import axios from 'axios';

// Detectar entorno
const isProduction = process.env.NODE_ENV === 'production';
const API_URL = isProduction 
  ? `${window.location.origin}/api`  // En Railway, usa la misma URL
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;