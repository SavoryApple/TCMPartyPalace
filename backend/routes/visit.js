const express = require('express');
const router = express.Router();
const Counter = require('../models/Counter');

// POST /api/visit - increments the visitor counter
router.post('/', async (req, res) => {
  try {
    const counter = await Counter.findOneAndUpdate(
      { name: 'visitor' },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );
    res.json({ count: counter.count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/visit - fetches the current visitor count without incrementing
router.get('/', async (req, res) => {
  try {
    const counter = await Counter.findOne({ name: 'visitor' });
    res.json({ count: counter ? counter.count : 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;