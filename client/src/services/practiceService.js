import api from './api';

export const practiceService = {
  generateExercises: (difficulty) => api.post('/practice/generate', { difficulty }),
  
  saveResult: (resultData) => api.post('/practice/results', resultData),

  getResults: (params) => api.get('/practice/results', { params }),

  getSoundProgress: () => api.get('/practice/results/by-sound'),
};
