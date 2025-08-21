const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const dataRoutes = require('./routes/data');
const visitRoutes = require('./routes/visit');
const authRoutes = require('./routes/auth'); // <-- Added line for auth

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/data', dataRoutes);
app.use('/api/visit', visitRoutes);
app.use('/api/auth', authRoutes); // <-- Added line for auth

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));