import React from 'react';
import {
  Activity, Clock, Mic2, Plus,
  ArrowUpRight, Lightbulb, GraduationCap, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/features/Dashboard/StatCard';
import RecentSessions from '../components/features/Dashboard/RecentSessions';
import WeeklySparkline from '../components/features/Dashboard/WPMTrendChart';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const stats = [
    { title: 'Total Sessions', value: '48', trend: 'up', trendValue: '+5', icon: Mic2 },
    { title: 'Avg Speech Rate', value: '132wpm', trend: 'up', trendValue: '+12%', icon: Activity },
    { title: 'Avg Repetitions', value: '4.2', trend: 'down', trendValue: '-1.5%', icon: Clock },
  ];

  const chartData = [
    { name: 'Mon', wpm: 120 }, { name: 'Tue', wpm: 132 }, { name: 'Wed', wpm: 101 },
    { name: 'Thu', wpm: 144 }, { name: 'Fri', wpm: 135 }, { name: 'Sat', wpm: 155 }, { name: 'Sun', wpm: 162 },
  ];

  const recentSessions = [
    { id: '1', title: 'Practice Session', date: new Date(), duration: 124, fluencyScore: 88 },
    { id: '2', title: 'Practice Session', date: new Date(Date.now() - 86400000), duration: 340, fluencyScore: 72 },
    { id: '3', title: 'Practice Session', date: new Date(Date.now() - 172800000), duration: 150, fluencyScore: 91 },
    { id: '4', title: 'Practice Session', date: new Date(Date.now() - 259200000), duration: 210, fluencyScore: 65 },
    { id: '5', title: 'Practice Session', date: new Date(Date.now() - 345600000), duration: 180, fluencyScore: 82 },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-20">

      {/* ── TOP ROW: Stat Cards (3 Cols) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {stats.map(s => (
          <StatCard
            key={s.title}
            label={s.title}
            value={s.value}
            delta={s.trendValue}
            icon={s.icon}
            isNegativeMetric={s.title.includes('Repetitions')}
          />
        ))}
      </div>

      {/* ── MIDDLE ROW: Sessions (3/5) + Chart (2/5) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <RecentSessions sessions={recentSessions} />
        </div>
        <div className="lg:col-span-2">
          <WeeklySparkline data={chartData} />
        </div>
      </div>

      {/* ── BOTTOM ROW: Recommendation + Tip (2 Cols) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Practice Recommendation */}
        <div className="bg-gradient-to-br from-[var(--accent-navy)] to-[var(--accent)] rounded-2xl p-8 text-white relative overflow-hidden shadow-lg group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <GraduationCap size={120} />
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Your Practice Recommendation</h3>
            <p className="text-white/80 text-sm mb-8 max-w-sm font-medium leading-relaxed">
              Based on your last session, practicing <span className="font-bold underline decoration-white/40">Plosive 'P' Sounds</span> will yield the highest fluency gain today.
            </p>

            <button
              onClick={() => navigate('/practice')}
              className="group relative overflow-hidden h-12 px-8 rounded-xl bg-white text-[var(--accent-navy)] font-black text-sm shadow-lg hover:scale-105 hover:bg-white/90 active:scale-95 transition-all"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Practice <ArrowUpRight size={16} />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
            </button>
          </div>
        </div>

        {/* Quick Tip Card */}
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
              Try taking a soft, full breath before initiating speech. This reduced repetitions by 15% in your previous session.
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
