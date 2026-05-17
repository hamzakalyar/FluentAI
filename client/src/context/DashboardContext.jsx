import React, { createContext, useContext, useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshStats = async () => {
    setLoading(true);
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
