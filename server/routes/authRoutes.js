const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  validateToken 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Login user & get token
// @access  Public
router.post('/login', loginUser);

// @route   GET /api/auth/validate-token
// @desc    Validate user token
// @access  Private
router.get('/validate-token', protect, validateToken);

module.exports = router;