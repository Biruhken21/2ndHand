// server.js - CLEAN VERSION
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/authRoute');
const productRoutes = require('./routes/productRoute');
const adminRoutes = require('./routes/adminRoute');
const actionRoutes = require('./routes/actionRoute');

const app = express();

// Connect to MongoDB directly
mongoose.connect('mongodb://localhost:27017/userproduct')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Body parser
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/actions', actionRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API working!' });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});