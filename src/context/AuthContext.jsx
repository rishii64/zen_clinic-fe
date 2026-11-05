import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('zenxnic_token') || null);
  const [clinicConfig, setClinicConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      const res = await api.getConfig();
      if (res.success) {
        setClinicConfig(res.config);
      }
    } catch (err) {
      console.error('Failed to load clinic config:', err);
    }
  };

  const checkUserSession = async () => {
    try {
      if (token) {
        const res = await api.getMe();
        if (res.success) {
          setUser(res.user);
        } else {
          logout();
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.warn('Session expired or invalid, clearing session');
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
    checkUserSession();
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.success) {
      localStorage.setItem('zenxnic_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    if (res.success) {
      localStorage.setItem('zenxnic_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('zenxnic_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        clinicConfig,
        reloadConfig: fetchConfig,
        login,
        register,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
