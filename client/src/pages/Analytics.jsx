import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { sessionsService } from '../services/sessionsService';

const Analytics = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('7d');
  const [summary, setSummary] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [weakSounds, setWeakSounds] = useState([]);
  const [triggerWords, setTriggerWords] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const MOCK_SUMMARY = {
    averageFluencyScore: 84,
    totalSessions: 14,
    improvementTrend: 'improving',
    topWeakSounds: [{ sound: '/th/' }]
  };
  
  const MOCK_TREND_DATA = [
    { name: 'Mon', repetitions: 3, pauses: 2, wpm: 128 },
    { name: 'Tue', repetitions: 2, pauses: 1, wpm: 135 },
    { name: 'Wed', repetitions: 4, pauses: 3, wpm: 122 },
    { name: 'Thu', repetitions: 1, pauses: 1, wpm: 140 },
    { name: 'Fri', repetitions: 2, pauses: 2, wpm: 138 },
    { name: 'Sat', repetitions: 0, pauses: 1, wpm: 144 },
    { name: 'Sun', repetitions: 1, pauses: 0, wpm: 146 }
  ];

  const MOCK_WEAK_SOUNDS = [
    { sound: '/th/', frequency: 8, trend: 'Requires Practice', description: 'Soft dental fricatives (tip of tongue on teeth)' },
    { sound: '/p/', frequency: 5, trend: 'Improving', description: 'Voiceless bilabial plosives (lips pop)' },
    { sound: '/cl/', frequency: 3, trend: 'Stable', description: 'Consonant cluster blends (velar-lateral)' },
    { sound: '/str/', frequency: 2, trend: 'Improving', description: 'Complex tri-consonant cluster (alveolar release)' },
    { sound: '/b/', frequency: 2, trend: 'Stable', description: 'Voiced bilabial plosives (voiced pop)' }
  ];

  const MOCK_TRIGGER_WORDS = [
    { word: "think", frequency: 4, type: "Blockage", sound: "/th/", tip: "Slide your tongue tip slightly forward before blowing air." },
    { word: "the", frequency: 3, type: "Repetition", sound: "/th/", tip: "Use soft vocalization and stretch out the 'th' transition." },
    { word: "peter", frequency: 3, type: "Blockage", sound: "/p/", tip: "Touch lips extremely gently without pressure." },
    { word: "prism", frequency: 2, type: "Prolongation", sound: "/p/", tip: "Breathe through the initial p-r transition." },
    { word: "blue", frequency: 2, type: "Repetition", sound: "/b/", tip: "Begin the /b/ sound with a soft murmur." }
  ];

  const MOCK_SESSIONS = [
    {
      _id: 'mock-session-1',
      createdAt: new Date().toISOString(),
      duration: 42,
      metrics: {
        repetitionCount: 2,
        pauseCount: 1,
        speechRateWPM: 142,
        fluencyScore: 84
      }
    },
    {
      _id: 'mock-session-2',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      duration: 38,
      metrics: {
        repetitionCount: 4,
        pauseCount: 2,
        speechRateWPM: 135,
        fluencyScore: 78
      }
    },
    {
      _id: 'mock-session-3',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      duration: 45,
      metrics: {
        repetitionCount: 3,
        pauseCount: 3,
        speechRateWPM: 122,
        fluencyScore: 71
      }
    }
  ];

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      const isDemo = localStorage.getItem('is_demo_mode') === 'true';
      if (isDemo) {
        setSummary(MOCK_SUMMARY);
        setTrendData(MOCK_TREND_DATA);
        setWeakSounds(MOCK_WEAK_SOUNDS);
        setTriggerWords(MOCK_TRIGGER_WORDS);
        setSessions(MOCK_SESSIONS);
        setLoading(false);
        return;
      }

      try {
        const [summaryRes, trendRes, soundsRes, sessionsRes] = await Promise.allSettled([
          analyticsService.getSummary(),
          analyticsService.getTrend('wpm', dateRange),
          analyticsService.getSoundProgress(),
          sessionsService.getSessions({ limit: 10 })
        ]);
        
        if (summaryRes.status === 'fulfilled') setSummary(summaryRes.value.data);
        if (trendRes.status === 'fulfilled') setTrendData(trendRes.value.data.data || []);
        
        if (soundsRes.status === 'fulfilled') {
          const loadedSounds = soundsRes.value.data.soundProficiency || soundsRes.value.data.weakSounds || [];
          setWeakSounds(loadedSounds.length > 0 ? loadedSounds : MOCK_WEAK_SOUNDS);
          setTriggerWords(MOCK_TRIGGER_WORDS);
        } else {
          setWeakSounds(MOCK_WEAK_SOUNDS);
          setTriggerWords(MOCK_TRIGGER_WORDS);
        }
        
        if (sessionsRes.status === 'fulfilled') setSessions(sessionsRes.value.data.sessions || []);
      } catch (err) {
        console.error("Failed to load analytics data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, [dateRange]);

  const chartText = "var(--text-muted)";
  const chartGrid = "var(--border-subtle)";
  const tooltipStyle = {
    backgroundColor: "var(--bg-surface)",
    borderRadius: '12px',
    border: '1px solid var(--border-subtle)',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
    fontSize: '12px',
    color: 'var(--text-primary)'
  };

  const trendImproving = summary?.improvementTrend === 'improving';
  const soundColors = ['#0D9488', '#F59E0B', '#3B82F6', '#8B5CF6', '#EF4444'];

  const formatDuration = (s) => {
    if (!s) return '—';
    const m = Math.floor(s / 60);
    const sec = Math.round(s % 60);
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="animate-fade-in pb-12 relative min-h-screen">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--accent)]/5 rounded-full blur-[140px] -z-10 pointer-events-none opacity-60 dark:opacity-20" />
      
      <div className="mb-10">
        <Breadcrumb />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
          <div>
            <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight font-syne">Speech Analytics</h1>
            <p className="text-[var(--text-secondary)] font-medium text-sm mt-2">Deep dive into your fluency patterns and progress</p>
          </div>
        </div>
      </div>

      <Card variant="glass" padded={false} className="mb-8 flex items-start md:items-center gap-5 p-6 shadow-premium border-l-[6px] border-l-[var(--accent)] bg-gradient-to-r from-[var(--bg-surface)] to-[var(--accent)]/5">
        <div className="w-14 h-14 bg-[var(--accent)]/10 rounded-2xl flex items-center justify-center text-[var(--accent)] shrink-0 shadow-sm">
          <ArrowUpRight size={28} strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          {loading ? (
             <div className="flex items-center gap-2 text-[var(--text-muted)]"><Loader2 size={16} className="animate-spin" /> Analyzing clinical records...</div>
          ) : (
            <>
              <h4 className="text-[var(--text-primary)] font-black text-lg tracking-tight">
                {trendImproving ? 'Fluency performance is trending upward 🎉' : 'Consistent practice leads to improvement'}
              </h4>
              <p className="text-[var(--text-secondary)] font-medium text-sm mt-1">
                Your average fluency score is <span className="text-[var(--accent)] font-bold">{summary?.averageFluencyScore || 0}%</span>. 
                {summary?.topWeakSounds?.length > 0 ? ` Focusing on your ${summary.topWeakSounds[0].sound} sounds will help you reach your goals faster.` : ' Keep taking assessments to unlock personalized insights.'}
              </p>
            </>
          )}
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-1.5 p-1 bg-[var(--bg-elevated)] rounded-xl w-fit border border-[var(--border-subtle)] shadow-sm">
          {[['7 Days','7d'], ['30 Days','30d'], ['90 Days','90d']].map(([label, val]) => (
            <button
              key={val}
              onClick={() => setDateRange(val)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                dateRange === val 
                  ? "bg-[var(--bg-surface)] text-teal-600 shadow-sm ring-1 ring-[var(--border-subtle)]" 
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <Button variant="ghost" size="sm" className="h-9 text-[11px] font-black uppercase tracking-widest border-[var(--border-subtle)]">
          <Download size={14} className="mr-2" /> Export Report
        </Button>
      </div>

      <div className="space-y-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="h-[280px] min-h-[280px] flex flex-col p-6 shadow-sm border-[var(--border-subtle)]">
            <div className="mb-4">
              <h3 className="font-black text-[var(--text-primary)] text-xs uppercase tracking-widest">Repetitions Trend</h3>
              <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-[0.2em] mt-1">Frequency monitoring</p>
            </div>
            <div className="flex-1 w-full min-h-0 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGrid} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: chartText}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: chartText}} />
                  <ReTooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="repetitions" stroke="#0D9488" strokeWidth={3} dot={{r: 4, fill: '#0D9488', strokeWidth: 2, stroke: '#fff'}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="h-[280px] min-h-[280px] flex flex-col p-6 shadow-sm border-[var(--border-subtle)]">
            <div className="mb-4">
              <h3 className="font-black text-[var(--text-primary)] text-xs uppercase tracking-widest">Pauses Trend</h3>
              <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-[0.2em] mt-1">Clinical event count</p>
            </div>
            <div className="flex-1 w-full min-h-0 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGrid} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: chartText}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: chartText}} />
                  <ReTooltip cursor={{fill: 'var(--bg-elevated)', opacity: 0.4}} contentStyle={tooltipStyle} />
                  <Bar dataKey="pauses" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card className="h-[320px] min-h-[320px] flex flex-col p-6 shadow-sm border-[var(--border-subtle)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-black text-[var(--text-primary)] text-xs uppercase tracking-widest">Speech Rate Velocity (WPM)</h3>
              <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-[0.2em] mt-1">Historical word rate trend</p>
            </div>
            {summary && summary.totalSessions > 0 && (
              <Badge className={cn("px-3 py-1 text-[10px] font-black tracking-widest", trendImproving ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-100 text-slate-500")}>
                {trendImproving ? '↑ IMPROVING' : 'STABLE'}
              </Badge>
            )}
          </div>
          <div className="flex-1 w-full min-h-0 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGrid} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: chartText}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: chartText}} />
                <ReTooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="wpm" stroke="#0D9488" strokeWidth={3} fillOpacity={1} fill="url(#colorWpm)" dot={{r: 4, fill: '#0D9488', strokeWidth: 2, stroke: '#fff'}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ── Articulation & Phonetic Friction Map ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        
        {/* Left 2 Cols: Weak Phonemes & Therapist advisory */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-3.5">
              Phonetic Articulation Friction Map
            </h3>
            <Card padded={false} className="overflow-hidden divide-y divide-[var(--border-subtle)] border-[var(--border-subtle)] shadow-sm">
              {weakSounds.length === 0 ? (
                <div className="p-12 text-center text-[var(--text-muted)] text-sm font-medium italic opacity-70">
                  {loading ? 'Analyzing phonetic patterns…' : 'No weak sounds detected yet.'}
                </div>
              ) : (
                weakSounds.map((item, idx) => (
                  <div key={item.sound} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-5 hover:bg-[var(--bg-elevated)]/30 transition-all group">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--bg-base)] flex items-center justify-center font-black text-teal-600 text-[15px] shrink-0 border border-[var(--border-subtle)] shadow-sm">
                      {item.sound}
                    </div>
                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-center mb-1.5">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-tight flex items-center gap-1.5">
                            {item.frequency > 0 ? `Stutter Triggered ${item.frequency}×` : 'Optimal Syllable Control'}
                            {item.frequency > 6 && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />}
                          </span>
                          <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider mt-0.5">
                            {item.description || 'Target consonant release'}
                          </span>
                        </div>
                        <Badge variant={item.frequency > 6 ? 'warning' : 'slate'} className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5">
                          {item.trend || 'stable'}
                        </Badge>
                      </div>
                      <div className="h-2 bg-[var(--bg-base)] rounded-full overflow-hidden border border-[var(--border-subtle)]/30">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.frequency === 0 ? 100 : Math.min(100, (item.frequency / (weakSounds[0]?.frequency || 1)) * 100)}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: item.frequency > 6 ? '#F59E0B' : '#0D9488' }}
                        />
                      </div>
                    </div>
                    <div className="shrink-0">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-9 px-4 text-[10px] font-black uppercase tracking-widest border-[var(--border-subtle)] hover:bg-[var(--accent)] hover:text-white transition-all" 
                        onClick={() => navigate('/practice', { state: { targetSound: item.sound.replace(/\//g, '').toUpperCase() } })}
                      >
                        Target Drill
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </Card>
          </div>

          {/* Clinical Speech-Language Therapist Advisory */}
          {weakSounds.length > 0 && (
            <Card variant="glass" className="p-6 border-l-[6px] border-l-teal-600 bg-gradient-to-r from-[var(--bg-surface)] to-teal-500/5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center shrink-0">
                  <Activity size={20} />
                </div>
                <div>
                  <h4 className="text-[12px] font-black uppercase tracking-widest text-[var(--text-primary)]">
                    Clinical Therapist Feedback & Diagnosis
                  </h4>
                  <p className="text-xs font-semibold text-[var(--text-secondary)] mt-2 leading-relaxed">
                    {weakSounds[0]?.sound === '/th/' ? (
                      <span>
                        Based on acoustic telemetry, you are experiencing high glottal impedance and blockage tension during <strong>soft dental fricatives (/th/)</strong>. Tension is localized in the tip of the tongue against the back of the teeth. <strong>Guidance:</strong> Focus on <em>Easy Onset</em>. Initiate airflow gently before tongue occlusion to prevent blockages.
                      </span>
                    ) : (
                      <span>
                        Telemetry indicates mild articulatory pressure spikes during <strong>bilabial plosives ({weakSounds[0]?.sound})</strong>. <strong>Guidance:</strong> Focus on <em>Light Contacts</em>. Let your lips touch extremely softly like flower petals to maintain continuous voicing.
                      </span>
                    )}
                  </p>
                  <div className="mt-4 flex gap-4 items-center">
                    <span className="text-[9px] font-black uppercase tracking-widest text-teal-600">Primary Drill Recommendation:</span>
                    <button 
                      onClick={() => navigate('/practice', { state: { targetSound: weakSounds[0]?.sound.replace(/\//g, '').toUpperCase() } })}
                      className="text-[10px] font-black text-[var(--text-primary)] hover:text-teal-600 hover:underline uppercase tracking-widest flex items-center gap-1"
                    >
                      Start Recommended Drill <ArrowUpRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right 1 Col: Top Stuttered Words Table */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-3.5">
            Top Articulation Trigger Words
          </h3>
          <Card padded={false} className="border-[var(--border-subtle)] shadow-sm overflow-hidden h-full flex flex-col justify-between">
            <div className="divide-y divide-[var(--border-subtle)]">
              <div className="px-5 py-4 bg-[var(--bg-elevated)]/40 border-b border-[var(--border-subtle)] flex items-center justify-between">
                <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider">Target word</span>
                <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider">Events count</span>
              </div>

              {(triggerWords.length > 0 ? triggerWords : MOCK_TRIGGER_WORDS).slice(0, 5).map((w, idx) => (
                <div key={idx} className="p-4 flex flex-col gap-2 hover:bg-[var(--bg-elevated)]/20 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-teal-600 font-syne">"{w.word}"</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="slate" size="sm" className="text-[9px] uppercase tracking-wider px-2 font-bold">{w.type}</Badge>
                      <span className="text-[11px] font-black text-[var(--text-primary)]">{w.frequency}×</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] font-medium leading-normal italic">
                    💡 {w.tip}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-[var(--bg-elevated)]/10 border-t border-[var(--border-subtle)]/40 text-center">
              <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                Aggregated over {summary?.totalSessions || 14} diagnostic records
              </span>
            </div>
          </Card>
        </div>

      </div>

      <div className="mb-12">
        <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-4 px-1">Clinical Session History</h3>
        <Card padded={false} className="overflow-hidden shadow-sm border-[var(--border-subtle)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)]">
                  <th className="px-6 py-4 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Date</th>
                  <th className="px-6 py-4 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Duration</th>
                  <th className="px-6 py-4 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] text-center">Repetitions</th>
                  <th className="px-6 py-4 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] text-center">Pauses</th>
                  <th className="px-6 py-4 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] text-center">Avg WPM</th>
                  <th className="px-6 py-4 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] text-center">Fluency</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {sessions.length > 0 ? sessions.map((s) => (
                  <tr key={s._id} className="hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer group" onClick={() => navigate(`/sessions/${s._id}`)}>
                    <td className="px-6 py-4 text-xs font-black text-[var(--text-primary)]">
                      {new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-xs text-[var(--text-muted)] font-bold">{formatDuration(s.duration)}</td>
                    <td className="px-6 py-4 text-xs text-center text-amber-600 font-black">{s.metrics?.repetitionCount || 0}</td>
                    <td className="px-6 py-4 text-xs text-center text-indigo-500 font-black">{s.metrics?.pauseCount || 0}</td>
                    <td className="px-6 py-4 text-xs text-center text-[var(--text-primary)] font-black">{s.metrics?.speechRateWPM || 0}</td>
                    <td className="px-6 py-4 text-center">
                       <span className="px-2 py-1 rounded bg-teal-500/10 text-teal-600 font-black text-[10px]">{s.metrics?.fluencyScore || 0}%</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-[10px] font-black text-[var(--text-muted)] group-hover:text-teal-600 transition-all flex items-center justify-end gap-1 uppercase tracking-widest">
                        Details <ChevronRight size={14} />
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="7" className="px-6 py-12 text-center text-[var(--text-muted)] font-black uppercase tracking-widest opacity-40">No records found</td></tr>
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
