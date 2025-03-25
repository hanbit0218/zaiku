const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Create email transporter with Gmail or fallback to Ethereal
const createTransporter = async () => {
  // Check if we have the required credentials
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      console.log('Creating Gmail transporter with credentials...');
      console.log(`Email user: ${process.env.EMAIL_USER}`);
      console.log(`Email pass length: ${process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0} characters`);
      
      // Create the transporter with Gmail configuration
      const gmailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      
      // Verify the connection configuration
      await gmailTransporter.verify();
      console.log('SMTP connection verified successfully');
      
      return gmailTransporter;
    } catch (error) {
      console.error('Error creating Gmail transporter:', error);
      console.log('Gmail credentials failed, falling back to test account');
    }
  } else {
    console.log('Gmail credentials not found in environment variables');
  }
    
  // Create Ethereal test account as fallback
  console.log('Creating Ethereal test account...');
  try {
    const testAccount = await nodemailer.createTestAccount();
    
    const etherealTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    
    console.log('Test email account created as fallback:', testAccount.user);
    console.log('Test email password:', testAccount.pass);
    return etherealTransporter;
  } catch (etherealError) {
    console.error('Error creating Ethereal account:', etherealError);
    throw etherealError;
  }
};

// Create reusable transporter
let transporter;

// Initialize transporter when server starts
(async () => {
  try {
    transporter = await createTransporter();
    console.log('Email transporter initialized successfully');
  } catch (error) {
    console.error('Failed to initialize email transporter:', error);
  }
})();

// @route   POST /api/contact/send
// @desc    Send contact form email
// @access  Public
router.post('/send', async (req, res) => {
  try {
    // If transporter not initialized yet, do it now
    if (!transporter) {
      console.log('Transporter not initialized, creating now...');
      transporter = await createTransporter();
    }
    
    const { name, email, phone, message } = req.body;
    console.log('Received contact form submission from:', name, email);
    
    // Validate required fields
    if (!name || !email || !message) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'Name, email, and message are required fields' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }
    
    // Create email content
    const mailOptions = {
      from: `"ZAIKU Website Contact Form" <${transporter.options.auth.user}>`,
      replyTo: email,
      to: 'zaiku.info@gmail.com',
      subject: `ZAIKU Website Contact: ${name}`,
      text: `
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}

Message:
${message}
      `,
      html: `
<h3>New Contact Form Submission</h3>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
<h4>Message:</h4>
<p>${message.replace(/\n/g, '<br>')}</p>
      `
    };
    
    console.log('Attempting to send email to zaiku.info@gmail.com...');
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    
    // Check if using Ethereal (fallback)
    if (info.messageUrl || (transporter.options.host && transporter.options.host.includes('ethereal'))) {
      const previewURL = nodemailer.getTestMessageUrl(info);
      console.log('Using test account. Preview URL: %s', previewURL);
      console.log('Note: To view the test email, go to this URL in your browser');
    } else {
      console.log('Email sent to Gmail successfully');
    }
    
    // Return success response
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Email sending error details:', error);
    
    // Send more specific error message
    let errorMessage = 'Failed to send email. Please try again later.';
    if (error.code === 'EAUTH') {
      errorMessage = 'Email server authentication failed. Please check your credentials.';
    } else if (error.code === 'ESOCKET') {
      errorMessage = 'Network error. Please check your connection and try again.';
    } else if (error.code === 'EENVELOPE') {
      errorMessage = 'Invalid recipient or sender address.';
    }
    
    res.status(500).json({ message: errorMessage, error: error.message });
  }
});

module.exports = router;