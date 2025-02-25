const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/config');

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, drivingLicense } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      drivingLicense
    });

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};


// Fetch all users except admins
const getUsers = async (req, res) => {
  try {
    // Fetch all users except for those with the role 'admin'
    const users = await User.find({ role: { $ne: 'admin' } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

const getUserCount = async (req, res) => {
  try {
    const { role } = req.query;
    const count = await User.countDocuments(role ? { role } : {});
    res.json(count);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user count' });
  }
};

module.exports = { registerUser, loginUser, getUsers,getUserCount };