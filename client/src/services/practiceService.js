import api from './api';

export const practiceService = {
  // Pass weak sounds so the backend generates exercises targeting them specifically
  generateExercises: (difficulty, weakSounds = []) =>
    api.post('/practice/generate', { difficulty, weakSounds }),
  
  saveResult: (resultData) => api.post('/practice/results', resultData),

  getResults: (params) => api.get('/practice/results', { params }),

  getSoundProgress: () => api.get('/practice/results/by-sound'),
};
