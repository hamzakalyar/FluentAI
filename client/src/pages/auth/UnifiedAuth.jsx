import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

const UnifiedAuth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = useState(location.pathname === '/register' ? 'register' : 'login');

  // Sync mode with URL if user navigates via browser buttons
  useEffect(() => {
    setMode(location.pathname === '/register' ? 'register' : 'login');
  }, [location.pathname]);

  const handleToggle = (newMode) => {
    setMode(newMode);
    navigate(newMode === 'register' ? '/register' : '/login', { replace: true });
  };

  return (
    <AuthLayout 
      title={mode === 'login' ? 'Welcome Back' : 'Get Started'} 
      subtitle={mode === 'login' ? 'Sign in to continue your fluency journey' : 'Create your free account in seconds'}
    >
      <div className="flex flex-col gap-8">
        {/* Premium Segmented Toggle */}
        <div className="p-1 bg-slate-100 rounded-2xl flex items-center relative">
          <div 
            className="absolute h-[calc(100%-8px)] rounded-xl bg-white shadow-sm transition-all duration-300 ease-out"
            style={{ 
              width: 'calc(50% - 4px)',
              left: mode === 'login' ? '4px' : 'calc(50%)',
            }}
          />
          <button
            onClick={() => handleToggle('login')}
            className={`flex-1 py-2.5 text-sm font-bold relative z-10 transition-colors duration-300 ${mode === 'login' ? 'text-teal-600' : 'text-slate-500'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => handleToggle('register')}
            className={`flex-1 py-2.5 text-sm font-bold relative z-10 transition-colors duration-300 ${mode === 'register' ? 'text-teal-600' : 'text-slate-500'}`}
          >
            Sign Up
          </button>
        </div>

        {/* Form Container */}
        <div className="transition-all duration-300">
           {mode === 'login' ? <LoginPage isUnified /> : <RegisterPage isUnified />}
        </div>
      </div>
    </AuthLayout>
  );
};

export default UnifiedAuth;
