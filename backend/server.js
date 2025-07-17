const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

// Load configuration
const config = require('./config');

const adminRoutes = require('./routes/admin');
const app = express();

// CORS Configuration - Allow all origins in production, use config in development
const corsOptions = process.env.NODE_ENV === 'production' 
  ? { origin: true, credentials: true }
  : {
      origin: config.cors.origin,
      methods: config.cors.methods,
      allowedHeaders: config.cors.allowedHeaders,
      credentials: true
    };

app.use(cors(corsOptions));

// Handle JSON & form data
app.use(bodyParser.json({ limit: config.upload.limit }));
app.use(bodyParser.urlencoded({ limit: config.upload.limit, extended: true }));
app.use(express.json({ limit: config.upload.limit }));
app.use(express.urlencoded({ limit: config.upload.limit, extended: true }));

// Static assets (e.g., for uploaded files)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/admin', adminRoutes);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || config.nodeEnv,
    supabase: {
      connected: !!(process.env.SUPABASE_URL || config.supabase?.url),
      bucket: process.env.SUPABASE_BUCKET || config.supabase?.bucket
    }
  });
});

// Base Route
app.get('/', (req, res) => {
  res.send(`🌐 HLSSA API v1.0.0 (${config.nodeEnv})`);
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Not Found',
    path: req.path
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    status: 'error',
    message,
    ...(config.nodeEnv === 'development' && { stack: err.stack })
  });
});

// Start Server
const server = app.listen(config.port, () => {
  console.log(`🚀 Server running in ${config.nodeEnv} mode on port ${config.port}`);
  console.log(`CORS configured for: ${config.cors.origin}`);
  console.log(`Supabase bucket: ${config.supabase.bucket}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// Handle keyboard interrupt
process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// Keep the server running
process.stdin.resume();

module.exports = app;
