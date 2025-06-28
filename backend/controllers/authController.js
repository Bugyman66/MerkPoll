const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { generateRelayerWallet, getAccountBalance, isAccountFunded, encryptData } = require('../utils/wallet');

// Wallet-based admin authentication
exports.login = async (req, res) => {
  try {
    const { walletAddress, network } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ 
        message: 'Wallet address is required' 
      });
    }

    // Validate wallet address format (basic validation)
    if (!walletAddress.startsWith('0x') || walletAddress.length !== 66) {
      return res.status(400).json({ 
        message: 'Invalid wallet address format' 
      });
    }

    // Find or create admin
    let admin = await Admin.findOne({ walletAddress });
    if (!admin) {
      console.log('Creating new admin with relayer wallet...');
      
      // Generate relayer wallet for new admin
      let relayerWalletData = null;
      try {
        const relayerWallet = generateRelayerWallet();
        const encryptionKey = process.env.RELAYER_ENCRYPTION_KEY || 'default-key-change-in-production';
        
        // Encrypt the private key before storing
        const encryptedPrivateKey = encryptData(relayerWallet.privateKey, encryptionKey);
        
        relayerWalletData = {
          address: relayerWallet.address,
          privateKey: encryptedPrivateKey,
          publicKey: relayerWallet.publicKey,
          balance: '0',
          lastBalanceUpdate: new Date(),
          isFunded: false
        };
        
        console.log('Relayer wallet generated:', relayerWallet.address);
      } catch (walletError) {
        console.error('Error generating relayer wallet:', walletError);
        // Continue without relayer wallet for now
      }
      
      admin = new Admin({
        walletAddress,
        network: network || 'devnet',
        relayerWallet: relayerWalletData,
        createdAt: new Date()
      });
      
      await admin.save();
      console.log('New admin created');
    } else if (!admin.relayerWallet || !admin.relayerWallet.address) {
      // Existing admin without relayer wallet - create one
      console.log('Adding relayer wallet to existing admin...');
      try {
        const relayerWallet = generateRelayerWallet();
        const encryptionKey = process.env.RELAYER_ENCRYPTION_KEY || 'default-key-change-in-production';
        
        // Encrypt the private key before storing
        const encryptedPrivateKey = encryptData(relayerWallet.privateKey, encryptionKey);
        
        admin.relayerWallet = {
          address: relayerWallet.address,
          privateKey: encryptedPrivateKey,
          publicKey: relayerWallet.publicKey,
          balance: '0',
          lastBalanceUpdate: new Date(),
          isFunded: false
        };
        
        await admin.save();
        console.log('Relayer wallet added to existing admin:', relayerWallet.address);
      } catch (walletError) {
        console.error('Error adding relayer wallet to existing admin:', walletError);
      }
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Check relayer wallet balance if it exists
    let relayerWalletInfo = null;
    if (admin.relayerWallet && admin.relayerWallet.address) {
      try {
        const currentBalance = await getAccountBalance(admin.relayerWallet.address);
        const isFunded = await isAccountFunded(admin.relayerWallet.address);
        
        // Update balance in database
        admin.relayerWallet.balance = currentBalance;
        admin.relayerWallet.isFunded = isFunded;
        admin.relayerWallet.lastBalanceUpdate = new Date();
        await admin.save();
        
        relayerWalletInfo = {
          address: admin.relayerWallet.address,
          balance: currentBalance,
          isFunded: isFunded,
          lastBalanceUpdate: admin.relayerWallet.lastBalanceUpdate
        };
        console.log('Relayer wallet info for response:', relayerWalletInfo);
      } catch (error) {
        console.error('Error checking relayer wallet balance:', error);
        relayerWalletInfo = {
          address: admin.relayerWallet.address,
          balance: admin.relayerWallet.balance || '0',
          isFunded: admin.relayerWallet.isFunded || false,
          lastBalanceUpdate: admin.relayerWallet.lastBalanceUpdate
        };
      }
    } else {
      console.log('Admin has no relayer wallet, will show as null in response');
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin._id, 
        walletAddress: admin.walletAddress,
        isAdmin: true 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: admin._id,
        walletAddress: admin.walletAddress,
        network: admin.network,
        isAdmin: true,
        lastLogin: admin.lastLogin,
        relayerWallet: relayerWalletInfo
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Internal server error during login' 
    });
  }
};

// Get admin profile
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    
    if (!admin) {
      return res.status(404).json({ 
        message: 'Admin not found' 
      });
    }

    // Check relayer wallet balance if it exists
    let relayerWalletInfo = null;
    if (admin.relayerWallet && admin.relayerWallet.address) {
      try {
        const currentBalance = await getAccountBalance(admin.relayerWallet.address);
        const isFunded = await isAccountFunded(admin.relayerWallet.address);
        
        // Update balance in database
        admin.relayerWallet.balance = currentBalance;
        admin.relayerWallet.isFunded = isFunded;
        admin.relayerWallet.lastBalanceUpdate = new Date();
        await admin.save();
        
        relayerWalletInfo = {
          address: admin.relayerWallet.address,
          balance: currentBalance,
          isFunded: isFunded,
          lastBalanceUpdate: admin.relayerWallet.lastBalanceUpdate
        };
      } catch (error) {
        console.error('Error checking relayer wallet balance:', error);
        relayerWalletInfo = {
          address: admin.relayerWallet.address,
          balance: admin.relayerWallet.balance || '0',
          isFunded: admin.relayerWallet.isFunded || false,
          lastBalanceUpdate: admin.relayerWallet.lastBalanceUpdate
        };
      }
    }

    res.json({
      user: {
        id: admin._id,
        walletAddress: admin.walletAddress,
        network: admin.network,
        isAdmin: true,
        lastLogin: admin.lastLogin,
        createdAt: admin.createdAt,
        relayerWallet: relayerWalletInfo
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};

// Verify token (for middleware)
exports.verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ 
      message: 'Access denied. No token provided.' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ 
      message: 'Invalid token' 
    });
  }
};

// Refresh relayer wallet balance
exports.refreshRelayerBalance = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    
    if (!admin) {
      return res.status(404).json({ 
        message: 'Admin not found' 
      });
    }

    if (!admin.relayerWallet || !admin.relayerWallet.address) {
      return res.status(400).json({ 
        message: 'Relayer wallet not found' 
      });
    }

    // Fetch current balance from blockchain
    const currentBalance = await getAccountBalance(admin.relayerWallet.address);
    const isFunded = await isAccountFunded(admin.relayerWallet.address);
    
    // Update balance in database
    admin.relayerWallet.balance = currentBalance;
    admin.relayerWallet.isFunded = isFunded;
    admin.relayerWallet.lastBalanceUpdate = new Date();
    await admin.save();

    res.json({
      message: 'Relayer wallet balance refreshed',
      relayerWallet: {
        address: admin.relayerWallet.address,
        balance: currentBalance,
        isFunded: isFunded,
        lastBalanceUpdate: admin.relayerWallet.lastBalanceUpdate
      }
    });

  } catch (error) {
    console.error('Refresh relayer balance error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};
