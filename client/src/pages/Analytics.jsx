import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as ReTooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  Calendar, Download, TrendingUp, Activity,
  History, FileText, ChevronRight, Filter,
  MoreHorizontal, ArrowUpRight, Play, Loader2
} from 'lucide-react';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import Badge from '../components/shared/Badge';
import Breadcrumb from '../components/layout/Breadcrumb';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';
import { analyticsService } from '../services/analyticsService';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('7d');
  const navigate = useNavigate();

  const [summary, setSummary]         = useState(null);
  const [trendData, setTrendData]     = useState([]);
  const [weakSounds, setWeakSounds]   = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    setLoading(true);

    Promise.allSettled([
      analyticsService.getSummary(),
      analyticsService.getTrend('wpm', dateRange),
      analyticsService.getWeakSounds(),
      api.get('/sessions', { params: { page: 1, limit: 10 } }),
    ]).then(([summaryRes, trendRes, soundsRes, sessionsRes]) => {
      if (summaryRes.status === 'fulfilled') setSummary(summaryRes.value.data);
      if (trendRes.status === 'fulfilled')   setTrendData(trendRes.value.data.data || []);
      if (soundsRes.status === 'fulfilled')  setWeakSounds(soundsRes.value.data.weakSounds || []);
      if (sessionsRes.status === 'fulfilled') setRecentSessions(sessionsRes.value.data.sessions || []);
    }).finally(() => setLoading(false));
  }, [dateRange]);

  // Theme-aware colors for Recharts
  const chartText      = "var(--text-muted)";
  const chartGrid      = "var(--border-subtle)";
  const chartTooltipBg = "var(--bg-surface)";
  const tooltipStyle   = {
    backgroundColor: chartTooltipBg,
    borderRadius: '12px',
    border: '1px solid var(--border-subtle)',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
    fontSize: '12px',
    color: 'var(--text-primary)'
  };

  const trendImproving = summary?.improvementTrend === 'improving';

  // Sound proficiency colours
  const soundColors = ['#0D9488', '#F59E0B', '#3B82F6', '#8B5CF6', '#EF4444'];

  const formatDuration = (s) => {
    if (!s) return '—';
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="animate-fade-in-up pb-12 relative min-h-screen">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--accent)]/5 rounded-full blur-[140px] -z-10 pointer-events-none opacity-60" />
      <div className="absolute top-[20%] left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] -z-10 pointer-events-none opacity-40" />
      
      {/* Header */}
      <div className="mb-10">
        <Breadcrumb />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
          <div>
            <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight font-syne">Speech Analytics</h1>
            <p className="text-[var(--text-secondary)] font-medium text-lg mt-2">Deep dive into your fluency patterns and progress</p>
          </div>
        </div>
      </div>

      {/* Summary Banner */}
      <Card variant="glass" padded={false} className="mb-8 flex items-start md:items-center gap-5 p-6 shadow-premium border-l-[6px] border-l-[var(--accent)] bg-gradient-to-r from-[var(--bg-surface)] to-[var(--accent)]/5">
        <div className="w-14 h-14 bg-[var(--accent)]/10 rounded-2xl flex items-center justify-center text-[var(--accent)] shrink-0 shadow-sm">
          <ArrowUpRight size={28} strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center gap-2 text-[var(--text-muted)]"><Loader2 size={16} className="animate-spin" /> Loading your data…</div>
          ) : summary?.totalSessions === 0 ? (
            <>
              <h4 className="text-[var(--text-primary)] font-black text-lg tracking-tight">No sessions yet</h4>
              <p className="text-[var(--text-secondary)] font-medium text-sm mt-1">
                Head to the <span className="text-[var(--accent)] font-bold cursor-pointer" onClick={() => navigate('/recording')}>Recording Studio</span> to record your first session and see analytics here.
              </p>
            </>
          ) : (
            <>
              <h4 className="text-[var(--text-primary)] font-black text-lg tracking-tight">
                {trendImproving ? 'Fluency performance is trending upward 🎉' : 'Keep practising to improve your fluency'}
              </h4>
              <p className="text-[var(--text-secondary)] font-medium text-sm mt-1">
                Average fluency score: <span className="text-[var(--accent)] font-bold">{summary?.averageFluencyScore ?? 0}%</span> across {summary?.totalSessions} sessions.
                {summary?.topWeakSounds?.[0] && <> Focus on your <span className="font-bold">'{summary.topWeakSounds[0].sound}' sounds</span> to improve faster.</>}
              </p>
            </>
          )}
        </div>
      </Card>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-1.5 p-1 bg-[var(--bg-elevated)] rounded-xl w-fit border border-[var(--border-subtle)]">
          {[['7 Days','7d'], ['30 Days','30d'], ['90 Days','90d']].map(([label, val]) => (
            <button
              key={val}
              onClick={() => setDateRange(val)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                dateRange === val 
                  ? "bg-[var(--bg-surface)] text-[var(--accent)] shadow-sm ring-1 ring-[var(--border-subtle)]" 
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="space-y-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Repetitions Chart */}
          <Card className="h-[280px] min-h-[280px] flex flex-col p-5">
            <div className="mb-4">
              <h3 className="font-bold text-[var(--text-primary)] text-sm uppercase tracking-tight">Repetitions per Session</h3>
              <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mt-0.5">Frequency over time</p>
            </div>
            <div className="flex-1 w-full min-h-0 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGrid} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: chartText}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: chartText}} />
                  <ReTooltip contentStyle={tooltipStyle} itemStyle={{ color: 'var(--text-primary)' }} />
                  <Line type="monotone" dataKey="repetitions" stroke="#0D9488" strokeWidth={3} dot={{r: 3, fill: '#0D9488'}} activeDot={{r: 5}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Pauses Chart */}
          <Card className="h-[280px] min-h-[280px] flex flex-col p-5">
            <div className="mb-4">
              <h3 className="font-bold text-[var(--text-primary)] text-sm uppercase tracking-tight">Pauses per Session</h3>
              <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mt-0.5">Count per session</p>
            </div>
            <div className="flex-1 w-full min-h-0 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGrid} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: chartText}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: chartText}} />
                  <ReTooltip cursor={{fill: 'var(--bg-elevated)', opacity: 0.4}} contentStyle={tooltipStyle} itemStyle={{ color: 'var(--text-primary)' }} />
                  <Bar dataKey="pauses" fill="var(--text-muted)" radius={[4, 4, 0, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* WPM Trend - Full Width */}
        <Card className="h-[300px] min-h-[300px] flex flex-col p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-[var(--text-primary)] text-sm uppercase tracking-tight">Speech Rate WPM Trend</h3>
              <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mt-0.5">Historical Word Rate Velocity</p>
            </div>
            {summary && summary.totalSessions > 0 && (
              <Badge className="bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/20">
                {trendImproving ? '↑ Improving' : 'Stable'}
              </Badge>
            )}
          </div>
          <div className="flex-1 w-full min-h-0 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGrid} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: chartText}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: chartText}} />
                <ReTooltip contentStyle={tooltipStyle} itemStyle={{ color: 'var(--text-primary)' }} />
                <Area type="monotone" dataKey="wpm" stroke="#0D9488" strokeWidth={3} fillOpacity={1} fill="url(#colorWpm)" dot={{r: 3, fill: '#0D9488'}} activeDot={{r: 5}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Weak Sounds Section */}
      <div className="mb-8">
        <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-4">Weak Sounds Ranking</h3>
        <Card padded={false} className="overflow-hidden divide-y divide-[var(--border-subtle)]">
          {weakSounds.length === 0 ? (
            <div className="p-8 text-center text-[var(--text-muted)] text-sm font-medium">
              {loading ? 'Loading…' : 'No weak sounds detected yet. Complete a session to see results here.'}
            </div>
          ) : (
            weakSounds.slice(0, 5).map((item, idx) => (
              <div key={item.sound} className="flex items-center gap-6 p-4 hover:bg-[var(--bg-elevated)] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[var(--bg-base)] flex items-center justify-center font-bold text-[var(--text-primary)] text-sm shrink-0 border border-[var(--border-subtle)]">
                  {item.sound}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-[var(--text-primary)]">Detected {item.frequency}× across sessions</span>
                    <span className="text-xs font-black text-[var(--text-muted)] capitalize">{item.trend || 'stable'}</span>
                  </div>
                  <div className="h-1.5 bg-[var(--bg-base)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (item.frequency / (weakSounds[0]?.frequency || 1)) * 100)}%` }}
                      transition={{ duration: 1, ease: 'easeOut', delay: idx * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: soundColors[idx % soundColors.length] }}
                    />
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold border-[var(--border-subtle)] hover:bg-[var(--bg-surface)] shrink-0"
                  onClick={() => navigate('/practice')}>
                  Practice
                </Button>
              </div>
            ))
          )}
        </Card>
      </div>

      {/* Session History Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Session History</h3>
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
                  <th className="px-6 py-4 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest text-center">Score</th>
                  <th className="px-6 py-4 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {loading ? (
                  <tr><td colSpan={7} className="px-6 py-8 text-center text-[var(--text-muted)] text-sm">Loading…</td></tr>
                ) : recentSessions.length === 0 ? (
                  <tr><td colSpan={7} className="px-6 py-8 text-center text-[var(--text-muted)] text-sm">No sessions yet.</td></tr>
                ) : (
                  recentSessions.map(s => (
                    <tr key={s._id} onClick={() => navigate(`/sessions/${s._id}`)} className="hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer group">
                      <td className="px-6 py-4 text-xs font-bold text-[var(--text-primary)]">
                        {new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-xs text-[var(--text-muted)] font-medium">{formatDuration(s.duration)}</td>
                      <td className="px-6 py-4 text-xs text-center text-amber-600 font-black">{s.metrics?.repetitionCount ?? '—'}</td>
                      <td className="px-6 py-4 text-xs text-center text-indigo-500 font-black">{s.metrics?.pauseCount ?? '—'}</td>
                      <td className="px-6 py-4 text-xs text-center text-[var(--text-primary)] font-black">{s.metrics?.speechRateWPM ?? '—'}</td>
                      <td className="px-6 py-4 text-xs text-center font-black" style={{ color: (s.metrics?.fluencyScore ?? 0) >= 75 ? '#0D9488' : '#F59E0B' }}>
                        {s.metrics?.fluencyScore ?? '—'}%
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-[10px] font-bold text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-all flex items-center justify-end gap-1">
                          View <ChevronRight size={14} />
                        </div>
                      </td>
                    </tr>
                  ))
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
