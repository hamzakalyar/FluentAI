import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6"
      style={{
        background: 'linear-gradient(135deg, #F0FDFB 0%, #F5FFFE 50%, #FFFFFF 100%)',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <div className="w-full max-w-[420px]">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 justify-center mb-10">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ background: 'linear-gradient(135deg,#0D9488,#14B8A6)' }}
          >F</div>
          <span className="font-bold text-xl" style={{ color: '#0F2744' }}>FluentAI</span>
        </Link>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black mb-2" style={{ color: '#0F2744' }}>{title}</h1>
          <p className="text-sm" style={{ color: '#6B7280' }}>{subtitle}</p>
        </div>

        {/* Card */}
        <div
          className="bg-white rounded-2xl p-8"
          style={{ boxShadow: '0 4px 32px rgba(13,148,136,0.10), 0 1px 4px rgba(0,0,0,0.04)' }}
        >
          {children}
        </div>

      </div>
    </div>
  );
};

export default AuthLayout;
