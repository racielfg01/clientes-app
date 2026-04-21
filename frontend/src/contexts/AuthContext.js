import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginApi, register as registerApi } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && userId) {
      setUser({ username: localStorage.getItem('username') });
    }
  }, [token, userId]);

  const login = async (username, password, remember) => {
    setLoading(true);
    try {
      const data = await loginApi(username, password);
      setToken(data.token);
      setUserId(data.userid);
      setUser({ username: data.username });
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userid);
      localStorage.setItem('username', data.username);
      if (remember) {
        localStorage.setItem('rememberedUser', username);
      } else {
        localStorage.removeItem('rememberedUser');
      }
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, message: error.response?.data?.message || 'Error de autenticación' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    try {
      await registerApi(username, email, password);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error en registro' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  };

  return (
    <AuthContext.Provider value={{ user, token, userId, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};