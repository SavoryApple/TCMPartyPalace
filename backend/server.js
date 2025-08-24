const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const dataRoutes = require('./routes/data');
const visitRoutes = require('./routes/visit');
const authRoutes = require('./routes/auth'); // <-- Added line for auth

const app = express();

// CORS configuration (more secure for production)
const allowedOrigins = [
  "https://savoryapple.github.io", // Your frontend domain
  "https://tcmpartypalace.onrender.com", // Your backend domain (optional)
  "http://localhost:3000"
];

app.use(cors({
  origin: allowedOrigins,
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
app.use('/api/auth', authRoutes); // <-- Added line for auth

// Global error handler (returns JSON)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));