import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Mic2, 
  BarChart3, 
  GraduationCap, 
  Settings,
  ChevronLeft,
  LogOut,
  User
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Mic2, label: 'Recording Studio', path: '/recording' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: GraduationCap, label: 'Practice', path: '/practice' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 h-full bg-[#0B1221] text-white transition-all duration-500 z-50 flex flex-col shadow-2xl ${
        isOpen 
          ? 'w-60 translate-x-0' 
          : 'w-16 lg:translate-x-0 -translate-x-full lg:opacity-100 opacity-0 pointer-events-none lg:pointer-events-auto'
      }`}
    >
      {/* ── LOGO ZONE ── */}
      <div className="h-[var(--topbar-height)] flex items-center px-4 border-b border-white/5 relative">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div className="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center font-black text-lg">F</div>
          {isOpen && <span className="ml-3 font-syne font-bold text-lg tracking-tight">FluentAI</span>}
        </button>
        
        {/* Collapse Toggle (Teal Highlight for Visibility) */}
        <button 
          onClick={toggleSidebar}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#0B1221] border border-[var(--accent)] rounded-full flex items-center justify-center text-[var(--accent)] transition-all shadow-xl z-50 cursor-pointer"
        >
          <ChevronLeft size={14} className={`transition-transform duration-300 ${!isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* ── NAVIGATION ── */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
              ${isActive 
                ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'}
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} className="flex-shrink-0" />
                {isOpen && <span className="text-[13px] font-bold tracking-tight">{item.label}</span>}
                
                {/* Active Indicator Bar (Screenshot style) */}
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-white rounded-r-full shadow-[2px_0_10px_white]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── FOOTER ACTIONS ── */}
      <div className="p-4 border-t border-white/5 space-y-4">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 group-hover:border-[var(--accent)] transition-all overflow-hidden">
             <User size={16} className="text-slate-400" />
          </div>
          {isOpen && (
            <div className="flex-1 min-w-0">
               <p className="text-sm font-bold truncate">Hassan Ali</p>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Settings</p>
            </div>
          )}
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-white/5 transition-all group"
        >
          <LogOut size={20} className="flex-shrink-0" />
          {isOpen && <span className="text-[13px] font-bold tracking-tight">Log out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
