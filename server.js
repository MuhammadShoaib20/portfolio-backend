const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

dotenv.config();
connectDB();

const app = express();

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Logging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// Test routes
app.get('/', (req, res) => {
  res.json({ message: '🚀 Portfolio API is running!', version: '1.0.0' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date(), uptime: process.uptime() });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/resumes', require('./routes/resumeRoutes'));
app.use('/api/chat', require('./routes/chatRoutes')); 

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ success: false, message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('========================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}`);
  console.log('========================================');
});