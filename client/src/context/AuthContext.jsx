import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import api from '../services/api';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser]                     = useState(null);
  const [token, setToken]                   = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading]               = useState(true);  // true until we verify the token

  // On mount — if a token exists in localStorage, rehydrate user from backend
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) {
      setLoading(false);
      return;
    }

    api.get('/auth/me')
      .then(res => {
        setUser(res.data.user);
        setToken(savedToken);
        setIsAuthenticated(true);
      })
      .catch(() => {
        // Token is invalid or expired — clear everything
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    const { user: userData, token: newToken } = response.data;

    setUser(userData);
    setToken(newToken);
    setIsAuthenticated(true);
    localStorage.setItem('token', newToken);

    return response.data;
  };

  const register = async (name, email, password) => {
    const response = await authService.register(name, email, password);
    const { user: userData, token: newToken } = response.data;

    setUser(userData);
    setToken(newToken);
    setIsAuthenticated(true);
    localStorage.setItem('token', newToken);

    return response.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  // Utility: check if the logged-in user is an admin
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      loading,
      isAdmin,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
