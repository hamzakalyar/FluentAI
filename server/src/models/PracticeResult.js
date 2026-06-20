const mongoose = require('mongoose');

const practiceResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exerciseType: {
    type: String,
    enum: ['sentence', 'tongue_twister', 'word_list'],
    default: 'sentence'
  },
  targetSound: {
    type: String,
    required: true
  },
  targetSentence: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  stutteredWords: [String],
  totalTargetWords: {
    type: Number,
    default: 0
  },
  correctTargetWords: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

practiceResultSchema.index({ user: 1, createdAt: -1 });
// Compound index for by-sound aggregation (most frequent analytics query)
practiceResultSchema.index({ user: 1, targetSound: 1 });
// Index for filtering by difficulty
practiceResultSchema.index({ user: 1, difficulty: 1 });

module.exports = mongoose.model('PracticeResult', practiceResultSchema);
