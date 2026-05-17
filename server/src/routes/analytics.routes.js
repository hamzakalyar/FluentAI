/**
 * ANALYTICS ROUTES — Progress Tracking & Historical Data
 * =======================================================
 * These routes provide aggregated data for the user dashboard
 * and historical data points for charts.
 */

const express = require('express');
const auth = require('../middleware/auth');
const Session = require('../models/Session');
const PracticeResult = require('../models/PracticeResult');
const User = require('../models/User');

const router = express.Router();

/**
 * GET /api/analytics/summary
 * Returns total sessions, average score, latest score, trend, and top weak sounds.
 */
router.get('/summary', auth, async (req, res) => {
  try {
    // Fetch both full recording sessions AND practice results
    const [sessions, practiceResults] = await Promise.all([
      Session.find({ user: req.user._id, status: 'completed' })
        .select('metrics.fluencyScore metrics.speechRateWPM metrics.repetitionCount metrics.pauseCount metrics.fillerCount weakSoundsDetected createdAt duration')
        .sort({ createdAt: -1 }),
      PracticeResult.find({ user: req.user._id })
        .select('score targetSound createdAt targetSentence difficulty')
        .sort({ createdAt: -1 })
    ]);

    const totalRecordings = sessions.length;
    const totalPractice = practiceResults.length;
    const totalActivities = totalRecordings + totalPractice;

    if (totalActivities === 0) {
      return res.json({
        totalSessions: 0,
        averageFluencyScore: 0,
        latestFluencyScore: 0,
        avgSpeechRate: 0,
        avgRepetitions: 0,
        improvementTrend: 'no_data',
        trends: { sessions: 0, wpm: 0, repetitions: 0 },
        topWeakSounds: [],
        recentSessions: [],
        latestSession: null
      });
    }

    // Combined Metrics
    const allScores = [
      ...sessions.map(s => s.metrics?.fluencyScore || 0),
      ...practiceResults.map(p => p.score || 0)
    ];
    const avgFluency = Math.round(allScores.reduce((sum, s) => sum + s, 0) / allScores.length);
    
    // WPM and Repetitions still primarily come from full sessions for accuracy
    const avgWPM = totalRecordings > 0 ? Math.round(sessions.reduce((sum, s) => sum + (s.metrics?.speechRateWPM || 0), 0) / totalRecordings) : 0;
    const avgReps = totalRecordings > 0 ? (sessions.reduce((sum, s) => sum + (s.metrics?.repetitionCount || 0), 0) / totalRecordings).toFixed(1) : "0.0";

    // Combined recent list for Dashboard
    const combinedRecent = [
      ...sessions.slice(0, 5).map(s => ({
        id: s._id.toString(),
        type: 'Session',
        date: s.createdAt,
        fluencyScore: s.metrics?.fluencyScore,
        speechRateWPM: s.metrics?.speechRateWPM,
        duration: s.duration,
        name: `Recording Check`
      })),
      ...practiceResults.slice(0, 5).map(p => ({
        id: p._id.toString(),
        type: 'Practice',
        date: p.createdAt,
        fluencyScore: p.score,
        name: `Practice: ${p.targetSound} Focus`,
        details: p.targetSentence
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

    // Improvement Trend
    let improvementTrend = 'stable';
    if (allScores.length >= 4) {
      const recent = allScores.slice(0, 2).reduce((sum, s) => sum + s, 0) / 2;
      const older = allScores.slice(2, 4).reduce((sum, s) => sum + s, 0) / 2;
      if (recent > older + 5) improvementTrend = 'improving';
      else if (recent < older - 5) improvementTrend = 'declining';
    }

    const user = await User.findById(req.user._id).select('weakSounds');
    let topWeakSounds = user && user.weakSounds ? [...user.weakSounds].sort((a, b) => b.frequency - a.frequency).slice(0, 5) : [];

    // Fallback for weak sounds
    if (topWeakSounds.length === 0 && sessions.length > 0) {
      const soundMap = {};
      for (const s of sessions.slice(0, 10)) {
        for (const ws of (s.weakSoundsDetected || [])) {
          if (ws.sound) soundMap[ws.sound] = (soundMap[ws.sound] || 0) + (ws.frequency || 1);
        }
      }
      topWeakSounds = Object.entries(soundMap)
        .map(([sound, frequency]) => ({ sound, frequency }))
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 5);
    }

    res.json({
      totalSessions: totalActivities,
      totalRecordings,
      totalPractice,
      averageFluencyScore: avgFluency,
      latestFluencyScore: allScores[0] || 0,
      avgSpeechRate: avgWPM,
      avgRepetitions: parseFloat(avgReps),
      improvementTrend,
      trends: { 
        sessions: totalActivities, // Simplified for now
        wpm: 0, 
        repetitions: 0 
      },
      topWeakSounds,
      recentSessions: combinedRecent,
      latestSession: sessions[0]
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch summary analytics', error: error.message });
  }
});

/**
 * GET /api/analytics/historical OR /api/analytics/trend
 * Unified endpoint for charting.
 */
router.get(['/historical', '/trend'], auth, async (req, res) => {
  try {
    const { timeframe = '7d' } = req.query;
    let days = 7;
    if (timeframe === '30d') days = 30;
    if (timeframe === '90d') days = 90;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const sessions = await Session.find({
      user: req.user._id,
      status: 'completed',
      createdAt: { $gte: startDate }
    })
    .sort({ createdAt: 1 })
    .select('metrics.fluencyScore metrics.speechRateWPM metrics.repetitionCount metrics.pauseCount createdAt');

    // FALLBACK: If no sessions in this timeframe, get the last 10 sessions anyway 
    // so the charts aren't just empty.
    let finalSessions = sessions;
    if (sessions.length === 0) {
      finalSessions = await Session.find({ user: req.user._id, status: 'completed' })
        .sort({ createdAt: -1 })
        .limit(10)
        .select('metrics.fluencyScore metrics.speechRateWPM metrics.repetitionCount metrics.pauseCount createdAt');
      finalSessions.reverse(); // Back to chronological order
    }

    const chartData = finalSessions.map(s => ({
      name: new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: s.metrics?.fluencyScore || 0,
      value: s.metrics?.fluencyScore || 0, // for generic 'value' consumers
      wpm: s.metrics?.speechRateWPM || 0,
      repetitions: s.metrics?.repetitionCount || 0,
      pauses: s.metrics?.pauseCount || 0,
      date: s.createdAt
    }));

    res.json({ timeframe, data: chartData });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch historical analytics', error: error.message });
  }
});

/**
 * GET /api/analytics/weak-sounds
 * Aggregated progress per sound from PracticeResults.
 */
router.get('/weak-sounds', auth, async (req, res) => {
  try {
    const soundProgress = await PracticeResult.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$targetSound',
          avgScore: { $avg: '$score' },
          totalAttempts: { $sum: 1 },
          lastAttempt: { $max: '$createdAt' }
        }
      },
      { $sort: { totalAttempts: -1 } }
    ]);

    const user = await User.findById(req.user._id).select('weakSounds');
    const profileWeakSounds = user?.weakSounds || [];

    const formattedProgress = soundProgress.map(sp => ({
      sound: sp._id,
      score: Math.round(sp.avgScore),
      totalAttempts: sp.totalAttempts,
      lastAttempt: sp.lastAttempt,
      frequency: profileWeakSounds.find(p => p.sound === sp._id)?.frequency || 0
    }));

    res.json({ soundProficiency: formattedProgress, weakSounds: profileWeakSounds });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sound analytics', error: error.message });
  }
});

module.exports = router;
