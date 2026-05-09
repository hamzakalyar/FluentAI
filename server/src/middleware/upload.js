/**
 * UPLOAD MIDDLEWARE — Multer Configuration for Audio Files
 * ========================================================
 * Handles audio file uploads from the client.
 * Saves files to server/uploads/ with unique timestamped names.
 * 
 * Accepted formats: WAV, WebM, MP3, OGG, M4A
 * Max file size: 50MB
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage — save with unique timestamped filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique name: userId_timestamp.extension
    const userId = req.user ? req.user._id : 'anonymous';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname) || '.wav';
    cb(null, `${userId}_${timestamp}${ext}`);
  }
});

// File filter — only accept audio formats
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'audio/wav',
    'audio/wave',
    'audio/x-wav',
    'audio/webm',
    'audio/mp3',
    'audio/mpeg',
    'audio/ogg',
    'audio/mp4',
    'audio/x-m4a'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid audio format: ${file.mimetype}. Accepted: WAV, WebM, MP3, OGG, M4A`), false);
  }
};

// Create the multer upload instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024  // 50MB max
  }
});

module.exports = upload;
