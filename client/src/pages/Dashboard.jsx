import React, { useEffect, useState } from 'react';
import { 
  Activity, Clock, Mic2, 
  ArrowUpRight, Lightbulb, GraduationCap, ChevronRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/features/Dashboard/StatCard';
import RecentSessions from '../components/features/Dashboard/RecentSessions';
import WeeklySparkline from '../components/features/Dashboard/WPMTrendChart';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [summary, setSummary]         = useState(null);
  const [sessions, setSessions]       = useState([]);
  const [trendData, setTrendData]     = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    // Fetch summary stats
    api.get('/sessions/stats/summary')
      .then(res => setSummary(res.data))
      .catch(() => {/* silently fail — show zeros */})
      .finally(() => setLoadingStats(false));

    // Fetch recent sessions list
    api.get('/sessions', { params: { page: 1, limit: 5 } })
      .then(res => setSessions(res.data.sessions || []))
      .catch(() => {});

    // Fetch WPM trend for chart
    api.get('/analytics/trend', { params: { metric: 'wpm', timeframe: '7d' } })
      .then(res => setTrendData(res.data.data || []))
      .catch(() => {});
  }, []);

  const stats = [
    {
      title: 'Total Sessions',
      value: loadingStats ? '—' : String(summary?.totalSessions ?? 0),
      trend: 'up',
      trendValue: '',
      icon: Mic2,
    },
    {
      title: 'Avg Fluency Score',
      value: loadingStats ? '—' : `${summary?.averageFluencyScore ?? 0}%`,
      trend: summary?.improvementTrend === 'improving' ? 'up' : 'down',
      trendValue: summary?.improvementTrend ?? '—',
      icon: Activity,
    },
    {
      title: 'Latest Score',
      value: loadingStats ? '—' : `${summary?.latestFluencyScore ?? 0}%`,
      trend: 'up',
      trendValue: '',
      icon: Clock,
    },
  ];

  // Map sessions to the shape RecentSessions expects
  const recentSessions = sessions.map(s => ({
    id: s._id,
    title: 'Practice Session',
    date: new Date(s.createdAt),
    duration: s.duration || 0,
    fluencyScore: s.metrics?.fluencyScore || 0,
  }));

  // Map trend data for chart: [{ name: 'May 01', wpm: 105 }, ...]
  const chartData = trendData.map(d => ({ name: d.name, wpm: d.wpm }));

  // Top weak sound recommendation
  const topWeakSound = summary?.topWeakSounds?.[0]?.sound;

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      {/* ── TOP ROW: Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {stats.map(s => <StatCard key={s.title} {...s} />)}
      </div>

      {/* ── MIDDLE ROW: Sessions + Chart ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <RecentSessions sessions={recentSessions} />
        </div>
        <div className="lg:col-span-2">
          <WeeklySparkline data={chartData.length ? chartData : []} />
        </div>
      </div>

      {/* ── BOTTOM ROW: Recommendation + Tip ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Practice Recommendation */}
        <div className="bg-gradient-to-br from-[var(--accent-navy)] to-[var(--accent)] rounded-2xl p-8 text-white relative overflow-hidden shadow-lg group">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <GraduationCap size={120} />
           </div>
           <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Your Practice Recommendation</h3>
              <p className="text-white/80 text-sm mb-8 max-w-sm font-medium leading-relaxed">
                {topWeakSound
                  ? <>Based on your sessions, practicing <span className="font-bold underline decoration-white/40">'{topWeakSound}' sounds</span> will yield the highest fluency gain today.</>
                  : 'Complete your first session to get a personalised practice recommendation.'}
              </p>
              
              <button 
                onClick={() => navigate('/practice')}
                className="group relative overflow-hidden h-12 px-8 rounded-xl bg-white text-[var(--accent-navy)] font-bold text-sm shadow-md hover:scale-105 transition-all"
              >
                 <span className="relative z-10 flex items-center gap-2">
                   Start Practice <ArrowUpRight size={16} />
                 </span>
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
