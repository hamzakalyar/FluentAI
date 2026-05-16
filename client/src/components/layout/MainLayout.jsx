import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, HelpCircle, Moon, Sun, Mic2, Menu, LogOut, Settings, User as UserIcon } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../../context/DashboardContext';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { stats } = useDashboard();

  const formatName = (name) => {
    if (!name) return 'Hassan';
    const firstPart = name.split(' ')[0];
    return firstPart.charAt(0).toUpperCase() + firstPart.slice(1).toLowerCase();
  };

  const displayName = formatName(user?.name);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-dropdown-container')) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isUserMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
  };

  const isRecordingPage = location.pathname === '/recording';
  const sidebarWidth = isMobile ? 0 : (isSidebarOpen ? 240 : 64);

  return (
    <div className={`min-h-screen bg-[var(--bg-base)] transition-all duration-500 ${isDarkMode ? 'dark-theme' : ''}`}>
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div
        className="flex flex-col transition-all duration-500 min-h-screen relative"
        style={{ paddingLeft: sidebarWidth }}
      >
        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] animate-fade-in"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        <header className="h-[64px] sticky top-0 z-40 bg-[var(--bg-surface)]/60 backdrop-blur-3xl border-b border-[var(--border-subtle)] px-6 sm:px-8 flex items-center justify-between gap-8 transition-all duration-500">
          {isMobile && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-teal-600 transition-all border border-[var(--border-subtle)]"
            >
              <Menu size={18} />
            </button>
          )}

          <div className="flex-shrink-0">
            <h1 className="font-syne text-[18px] sm:text-[20px] font-bold text-[var(--text-primary)] tracking-tight leading-none">
              Hello, <span className="text-teal-600">{displayName}</span>
            </h1>
            <p className="hidden sm:block text-[11px] font-medium text-[var(--text-muted)]">
              {stats?.totalSessions > 0 
                ? `You've completed ${stats.totalSessions} sessions this week.`
                : "Here's your fluency overview"}
            </p>
          </div>

          <div className="hidden lg:flex flex-1 justify-center max-w-lg">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-teal-500 transition-colors">
                <Search size={14} strokeWidth={3} />
              </div>
              <input
                type="text"
                placeholder="Search clinical data..."
                className="w-full h-10 pl-11 pr-4 bg-[var(--bg-base)]/40 border border-[var(--border-subtle)] rounded-[1.25rem] text-[12px] font-bold text-[var(--text-primary)] placeholder-[var(--text-muted)]/50 focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500/20 focus:bg-[var(--bg-surface)] outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5 px-2 border-r border-[var(--border-subtle)]">
              {[
                { icon: isDarkMode ? <Sun size={17} /> : <Moon size={17} />, label: 'Theme', action: toggleTheme },
                { icon: <Bell size={17} />, label: 'Notifications', hasDot: true },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={item.action}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-[var(--text-muted)] hover:text-teal-600 hover:bg-[var(--bg-elevated)] transition-all relative group"
                  title={item.label}
                >
                  <div className={`transition-transform duration-500 ${item.label === 'Theme' ? 'group-active:rotate-90' : ''}`}>
                    {item.icon}
                  </div>
                  {item.hasDot && (
                    <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full border border-[var(--bg-surface)]" />
                  )}
                </button>
              ))}
            </div>

            <div className="relative user-dropdown-container">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`flex items-center gap-2.5 p-1 rounded-full transition-all duration-500 ${isUserMenuOpen ? 'bg-[var(--bg-elevated)] ring-4 ring-teal-50/5' : 'hover:bg-[var(--bg-elevated)]'}`}
              >
                <div className="w-9 h-9 rounded-full bg-[var(--bg-base)] flex items-center justify-center text-[var(--text-primary)] font-black text-[14px] shadow-sm relative group-hover:scale-105 transition-transform overflow-hidden border border-[var(--border-subtle)]">
                  <div className="absolute inset-0 bg-gradient-to-tr from-teal-600/40 to-transparent opacity-60" />
                  <span className="relative z-10">{displayName.charAt(0)}</span>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[var(--bg-surface)] shadow-sm" />
                </div>
                <div className="hidden xl:block text-left pr-2">
                  <p className="text-[12px] font-black text-[var(--text-primary)] leading-none">{displayName}</p>
                </div>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-[var(--bg-surface)]/95 backdrop-blur-2xl border border-[var(--border-subtle)] rounded-[28px] shadow-premium py-3 z-50 animate-in fade-in slide-in-from-top-3 duration-300">
                  <div className="px-6 py-5 border-b border-[var(--border-subtle)] mb-2">
                    <p className="text-[16px] font-black text-[var(--text-primary)] leading-none mb-1.5">{user?.name || 'Hassan Ali'}</p>
                    <p className="text-[12px] font-bold text-[var(--text-muted)] truncate tracking-tight">{user?.email || 'hassan@example.com'}</p>
                  </div>
                  
                  <div className="px-2.5 space-y-1">
                    {[
                      { icon: <UserIcon size={16} />, label: 'View Profile', path: '/profile' },
                      { icon: <Mic2 size={16} />, label: 'My Sessions', path: '/analytics' },
                      { icon: <HelpCircle size={16} />, label: 'Support Center', path: '/help' },
                      { icon: <Settings size={16} />, label: 'Settings', path: '/settings' },
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => { navigate(item.path); setIsUserMenuOpen(false); }}
                        className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[14px] font-bold text-[var(--text-secondary)] hover:text-teal-600 hover:bg-[var(--bg-elevated)] transition-all text-left group"
                      >
                        <span className="text-[var(--text-muted)] group-hover:text-teal-500 transition-colors">{item.icon}</span>
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] px-2.5">
                    <button
                      onClick={() => { logout(); navigate('/login'); }}
                      className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[14px] font-bold text-red-500 hover:bg-red-500/10 transition-all text-left group"
                    >
                      <LogOut size={16} className="group-hover:translate-x-0.5 transition-transform" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className={`${isRecordingPage ? 'p-0' : 'p-[var(--page-padding)]'} relative flex-1 overflow-x-hidden`}>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent)]/5 rounded-full blur-[120px] -z-10 pointer-events-none opacity-50 dark:opacity-20" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] -z-10 pointer-events-none opacity-50 dark:opacity-20" />
          
          <div className="max-w-[1600px] mx-auto h-full">
            <Outlet />
          </div>

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
