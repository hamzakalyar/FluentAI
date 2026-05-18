import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, HelpCircle, Moon, Sun, Mic2, Menu, LogOut, Settings, User as UserIcon, ChevronDown } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../../context/DashboardContext';
import { cn } from '../../utils/cn';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  const [tourStep, setTourStep] = useState(null);
  const [showTourBanner, setShowTourBanner] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Stateful Notifications List
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      icon: '🎙️', 
      title: 'Speech Diagnostics Complete', 
      desc: 'Your Plosive Articulation drill has been fully aligned and analyzed by our Whisper engine.',
      time: '10 min ago',
      unread: true 
    },
    { 
      id: 2, 
      icon: '📈', 
      title: 'Fluency Milestone Unlocked', 
      desc: 'Syllables per minute has achieved a steady 112 WPM average, showing 12% improvement.',
      time: '2 hours ago',
      unread: true 
    },
    { 
      id: 3, 
      icon: '🎯', 
      title: 'New Articulation Practice Ready', 
      desc: 'I have generated a customized tongue twister drill targeting your active weak sound /p/.',
      time: '1 day ago',
      unread: false 
    },
    { 
      id: 4, 
      icon: '🔒', 
      title: 'HIPAA Security Sync', 
      desc: 'Clinical database backup verified. All patient recordings are secured with AES-256.',
      time: '2 days ago',
      unread: false 
    }
  ]);

  const hasUnread = notifications.some(n => n.unread);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };
  
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
    const tourCompleted = localStorage.getItem('fluent_tour_completed');
    if (!tourCompleted) {
      const timer = setTimeout(() => {
        setShowTourBanner(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const TOUR_STEPS = [
    {
      title: "🧭 Platform Navigation",
      text: "The left sidebar is your clinical command center. Toggle between Practice Studio, Recording History, AI Assistant, and personal settings."
    },
    {
      title: "🎙️ Quick Studio Action",
      text: "Whenever you are ready to practice, click the floating clinical Mic button at the bottom right to instantly jump into the recording studio!"
    },
    {
      title: "🌓 Aesthetic Theme & Help",
      text: "Switch themes, view notifications, or click the Help icon to restart this workspace onboarding walkthrough at any time!"
    },
    {
      title: "⚡ Interactive Speech Diagnostics",
      text: "Review diagnostic timelines inside 'My Sessions' to view objective Whisper accuracy charts and click single spoken words to isolate stutters!"
    }
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-dropdown-container')) {
        setIsUserMenuOpen(false);
      }
      if (!e.target.closest('.notification-dropdown-container')) {
        setIsNotificationOpen(false);
      }
    };
    if (isUserMenuOpen || isNotificationOpen) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isUserMenuOpen, isNotificationOpen]);

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
        onLogoutClick={() => setShowLogoutModal(true)}
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
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-[var(--text-muted)] hover:text-teal-600 hover:bg-[var(--bg-elevated)] transition-all group"
                title="Theme Toggle"
              >
                <div className="transition-transform duration-500 group-active:rotate-90">
                  {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
                </div>
              </button>

              {/* Help Tour Toggle */}
              <button
                onClick={() => { setTourStep(0); setShowTourBanner(false); }}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-[var(--text-muted)] hover:text-teal-600 hover:bg-[var(--bg-elevated)] transition-all"
                title="Workspace Tour"
              >
                <HelpCircle size={17} />
              </button>

              {/* Notification Popover */}
              <div className="relative notification-dropdown-container">
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all relative ${
                    isNotificationOpen ? 'text-teal-600 bg-[var(--bg-elevated)]' : 'text-[var(--text-muted)] hover:text-teal-600 hover:bg-[var(--bg-elevated)]'
                  }`}
                  title="Notifications"
                >
                  <Bell size={17} />
                  {hasUnread && (
                    <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full border border-[var(--bg-surface)] animate-pulse" />
                  )}
                </button>

                {isNotificationOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-[var(--bg-surface)]/95 backdrop-blur-2xl border border-[var(--border-subtle)] rounded-[24px] shadow-premium p-4 z-50 animate-in fade-in slide-in-from-top-3 duration-300">
                    <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-3 mb-3">
                      <span className="text-[12px] font-black uppercase tracking-wider text-[var(--text-primary)]">System Alerts</span>
                      {hasUnread && (
                        <button 
                          onClick={markAllAsRead}
                          className="text-[10px] font-bold text-teal-600 hover:underline active:scale-95 transition-all"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="space-y-2.5 max-h-[280px] overflow-y-auto custom-scrollbar">
                      {notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          onClick={() => markAsRead(notif.id)}
                          className={`p-3 rounded-xl border transition-all text-left flex gap-3 cursor-pointer ${
                            notif.unread 
                              ? 'bg-teal-500/5 border-teal-500/10 shadow-sm' 
                              : 'bg-[var(--bg-elevated)]/30 border-transparent hover:bg-[var(--bg-elevated)]/50'
                          }`}
                        >
                          <span className="text-[18px] shrink-0">{notif.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-black text-[var(--text-primary)] leading-tight truncate">{notif.title}</span>
                              {notif.unread && <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />}
                            </div>
                            <p className="text-[10px] text-[var(--text-secondary)] font-medium mt-1 leading-relaxed">{notif.desc}</p>
                            <span className="text-[9px] text-[var(--text-muted)] font-semibold mt-1.5 block">{notif.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
                <div className="hidden xl:flex items-center gap-1.5 pr-2">
                  <p className="text-[12px] font-black text-[var(--text-primary)] leading-none">{displayName}</p>
                  <ChevronDown 
                    size={13} 
                    className={cn(
                      "text-[var(--text-muted)] transition-transform duration-500 shrink-0",
                      isUserMenuOpen ? "rotate-180 text-teal-600" : ""
                    )} 
                  />
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
                      onClick={() => { setIsUserMenuOpen(false); setShowLogoutModal(true); }}
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

          {!['/assistant', '/recording'].includes(location.pathname) && (
            <button
              onClick={() => navigate('/recording')}
              className="fixed bottom-8 right-8 w-[52px] h-[52px] bg-[#0B0E14] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 border border-white/10 floating-mic-button"
            >
              <Mic2 size={22} />
            </button>
          )}
        </main>
      </div>

      {/* 🎓 FluentAI Workspace Interactive Tour */}
      {showTourBanner && (
        <div className="fixed bottom-6 left-6 z-[99] max-w-sm bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-5 rounded-[28px] shadow-premium animate-in slide-in-from-bottom-5 duration-500">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center shrink-0 border border-teal-500/20">
              <HelpCircle size={20} className="text-teal-600 animate-bounce" />
            </div>
            <div>
              <h4 className="font-syne text-[14px] font-black text-[var(--text-primary)]">🎓 Interactive Platform Tour</h4>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1 font-medium leading-relaxed">
                Would you like a quick onboarding walkthrough of your personalized clinical workspace?
              </p>
              <div className="flex gap-2.5 mt-4">
                <button
                  onClick={() => {
                    setTourStep(0);
                    setShowTourBanner(false);
                  }}
                  className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-teal-600/15 animate-pulse"
                >
                  Take Tour
                </button>
                <button
                  onClick={() => {
                    setShowTourBanner(false);
                    localStorage.setItem('fluent_tour_completed', 'true');
                  }}
                  className="px-3.5 py-2 border border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-wider rounded-xl transition-all"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tourStep !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[100] transition-all duration-300 flex items-center justify-center pointer-events-none">
          <div 
            className={cn(
              "fixed pointer-events-auto bg-[var(--bg-surface)] border-2 border-teal-500 rounded-[28px] p-6 max-w-sm w-full shadow-premium animate-in zoom-in-95 duration-300 z-[101]",
              tourStep === 0 && "left-4 md:left-[260px] top-[140px]",
              tourStep === 1 && "right-4 md:right-[90px] bottom-[90px]",
              tourStep === 2 && "right-4 md:right-[150px] top-[80px]",
              tourStep === 3 && "right-4 md:right-[40px] top-[110px]"
            )}
          >
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-teal-500 rounded-full animate-ping" />
            
            <h4 className="font-syne text-[14px] font-black text-[var(--text-primary)] mb-2">
              {TOUR_STEPS[tourStep].title}
            </h4>
            <p className="text-[11px] text-[var(--text-secondary)] font-medium leading-relaxed mb-5">
              {TOUR_STEPS[tourStep].text}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider">
                  Step {tourStep + 1} of {TOUR_STEPS.length}
                </span>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (tourStep > 0) setTourStep(tourStep - 1);
                    else setTourStep(null);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] text-[9px] font-black uppercase tracking-wider text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if (tourStep < TOUR_STEPS.length - 1) {
                      setTourStep(tourStep + 1);
                    } else {
                      setTourStep(null);
                      localStorage.setItem('fluent_tour_completed', 'true');
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-teal-600 text-white text-[9px] font-black uppercase tracking-wider hover:bg-teal-700 transition-colors shadow-md shadow-teal-600/15"
                >
                  {tourStep === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-300 pointer-events-auto">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[28px] p-6 max-w-sm w-full shadow-premium animate-in zoom-in-95 duration-300 text-center relative pointer-events-auto">
            <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <LogOut size={22} className="animate-pulse" />
            </div>
            <h3 className="font-syne text-[15px] font-black text-[var(--text-primary)]">Logout Session?</h3>
            <p className="text-[11px] text-[var(--text-secondary)] mt-2 font-medium leading-relaxed">
              Are you sure you want to end your active practice session? Any unsaved evaluation progress might be lost.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:bg-[var(--bg-base)] text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-wider rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  logout();
                  navigate('/login');
                }}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-red-500/10"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
