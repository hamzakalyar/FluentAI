import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ReTooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  Calendar, 
  Download, 
  TrendingUp, 
  Activity,
  History,
  FileText,
  ChevronRight,
  Filter,
  MoreHorizontal,
  ArrowUpRight,
  Play
} from 'lucide-react';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import Badge from '../components/shared/Badge';
import Breadcrumb from '../components/layout/Breadcrumb';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

import { analyticsService } from '../services/analyticsService';
import { sessionsService } from '../services/sessionsService';

const Analytics = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('7d');
  const [summary, setSummary] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [soundProficiency, setSoundProficiency] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const [summaryRes, historicalRes, soundRes, sessionsRes] = await Promise.all([
          analyticsService.getSummary(),
          analyticsService.getHistorical(dateRange),
          analyticsService.getSoundProgress(),
          sessionsService.getSessions({ limit: 5 })
        ]);
        
        setSummary(summaryRes.data);
        setHistoricalData(historicalRes.data.data || []);
        setSoundProficiency(soundRes.data.soundProficiency || []);
        setSessions(sessionsRes.data.sessions || []);
      } catch (err) {
        console.error("Failed to load analytics data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, [dateRange]);

  if (loading && historicalData.length === 0) return <div className="p-8 animate-pulse text-[var(--text-muted)] font-bold uppercase tracking-widest">Loading Analytics...</div>;


  // Theme-aware colors for Recharts
  const chartText = "var(--text-muted)";
  const chartGrid = "var(--border-subtle)";
  const chartTooltipBg = "var(--bg-surface)";

  return (
    <div className="animate-fade-in-up pb-12 relative min-h-screen">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--accent)]/5 rounded-full blur-[140px] -z-10 pointer-events-none opacity-60" />
      <div className="absolute top-[20%] left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] -z-10 pointer-events-none opacity-40" />
      
      {/* Header & Breadcrumb */}
      <div className="mb-10">
        <Breadcrumb />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
          <div>
            <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight font-syne">Speech Analytics</h1>
            <p className="text-[var(--text-secondary)] font-medium text-lg mt-2">Deep dive into your fluency patterns and progress</p>
          </div>
        </div>
      </div>

      {/* Summary Box — Premium Lift */}
      <Card variant="glass" padded={false} className="mb-8 flex items-start md:items-center gap-5 p-6 shadow-premium border-l-[6px] border-l-[var(--accent)] bg-gradient-to-r from-[var(--bg-surface)] to-[var(--accent)]/5">
        <div className="w-14 h-14 bg-[var(--accent)]/10 rounded-2xl flex items-center justify-center text-[var(--accent)] shrink-0 shadow-sm">
          <ArrowUpRight size={28} strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <h4 className="text-[var(--text-primary)] font-black text-lg tracking-tight">
            {summary?.improvementTrend === 'improving' ? 'Fluency performance is trending upward' : 'Consistent practice leads to improvement'}
          </h4>
          <p className="text-[var(--text-secondary)] font-medium text-sm mt-1">
            Your average fluency score is <span className="text-[var(--accent)] font-bold">{summary?.averageFluencyScore || 0}%</span>. 
            {summary?.topWeakSounds?.length > 0 ? ` Focusing on your ${summary.topWeakSounds[0].sound} sounds will help you reach your goals faster.` : ' Keep taking assessments to unlock personalized insights.'}
          </p>
        </div>
        <div className="hidden md:block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-60">
          Updated 2 hours ago
        </div>
      </Card>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-1.5 p-1 bg-[var(--bg-elevated)] rounded-xl w-fit border border-[var(--border-subtle)]">
          {['7 Days', '30 Days', '90 Days'].map((range) => {
            const val = range.split(' ')[0].toLowerCase() + range.split(' ')[1][0].toLowerCase();
            return (
              <button
                key={range}
                onClick={() => setDateRange(val)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                  dateRange === val 
                    ? "bg-[var(--bg-surface)] text-[var(--accent)] shadow-sm ring-1 ring-[var(--border-subtle)]" 
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                )}
              >
                {range}
              </button>
            );
          })}
          <button className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1">
            Custom <ChevronRight size={12} className="rotate-90" />
          </button>
        </div>
        
        <Button variant="ghost" size="sm" className="h-9 text-[11px] font-bold uppercase tracking-wider border-[var(--border-subtle)]">
          <Download size={14} className="mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Charts Section — 2-col then 1-col */}
      <div className="space-y-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Repetitions per Minute */}
          <Card className="h-[280px] min-h-[280px] flex flex-col p-5">
            <div className="mb-4">
              <h3 className="font-bold text-[var(--text-primary)] text-sm uppercase tracking-tight">Repetitions per Minute</h3>
              <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mt-0.5">Frequency over time</p>
            </div>
            <div className="flex-1 w-full min-h-0 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGrid} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: chartText}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: chartText}} />
                  <ReTooltip 
                    contentStyle={{ backgroundColor: chartTooltipBg, borderRadius: '12px', border: '1px solid var(--border-subtle)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontSize: '12px', color: 'var(--text-primary)' }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                  />
                  <Line type="monotone" dataKey="repetitions" stroke="#0D9488" strokeWidth={3} dot={{r: 3, fill: '#0D9488'}} activeDot={{r: 5}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Avg Pause Duration */}
          <Card className="h-[280px] min-h-[280px] flex flex-col p-5">
            <div className="mb-4">
              <h3 className="font-bold text-[var(--text-primary)] text-sm uppercase tracking-tight">Avg Pause Duration</h3>
              <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mt-0.5">Seconds per event</p>
            </div>
            <div className="flex-1 w-full min-h-0 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGrid} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: chartText}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: chartText}} />
                  <ReTooltip 
                    cursor={{fill: 'var(--bg-elevated)', opacity: 0.4}}
                    contentStyle={{ backgroundColor: chartTooltipBg, borderRadius: '12px', border: '1px solid var(--border-subtle)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontSize: '12px', color: 'var(--text-primary)' }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                  />
                  <Bar dataKey="pauses" fill="var(--text-muted)" radius={[4, 4, 0, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Full Width Line Chart */}
        <Card className="h-[300px] min-h-[300px] flex flex-col p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-[var(--text-primary)] text-sm uppercase tracking-tight">Speech Rate WPM Trend</h3>
              <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mt-0.5">Historical Word Rate Velocity</p>
            </div>
            <Badge className="bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/20">+8.2% growth</Badge>
          </div>
          <div className="flex-1 w-full min-h-0 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData}>
                <defs>
                  <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGrid} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: chartText}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: chartText}} />
                <ReTooltip 
                  contentStyle={{ backgroundColor: chartTooltipBg, borderRadius: '12px', border: '1px solid var(--border-subtle)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontSize: '12px', color: 'var(--text-primary)' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Area type="monotone" dataKey="wpm" stroke="#0D9488" strokeWidth={3} fillOpacity={1} fill="url(#colorWpm)" dot={{r: 3, fill: '#0D9488'}} activeDot={{r: 5}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Weak Sounds Ranking Section */}
      <div className="mb-8">
        <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-4">Weak Sounds Ranking</h3>
        <Card padded={false} className="overflow-hidden divide-y divide-[var(--border-subtle)]">
          {soundProficiency.map((item, idx) => (
            <div key={item.sound} className="flex items-center gap-6 p-4 hover:bg-[var(--bg-elevated)] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-base)] flex items-center justify-center font-bold text-[var(--text-primary)] text-sm shrink-0 border border-[var(--border-subtle)]">
                {item.sound}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-[var(--text-primary)]">Proficiency Level</span>
                  <span className="text-xs font-black text-[var(--text-primary)]">{item.score}%</span>
                </div>
                <div className="h-1.5 bg-[var(--bg-base)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.score}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: idx * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold border-[var(--border-subtle)] hover:bg-[var(--bg-surface)] shrink-0">
                Practice
              </Button>
            </div>
          ))}
        </Card>
      </div>

      {/* Session History Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Session History</h3>
          <div className="flex items-center gap-1 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest cursor-pointer hover:text-[var(--accent)] transition-colors">
            View All <History size={12} />
          </div>
        </div>
        <Card padded={false} className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--bg-elevated)]/50 border-b border-[var(--border-subtle)]">
                  <th className="px-6 py-4 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Date ▾</th>
                  <th className="px-6 py-4 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Duration</th>
                  <th className="px-6 py-4 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest text-center">Repetitions</th>
                  <th className="px-6 py-4 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest text-center">Pauses</th>
                  <th className="px-6 py-4 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest text-center">WPM</th>
                  <th className="px-6 py-4 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {sessions.length > 0 ? sessions.map((s) => (
                  <tr key={s._id} className="hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer group" onClick={() => navigate(`/sessions/${s._id}`)}>
                    <td className="px-6 py-4 text-xs font-bold text-[var(--text-primary)]">
                      {new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-xs text-[var(--text-muted)] font-medium">
                      {Math.floor(s.duration / 60)}:{(s.duration % 60).toString().padStart(2, '0')}s
                    </td>
                    <td className="px-6 py-4 text-xs text-center text-amber-600 font-black">{s.metrics?.repetitionCount || 0}</td>
                    <td className="px-6 py-4 text-xs text-center text-indigo-500 font-black">{s.metrics?.pauseCount || 0}</td>
                    <td className="px-6 py-4 text-xs text-center text-[var(--text-primary)] font-black">{s.metrics?.speechRateWPM || 0}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-[10px] font-bold text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-all flex items-center justify-end gap-1">
                        View <ChevronRight size={14} />
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-[var(--text-muted)] font-bold uppercase tracking-widest opacity-40">No sessions recorded yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
