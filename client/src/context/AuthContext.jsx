import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ name: 'Hassan', role: 'patient' });
  const [token, setToken] = useState('mock_token');
  const [isAuthenticated, setIsAuthenticated] = useState(true); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initial check (could verify token with backend here)
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { user: userData, token: newToken } = response.data;
      
      setUser(userData);
      setToken(newToken);
      setIsAuthenticated(true);
      localStorage.setItem('token', newToken);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  const setRole = (newRole) => {
    setUser(prev => ({ ...prev, role: newRole }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      loading,
      login,
      logout,
      setRole
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
