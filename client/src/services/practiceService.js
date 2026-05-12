import api from './api';

export const practiceService = {
  generateExercises: (difficulty) => api.post('/practice/generate', { difficulty }),
  
  submitAttempt: (exerciseId, audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'attempt.wav');
    return api.post(`/practice/${exerciseId}/attempt`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  selfAssess: (exerciseId, assessment) => api.post(`/practice/${exerciseId}/assess`, { assessment }),
};
