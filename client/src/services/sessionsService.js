import api from './api';

export const sessionsService = {
  createSession: (audioBlob, metadata) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'session.wav');
    formData.append('metadata', JSON.stringify(metadata));

    return api.post('/sessions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  analyzeSession: (audioBlob, passageId) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'session.wav');
    if (passageId) formData.append('passageId', passageId);

    return api.post('/sessions/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getSessions: (params) => api.get('/sessions', { params }),
  
  getSessionById: (id) => api.get(`/sessions/${id}`),
  
  deleteSession: (id) => api.delete(`/sessions/${id}`),

  getPassages: () => api.get('/assessment-passages'),
};
