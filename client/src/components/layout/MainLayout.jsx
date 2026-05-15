import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, HelpCircle, Moon, Sun, Mic2, Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../../context/DashboardContext';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stats } = useDashboard();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
  };

  const isRecordingPage = location.pathname === '/recording';
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Handle Window Resize
  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarWidth = isMobile ? 0 : (isSidebarOpen ? 240 : 64);

  return (
    <div className={`min-h-screen bg-[var(--bg-base)] ${isDarkMode ? 'dark-theme' : ''}`}>
      {/* ── SIDEBAR ── */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* ── MAIN CONTENT AREA ── */}
      <div
        className="flex flex-col transition-all duration-300 min-h-screen relative"
        style={{ paddingLeft: sidebarWidth }}
      >
        {/* Overlay for mobile sidebar */}
        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] animate-fade-in"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        {/* ── TOPBAR (Blueprint Match: Greeting + Centered Search) ── */}
        <header className="h-[var(--topbar-height)] sticky top-0 z-40 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] px-4 sm:px-[var(--page-padding)] flex items-center justify-between gap-3 sm:gap-6">

          {/* Mobile Menu Toggle */}
          {isMobile && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
            >
              <Menu size={20} />
            </button>
          )}

          {/* Left: Greeting (Screenshot Match) */}
          <div className="flex-shrink-0">
            <h1 className="font-syne text-[18px] sm:text-[20px] font-bold text-[var(--text-primary)] leading-tight">
              {user?.name?.split(' ')[0] || 'Hassan'}
            </h1>
            <p className="hidden sm:block text-[11px] font-medium text-[var(--text-muted)]">
              {stats?.totalSessions > 0 
                ? `You've completed ${stats.totalSessions} sessions this week.`
                : "Here's your fluency overview"}
            </p>
          </div>

          {/* Center: Centered Search (Desktop only) */}
          <div className="hidden lg:flex flex-1 justify-center">
            <div className="relative w-full max-w-[380px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search clinical data..."
                className="w-full h-[36px] pl-10 pr-4 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg text-[13px] font-medium placeholder-[var(--text-muted)] focus:ring-1 focus:ring-[var(--accent)] focus:bg-[var(--bg-surface)] outline-none transition-all text-[var(--text-primary)]"
              />
            </div>
          </div>

          {/* Right: Actions (No Roles/Premium) */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <button className="hidden sm:block p-2 text-slate-400 hover:text-[var(--text-primary)] transition-colors" title="Help">
              <HelpCircle size={18} />
            </button>

            <button
              onClick={toggleTheme}
              className="w-[36px] h-[36px] flex items-center justify-center text-slate-400 hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] rounded-lg transition-all"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button className="p-2 text-slate-400 hover:text-[var(--text-primary)] transition-colors relative" title="Notifications">
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-[var(--bg-surface)]" />
            </button>

            <div className="w-[1px] h-4 bg-[var(--border-subtle)] mx-2" />

            <button className="w-[36px] h-[36px] rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-medium text-sm shadow-sm hover:scale-105 transition-all ml-1">
              {user?.name?.[0] || 'H'}
            </button>
          </div>
        </header>

        <main className={`${isRecordingPage ? 'p-0' : 'p-[var(--page-padding)]'} relative flex-1 overflow-x-hidden`}>
          {/* Backdrop Decor Glows */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent)]/5 rounded-full blur-[120px] -z-10 pointer-events-none opacity-50 dark:opacity-20" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] -z-10 pointer-events-none opacity-50 dark:opacity-20" />
          
          <div className="max-w-[1600px] mx-auto h-full">
            <Outlet />
          </div>

          {/* Floating Action Button (Screenshot Match) */}
          <button
            onClick={() => navigate('/recording')}
            className="fixed bottom-8 right-8 w-[52px] h-[52px] bg-[#0B0E14] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 border border-white/10"
          >
            <Mic2 size={22} />
          </button>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
