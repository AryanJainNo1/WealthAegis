import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

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
