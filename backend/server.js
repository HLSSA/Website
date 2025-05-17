// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const adminRoutes = require('./routes/admin');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Optional: Debug incoming requests
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Mount admin routes at /api/admin
app.use('/api/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('🌐 HLSSA backend is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
