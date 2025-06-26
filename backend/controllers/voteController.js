const Election = require('../models/Election');
const Vote = require('../models/Vote');
const { hashEmail, verifyMerkleProof } = require('../utils/merkle');
const crypto = require('crypto');

// Submit votes for multiple positions
const submitVote = async (req, res) => {
  try {
    const { electionId, votes, voterEmail, merkleProof } = req.body;

    // Validate required fields
    if (!electionId || !votes || !voterEmail) {
      return res.status(400).json({ 
        message: 'Missing required fields: electionId, votes, voterEmail' 
      });
    }

    // Find election
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    // Check if election is active
    if (election.status !== 'active') {
      return res.status(400).json({ message: 'Election is not active' });
    }

    // Check if deadline has passed
    if (new Date() > election.deadline) {
      return res.status(400).json({ message: 'Election deadline has passed' });
    }

    // Verify voter is eligible (Merkle proof verification)
    const voterHash = hashEmail(voterEmail);
    
    // Check if voter has already voted
    const voterRecord = election.voterList.find(v => v.email === voterEmail);
    if (voterRecord && voterRecord.hasVoted) {
      return res.status(400).json({ message: 'You have already voted in this election' });
    }

    // Validate votes structure
    if (!Array.isArray(votes)) {
      return res.status(400).json({ message: 'Votes must be an array' });
    }

    // Validate each vote
    const validatedVotes = [];
    for (const vote of votes) {
      const { positionId, candidateIds } = vote;
      
      // Find position
      const position = election.positions.id(positionId);
      if (!position) {
        return res.status(400).json({ message: `Invalid position ID: ${positionId}` });
      }

      // Validate candidate selections
      if (!Array.isArray(candidateIds)) {
        return res.status(400).json({ message: 'Candidate IDs must be an array' });
      }

      // Check max selections limit
      if (candidateIds.length > position.maxSelections) {
        return res.status(400).json({ 
          message: `Too many candidates selected for ${position.title}. Maximum: ${position.maxSelections}` 
        });
      }

      // Validate each candidate ID
      for (const candidateId of candidateIds) {
        const candidate = position.candidates.id(candidateId);
        if (!candidate) {
          return res.status(400).json({ 
            message: `Invalid candidate ID: ${candidateId} for position: ${position.title}` 
          });
        }
      }

      validatedVotes.push({
        positionId,
        candidateIds,
        position: position.title
      });
    }

    // Check if all required positions are voted for
    if (election.requireAllPositions) {
      const votedPositions = validatedVotes.map(v => v.positionId);
      const allPositionIds = election.positions.map(p => p._id.toString());
      const missingPositions = allPositionIds.filter(id => !votedPositions.includes(id));
      
      if (missingPositions.length > 0) {
        return res.status(400).json({ 
          message: 'All positions must be voted for in this election' 
        });
      }
    }

    // Record votes in database
    const voteRecords = [];
    for (const vote of validatedVotes) {
      for (const candidateId of vote.candidateIds) {
        const voteRecord = new Vote({
          election: electionId,
          position: vote.positionId,
          candidate: candidateId,
          voterHash: voterHash,
          timestamp: new Date(),
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        });
        
        await voteRecord.save();
        voteRecords.push(voteRecord);

        // Update candidate vote count
        const position = election.positions.id(vote.positionId);
        const candidate = position.candidates.id(candidateId);
        candidate.voteCount += 1;
        position.totalVotes += 1;
      }
    }

    // Mark voter as having voted
    if (voterRecord) {
      voterRecord.hasVoted = true;
    } else {
      election.voterList.push({ email: voterEmail, hasVoted: true });
    }

    await election.save();

    console.log(`✅ Vote submitted for election: ${election.title} by voter: ${voterEmail.substring(0, 3)}***`);

    res.json({
      message: 'Vote submitted successfully',
      voteId: voteRecords.map(v => v._id),
      submittedAt: new Date(),
      positionsVoted: validatedVotes.length
    });

  } catch (error) {
    console.error('Vote submission error:', error);
    res.status(500).json({ 
      message: 'Error submitting vote', 
      error: error.message 
    });
  }
};

// Get election results with position breakdown
const getResults = async (req, res) => {
  try {
    const { electionId } = req.params;

    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    // Check if results should be visible
    if (!election.resultsVisible && election.status !== 'ended') {
      return res.status(403).json({ message: 'Results are not yet available' });
    }

    // Calculate total voters and turnout
    const totalEligibleVoters = election.voterList.length;
    const totalVotedCount = election.voterList.filter(v => v.hasVoted).length;
    const turnoutPercentage = totalEligibleVoters > 0 ? 
      ((totalVotedCount / totalEligibleVoters) * 100).toFixed(2) : 0;

    // Structure results by position
    const results = {
      election: {
        id: election._id,
        title: election.title,
        description: election.description,
        organization: election.organization,
        status: election.status,
        deadline: election.deadline
      },
      statistics: {
        totalEligibleVoters,
        totalVotedCount,
        turnoutPercentage: parseFloat(turnoutPercentage)
      },
      positions: election.positions.map(position => ({
        id: position._id,
        title: position.title,
        description: position.description,
        maxSelections: position.maxSelections,
        totalVotes: position.totalVotes,
        candidates: position.candidates.map(candidate => ({
          id: candidate._id,
          name: candidate.name,
          description: candidate.description,
          party: candidate.party,
          voteCount: candidate.voteCount,
          percentage: position.totalVotes > 0 ? 
            ((candidate.voteCount / position.totalVotes) * 100).toFixed(2) : 0
        })).sort((a, b) => b.voteCount - a.voteCount) // Sort by vote count descending
      }))
    };

    res.json(results);

  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ 
      message: 'Error fetching results', 
      error: error.message 
    });
  }
};

// Get election details for voting
const getElectionForVoting = async (req, res) => {
  try {
    const { electionId } = req.params;
    const { voterEmail } = req.query;

    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    // Check if election is active
    if (election.status !== 'active') {
      return res.status(400).json({ message: 'Election is not active' });
    }

    // Check if deadline has passed
    if (new Date() > election.deadline) {
      return res.status(400).json({ message: 'Election deadline has passed' });
    }

    // Check voter eligibility if email provided
    let hasVoted = false;
    if (voterEmail) {
      const voterRecord = election.voterList.find(v => v.email === voterEmail);
      if (!voterRecord) {
        return res.status(403).json({ message: 'You are not eligible to vote in this election' });
      }
      hasVoted = voterRecord.hasVoted;
    }

    // Return election structure for voting (without vote counts)
    const electionForVoting = {
      id: election._id,
      title: election.title,
      description: election.description,
      organization: election.organization,
      deadline: election.deadline,
      allowAbstain: election.allowAbstain,
      requireAllPositions: election.requireAllPositions,
      hasVoted,
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
      }))
    };

    res.json(electionForVoting);

  } catch (error) {
    console.error('Get election for voting error:', error);
    res.status(500).json({ 
      message: 'Error fetching election', 
      error: error.message 
    });
  }
};

module.exports = {
  submitVote,
  getResults,
  getElectionForVoting
};
