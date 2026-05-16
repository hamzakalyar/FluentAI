import React from 'react';
import {
  Activity, Clock, Mic2,
  ArrowUpRight, Lightbulb, GraduationCap, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/features/Dashboard/StatCard';
import RecentSessions from '../components/features/Dashboard/RecentSessions';
import WeeklySparkline from '../components/features/Dashboard/WPMTrendChart';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../context/DashboardContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stats, loading } = useDashboard();

  if (loading) return <div className="p-12 animate-pulse text-[var(--text-muted)] font-black uppercase tracking-widest text-center">Syncing Analytics...</div>;

  const topWeakSound = stats?.topWeakSounds?.[0]?.sound || 'Patterns';
  const recentSessionsData = stats?.recentSessions?.map(s => ({
    id: s.id || s._id,
    type: 'Session',
    name: `Fluency Check · ${new Date(s.date || s.createdAt).toLocaleDateString()}`,
    date: new Date(s.date || s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    duration: s.duration ? `${Math.floor(s.duration / 60)}m ${Math.round(s.duration % 60)}s` : '--',
    score: s.fluencyScore,
    Icon: Mic2
  })) || [];

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <StatCard label="Total Sessions" value={stats?.totalSessions || 0} icon={Mic2} delta={stats?.trends?.sessions !== 0 ? `${stats?.trends?.sessions > 0 ? '+' : ''}${stats?.trends?.sessions}` : '0'} />
        <StatCard label="Avg Speech Rate" value={stats?.avgSpeechRate || 0} subValue="wpm" icon={Activity} delta={`${stats?.trends?.wpm > 0 ? '+' : ''}${stats?.trends?.wpm || 0}%`} />
        <StatCard label="Avg Repetitions" value={stats?.avgRepetitions || 0} icon={Clock} delta={`${stats?.trends?.repetitions > 0 ? '+' : ''}${stats?.trends?.repetitions || 0}%`} isNegativeMetric={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <RecentSessions sessions={recentSessionsData} />
        </div>
        <div className="lg:col-span-2">
          <WeeklySparkline range="7D" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-[var(--accent-navy)] to-[var(--accent)] rounded-2xl p-8 text-white relative overflow-hidden shadow-lg group">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <GraduationCap size={120} />
           </div>
           <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Your Practice Recommendation</h3>
              <p className="text-white/80 text-sm mb-8 max-w-sm font-medium leading-relaxed">
                Based on your last session, practicing <span className="font-bold underline decoration-white/40">{topWeakSound} focus</span> will yield the highest fluency gain today.
              </p>
              
              <button 
                onClick={() => navigate('/practice')}
                className="group relative overflow-hidden h-12 px-8 rounded-xl bg-white text-[var(--accent-navy)] font-bold text-sm shadow-md hover:scale-105 transition-all"
              >
                 <span className="relative z-10 flex items-center gap-2">
                   Start Practice <ArrowUpRight size={16} />
                 </span>
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
              </button>
           </div>
        </div>

        <div className="bg-[var(--bg-surface)] rounded-2xl p-8 border border-[var(--border-subtle)] shadow-sm relative group overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Lightbulb size={120} className="text-[#0D9488]" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 text-[#0D9488] font-bold text-xs uppercase tracking-widest">
              <Lightbulb size={14} /> Quick Tip
            </div>
            <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2">Breath Management</h4>
            <p className="text-sm text-[var(--text-secondary)] font-medium mb-6 leading-relaxed max-w-md">
              Try taking a soft, full breath before initiating speech. This technique can reduce repetitions and improve your fluency score.
            </p>
            <button className="flex items-center gap-1 text-[#0D9488] text-xs font-bold hover:gap-2 transition-all">
              Learn more techniques <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
