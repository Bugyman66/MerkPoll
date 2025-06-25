const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

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
      admin = new Admin({
        walletAddress,
        network: network || 'devnet',
        createdAt: new Date()
      });
      await admin.save();
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

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
        lastLogin: admin.lastLogin
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

    res.json({
      user: {
        id: admin._id,
        walletAddress: admin.walletAddress,
        network: admin.network,
        isAdmin: true,
        lastLogin: admin.lastLogin,
        createdAt: admin.createdAt
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
