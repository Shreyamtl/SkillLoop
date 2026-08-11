import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.method === 'get') {
    config.params = {
      ...config.params,
      _t: Date.now(),
    };
  }
  return config;
});

// ---- Auth ----
export const signup = (data) => api.post('/auth/signup', data);
export const login = (data) => api.post('/auth/login', data);

// ---- Profile ----
export const getProfile = () => api.get('/users/profile');
export const updateProfile = (data) => api.patch('/users/profile', data);

// ---- Users ----
export const getAllUsers = () => api.get('/users/all');

// ---- Matches ----
export const getSuggestedMatches = () => api.get('/matches/suggested');
export const sendMatchRequest = (data) => api.post('/matches/request', data);
export const acceptMatchRequest = (id) => api.patch(`/matches/${id}/accept`);
export const declineMatchRequest = (id) => api.patch(`/matches/${id}/decline`);
export const getMyRequests = () => api.get('/matches/my-requests');

export default api;