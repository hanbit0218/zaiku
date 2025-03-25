const express = require('express');
const router = express.Router();
const axios = require('axios');
const { 
  registerUser, 
  loginUser, 
  validateToken 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

// Standard auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/validate-token', protect, validateToken);

// Google token verification route
router.post('/google-token', async (req, res) => {
  try {
    const { access_token } = req.body;
    
    if (!access_token) {
      return res.status(400).json({ message: 'Access token is required' });
    }
    
    // Get user info from Google
    const googleResponse = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );
    
    const { sub, email, name } = googleResponse.data;
    
    // Find or create user
    let user = await User.findOne({
      $or: [{ googleId: sub }, { email }]
    });
    
    if (!user) {
      // Create new user
      const username = name.replace(/\s+/g, '').toLowerCase() + 
                      Math.floor(Math.random() * 1000);
      const randomPassword = Math.random().toString(36).slice(-8);
      
      user = await User.create({
        username,
        email,
        googleId: sub,
        password: randomPassword
      });
      
      console.log('New user created via Google login:', email);
    } else if (!user.googleId) {
      // Update existing user with Google ID
      user.googleId = sub;
      await user.save();
      console.log('Existing user updated with Google ID:', email);
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    // Return user info and token
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token
    });
  } catch (error) {
    console.error('Google token verification error:', error);
    if (error.response) {
      console.error('Google API response:', error.response.data);
    }
    res.status(401).json({ message: 'Invalid Google token' });
  }
});

module.exports = router;