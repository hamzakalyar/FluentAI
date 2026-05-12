import api from './api';

export const authService = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
    
  register: (name, email, password) => 
    api.post('/auth/register', { name, email, password }),
    
  verifyEmail: (token) => 
    api.post('/auth/verify-email', { token }),
    
  forgotPassword: (email) => 
    api.post('/auth/forgot-password', { email }),
    
  resetPassword: (token, password) => 
    api.post('/auth/reset-password', { token, password }),
};
