const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const dataRoutes = require('./routes/data');
const visitRoutes = require('./routes/visit');
const authRoutes = require('./routes/auth');

const app = express();

// CORS configuration (put FIRST, before any routes)
const allowedOrigins = [
  "https://savoryapple.github.io",
  "https://thetcmatlas.fly.dev",
  "http://localhost:3000",
  "https://thetcmatlas.com",
  "https://www.thetcmatlas.com"
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Root route for health check or welcome message
app.get('/', (req, res) => {
  res.send('Welcome to The TCM Atlas API!');
});

// API Routes
app.use('/api/data', dataRoutes);
app.use('/api/visit', visitRoutes);
app.use('/api/auth', authRoutes);

// Global error handler (returns JSON)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));