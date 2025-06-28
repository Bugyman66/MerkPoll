const { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey } = require('@aptos-labs/ts-sdk');
const crypto = require('crypto');

// Initialize Aptos client for devnet
const config = new AptosConfig({ network: Network.DEVNET });
const aptos = new Aptos(config);

/**
 * Generate a new Aptos wallet for relayer functionality
 * @returns {Object} Wallet object with address, private key, and public key
 */
function generateRelayerWallet() {
  try {
    // Generate a new account
    const account = Account.generate();
    
    const wallet = {
      address: account.accountAddress.toString(),
      privateKey: account.privateKey.toString(),
      publicKey: account.publicKey.toString(),
      accountObject: account // For immediate use if needed
    };
    
    console.log('Generated relayer wallet address:', wallet.address);
    return wallet;
  } catch (error) {
    console.error('Error generating relayer wallet:', error);
    throw new Error(`Failed to generate relayer wallet: ${error.message}`);
  }
}

/**
 * Get account balance from Aptos blockchain
 * @param {string} accountAddress - The account address to check
 * @returns {Promise<string>} Balance in APT (as string to preserve precision)
 */
async function getAccountBalance(accountAddress) {
  try {
    const balance = await aptos.getAccountAPTAmount({
      accountAddress
    });
    
    // Convert from octas to APT (1 APT = 100,000,000 octas)
    const aptBalance = (balance / 100000000).toString();
    return aptBalance;
  } catch (error) {
    console.error('Error fetching account balance:', error);
    // If account doesn't exist or has no balance, return '0'
    return '0';
  }
}

/**
 * Check if an account exists and is funded
 * @param {string} accountAddress - The account address to check
 * @returns {Promise<boolean>} True if account has balance > 0
 */
async function isAccountFunded(accountAddress) {
  try {
    const balance = await getAccountBalance(accountAddress);
    return parseFloat(balance) > 0;
  } catch (error) {
    console.error('Error checking if account is funded:', error);
    return false;
  }
}

/**
 * Encrypt sensitive data (like private keys)
 * @param {string} text - Text to encrypt
 * @param {string} secretKey - Secret key for encryption
 * @returns {string} Encrypted text
 */
function encryptData(text, secretKey) {
  try {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(secretKey, 'salt', 32);
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipher(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Error encrypting data:', error);
    // Return the original text as fallback (not secure, but functional for development)
    return text;
  }
}

/**
 * Decrypt sensitive data
 * @param {string} encryptedText - Text to decrypt
 * @param {string} secretKey - Secret key for decryption
 * @returns {string} Decrypted text
 */
function decryptData(encryptedText, secretKey) {
  try {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(secretKey, 'salt', 32);
    
    const parts = encryptedText.split(':');
    if (parts.length !== 2) {
      // Assume it's not encrypted (for backward compatibility)
      return encryptedText;
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    const decipher = crypto.createDecipher(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Error decrypting data:', error);
    // Return the original text as fallback
    return encryptedText;
  }
}

/**
 * Create an Account object from private key string
 * @param {string} privateKeyString - Private key as string
 * @returns {Account} Aptos Account object
 */
function createAccountFromPrivateKey(privateKeyString) {
  try {
    const privateKey = new Ed25519PrivateKey(privateKeyString);
    return Account.fromPrivateKey({ privateKey });
  } catch (error) {
    console.error('Error creating account from private key:', error);
    throw new Error('Failed to create account from private key');
  }
}

module.exports = {
  generateRelayerWallet,
  getAccountBalance,
  isAccountFunded,
  encryptData,
  decryptData,
  createAccountFromPrivateKey,
  aptos
};
