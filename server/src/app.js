const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const { sessionRouter, assessmentRouter } = require('./routes/session.routes');
const practiceRoutes = require('./routes/practice.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const assistantRoutes = require('./routes/assistant.routes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
// Build allowed origins list — CLIENT_URL can be a comma-separated list of domains
// e.g.  CLIENT_URL=https://example.vercel.app,https://mycustomdomain.com
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  ...(process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map(u => u.trim()).filter(Boolean)
    : [])
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.warn(`⚠️  CORS blocked request from: ${origin}`);
    return callback(new Error(`CORS: origin '${origin}' is not allowed`));
  },
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files — serve uploaded audio files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRouter);
app.use('/api/assessment-passages', assessmentRouter);
app.use('/api/practice', practiceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/assistant', assistantRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Speech Fluency API is running',
    timestamp: new Date().toISOString()
  });
});

// Keep-alive ping endpoint (use with UptimeRobot to prevent Render cold starts)
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});


// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
