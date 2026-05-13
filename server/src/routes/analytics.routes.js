/**
 * ANALYTICS ROUTES
 * ================
 * Serves aggregated analytics data for the frontend Analytics page.
 * All data is derived from the Session collection.
 *
 * ENDPOINTS:
 *   GET /api/analytics/summary       → Overall stats (mirrors sessions/stats/summary)
 *   GET /api/analytics/trend         → Sessions grouped by date for chart data
 *   GET /api/analytics/weak-sounds   → User's weak sounds from profile
 */

const express = require('express');
const auth = require('../middleware/auth');
const Session = require('../models/Session');
const User = require('../models/User');

const router = express.Router();

/**
 * GET /api/analytics/summary
 * Returns total sessions, average score, latest score, trend, and top weak sounds.
 */
router.get('/summary', auth, async (req, res) => {
  try {
    const sessions = await Session.find({
      user: req.user._id,
      status: 'completed'
    })
      .select('metrics.fluencyScore metrics.speechRateWPM metrics.repetitionCount metrics.pauseCount metrics.fillerCount weakSoundsDetected createdAt')
      .sort({ createdAt: -1 });

    if (sessions.length === 0) {
      return res.json({
        totalSessions: 0,
        averageFluencyScore: 0,
        latestFluencyScore: 0,
        improvementTrend: 'no_data',
        topWeakSounds: [],
        recentSessions: []
      });
    }

    const avgScore = Math.round(
      sessions.reduce((sum, s) => sum + (s.metrics?.fluencyScore || 0), 0) / sessions.length
    );

    let improvementTrend = 'stable';
    if (sessions.length >= 6) {
      const recent3 = sessions.slice(0, 3).reduce((sum, s) => sum + (s.metrics?.fluencyScore || 0), 0) / 3;
      const older3  = sessions.slice(3, 6).reduce((sum, s) => sum + (s.metrics?.fluencyScore || 0), 0) / 3;
      if (recent3 > older3 + 3) improvementTrend = 'improving';
      else if (recent3 < older3 - 3) improvementTrend = 'declining';
    }

    const weakSoundsMap = {};
    for (const s of sessions) {
      for (const ws of (s.weakSoundsDetected || [])) {
        weakSoundsMap[ws.sound] = (weakSoundsMap[ws.sound] || 0) + (ws.frequency || 1);
      }
    }
    const topWeakSounds = Object.entries(weakSoundsMap)
      .map(([sound, frequency]) => ({ sound, frequency }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5);

    res.json({
      totalSessions: sessions.length,
      averageFluencyScore: avgScore,
      latestFluencyScore: sessions[0]?.metrics?.fluencyScore || 0,
      improvementTrend,
      topWeakSounds,
      recentSessions: sessions.slice(0, 5).map(s => ({
        id: s._id,
        fluencyScore: s.metrics?.fluencyScore || 0,
        speechRateWPM: s.metrics?.speechRateWPM || 0,
        date: s.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics summary', error: error.message });
  }
});


/**
 * GET /api/analytics/trend
 * Query params: metric (wpm|repetitions|pauses|fluency), timeframe (7d|30d|90d)
 * Returns an array of { name: 'May 01', value: 105 } for charting.
 */
router.get('/trend', auth, async (req, res) => {
  try {
    const { metric = 'wpm', timeframe = '7d' } = req.query;

    const days = timeframe === '90d' ? 90 : timeframe === '30d' ? 30 : 7;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const sessions = await Session.find({
      user: req.user._id,
      status: 'completed',
      createdAt: { $gte: since }
    })
      .select('metrics.fluencyScore metrics.speechRateWPM metrics.repetitionCount metrics.pauseCount createdAt')
      .sort({ createdAt: 1 });

    const metricMap = {
      wpm:         s => s.metrics?.speechRateWPM || 0,
      repetitions: s => s.metrics?.repetitionCount || 0,
      pauses:      s => s.metrics?.pauseCount || 0,
      fluency:     s => s.metrics?.fluencyScore || 0,
    };
    const getValue = metricMap[metric] || metricMap.wpm;

    const data = sessions.map(s => ({
      name: new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: getValue(s),
      // Also include all metrics so frontend can switch without re-fetching
      wpm:         s.metrics?.speechRateWPM || 0,
      repetitions: s.metrics?.repetitionCount || 0,
      pauses:      s.metrics?.pauseCount || 0,
      fluency:     s.metrics?.fluencyScore || 0,
    }));

    res.json({ data, metric, timeframe });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch trend data', error: error.message });
  }
});


/**
 * GET /api/analytics/weak-sounds
 * Returns the user's aggregated weak sounds with frequency counts.
 */
router.get('/weak-sounds', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('weakSounds');
    res.json({ weakSounds: user?.weakSounds || [] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch weak sounds', error: error.message });
  }
});


module.exports = router;
