const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Replace with your actual admin email
const ADMIN_EMAIL = "your@email.com"; // <-- CHANGE THIS to your real admin email

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

module.exports = router;