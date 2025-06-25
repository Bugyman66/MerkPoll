const Election = require('../models/Election');
const Voter = require('../models/Voter');
const { buildMerkleTree, hashEmail } = require('../utils/merkle');
const crypto = require('crypto');

// Create a new election
const createElection = async (req, res) => {
  try {
    const { name, description, deadline, position, candidates, voterEmails, adminWallet } = req.body;

    // Validate required fields
    if (!name || !deadline || !candidates || !voterEmails || !adminWallet) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, deadline, candidates, voterEmails, adminWallet' 
      });
    }

    // Validate candidates
    if (!Array.isArray(candidates) || candidates.length === 0) {
      return res.status(400).json({ message: 'At least one candidate is required' });
    }

    // Validate voter emails
    if (!Array.isArray(voterEmails) || voterEmails.length === 0) {
      return res.status(400).json({ message: 'At least one voter email is required' });
    }

    // Generate unique election ID
    const electionId = crypto.randomUUID();

    // Hash voter emails for privacy
    const hashedEmails = voterEmails.map(email => hashEmail(email));

    // Build Merkle tree from hashed emails
    const merkleTree = buildMerkleTree(hashedEmails);
    const merkleRoot = merkleTree.getRoot().toString('hex');

    // Create election document
    const election = new Election({
      id: electionId,
      name,
      description,
      deadline: new Date(deadline),
      position,
      candidates: candidates.map((candidate, index) => ({
        id: index,
        name: candidate.name,
        description: candidate.description || '',
        voteCount: 0
      })),
      adminWallet,
      merkleRoot,
      status: 'active',
      voterCount: voterEmails.length,
      createdAt: new Date()
    });

    await election.save();

    // Store voter information with Merkle proofs
    const voterPromises = voterEmails.map(async (email, index) => {
      const hashedEmail = hashedEmails[index];
      const merkleProof = merkleTree.getProof(hashedEmail);

      const voter = new Voter({
        email: email.toLowerCase(),
        hashedEmail,
        electionId,
        merkleProof: merkleProof.map(p => p.toString('hex')),
        hasVoted: false
      });

      return voter.save();
    });

    await Promise.all(voterPromises);

    res.status(201).json({
      message: 'Election created successfully',
      election: {
        id: election.id,
        name: election.name,
        description: election.description,
        deadline: election.deadline,
        position: election.position,
        candidates: election.candidates,
        status: election.status,
        voterCount: election.voterCount,
        merkleRoot: election.merkleRoot
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
    const election = await Election.findOne({ id });

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

    const election = await Election.findOneAndUpdate(
      { id },
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

    const election = await Election.findOne({ id });
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
      const hashedEmail = hashedEmails[index];
      const merkleProof = merkleTree.getProof(hashedEmail);

      const voter = new Voter({
        email: email.toLowerCase(),
        hashedEmail,
        electionId: id,
        merkleProof: merkleProof.map(p => p.toString('hex')),
        hasVoted: false
      });

      return voter.save();
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

    const election = await Election.findOne({ id });
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

    const election = await Election.findOne({ id });
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
  getPublicElections
};
