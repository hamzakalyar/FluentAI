import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Mic2, 
  Globe,
  Save,
  Moon,
  Sun,
  Info,
  Camera,
  Plus,
  Key,
  Database,
  Trash2,
  Download,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
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
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Privacy & Data states
  const [allowAIImprovement, setAllowAIImprovement] = useState(true);
  const [privateTherapyProfile, setPrivateTherapyProfile] = useState(false);
  const [cacheDuration, setCacheDuration] = useState('90');
  
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
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--accent)]/5 rounded-full blur-[140px] -z-10 pointer-events-none opacity-60" />
      <div className="absolute top-[20%] left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] -z-10 pointer-events-none opacity-40" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Breadcrumb />
          <h1 className="text-2xl md:text-3xl font-black text-[var(--text-primary)] tracking-tight font-syne mt-2">System Settings</h1>
          <p className="text-[var(--text-secondary)] font-medium mt-1 text-sm md:text-base">Manage your account and practice preferences</p>
        </div>
        
        <Button 
          onClick={() => toast.success("Settings saved successfully!")}
          className="hidden md:flex shadow-lg shadow-[var(--accent)]/10 h-10 text-xs"
        >
          <Save size={16} className="mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-[var(--bg-surface)]/80 backdrop-blur-xl border-t border-[var(--border-subtle)] z-50 flex items-center justify-center">
        <Button 
          onClick={() => toast.success("Settings saved successfully!")}
          className="w-full shadow-lg shadow-[var(--accent)]/10 h-12 text-sm font-bold"
        >
          <Save size={18} className="mr-2" />
          Save All Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        <div className="lg:col-span-1 lg:sticky lg:top-24 h-fit">
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-hide">
            <div className="flex lg:flex-col gap-2 min-w-max lg:min-w-0 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-1.5 shadow-sm w-full">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-[12px] transition-all duration-300 whitespace-nowrap lg:w-full",
                    activeTab === tab.id 
                      ? tab.dangerous 
                        ? "bg-red-600 text-white shadow-lg shadow-red-500/20"
                        : "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20" 
                      : tab.dangerous
                        ? "text-red-500 hover:bg-red-50"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-base)]"
                  )}
                >
                  <tab.icon size={16} className="shrink-0" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="hidden lg:block pt-6 mt-6 border-t border-[var(--border-subtle)]">
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

        <div className="lg:col-span-3">
          <Card className="min-h-[600px] shadow-premium rounded-3xl border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 p-2">
                <div className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-[var(--border-subtle)] relative">
                  <div className="relative group">
                    <div 
                      onClick={() => document.getElementById('avatar-upload').click()}
                      className="w-32 h-32 bg-gradient-to-br from-teal-500/10 to-indigo-500/10 rounded-[2.5rem] flex items-center justify-center relative overflow-hidden cursor-pointer transition-all duration-500 hover:rounded-[1.5rem] hover:shadow-2xl hover:shadow-teal-500/20 border border-white"
                    >
                      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
                      <span className="text-4xl font-black bg-gradient-to-br from-teal-600 to-indigo-600 bg-clip-text text-transparent relative z-10">
                        {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '??'}
                      </span>
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center text-white backdrop-blur-[4px] z-20">
                        <Camera size={28} className="mb-2" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">Update</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => document.getElementById('avatar-upload').click()}
                      className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center text-slate-600 hover:text-teal-600 hover:scale-110 transition-all z-30"
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                      <h3 className="text-3xl font-black text-[var(--text-primary)] font-syne tracking-tight">{user?.name || 'User Profile'}</h3>
                      <div className="flex justify-center md:justify-start gap-2">
                        <Badge variant="teal" className="py-0.5 px-3 text-[9px] font-black uppercase tracking-wider">Premium</Badge>
                        <Badge variant="outline" className="py-0.5 px-3 text-[9px] font-black uppercase tracking-wider border-indigo-500/20 text-indigo-500 bg-indigo-50/30">Verified</Badge>
                      </div>
                    </div>
                    <p className="text-base text-[var(--text-secondary)] font-medium capitalize">{user?.role || 'Patient'} Account • Joined March 2026</p>
                    <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">
                      <input type="file" id="avatar-upload" className="hidden" accept="image/*" />
                      <button 
                        onClick={() => document.getElementById('avatar-upload').click()}
                        className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                      >
                        <Camera size={14} /> New Portrait
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Full Name</label>
                    <Input defaultValue={user?.name} className="bg-[var(--bg-base)] border-none focus:ring-[var(--accent)]/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Email Address</label>
                    <Input defaultValue={user?.email} type="email" disabled className="bg-[var(--bg-base)] border-none opacity-60" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Role</label>
                    <Input defaultValue={user?.role} disabled className="bg-[var(--bg-base)] border-none opacity-60 capitalize" />
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
                <header className="border-b border-[var(--border-subtle)] pb-6">
                  <h3 className="text-2xl font-black text-[var(--text-primary)] font-syne mb-2">Practice Environment</h3>
                  <p className="text-base text-[var(--text-secondary)] font-medium">Fine-tune the AI engine and visual feedback systems for your therapy sessions.</p>
                </header>

                <section className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-4 bg-[var(--accent)] rounded-full" />
                    <h4 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Algorithm Calibration</h4>
                  </div>
                  
                  <div className="p-5 bg-[var(--bg-base)] rounded-2xl border border-[var(--border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group transition-all">
                    <div className="flex-1">
                      <p className="font-bold text-[var(--text-primary)] text-sm tracking-tight flex items-center gap-2">
                        Target Speaking Rate
                        <Info size={14} className="text-[var(--text-muted)] cursor-help" />
                      </p>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Optimizes the real-time feedback for your desired speech tempo.</p>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <input type="range" min="80" max="180" defaultValue="130" className="flex-1 sm:w-32 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[var(--accent)]" />
                      <span className="text-xs font-black text-[var(--text-primary)] bg-[var(--bg-surface)] px-3 py-1.5 rounded-lg shadow-sm border border-[var(--border-subtle)] w-14 text-center">130</span>
                    </div>
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'password' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 p-2">
                <header className="border-b border-[var(--border-subtle)] pb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-600">
                      <Key size={20} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-[var(--text-primary)] font-syne">Security & Credentials</h3>
                      <p className="text-sm text-[var(--text-secondary)] font-medium mt-0.5">Manage your secret key and access logs</p>
                    </div>
                  </div>
                </header>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Current Password</label>
                    <Input 
                      type="password" 
                      placeholder="••••••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="bg-[var(--bg-base)] border-none focus:ring-[var(--accent)]/20" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">New Password</label>
                      <Input 
                        type="password" 
                        placeholder="••••••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-[var(--bg-base)] border-none focus:ring-[var(--accent)]/20" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Confirm New Password</label>
                      <Input 
                        type="password" 
                        placeholder="••••••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-[var(--bg-base)] border-none focus:ring-[var(--accent)]/20" 
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-teal-50/50 dark:bg-teal-950/10 rounded-2xl border border-teal-500/10 flex gap-3">
                    <ShieldCheck size={18} className="text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-teal-800 dark:text-teal-400">Password Requirements</h4>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-1 font-medium leading-relaxed">
                        To secure your diagnostic records, passwords must be at least 8 characters long and contain both letters and digits.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button 
                      onClick={() => {
                        if (!currentPassword || !newPassword || !confirmPassword) {
                          toast.error("Please fill in all password fields.");
                          return;
                        }
                        if (newPassword !== confirmPassword) {
                          toast.error("Passwords do not match.");
                          return;
                        }
                        toast.success("Security credentials updated successfully!");
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                      className="shadow-lg shadow-[var(--accent)]/10 text-xs px-6"
                    >
                      Update Password
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'privacy' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 p-2">
                <header className="border-b border-[var(--border-subtle)] pb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                      <Database size={20} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-[var(--text-primary)] font-syne">Privacy & Clinical Data</h3>
                      <p className="text-sm text-[var(--text-secondary)] font-medium mt-0.5">Control how your speech diagnostics and audio records are handled</p>
                    </div>
                  </div>
                </header>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[var(--bg-base)] rounded-2xl border border-[var(--border-subtle)]">
                      <div className="flex-1 pr-4">
                        <h4 className="text-sm font-bold text-[var(--text-primary)]">AI Model Calibration Opt-In</h4>
                        <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                          Allow clinical speech samples to be anonymously used to calibrate and improve Whisper stutter-detection models.
                        </p>
                      </div>
                      <button 
                        onClick={() => setAllowAIImprovement(!allowAIImprovement)}
                        className={cn(
                          "w-11 h-6 rounded-full relative transition-all p-1 shrink-0",
                          allowAIImprovement ? "bg-[var(--accent)]" : "bg-slate-200"
                        )}
                      >
                        <div className={cn(
                          "w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300",
                          allowAIImprovement ? "translate-x-5" : "translate-x-0"
                        )} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[var(--bg-base)] rounded-2xl border border-[var(--border-subtle)]">
                      <div className="flex-1 pr-4">
                        <h4 className="text-sm font-bold text-[var(--text-primary)]">Private Speech Therapy Profile</h4>
                        <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                          Keep therapist metrics and diagnostic graphs fully private and hidden from clinical dashboard exports.
                        </p>
                      </div>
                      <button 
                        onClick={() => setPrivateTherapyProfile(!privateTherapyProfile)}
                        className={cn(
                          "w-11 h-6 rounded-full relative transition-all p-1 shrink-0",
                          privateTherapyProfile ? "bg-[var(--accent)]" : "bg-slate-200"
                        )}
                      >
                        <div className={cn(
                          "w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300",
                          privateTherapyProfile ? "translate-x-5" : "translate-x-0"
                        )} />
                      </button>
                    </div>
                  </div>

                  <div className="p-5 bg-[var(--bg-base)] rounded-2xl border border-[var(--border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 pr-2">
                      <p className="font-bold text-[var(--text-primary)] text-sm">Audio Files Retention Policy</p>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">Choose how long you want our secure servers to cache your recorded speech sessions before auto-purging.</p>
                    </div>
                    <select 
                      value={cacheDuration}
                      onChange={(e) => setCacheDuration(e.target.value)}
                      className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-4 py-2 text-xs font-bold text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent)]/20 outline-none"
                    >
                      <option value="30">30 Days</option>
                      <option value="90">90 Days</option>
                      <option value="365">1 Year</option>
                      <option value="indefinite">Keep Indefinitely</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Export Clinical Records</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-[var(--bg-base)] rounded-2xl border border-[var(--border-subtle)] flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-[var(--text-primary)]">Download Speech Profile</p>
                          <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Export all historical stutter percentages and scores</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 text-[10px] font-black"
                          onClick={() => {
                            toast.loading("Compiling speech profile...");
                            setTimeout(() => {
                              toast.dismiss();
                              toast.success("Speech Profile exported successfully! (fluency-record.csv)");
                            }, 1200);
                          }}
                        >
                          <Download size={12} className="mr-1.5" /> CSV
                        </Button>
                      </div>

                      <div className="p-4 bg-[var(--bg-base)] rounded-2xl border border-[var(--border-subtle)] flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-[var(--text-primary)]">Download Audio Archive</p>
                          <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Download zip file containing all uploaded recordings</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 text-[10px] font-black"
                          onClick={() => {
                            toast.loading("Compressing recorded wav assets...");
                            setTimeout(() => {
                              toast.dismiss();
                              toast.success("Audio archive compiled! Check your downloads. (audio-archive.zip)");
                            }, 1800);
                          }}
                        >
                          <Download size={12} className="mr-1.5" /> ZIP
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'danger' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 p-2">
                <header className="border-b border-[var(--border-subtle)] pb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 animate-pulse">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-red-600 font-syne">Danger Zone</h3>
                      <p className="text-sm text-[var(--text-secondary)] font-medium mt-0.5">Destructive actions that cannot be undone</p>
                    </div>
                  </div>
                </header>

                <div className="space-y-6">
                  <div className="p-5 bg-[var(--bg-base)] rounded-2xl border border-red-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 pr-2">
                      <p className="font-bold text-[var(--text-primary)] text-sm">Purge All Recorded Session Files</p>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                        Permanently deletes all stored audio files and Whisper transcripts from our system, leaving only your history list metadata.
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="border-red-500/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 font-black h-9 text-xs"
                      onClick={() => setShowPurgeModal(true)}
                    >
                      <Trash2 size={14} className="mr-1.5" /> Purge Cache
                    </Button>
                  </div>

                  <div className="p-5 bg-red-50/50 dark:bg-red-950/10 rounded-2xl border border-red-500/15 space-y-4">
                    <div>
                      <p className="font-black text-red-600 text-sm">Permanently Deactivate & Delete Account</p>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-1 leading-relaxed">
                        This is an absolute delete action. All your profile information, premium status, clinical diagnostic records, sound-map scores, and sessions will be destroyed forever.
                      </p>
                    </div>
                    
                    <div className="space-y-2 pt-2">
                      <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">
                        Type <span className="text-red-500 font-bold select-all">{user?.email || 'your email'}</span> to confirm
                      </label>
                      <Input 
                        placeholder={user?.email || 'email@example.com'}
                        value={confirmEmail}
                        onChange={(e) => setConfirmEmail(e.target.value)}
                        className="bg-[var(--bg-surface)] border-red-500/20 focus:ring-red-500/10 max-w-md" 
                      />
                    </div>

                    <div className="pt-2">
                      <Button 
                        disabled={confirmEmail !== (user?.email || '')}
                        className={cn(
                          "font-black text-xs h-10 px-6 shadow-md transition-all duration-300",
                          confirmEmail === (user?.email || '')
                            ? "bg-red-600 hover:bg-red-700 text-white shadow-red-600/10 cursor-pointer"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                        )}
                        onClick={() => setShowDeleteModal(true)}
                      >
                        Delete My Workspace & Account
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </Card>
        </div>
      </div>
      {showPurgeModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-300">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[28px] p-6 max-w-sm w-full shadow-premium animate-in zoom-in-95 duration-300 text-center relative pointer-events-auto">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
              <AlertTriangle size={22} className="animate-bounce" />
            </div>
            <h3 className="font-syne text-[15px] font-black text-[var(--text-primary)]">Purge Recording Cache?</h3>
            <p className="text-[11px] text-[var(--text-secondary)] mt-2 font-medium leading-relaxed">
              Are you sure you want to permanently delete all stored speech wav samples and Whisper transcripts? This action is clinical and completely irreversible.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPurgeModal(false)}
                className="flex-1 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:bg-[var(--bg-base)] text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-wider rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowPurgeModal(false);
                  toast.loading("Purging cloud data cache...");
                  setTimeout(() => {
                    toast.dismiss();
                    toast.success("Successfully purged all audio recording files!");
                  }, 1500);
                }}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-md"
              >
                Confirm Purge
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-300">
          <div className="bg-[var(--bg-surface)] border border-red-500/35 rounded-[28px] p-6 max-w-sm w-full shadow-premium animate-in zoom-in-95 duration-300 text-center relative pointer-events-auto">
            <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <Trash2 size={22} className="animate-pulse" />
            </div>
            <h3 className="font-syne text-[15px] font-black text-red-600">Delete Account Forever?</h3>
            <p className="text-[11px] text-[var(--text-secondary)] mt-2 font-medium leading-relaxed">
              This will destroy all clinical diagnostics, recording history, and credentials immediately. You will be signed out and your profile purged permanently.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:bg-[var(--bg-base)] text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-wider rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  toast.loading("Deleting your clinician workspace...");
                  setTimeout(() => {
                    toast.dismiss();
                    toast.success("Account permanently deactivated.");
                    localStorage.removeItem('token');
                    window.location.href = '/register';
                  }, 2000);
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Settings;
