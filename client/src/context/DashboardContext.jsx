import React, { createContext, useContext, useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const MOCK_DEMO_STATS = {
    totalSessions: 14,
    avgSpeechRate: 142,
    avgRepetitions: 4,
    topWeakSounds: [{ sound: 'Plosives (/p/, /b/)' }],
    recentSessions: [
      {
        id: 'mock-session-1',
        type: 'Evaluation',
        name: 'Vocal Prompt Evaluation',
        date: new Date().toISOString(),
        duration: 42,
        fluencyScore: 84
      },
      {
        id: 'mock-session-2',
        type: 'Practice',
        name: 'Plosives Reading Drill',
        date: new Date(Date.now() - 86400000).toISOString(),
        duration: 90,
        fluencyScore: 78
      },
      {
        id: 'mock-session-3',
        type: 'Evaluation',
        name: 'General Speech Prompt',
        date: new Date(Date.now() - 172800000).toISOString(),
        duration: 65,
        fluencyScore: 89
      }
    ],
    trends: {
      sessions: 4,
      wpm: 12,
      repetitions: -8
    }
  };

  const refreshStats = async () => {
    setLoading(true);
    const isDemo = localStorage.getItem('is_demo_mode') === 'true';
    if (isDemo) {
      setStats(MOCK_DEMO_STATS);
      setLoading(false);
      return;
    }

    try {
      const res = await analyticsService.getSummary();
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshStats();
  }, []);

  return (
    <DashboardContext.Provider value={{ stats, loading, refreshStats }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
