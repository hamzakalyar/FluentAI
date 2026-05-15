import api from './api';

export const analyticsService = {
  getSummary: () => api.get('/analytics/summary'),
  
  getHistorical: (timeframe) => api.get('/analytics/historical', { params: { timeframe } }),
  
  getSoundProgress: () => api.get('/analytics/weak-sounds'),
};
