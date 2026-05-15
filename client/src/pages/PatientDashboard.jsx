import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mic2, Activity, TrendingUp, Sparkles,
  Clock, FileText, Target, ArrowRight, ChevronRight
} from 'lucide-react';
import StatCard from '../components/features/Dashboard/StatCard';
import RecentSessions from '../components/features/Dashboard/RecentSessions';
import WPMTrendChart from '../components/features/Dashboard/WPMTrendChart';
import Card from '../components/shared/Card';

import { analyticsService } from '../services/analyticsService';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await analyticsService.getSummary();
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 animate-pulse text-[var(--text-muted)] font-bold uppercase tracking-widest">Loading Dashboard...</div>;

  const topWeakSound = stats?.topWeakSounds?.[0]?.sound || 'Speech Patterns';
  const improvementMsg = stats?.improvementTrend === 'improving' ? "Your fluency is trending upward!" : "Steady progress! Keep practicing.";


  return (
    <div className="space-y-[var(--section-gap)] animate-fade-in max-w-7xl mx-auto pb-12 text-[var(--text-primary)]">
      
      {/* ── 1. BREADCRUMB (Clean & Modular) ── */}
      <div className="flex items-center justify-between">
         <nav className="flex items-center gap-2">
            <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Dashboard</span>
            <ChevronRight size={10} className="text-slate-300" />
            <span className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest">Overview</span>
         </nav>
      </div>

      {/* ── 2. METRIC GRID (Teal Blueprint Match) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--section-gap)]">
         <StatCard 
            label="Total Sessions" 
            value={stats?.totalSessions || 0} 
            delta={stats?.totalSessions > 0 ? "+1" : "0"} 
            icon={FileText}
         />
         <StatCard 
            label="Avg Speech Rate" 
            value={stats?.avgSpeechRate || 0} 
            subValue="wpm"
            delta={stats?.improvementTrend === 'improving' ? "+8%" : "stable"} 
            icon={Activity}
         />
         <StatCard 
            label="Avg Repetitions" 
            value={stats?.avgRepetitions || 0} 
            delta={stats?.improvementTrend === 'improving' ? "-12%" : "stable"} 
            isNegativeMetric={true}
            icon={Clock}
         />
      </div>

      {/* ── 3. DATA GRID (3:2 Proportions) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-[var(--section-gap)] items-stretch">
         <Card className="flex flex-col">
            <div className="flex items-center justify-between mb-6">
               <h3 className="font-syne text-[15px] font-bold text-[var(--text-primary)]">Recent Sessions</h3>
               <button className="text-[11px] font-bold text-[var(--accent)] uppercase tracking-wider hover:underline">View All</button>
            </div>
            <RecentSessions />
         </Card>
         
         <WPMTrendChart />
      </div>

      {/* ── 4. RECOMMENDATION ZONE (2:1 Proportions) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-[var(--section-gap)]">
         
         <Card variant="accent" className="border-l-[4px] border-l-[var(--accent)] flex flex-col justify-between group shadow-sm bg-gradient-to-br from-[var(--bg-surface)] to-[var(--accent)]/5">
            <div>
               <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                     <Target size={18} />
                  </div>
                  <label className="text-[10px] font-black text-[var(--accent)] uppercase tracking-[0.15em]">Daily Practice Focus</label>
               </div>
               <h3 className="font-syne text-[22px] font-bold text-[var(--text-primary)] mb-3">Targeting {topWeakSound} Sounds</h3>
               <p className="text-[15px] text-[var(--text-muted)] font-medium leading-relaxed mb-8 max-w-xl">
                  {stats?.topWeakSounds?.length > 0 
                    ? `Based on your recent performance, focusing on ${topWeakSound} transitions will provide the most significant boost to your overall fluency score today.`
                    : "Complete an assessment session to receive personalized practice recommendations tailored to your speech patterns."
                  }
               </p>
            </div>
            <button 
              onClick={() => navigate('/recording')}
              className="w-fit bg-[var(--accent)] text-white px-8 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[var(--accent)]/90 transition-all shadow-lg shadow-[var(--accent)]/20"
            >
               Start Practice <ArrowRight size={16} />
            </button>
         </Card>

         <Card className="flex flex-col justify-center relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4 text-amber-500">
               <Sparkles size={16} fill="currentColor" />
               <label className="text-[10px] font-black uppercase tracking-[0.15em]">Quick Tip</label>
            </div>
            <h3 className="font-syne text-[18px] font-bold text-[var(--text-primary)] mb-3">Breath Management</h3>
            <p className="text-[14px] text-[var(--text-muted)] font-medium leading-relaxed mb-6">
               Try taking a soft, full breath before initiating speech. This reduced repetitions by 15% in your previous session.
            </p>
            <button className="text-[var(--accent)] font-bold text-[13px] flex items-center gap-1 group hover:underline">
               Learn more techniques <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[var(--accent)]/5 rounded-full blur-3xl" />
         </Card>
      </div>
    </div>
  );
};

export default PatientDashboard;
