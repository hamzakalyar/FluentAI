import api from './api';

export const analyticsService = {
  getSummary: () => api.get('/analytics/summary'),
  
  getTrend: (metric, timeframe) => api.get('/analytics/trend', { params: { metric, timeframe } }),
  
  getHistorical: (timeframe) => api.get('/analytics/historical', { params: { timeframe } }),
  
  getSoundProgress: () => api.get('/analytics/weak-sounds'),
};
