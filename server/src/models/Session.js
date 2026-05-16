const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  audioPath: {
    type: String,
    required: true
  },
  audioFilename: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // duration in seconds
    default: 0
  },
  status: {
    type: String,
    enum: ['uploading', 'processing', 'completed', 'failed'],
    default: 'uploading'
  },
  // Transcript data from Whisper
  transcript: {
    text: { type: String, default: '' },
    words: [{
      word: String,
      start: Number,
      end: Number
    }]
  },
  // Stutter detection metrics
  metrics: {
    fluencyScore: { type: Number, default: 0 },
    speechRateWPM: { type: Number, default: 0 },
    repetitionCount: { type: Number, default: 0 },
    pauseCount: { type: Number, default: 0 },
    fillerCount: { type: Number, default: 0 },
    repetitions: [{
      word: String,
      times: Number,
      position: Number,
      sound: String
    }],
    pauses: [{
      position: Number,
      durationMs: Number
    }],
    fillers: [String],
    detectedStutters: [{
      type: { type: String },
      word: String,
      position: Number
    }]
  },
  // NLP analysis data
  nlpAnalysis: {
    posDistribution: {
      type: Map,
      of: Number,
      default: {}
    },
    complexity: {
      typeTokenRatio: { type: Number, default: 0 },
      avgWordLength: { type: Number, default: 0 },
      lexicalDensity: { type: Number, default: 0 }
    },
    avoidanceDetected: { type: Boolean, default: false },
    sentimentPolarity: { type: Number, default: 0 }
  },
  // Weak sounds detected in this session
  weakSoundsDetected: [{
    sound: String,
    frequency: Number
  }],
  // Assessment mode fields
  passageId: { type: String, default: null },
  assessmentComparison: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
sessionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Session', sessionSchema);
