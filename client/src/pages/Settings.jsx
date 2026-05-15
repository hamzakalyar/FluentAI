import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Mic2, 
  Globe,
  Save,
  Moon,
  Sun
} from 'lucide-react';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import Input from '../components/shared/Input';
import Badge from '../components/shared/Badge';
import Breadcrumb from '../components/layout/Breadcrumb';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [confirmEmail, setConfirmEmail] = useState('');
  
  const userInitials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '??';

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.getAttribute('data-theme') === 'dark';
    }
    return false;
  });

  const toggleAppTheme = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Password', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Mic2 },
    { id: 'privacy', label: 'Privacy & Data', icon: Globe },
    { id: 'danger', label: 'Danger Zone', icon: Shield, dangerous: true },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="animate-fade-in-up relative min-h-screen pb-20"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--accent)]/5 rounded-full blur-[140px] -z-10 pointer-events-none opacity-60" />
      <div className="absolute top-[20%] left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] -z-10 pointer-events-none opacity-40" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Breadcrumb />
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight font-syne mt-2">System Settings</h1>
          <p className="text-[var(--text-secondary)] font-medium mt-1 text-base">Manage your account and practice preferences</p>
        </div>
        <Button className="shadow-lg shadow-[var(--accent)]/10 h-10 text-xs">
          <Save size={16} className="mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-1.5 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-[12px] transition-all duration-300",
                  activeTab === tab.id 
                    ? tab.dangerous 
                      ? "bg-red-600 text-white shadow-lg shadow-red-200"
                      : "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20" 
                    : tab.dangerous
                      ? "text-red-500 hover:bg-red-50"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-base)]"
                )}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="pt-6 mt-6 border-t border-[var(--border-subtle)]">
            <h4 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] px-4 mb-4">Preference</h4>
            <button 
              onClick={toggleAppTheme}
              className="w-full flex items-center justify-between px-5 py-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 font-bold text-[13px] text-[var(--text-primary)]">
                {isDarkMode ? <Moon size={18} className="text-indigo-400" /> : <Sun size={18} className="text-amber-500" />}
                {isDarkMode ? 'Dark Theme' : 'Light Theme'}
              </div>
              <div className={cn(
                "w-11 h-6 rounded-full relative transition-all p-1",
                isDarkMode ? "bg-indigo-600" : "bg-slate-200"
              )}>
                <div className={cn(
                  "w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300",
                  isDarkMode ? "translate-x-5" : "translate-x-0"
                )} />
              </div>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <Card className="min-h-[600px] shadow-premium rounded-3xl border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 p-2">
                <div className="flex items-center gap-6 pb-8 border-b border-[var(--border-subtle)]">
                  <div className="w-20 h-20 bg-[var(--bg-base)] rounded-2xl flex items-center justify-center text-[var(--accent)] relative group cursor-pointer shadow-inner border border-[var(--border-subtle)] text-xl font-black">
                    {userInitials}
                    <div className="absolute inset-0 bg-[var(--accent-navy)]/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center text-white text-[10px] font-black uppercase tracking-widest backdrop-blur-[2px]">
                      Edit
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-[var(--text-primary)] font-syne">{user?.name || 'User Profile'}</h3>
                    <p className="text-sm text-[var(--text-secondary)] font-medium">{user?.role === 'patient' ? 'Patient Account' : 'Clinician Account'} • Joined March 2026</p>
                    <Badge variant="teal" className="mt-2 py-0.5 px-3 text-[10px]">Active Member</Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="hidden md:flex h-9 text-xs">Change Photo</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Full Name</label>
                    <Input defaultValue={user?.name} className="bg-[var(--bg-base)] border-none focus:ring-[var(--accent)]/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Role</label>
                    <Input defaultValue={user?.role} disabled className="bg-[var(--bg-base)] border-none opacity-60" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Email Address</label>
                    <Input defaultValue={user?.email} type="email" disabled className="bg-[var(--bg-base)] border-none opacity-60" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Account ID</label>
                    <Input defaultValue={user?._id || user?.id} disabled className="bg-[var(--bg-base)] border-none opacity-60" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Biography</label>
                  <textarea 
                    className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-2xl p-4 text-sm text-[var(--text-primary)] font-medium focus:ring-2 focus:ring-[var(--accent)]/20 outline-none min-h-[120px] transition-all"
                    placeholder="Tell us about your speech goals..."
                    defaultValue="Computer science student focused on improving public speaking fluency for technical presentations."
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'preferences' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 p-2">
                <div>
                  <h3 className="text-2xl font-black text-[var(--text-primary)] font-syne mb-2">Practice Preferences</h3>
                  <p className="text-base text-[var(--text-secondary)] font-medium">Tailor the AI engine to your specific needs</p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-[var(--bg-base)] rounded-2xl border border-[var(--border-subtle)] flex items-center justify-between group hover:border-[var(--accent)]/30 transition-all">
                    <div>
                      <p className="font-bold text-[var(--text-primary)] text-sm tracking-tight">Target Speaking Rate</p>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Desired words per minute (WPM)</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <input type="range" min="80" max="180" defaultValue="130" className="w-32 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[var(--accent)]" />
                      <span className="text-xs font-black text-[var(--text-primary)] bg-[var(--bg-surface)] px-3 py-1.5 rounded-lg shadow-sm border border-[var(--border-subtle)] w-14 text-center">130</span>
                    </div>
                  </div>                  <div className="p-4 bg-[var(--bg-base)] rounded-2xl border border-[var(--border-subtle)] flex items-center justify-between group hover:border-[var(--accent)]/30 transition-all">
                    <div>
                      <p className="font-bold text-[var(--text-primary)] text-sm tracking-tight">AI Analysis Sensitivity</p>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">How strictly should we detect disfluencies?</p>
                    </div>
                    <select className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest outline-none shadow-sm cursor-pointer hover:border-[var(--accent)] transition-all">
                      <option>Balanced</option>
                      <option>Strict</option>
                      <option>Relaxed</option>
                    </select>
                  </div>
                  
                  <div className="p-4 bg-[var(--bg-base)] rounded-2xl border border-[var(--border-subtle)] flex items-center justify-between group hover:border-[var(--accent)]/30 transition-all">
                    <div>
                      <p className="font-bold text-[var(--text-primary)] text-sm tracking-tight">Visualizer Waveform</p>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Enable real-time feedback during recording</p>
                    </div>
                    <div className="w-10 h-5 bg-[var(--accent)] rounded-full relative p-1 shadow-lg shadow-[var(--accent)]/20">
                      <div className="w-3 h-3 bg-white rounded-full translate-x-5" />
                    </div>
                  </div>
                </div>

                <div className="pt-10 mt-10 border-t border-[var(--border-subtle)] space-y-6">
                  <h4 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-5 ml-1">System Preferences</h4>
                  
                  <div className="p-6 bg-[var(--bg-base)] rounded-3xl border border-[var(--border-subtle)] flex items-center justify-between group hover:border-[var(--accent)]/30 transition-all">
                    <div>
                      <p className="font-bold text-[var(--text-primary)] text-sm">Default Difficulty</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">Starting level for new exercises</p>
                    </div>
                    <select className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-4 py-2 text-[11px] font-black text-[var(--text-primary)] uppercase tracking-widest outline-none shadow-sm cursor-pointer hover:border-[var(--accent)] transition-all">
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </div>

                  <div className="p-6 bg-[var(--bg-base)] rounded-[2rem] border border-[var(--border-subtle)] flex items-center justify-between group hover:border-[var(--accent)]/30 transition-all">
                    <div>
                      <p className="font-bold text-[var(--text-primary)] text-sm">Email Notifications</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">Weekly progress reports and updates</p>
                    </div>
                    <div className="w-12 h-6 bg-[var(--accent)] rounded-full relative p-1.5 shadow-lg shadow-[var(--accent)]/20">
                      <div className="w-3 h-3 bg-white rounded-full translate-x-6" />
                    </div>
                  </div>

                  <div className="p-6 bg-[var(--bg-base)] rounded-[2rem] border border-[var(--border-subtle)] flex items-center justify-between group hover:border-[var(--accent)]/30 transition-all">
                    <div>
                      <p className="font-bold text-[var(--text-primary)] text-sm">Progress Reminders</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">Daily nudge to maintain your streak</p>
                    </div>
                    <div className="w-12 h-6 bg-slate-200 rounded-full relative p-1.5 transition-all">
                      <div className="w-3 h-3 bg-white rounded-full translate-x-0" />
                    </div>
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t border-[var(--border-subtle)]">
                  <h4 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-4 ml-1">Input Device</h4>
                  <div className="flex items-center gap-4 p-4 border border-[var(--accent)]/30 rounded-2xl bg-[var(--accent)]/5">
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] flex items-center justify-center text-[var(--accent)] shadow-sm border border-[var(--border-subtle)]">
                      <Mic2 size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-[var(--text-primary)]">System Microphone</p>
                      <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">MacBook Pro Microphone (System Default)</p>
                    </div>
                    <Badge variant="teal" className="py-0.5 px-3 text-[9px] font-black">ACTIVE</Badge>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'password' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 p-2">
                <div>
                  <h3 className="text-2xl font-black text-[var(--text-primary)] font-syne mb-2">Security & Password</h3>
                  <p className="text-base text-[var(--text-secondary)] font-medium">Manage your password and session security</p>
                </div>

                <div className="space-y-6 max-w-md">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Current Password</label>
                    <Input type="password" placeholder="••••••••" className="bg-[var(--bg-base)] border-none focus:ring-[var(--accent)]/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">New Password</label>
                    <Input type="password" placeholder="••••••••" className="bg-[var(--bg-base)] border-none focus:ring-[var(--accent)]/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Confirm New Password</label>
                    <Input type="password" placeholder="••••••••" className="bg-[var(--bg-base)] border-none focus:ring-[var(--accent)]/20" />
                  </div>
                  <Button className="w-full h-12 shadow-lg shadow-[var(--accent)]/10">Update Password</Button>
                </div>
              </motion.div>
            )}

            {activeTab === 'privacy' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 p-2">
                <div>
                  <h3 className="text-2xl font-black text-[var(--text-primary)] font-syne mb-2">Privacy & Data</h3>
                  <p className="text-base text-[var(--text-secondary)] font-medium">Manage how your speech data is handled</p>
                </div>
                
                <div className="space-y-6">
                  <div className="p-6 bg-[var(--bg-base)] rounded-[2rem] border border-[var(--border-subtle)] flex items-center justify-between group hover:border-[var(--accent)]/30 transition-all">
                    <div>
                      <p className="font-bold text-[var(--text-primary)] text-sm">Data Anonymization</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">Remove personal identifiers from recordings</p>
                    </div>
                    <div className="w-12 h-6 bg-[var(--accent)] rounded-full relative p-1.5 shadow-lg shadow-[var(--accent)]/20">
                      <div className="w-3 h-3 bg-white rounded-full translate-x-6" />
                    </div>
                  </div>

                  <div className="p-6 bg-[var(--bg-base)] rounded-[2rem] border border-[var(--border-subtle)] flex items-center justify-between group hover:border-[var(--accent)]/30 transition-all">
                    <div>
                      <p className="font-bold text-[var(--text-primary)] text-sm">Research Participation</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">Help improve the AI with anonymous data</p>
                    </div>
                    <div className="w-12 h-6 bg-slate-200 rounded-full relative p-1.5 transition-all">
                      <div className="w-3 h-3 bg-white rounded-full translate-x-0" />
                    </div>
                  </div>
                </div>

                <div className="pt-10 mt-10 border-t border-[var(--border-subtle)]">
                   <Button variant="ghost" className="text-red-500 hover:bg-red-50">Download All My Data (.JSON)</Button>
                </div>
              </motion.div>
            )}

            {activeTab === 'danger' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 p-2">
                <div>
                  <h3 className="text-2xl font-black text-red-600 font-syne mb-2">Danger Zone</h3>
                  <p className="text-base text-[var(--text-secondary)] font-medium">Irreversible actions for your account</p>
                </div>

                <div className="border border-red-200 bg-red-50/30 rounded-[2rem] p-8 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                  <div className="flex flex-col gap-8 relative z-10">
                    <div>
                      <p className="font-bold text-red-900 text-lg">Delete Account & Data</p>
                      <p className="text-sm text-red-700/70 font-medium leading-relaxed mt-2 max-w-xl">
                        This will permanently delete your account, all practice history, recordings, and analytics data. This action is **irreversible**.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-red-900/60 uppercase tracking-[0.2em]">To confirm, type your email address below</label>
                        <Input 
                          placeholder="hassan@example.com" 
                          value={confirmEmail}
                          onChange={(e) => setConfirmEmail(e.target.value)}
                          className="bg-white border-red-200 focus:ring-red-500/20 max-w-md h-12" 
                        />
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-4 pt-2">
                        <Button 
                          variant="danger" 
                          className="px-10 h-12 shadow-lg shadow-red-200/50"
                          disabled={confirmEmail !== 'hassan@example.com'}
                        >
                          Permanently Delete Account
                        </Button>
                        <Button variant="ghost" className="h-12 border-slate-200">Delete Only Data</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
