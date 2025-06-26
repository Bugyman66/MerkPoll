const Election = require('../models/Election');
const Voter = require('../models/Voter');
const Vote = require('../models/Vote');
const { buildMerkleTree, hashEmail } = require('../utils/merkle');
const crypto = require('crypto');
const { Account } = require('@aptos-labs/ts-sdk');
const OTP = require('../models/OTP');
const nodemailer = require('nodemailer');

// Configure nodemailer transport (use environment variables in production)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER || 'your_email@gmail.com',
    pass: process.env.SMTP_PASS || 'your_app_password',
  },
});

async function sendOtpEmail(email, otp) {
  if (!transporter) {
    console.warn('Nodemailer not configured. OTP:', otp);
    return;
  }
  const mailOptions = {
    from: process.env.SMTP_FROM || 'MerkPoll <no-reply@merkpoll.com>',
    to: email,
    subject: 'Your MerkPoll OTP Code',
    text: `Your OTP code for voting is: ${otp}\n\nThis code will expire in 10 minutes.`,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Failed to send OTP email:', err);
    throw new Error('Failed to send OTP email');
  }
}

// Create a new election with multiple positions
const createElection = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      organization,
      deadline, 
      startDate,
      positions, 
      voterEmails, 
      allowAbstain,
      requireAllPositions,
      resultsVisible 
    } = req.body;

    // Validate required fields
    if (!title || !deadline || !positions || !voterEmails) {
      return res.status(400).json({ 
        message: 'Missing required fields: title, deadline, positions, voterEmails' 
      });
    }

    // Validate positions structure
    if (!Array.isArray(positions) || positions.length === 0) {
      return res.status(400).json({ message: 'At least one position is required' });
    }

    // Validate each position has candidates
    for (let i = 0; i < positions.length; i++) {
      const position = positions[i];
      if (!position.title || !position.candidates || !Array.isArray(position.candidates) || position.candidates.length === 0) {
        return res.status(400).json({ 
          message: `Position ${i + 1} must have a title and at least one candidate` 
        });
      }
    }

    // Validate voter emails
    if (!Array.isArray(voterEmails) || voterEmails.length === 0) {
      return res.status(400).json({ message: 'At least one voter email is required' });
    }

    // Hash voter emails for privacy
    const hashedEmails = voterEmails.map(email => hashEmail(email));

    // Build Merkle tree from hashed emails
    const merkleTree = buildMerkleTree(hashedEmails);
    const merkleRoot = merkleTree.getRoot().toString('hex');

    // Structure positions with enhanced candidate data
    const structuredPositions = positions.map(position => ({
      title: position.title,
      description: position.description || '',
      maxSelections: position.maxSelections || 1,
      candidates: position.candidates.map(candidate => ({
        name: candidate.name,
        description: candidate.description || '',
        imageUrl: candidate.imageUrl || '',
        party: candidate.party || '',
        qualifications: candidate.qualifications || '',
        voteCount: 0
      })),
      totalVotes: 0
    }));

    // Create voter list for tracking
    const voterList = voterEmails.map(email => ({
      email: email,
      hasVoted: false
    }));

    // Generate a unique slug for the election
    function generateSlug(title) {
      const base = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const random = Math.random().toString(36).substring(2, 8);
      return `${base}-${random}`;
    }
    const slug = generateSlug(title);

    // For each hashed email, generate a wallet and store mapping
    const voterWallets = hashedEmails.map(hashedEmail => {
      const account = Account.generate();
      return {
        hashedEmail: hashedEmail.toString('hex'),
        walletAddress: account.accountAddress.toString(),
        // Optionally, you could store the private key securely if needed for recovery
        // privateKey: account.signingKeyHex
      };
    });

    // Create election document
    const election = new Election({
      title,
      description,
      organization: organization || '',
      deadline: new Date(deadline),
      startDate: startDate ? new Date(startDate) : new Date(),
      positions: structuredPositions,
      voterList,
      allowAbstain: allowAbstain !== false,
      requireAllPositions: requireAllPositions === true,
      resultsVisible: resultsVisible === true,
      merkleRoot,
      status: 'active',
      createdBy: req.user.id,
      slug,
      voterWallets
    });

    await election.save();

    console.log(`✅ Election created: ${election.title} with ${positions.length} positions`);

    const voterPromises = voterEmails.map(async (email, index) => {
      const hashedEmailHex = hashedEmails[index].toString('hex');
      const merkleProof = merkleTree.getProof(hashedEmails[index]);
      const walletEntry = voterWallets.find(vw => vw.hashedEmail === hashedEmailHex);

      try {
        // Check if voter already exists for this election
        const existingVoter = await Voter.findOne({
          emailHash: hashedEmailHex,
          election: election._id
        });

        if (existingVoter) {
          console.log(`Voter with email hash ${hashedEmailHex} already exists for this election`);
          return existingVoter;
        }

        const voter = new Voter({
          emailHash: hashedEmailHex,
          wallet: walletEntry.walletAddress,
          election: election._id,
          otpVerified: false,
          hasVoted: false
          // Optionally: merkleProof: merkleProof.map(p => p.toString('hex'))
        });

        return await voter.save();
      } catch (error) {
        if (error.code === 11000) {
          // Duplicate key error - voter already exists
          console.log(`Voter with email hash ${hashedEmailHex} already exists, skipping...`);
          return await Voter.findOne({ emailHash: hashedEmailHex, election: election._id });
        }
        throw error;
      }
    });

    await Promise.all(voterPromises);

    res.status(201).json({
      message: 'Election created successfully',
      election: {
        id: election._id,
        title: election.title,
        description: election.description,
        organization: election.organization,
        deadline: election.deadline,
        startDate: election.startDate,
        positions: election.positions.map(pos => ({
          id: pos._id,
          title: pos.title,
          description: pos.description,
          maxSelections: pos.maxSelections,
          candidateCount: pos.candidates.length
        })),
        voterCount: election.voterList.length,
        status: election.status,
        allowAbstain: election.allowAbstain,
        requireAllPositions: election.requireAllPositions,
        resultsVisible: election.resultsVisible,
        slug: election.slug
      }
    });

  } catch (error) {
    console.error('Error creating election:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all elections for admin
const getAdminElections = async (req, res) => {
  try {
    const adminWallet = req.user.walletAddress; // Assuming this is set by auth middleware
    
    const elections = await Election.find({ adminWallet }).sort({ createdAt: -1 });
    
    res.json(elections.map(election => ({
      id: election.id,
      name: election.name,
      description: election.description,
      deadline: election.deadline,
      position: election.position,
      status: election.status,
      voterCount: election.voterCount,
      totalVotes: election.candidates.reduce((sum, c) => sum + c.voteCount, 0),
      createdAt: election.createdAt
    })));

  } catch (error) {
    console.error('Error fetching admin elections:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get election details
const getElectionDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const election = await Election.findById(id);

    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    res.json(election);

  } catch (error) {
    console.error('Error fetching election details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update election
const updateElection = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const election = await Election.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    res.json({ message: 'Election updated successfully', election });

  } catch (error) {
    console.error('Error updating election:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete election
const deleteElection = async (req, res) => {
  try {
    const { id } = req.params;

    const election = await Election.findOneAndDelete({ id });

    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    // Also delete associated voters
    await Voter.deleteMany({ electionId: id });

    res.json({ message: 'Election deleted successfully' });

  } catch (error) {
    console.error('Error deleting election:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Upload voters to existing election
const uploadVoters = async (req, res) => {
  try {
    const { id } = req.params;
    const { voterEmails } = req.body;

    if (!Array.isArray(voterEmails) || voterEmails.length === 0) {
      return res.status(400).json({ message: 'Voter emails are required' });
    }

    const election = await Election.findById(id);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    // Hash new voter emails
    const hashedEmails = voterEmails.map(email => hashEmail(email));

    // Get existing voters
    const existingVoters = await Voter.find({ electionId: id });
    const allHashedEmails = [
      ...existingVoters.map(v => v.hashedEmail),
      ...hashedEmails
    ];

    // Rebuild Merkle tree with all voters
    const merkleTree = buildMerkleTree(allHashedEmails);
    const merkleRoot = merkleTree.getRoot().toString('hex');

    // Update election with new Merkle root and voter count
    await Election.findOneAndUpdate(
      { id },
      { 
        merkleRoot,
        voterCount: allHashedEmails.length
      }
    );

    // Add new voters with proofs
    const voterPromises = voterEmails.map(async (email, index) => {
      const hashedEmailHex = hashedEmails[index].toString('hex');
      const merkleProof = merkleTree.getProof(hashedEmails[index]);
      const walletEntry = election.voterWallets.find(vw => vw.hashedEmail === hashedEmailHex);

      try {
        // Check if voter already exists for this election
        const existingVoter = await Voter.findOne({
          emailHash: hashedEmailHex,
          election: election._id
        });

        if (existingVoter) {
          console.log(`Voter with email hash ${hashedEmailHex} already exists for this election`);
          return existingVoter;
        }

        const voter = new Voter({
          emailHash: hashedEmailHex,
          wallet: walletEntry.walletAddress,
          election: election._id,
          otpVerified: false,
          hasVoted: false
          // Optionally: merkleProof: merkleProof.map(p => p.toString('hex'))
        });

        return await voter.save();
      } catch (error) {
        if (error.code === 11000) {
          // Duplicate key error - voter already exists
          console.log(`Voter with email hash ${hashedEmailHex} already exists, skipping...`);
          return await Voter.findOne({ emailHash: hashedEmailHex, election: election._id });
        }
        throw error;
      }
    });

    await Promise.all(voterPromises);

    res.json({
      message: 'Voters added successfully',
      addedCount: voterEmails.length,
      totalVoters: allHashedEmails.length
    });

  } catch (error) {
    console.error('Error uploading voters:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get election voters
const getElectionVoters = async (req, res) => {
  try {
    const { id } = req.params;

    const voters = await Voter.find({ electionId: id }, 'email hasVoted');
    
    res.json(voters);

  } catch (error) {
    console.error('Error fetching election voters:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get election results
const getElectionResults = async (req, res) => {
  try {
    const { id } = req.params;

    const election = await Election.findById(id);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    const voters = await Voter.find({ electionId: id });
    const totalVotes = election.candidates.reduce((sum, c) => sum + c.voteCount, 0);
    const votedCount = voters.filter(v => v.hasVoted).length;

    res.json({
      electionName: election.name,
      status: election.status,
      deadline: election.deadline,
      candidates: election.candidates,
      totalVotes,
      voterCount: election.voterCount,
      votedCount,
      turnoutPercentage: election.voterCount > 0 ? (votedCount / election.voterCount * 100).toFixed(2) : 0
    });

  } catch (error) {
    console.error('Error fetching election results:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get election analytics
const getElectionAnalytics = async (req, res) => {
  try {
    const { id } = req.params;

    const election = await Election.findById(id);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    const voters = await Voter.find({ electionId: id });
    
    // Calculate voting timeline (votes per hour/day)
    const votingTimeline = voters
      .filter(v => v.hasVoted && v.votedAt)
      .map(v => v.votedAt)
      .sort()
      .reduce((timeline, votedAt) => {
        const hour = new Date(votedAt).toISOString().slice(0, 13);
        timeline[hour] = (timeline[hour] || 0) + 1;
        return timeline;
      }, {});

    res.json({
      totalVoters: voters.length,
      votedCount: voters.filter(v => v.hasVoted).length,
      pendingCount: voters.filter(v => !v.hasVoted).length,
      votingTimeline,
      candidates: election.candidates.map(c => ({
        name: c.name,
        votes: c.voteCount,
        percentage: election.candidates.reduce((sum, candidate) => sum + candidate.voteCount, 0) > 0
          ? (c.voteCount / election.candidates.reduce((sum, candidate) => sum + candidate.voteCount, 0) * 100).toFixed(2)
          : 0
      }))
    });

  } catch (error) {
    console.error('Error fetching election analytics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all public elections (for voters)
const getPublicElections = async (req, res) => {
  try {
    const elections = await Election.find(
      { status: 'active', deadline: { $gt: new Date() } },
      'id name description deadline position candidates.name candidates.description voterCount'
    ).sort({ createdAt: -1 });

    res.json(elections);

  } catch (error) {
    console.error('Error fetching public elections:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get election by slug (for voting page)
const getElectionBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const election = await Election.findOne({ slug });
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }
    res.json({
      id: election._id,
      title: election.title,
      description: election.description,
      organization: election.organization,
      deadline: election.deadline,
      startDate: election.startDate,
      positions: election.positions.map(position => ({
        id: position._id,
        title: position.title,
        description: position.description,
        maxSelections: position.maxSelections,
        candidates: position.candidates.map(candidate => ({
          id: candidate._id,
          name: candidate.name,
          description: candidate.description,
          imageUrl: candidate.imageUrl,
          party: candidate.party,
          qualifications: candidate.qualifications
        }))
      })),
      allowAbstain: election.allowAbstain,
      requireAllPositions: election.requireAllPositions,
      resultsVisible: election.resultsVisible,
      merkleRoot: election.merkleRoot,
      slug: election.slug
    });
  } catch (error) {
    console.error('Error fetching election by slug:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get voter's wallet address by election slug and email
const getVoterWalletByEmail = async (req, res) => {
  try {
    const { slug } = req.params;
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const { hashEmail } = require('../utils/merkle');
    const hashedEmail = hashEmail(email).toString('hex');
    const election = await Election.findOne({ slug });
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }
    const walletEntry = election.voterWallets.find(vw => vw.hashedEmail === hashedEmail);
    if (!walletEntry) {
      return res.status(403).json({ message: 'You are not eligible to vote in this election' });
    }
    res.json({ eligible: true });
  } catch (error) {
    console.error('Error checking voter eligibility:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Request OTP for voting
const requestOtp = async (req, res) => {
  try {
    const { slug } = req.params;
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    const { hashEmail } = require('../utils/merkle');
    const hashedEmail = hashEmail(email).toString('hex');
    const election = await Election.findOne({ slug });
    if (!election) return res.status(404).json({ message: 'Election not found' });
    const walletEntry = election.voterWallets.find(vw => vw.hashedEmail === hashedEmail);
    if (!walletEntry) return res.status(403).json({ message: 'You are not eligible to vote in this election' });
    // Generate and save OTP
    const otp = await OTP.generateAndSave(hashedEmail);
    // Send OTP via email
    await sendOtpEmail(email, otp);
    res.json({ message: 'OTP sent to your email.' });
  } catch (error) {
    console.error('Error requesting OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Verify OTP for voting
const verifyOtp = async (req, res) => {
  try {
    const { slug } = req.params;
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });
    const { hashEmail } = require('../utils/merkle');
    const hashedEmail = hashEmail(email).toString('hex');
    const election = await Election.findOne({ slug });
    if (!election) return res.status(404).json({ message: 'Election not found' });
    const walletEntry = election.voterWallets.find(vw => vw.hashedEmail === hashedEmail);
    if (!walletEntry) return res.status(403).json({ message: 'You are not eligible to vote in this election' });
    const valid = await OTP.verifyOtp(hashedEmail, otp);
    if (!valid) return res.status(403).json({ message: 'Invalid or expired OTP' });
    res.json({ eligible: true });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createElection,
  getAdminElections,
  getElectionDetails,
  updateElection,
  deleteElection,
  uploadVoters,
  getElectionVoters,
  getElectionResults,
  getElectionAnalytics,
  getPublicElections,
  getElectionBySlug,
  getVoterWalletByEmail,
  requestOtp,
  verifyOtp
};
