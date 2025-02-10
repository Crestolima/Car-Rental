const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found, authorization failed' });
    }

    console.log("Authenticated User:", req.user); // Debugging

    next();
  } catch (error) {
    console.error("JWT Error:", error); // Debugging
    return res.status(401).json({ message: 'Invalid token, authorization failed' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  } else {
    return res.status(403).json({ message: 'Not authorized as admin' });
  }
};

const user = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    return next();
  } else {
    return res.status(403).json({ message: 'Not authorized as user' });
  }
};

module.exports = { protect, admin, user };
