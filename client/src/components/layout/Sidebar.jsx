import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Mic2, 
  BarChart3, 
  GraduationCap, 
  Settings,
  ChevronLeft,
  LogOut,
  User,
  Bot
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
 
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Mic2, label: 'Recording Studio', path: '/recording' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Bot, label: 'AI Assistant', path: '/assistant' },
    { icon: GraduationCap, label: 'Practice', path: '/practice' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];
 
  return (
    <aside 
      className={`fixed left-0 top-0 h-full bg-[#0B1221]/95 backdrop-blur-xl text-white transition-all duration-500 z-50 flex flex-col border-r border-white/[0.03] shadow-[4px_0_24px_rgba(0,0,0,0.3)] ${
        isOpen 
          ? 'w-60 translate-x-0' 
          : 'w-16 lg:translate-x-0 -translate-x-full lg:opacity-100 opacity-0 pointer-events-none lg:pointer-events-auto'
      }`}
    >
      {/* ── LOGO ZONE ── */}
      <div className="h-[var(--topbar-height)] flex items-center px-4 border-b border-white/[0.05] relative bg-white/[0.01]">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center hover:opacity-80 transition-all duration-300 cursor-pointer group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center font-black text-lg shadow-[0_0_15px_rgba(20,184,166,0.3)] group-hover:shadow-[0_0_20px_rgba(20,184,166,0.5)] transition-all">F</div>
          {isOpen && <span className="ml-3 font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">FluentAI</span>}
        </button>
        
        {/* Collapse Toggle */}
        <button 
          onClick={toggleSidebar}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#0B1221] border border-teal-500/50 rounded-full flex items-center justify-center text-teal-500 transition-all shadow-xl z-50 cursor-pointer hover:bg-teal-500 hover:text-white"
        >
          <ChevronLeft size={12} className={`transition-transform duration-300 ${!isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
 
      {/* ── NAVIGATION ── */}
      <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-300 group relative
              ${isActive 
                ? 'bg-gradient-to-r from-teal-500/20 to-teal-500/5 text-white shadow-[0_4px_12px_rgba(20,184,166,0.1)] border border-teal-500/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'}
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon size={18} className={`flex-shrink-0 transition-all duration-300 ${isActive ? 'text-teal-400 scale-110' : 'group-hover:text-slate-200'}`} />
                {isOpen && <span className="text-[13px] font-bold tracking-tight">{item.label}</span>}
                
                {isActive && (
                   <div className="absolute left-0 w-[3px] h-5 bg-gradient-to-b from-teal-400 to-teal-600 rounded-r-full shadow-[2px_0_10px_rgba(20,184,166,0.6)]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
 
      {/* ── FOOTER ACTIONS ── */}
      <div className="p-3 border-t border-white/[0.05] space-y-2 bg-white/[0.01]">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/[0.08] transition-all duration-300 group"
        >
          <LogOut size={18} className="flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
          {isOpen && <span className="text-[13px] font-bold tracking-tight">Logout Session</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
