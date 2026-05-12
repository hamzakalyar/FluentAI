import api from './api';

export const analyticsService = {
  getSummary: () => api.get('/analytics/summary'),
  
  getTrend: (metric, timeframe) => api.get('/analytics/trend', { params: { metric, timeframe } }),
  
  getWeakSounds: () => api.get('/analytics/weak-sounds'),
};
