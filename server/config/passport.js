const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

// Configure Passport
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
      userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google profile received:', profile.id, profile.displayName);
        
        // Find user by Google ID or email
        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email: profile.emails[0].value }]
        });
        
        if (user) {
          // If user exists but doesn't have googleId, update it
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
          return done(null, user);
        }
        
        // Create new user if doesn't exist
        // Generate a random password for Google users
        const randomPassword = Math.random().toString(36).slice(-8);
        
        const newUser = await User.create({
          username: profile.displayName.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000),
          email: profile.emails[0].value,
          googleId: profile.id,
          password: randomPassword
        });
        
        console.log('New Google user created:', newUser.email);
        done(null, newUser);
      } catch (error) {
        console.error('Google auth error:', error);
        done(error, null);
      }
    }
  )
);

module.exports = passport;