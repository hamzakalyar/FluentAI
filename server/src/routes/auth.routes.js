const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // Create new user (role defaults to 'patient' if not provided)
    const user = await User.create({ name, email, password, role: role || 'patient' });
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Account created successfully',
      user,
      token
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      user,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/auth/me — Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/auth/profile — Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, preferredDifficulty } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (preferredDifficulty) updateData.preferredDifficulty = preferredDifficulty;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/auth/user — Delete user and all their data
router.delete('/user', auth, async (req, res) => {
  try {
    // In a real app, you would also delete all their Sessions and PracticeResults here
    // using something like: await Session.deleteMany({ user: req.user._id });
    
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: 'User account and all associated data successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/auth/verify-email — Stub endpoint for email verification
// (Real implementation would check verification token from email link)
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    // STUB: In a real implementation, this would:
    // 1. Verify the token signature
    // 2. Find the user by decoded email
    // 3. Mark user.emailVerified = true
    // 4. Delete the temporary verification token
    
    res.json({
      message: 'Email verified successfully',
      status: 'verified'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/auth/forgot-password — Stub endpoint to initiate password reset
// (Real implementation would send email with reset link)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // STUB: In a real implementation, this would:
    // 1. Find user by email
    // 2. Generate a password reset token
    // 3. Send email with reset link containing the token
    // 4. Return success message

    // For now, just confirm the request was processed
    res.json({
      message: 'If an account exists with this email, you will receive a password reset link shortly',
      status: 'email_sent'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/auth/reset-password — Stub endpoint to reset password with token
// (Real implementation would verify token and update password)
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // STUB: In a real implementation, this would:
    // 1. Verify the reset token signature
    // 2. Find the user by decoded email from token
    // 3. Hash the new password
    // 4. Update user.password
    // 5. Delete/invalidate the reset token
    // 6. Optionally send confirmation email

    res.json({
      message: 'Password reset successfully',
      status: 'password_reset'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
