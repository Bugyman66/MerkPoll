const crypto = require('crypto');
const { MerkleTree } = require('merkletreejs');

// Hash an email using SHA-256
function hashEmail(email) {
  return crypto.createHash('sha256').update(email.trim().toLowerCase()).digest();
}

// Build a Merkle tree from an array of hashed emails (Buffer[])
function buildMerkleTree(hashedEmails) {
  return new MerkleTree(hashedEmails, crypto.createHash('sha256'), { sortPairs: true });
}

// Export functions
module.exports = {
  hashEmail,
  buildMerkleTree
};
