const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

// Hash an email using keccak256
function hashEmail(email) {
  return keccak256(email.trim().toLowerCase());
}

// Build a Merkle tree from an array of hashed emails (Buffer[])
function buildMerkleTree(hashedEmails) {
  return new MerkleTree(hashedEmails, keccak256, { sortPairs: true });
}

// Export functions
module.exports = {
  hashEmail,
  buildMerkleTree
};
