import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000
});

// Add token to headers for protected routes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle token refresh and error responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  login: async (email: string, password: string) => {
    return api.post('/auth/login', { email, password });
  },
  signup: async (name: string, email: string, password: string) => {
    return api.post('/auth/signup', { name, email, password });
  },
  // Add more API methods as needed
};

export default api;
