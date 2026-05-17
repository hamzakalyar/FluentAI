import axios from 'axios';
import { toast } from 'sonner';

// Robust fallback: supports both VITE_API_BASE_URL and VITE_API_URL
let rawUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Auto-normalize: strip trailing slashes and ensure it ends with /api
if (rawUrl && !rawUrl.endsWith('/api') && rawUrl !== 'http://localhost:3001/api') {
  rawUrl = rawUrl.replace(/\/$/, '') + '/api';
}

const API_BASE_URL = rawUrl;

console.log("🔍 Diagnostic - Loaded Frontend API URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (logout/redirect)
      localStorage.removeItem('token');
      toast.error("Session expired. Please log in again.");
      setTimeout(() => window.location.href = '/login', 1500);
    } else if (error.response?.status >= 500) {
      toast.error("A server error occurred. Please try again later.");
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error.code === 'ERR_NETWORK') {
      toast.error("Network error. Please check your connection.");
    }
    return Promise.reject(error);
  }
);

export default api;
