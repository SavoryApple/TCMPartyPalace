const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Load environment variables based on NODE_ENV
const dotenv = require('dotenv');
if (process.env.NODE_ENV === 'production') {
  dotenv.config(); // Loads .env
} else {
  dotenv.config({ path: '.env.local' }); // Loads .env.local
}

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

// Content-Security-Policy (CSP) header middleware
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    // Production: Allow only backend and self
    res.setHeader(
      'Content-Security-Policy', 
      "default-src 'self'; connect-src 'self' https://thetcmatlas.fly.dev"
    );
  } else {
    // Development: Allow localhost:8080 for API calls
    res.setHeader(
      'Content-Security-Policy', 
      "default-src 'self'; connect-src 'self' http://localhost:8080 https://thetcmatlas.fly.dev"
    );
  }
  next();
});

// Connect to MongoDB Atlas or local
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