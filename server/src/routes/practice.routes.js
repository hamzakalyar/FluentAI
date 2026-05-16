/**
 * PRACTICE ROUTES — Exercise Generation & Practice Tracking
 * ===========================================================
 * These routes handle the "Practice" side of the system.
 * 
 * After analyzing a user's speech and identifying their weak sounds,
 * these endpoints generate personalized exercises and track their
 * practice progress over time.
 * 
 * FLOW:
 *   1. Frontend asks for exercises based on user's weak sounds
 *   2. Express calls Python audio-service (/generate-exercises)
 *   3. Python returns sentences targeting those sounds (easy/medium/hard)
 *   4. User practices speaking those sentences
 *   5. Frontend submits practice results back here for tracking
 * 
 * ENDPOINTS:
 *   POST /api/practice/generate          → Get exercises for weak sounds
 *   GET  /api/practice/available-sounds   → List all sounds with exercises
 *   POST /api/practice/results            → Save a practice attempt result
 *   GET  /api/practice/results            → Get user's practice history
 *   GET  /api/practice/results/by-sound   → Get practice results grouped by sound
 */

const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const PracticeResult = require('../models/PracticeResult');
const User = require('../models/User');

const router = express.Router();

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:5000';


/**
 * POST /api/practice/generate
 * 
 * Generate personalized practice exercises.
 * 
 * If no weakSounds are provided in the body, it will automatically
 * use the user's stored weak sounds from their profile.
 * 
 * Body (optional — auto-fills from user profile):
 * {
 *   "weakSounds": ["S", "TH", "R"],
 *   "difficulty": "easy",    // easy | medium | hard
 *   "count": 5               // number of exercises
 * }
 */
router.post('/generate', auth, async (req, res) => {
  try {
    let { weakSounds, difficulty, count } = req.body;

    // If no weak sounds provided, use the user's stored weak sounds
    if (!weakSounds || weakSounds.length === 0) {
      const userWeakSounds = req.user.weakSounds || [];
      weakSounds = userWeakSounds.map(ws => ws.sound);
    }

    // Fallback 1: Scan recent sessions for weakSoundsDetected
    if (!weakSounds || weakSounds.length === 0) {
      const Session = require('../models/Session');
      const recentSessions = await Session.find({ user: req.user._id, status: 'completed' })
        .sort({ createdAt: -1 })
        .limit(10)
        .select('weakSoundsDetected');
      
      const soundMap = {};
      for (const s of recentSessions) {
        for (const ws of (s.weakSoundsDetected || [])) {
          if (ws.sound) soundMap[ws.sound] = (soundMap[ws.sound] || 0) + (ws.frequency || 1);
        }
      }
      weakSounds = Object.entries(soundMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([sound]) => sound);
    }

    // Fallback 2: Use common default sounds so the page is never empty
    if (!weakSounds || weakSounds.length === 0) {
      weakSounds = ['P', 'S', 'R', 'TH'];
      console.log('⚠️  No weak sounds found — using default practice sounds:', weakSounds);
    }

    // Default values
    difficulty = difficulty || req.user.preferredDifficulty || 'easy';
    count = count || 5;

    // Validate difficulty
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return res.status(400).json({
        message: 'Invalid difficulty. Use: easy, medium, or hard'
      });
    }

    console.log(`📝 Generating ${count} ${difficulty} exercises for sounds: ${weakSounds.join(', ')}`);

    // Call Python service
    const pythonResponse = await axios.post(
      `${PYTHON_SERVICE_URL}/generate-exercises`,
      { weakSounds, difficulty, count },
      { timeout: 10000 }
    );

    res.json({
      message: 'Exercises generated successfully',
      exercises: pythonResponse.data.exercises || [],
      totalCount: pythonResponse.data.totalCount || 0,
      difficulty: pythonResponse.data.difficulty || difficulty,
      targetSounds: pythonResponse.data.targetSounds || weakSounds
    });

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        message: 'Exercise generation service is not running. Please start the Python service on port 5000.',
        error: 'PYTHON_SERVICE_UNAVAILABLE'
      });
    }

    res.status(500).json({
      message: 'Failed to generate exercises',
      error: error.message
    });
  }
});


/**
 * GET /api/practice/available-sounds
 * 
 * List all sounds that have practice exercises available.
 * Useful for UI dropdowns/filters.
 */
router.get('/available-sounds', auth, async (req, res) => {
  try {
    const pythonResponse = await axios.get(
      `${PYTHON_SERVICE_URL}/available-sounds`,
      { timeout: 5000 }
    );

    res.json({
      sounds: pythonResponse.data.sounds || []
    });

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        message: 'Exercise service is not running.',
        error: 'PYTHON_SERVICE_UNAVAILABLE'
      });
    }

    res.status(500).json({
      message: 'Failed to fetch available sounds',
      error: error.message
    });
  }
});


/**
 * POST /api/practice/results
 * 
 * Save the result of a practice attempt.
 * 
 * Body:
 * {
 *   "targetSound": "S",
 *   "targetSentence": "The sun is shining today.",
 *   "exerciseType": "sentence",
 *   "difficulty": "easy",
 *   "score": 85,
 *   "totalTargetWords": 2,
 *   "correctTargetWords": 1,
 *   "stutteredWords": ["shining"]
 * }
 */
router.post('/results', auth, async (req, res) => {
  try {
    const {
      targetSound,
      targetSentence,
      exerciseType,
      difficulty,
      score,
      totalTargetWords,
      correctTargetWords,
      stutteredWords
    } = req.body;

    // Validate required fields
    if (!targetSound || !targetSentence || !difficulty) {
      return res.status(400).json({
        message: 'Missing required fields: targetSound, targetSentence, difficulty'
      });
    }

    const practiceResult = new PracticeResult({
      user: req.user._id,
      exerciseType: exerciseType || 'sentence',
      targetSound,
      targetSentence,
      difficulty,
      score: score || 0,
      totalTargetWords: totalTargetWords || 0,
      correctTargetWords: correctTargetWords || 0,
      stutteredWords: stutteredWords || []
    });

    await practiceResult.save();

    res.status(201).json({
      message: 'Practice result saved',
      result: practiceResult
    });

  } catch (error) {
    res.status(500).json({
      message: 'Failed to save practice result',
      error: error.message
    });
  }
});


/**
 * GET /api/practice/results
 * 
 * Get the current user's practice history, sorted by newest first.
 */
router.get('/results', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Optional filter by sound
    const filter = { user: req.user._id };
    if (req.query.sound) {
      filter.targetSound = req.query.sound.toUpperCase();
    }

    const results = await PracticeResult.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await PracticeResult.countDocuments(filter);

    res.json({
      results,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch practice results',
      error: error.message
    });
  }
});


/**
 * GET /api/practice/results/by-sound
 * 
 * Get practice results grouped by target sound.
 * Shows average score and attempt count for each sound.
 * Useful for showing progress per sound in the UI.
 */
router.get('/results/by-sound', auth, async (req, res) => {
  try {
    const grouped = await PracticeResult.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$targetSound',
          averageScore: { $avg: '$score' },
          totalAttempts: { $sum: 1 },
          bestScore: { $max: '$score' },
          lastAttempt: { $max: '$createdAt' }
        }
      },
      { $sort: { totalAttempts: -1 } }
    ]);

    const result = grouped.map(g => ({
      sound: g._id,
      averageScore: Math.round(g.averageScore),
      totalAttempts: g.totalAttempts,
      bestScore: g.bestScore,
      lastAttempt: g.lastAttempt
    }));

    res.json({ soundProgress: result });

  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch sound progress',
      error: error.message
    });
  }
});


module.exports = router;
