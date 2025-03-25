// server/scripts/setupAdmin.js
const mongoose = require('mongoose');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const readline = require('readline');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create readline interface for secure input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to get secure input (password won't be visible)
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Get admin credentials securely
    console.log('\n=== ZAIKU ADMIN SETUP ===\n');
    const username = await question('Enter admin username: ');
    const email = await question('Enter admin email: ');
    
    // Password requirements message
    console.log('\nPassword must contain:');
    console.log('- At least 8 characters');
    console.log('- At least one uppercase letter');
    console.log('- At least one lowercase letter');
    console.log('- At least one number');
    console.log('- At least one special character\n');
    
    const password = await question('Enter admin password: ');
    
    // Validate password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      console.error('Password does not meet requirements!');
      rl.close();
      mongoose.disconnect();
      return;
    }
    
    const confirmPassword = await question('Confirm admin password: ');
    
    if (password !== confirmPassword) {
      console.error('Passwords do not match!');
      rl.close();
      mongoose.disconnect();
      return;
    }

    // Check if admin already exists
    const adminExists = await User.findOne({ email });
    
    if (adminExists) {
      console.log('\nUser with this email already exists.');
      
      const updateConfirm = await question('Do you want to update this user to admin status? (yes/no): ');
      
      if (updateConfirm.toLowerCase() === 'yes') {
        adminExists.isAdmin = true;
        await adminExists.save();
        console.log('\nUser updated to admin status successfully!');
      } else {
        console.log('\nAdmin setup cancelled.');
      }
    } else {
      // Create a new admin user with secure password hashing
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const adminUser = new User({
        username,
        email,
        password: hashedPassword,
        isAdmin: true
      });
      
      await adminUser.save();
      console.log('\nAdmin user created successfully!');
    }
    
    rl.close();
    mongoose.disconnect();
  } catch (err) {
    console.error('Error setting up admin:', err);
    rl.close();
    mongoose.disconnect();
  }
}

setupAdmin();