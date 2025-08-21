const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken'); // npm install jsonwebtoken

// Replace this with your actual admin email!
const ADMIN_EMAIL = "seannavery@gmail.com"; // <-- CHANGE THIS to your real admin email

// Registration endpoint
router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;

  // Only allow admin registration for your own email
  if (role === "admin" && email !== ADMIN_EMAIL) {
    return res.status(403).json({ message: 'Only the owner can register as admin.' });
  }

  try {
    const user = new User({ email, password, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(400).json({ message: 'Error registering user', error: err.message });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  // Prevent admin login unless it's your email
  if (user.role === "admin" && user.email !== ADMIN_EMAIL) {
    return res.status(403).json({ message: "You are not authorized as admin." });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  // Generate JWT
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: '2h' }
  );
  res.json({ token, user: { email: user.email, role: user.role } });
});

module.exports = router;