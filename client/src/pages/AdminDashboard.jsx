import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  Users, 
  Activity, 
  Database, 
  Settings, 
  LayoutDashboard,
  LogOut,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '../utils/cn';
import Card from '../components/shared/Card';
import Badge from '../components/shared/Badge';
import { motion } from 'framer-motion';

const AdminSidebar = () => {
  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Sessions', path: '/admin/sessions', icon: Activity },
    { label: 'System', path: '/admin/system', icon: Database },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const location = useLocation();

  return (
    <div className="w-16 md:w-[240px] h-screen bg-[#2C2C2A] border-r border-[#444] text-[#888780] flex flex-col fixed left-0 top-0 transition-all duration-300 z-50">
      <div className="p-4 md:p-6 border-b border-[#444] flex items-center justify-center md:justify-start">
        <div className="flex items-center gap-2 text-white font-black tracking-widest text-xs md:text-sm">
          <div className="w-4 h-4 bg-primary rounded-sm shrink-0" />
          <span className="hidden md:inline">ADMIN PORTAL</span>
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center h-10 rounded-lg transition-all duration-200 px-3 text-sm justify-center md:justify-start",
              (item.path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(item.path))
                ? "bg-[#444] text-white font-medium" 
                : "hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon size={16} className="md:mr-3 shrink-0" />
            <span className="hidden md:inline">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[#444]">
        <NavLink
          to="/dashboard"
          className="flex items-center justify-center md:justify-start h-10 rounded-lg transition-all duration-200 px-3 text-sm hover:bg-white/5 hover:text-white group"
          title="Exit Admin"
        >
          <LogOut size={16} className="md:mr-3 shrink-0 text-error/80 group-hover:text-error" />
          <span className="hidden md:inline">Exit Admin</span>
        </NavLink>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-[#F5F4F0] pl-16 md:pl-[240px] transition-all duration-300">
      <AdminSidebar />
      <main className="p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
