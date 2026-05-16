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
    const sessions = await Session.find({ user: req.user._id, status: 'completed' })
      .select('metrics.fluencyScore metrics.speechRateWPM metrics.repetitionCount metrics.pauseCount metrics.fillerCount weakSoundsDetected createdAt')
      .sort({ createdAt: -1 });

    if (sessions.length === 0) {
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

    const totalSessions = sessions.length;
    const avgFluency = Math.round(sessions.reduce((sum, s) => sum + (s.metrics?.fluencyScore || 0), 0) / totalSessions);
    const avgWPM = Math.round(sessions.reduce((sum, s) => sum + (s.metrics?.speechRateWPM || 0), 0) / totalSessions);
    const avgReps = (sessions.reduce((sum, s) => sum + (s.metrics?.repetitionCount || 0), 0) / totalSessions).toFixed(1);

    // Improvement Trend (Last 7 days vs Previous 7 days)
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const prevWeek = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const thisWeekSessions = sessions.filter(s => s.createdAt >= lastWeek);
    const prevWeekSessions = sessions.filter(s => s.createdAt >= prevWeek && s.createdAt < lastWeek);

    const calculateAvg = (arr, key) => arr.length > 0 ? arr.reduce((sum, s) => sum + (s.metrics?.[key] || 0), 0) / arr.length : 0;

    const trends = {
      sessions: thisWeekSessions.length - prevWeekSessions.length,
      wpm: prevWeekSessions.length > 0 ? Math.round(((calculateAvg(thisWeekSessions, 'speechRateWPM') - calculateAvg(prevWeekSessions, 'speechRateWPM')) / calculateAvg(prevWeekSessions, 'speechRateWPM')) * 100) : 0,
      repetitions: prevWeekSessions.length > 0 ? Math.round(((calculateAvg(thisWeekSessions, 'repetitionCount') - calculateAvg(prevWeekSessions, 'repetitionCount')) / calculateAvg(prevWeekSessions, 'repetitionCount')) * 100) : 0
    };

    let improvementTrend = 'stable';
    if (totalSessions >= 4) {
      const recent = sessions.slice(0, 2).reduce((sum, s) => sum + (s.metrics?.fluencyScore || 0), 0) / 2;
      const older = sessions.slice(2, 4).reduce((sum, s) => sum + (s.metrics?.fluencyScore || 0), 0) / 2;
      if (recent > older + 5) improvementTrend = 'improving';
      else if (recent < older - 5) improvementTrend = 'declining';
    }

    const user = await User.findById(req.user._id);
    const topWeakSounds = (user.weakSounds || []).sort((a, b) => b.frequency - a.frequency).slice(0, 5);

    res.json({
      totalSessions,
      averageFluencyScore: avgFluency,
      latestFluencyScore: sessions[0]?.metrics?.fluencyScore || 0,
      avgSpeechRate: avgWPM,
      avgRepetitions: parseFloat(avgReps),
      improvementTrend,
      trends,
      topWeakSounds,
      recentSessions: sessions.slice(0, 5).map(s => ({
        id: s._id.toString(),
        date: s.createdAt,
        fluencyScore: s.metrics?.fluencyScore,
        speechRateWPM: s.metrics?.speechRateWPM
      })),
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

    const chartData = sessions.map(s => ({
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
