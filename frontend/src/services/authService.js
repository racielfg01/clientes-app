import api from './api';

export const login = async (username, password) => {
  const response = await api.post('/Authenticate/login', { username, password });
  return response.data; // { token, expiration, userid, username }
};

export const register = async (username, email, password) => {
  const response = await api.post('/Authenticate/register', { username, email, password });
  return response.data; // { status, message }
};