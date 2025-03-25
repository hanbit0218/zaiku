// server/controllers/authController.js
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    console.log('Registration request received:', { username, email, password: '***hidden***' });
    
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      console.log('User already exists with this email');
      return res.status(400).json({ message: 'User already exists' });
    }
    
    console.log('About to create user in database');
    
    const user = await User.create({
      username,
      email,
      password,
    });
    
    console.log('User created successfully:', user._id);
    
    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      console.log('Failed to create user');
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Error in user registration:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt for:', email);
    
    const user = await User.findOne({ email });
    
    if (user && (await user.matchPassword(password))) {
      console.log('Login successful for user:', user._id);
      
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      console.log('Login failed: Invalid credentials');
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error in user login:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// @desc    Validate user token
// @route   GET /api/auth/validate-token
// @access  Private
const validateToken = async (req, res) => {
  try {
    console.log('Token validation for user:', req.user._id);
    
    const user = await User.findById(req.user._id);
    
    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      console.log('Token validation failed: User not found');
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error in token validation:', error);
    res.status(500).json({ message: 'Server error during token validation', error: error.message });
  }
};

module.exports = { registerUser, loginUser, validateToken };