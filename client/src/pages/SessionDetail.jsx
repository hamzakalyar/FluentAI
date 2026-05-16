import React, { useState, useEffect } from 'react';
import { 
  Play, Download, Share2, Clock, Calendar, Mic2,
  AlertCircle, ChevronLeft, Activity, Loader2,
  BarChart3, Volume2, Repeat, MessageSquare, Zap,
  Target, Brain, FileText, TrendingUp, ArrowRight,
  CheckCircle2, XCircle, Pause as PauseIcon
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import Badge from '../components/shared/Badge';
import Breadcrumb from '../components/layout/Breadcrumb';
import { motion } from 'framer-motion';
import { sessionsService } from '../services/sessionsService';

const ScoreRing = ({ score, size = 100, strokeWidth = 8 }) => {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const color = score >= 70 ? '#14b8a6' : score >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} stroke="var(--border-subtle)" strokeWidth={strokeWidth} fill="transparent" />
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={strokeWidth} fill="transparent"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-black" style={{ color }}>{score}</span>
        <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">/ 100</span>
      </div>
    </div>
  );
};

const SessionDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const response = await sessionsService.getSessionById(id);
        setSession(response.data.session || response.data);
      } catch (err) {
        console.error('Error fetching session:', err);
        setError('Failed to load session data.');
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-[var(--accent)] animate-spin mb-4" />
        <p className="text-[var(--text-secondary)] font-bold">Fetching clinical analysis...</p>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
        <h2 className="text-2xl font-black text-[var(--text-primary)] mb-2">Analysis Unavailable</h2>
        <p className="text-[var(--text-secondary)] max-w-md mb-8">{error || 'The requested session data could not be retrieved.'}</p>
        <Button onClick={() => navigate('/analytics')}>Back to Analytics</Button>
      </div>
    );
  }

  const m = session.metrics || {};
  const tokens = session.analysis?.tokens || [];
  const stutters = session.analysis?.stutters || session.metrics?.detectedStutters || [];
  const comparison = session.analysis?.comparison || session.assessmentComparison;
  const nlp = session.analysis?.nlp || session.nlpAnalysis || {};
  const weakSounds = session.analysis?.weakSounds || session.weakSoundsDetected || [];
  const repetitions = session.analysis?.repetitions || session.metrics?.repetitions || [];
  const pauses = session.analysis?.pauses || session.metrics?.pauses || [];
  const fillers = session.analysis?.fillers || session.metrics?.fillers || [];
  const createdAt = new Date(session.createdAt);
  const scoreLabel = m.fluencyScore >= 80 ? 'Exceptional' : m.fluencyScore >= 60 ? 'Consistent' : 'Practice Needed';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="animate-fade-in-up pb-12 px-2"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Breadcrumb />
          <div className="flex items-center gap-4 mt-1">
            <button onClick={() => navigate(-1)}
              className="p-2 hover:bg-[var(--bg-elevated)] rounded-xl transition-all text-[var(--text-muted)] hover:text-[var(--accent)]">
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight font-syne">Session Report</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-1">
                  <Calendar size={12} /> {createdAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-1">
                  <Clock size={12} /> {Math.floor(session.duration / 60)}m {Math.round(session.duration % 60)}s
                </span>
                {session.passageId && (
                  <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-widest flex items-center gap-1">
                    <Target size={12} /> {session.passageId}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="border-[var(--border-subtle)]"><Share2 size={16} className="mr-2" /> Share</Button>
          <Button variant="ghost" size="sm" className="border-[var(--border-subtle)]"><Download size={16} className="mr-2" /> Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[var(--bg-surface)] rounded-3xl p-6 border border-[var(--border-subtle)] shadow-sm">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="text-center">
                <ScoreRing score={m.fluencyScore || 0} size={120} strokeWidth={10} />
                <p className="text-sm font-black text-[var(--text-primary)] mt-2">{scoreLabel}</p>
              </div>
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="text-center p-3 bg-[var(--bg-elevated)] rounded-xl">
                  <p className="text-2xl font-black text-[var(--text-primary)]">{m.speechRateWPM || 0}</p>
                  <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">WPM</p>
                </div>
                <div className="text-center p-3 bg-[var(--bg-elevated)] rounded-xl">
                  <p className="text-2xl font-black text-amber-500">{m.repetitionCount || 0}</p>
                  <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Repetitions</p>
                </div>
                <div className="text-center p-3 bg-[var(--bg-elevated)] rounded-xl">
                  <p className="text-2xl font-black text-indigo-500">{m.pauseCount || 0}</p>
                  <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Pauses</p>
                </div>
                <div className="text-center p-3 bg-[var(--bg-elevated)] rounded-xl">
                  <p className="text-2xl font-black text-rose-500">{m.fillerCount || 0}</p>
                  <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Fillers</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-subtle)] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2"><FileText size={16} /> Transcript Analysis</h3>
              <span className="text-[10px] font-bold text-[var(--accent)] bg-[var(--accent-glow)] px-2 py-1 rounded-lg uppercase tracking-widest">AI Analyzed</span>
            </div>
            <div className="p-6">
              <div className="text-base text-[var(--text-primary)] leading-[2] font-medium whitespace-pre-wrap">
                {(session.transcript?.text || session.transcript || '').split(' ').map((word, i) => {
                   const cleanWord = word.replace(/[^\w]/g, '').toLowerCase();
                   const isStuttered = cleanWord && stutters.some(s => s.word && s.word.replace(/[^\w]/g, '').toLowerCase().includes(cleanWord));
                   return (
                      <span key={i} className={isStuttered ? 'bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-100 px-1 rounded border-b-2 border-red-400 mx-0.5' : 'mx-0.5'}>
                         {word}
                      </span>
                   );
                })}
              </div>
            </div>
          </div>

          {stutters.length > 0 && (
            <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-subtle)] shadow-sm p-5">
              <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2"><Activity size={16} /> Stutter Events Timeline ({stutters.length})</h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {stutters.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-[var(--bg-elevated)] rounded-xl">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-black ${
                      s.type === 'repetition' ? 'bg-amber-500' : s.type === 'block' ? 'bg-red-500' : 'bg-slate-500'
                    }`}>
                      {s.type?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[var(--text-primary)] capitalize">{s.type}</p>
                      <p className="text-[11px] text-[var(--text-muted)] truncate">{s.details || s.word || '—'}</p>
                    </div>
                    <span className="text-[11px] font-mono text-[var(--text-muted)]">{s.position?.toFixed(1)}s</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {comparison && (
            <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-subtle)] shadow-sm p-5">
              <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2"><Target size={16} /> Passage Assessment</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="text-center p-3 bg-[var(--bg-elevated)] rounded-xl">
                  <p className="text-xl font-black text-[var(--accent)]">{comparison.accuracy || comparison.matchScore}%</p>
                  <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase">Accuracy</p>
                </div>
                <div className="text-center p-3 bg-[var(--bg-elevated)] rounded-xl">
                  <p className="text-xl font-black text-amber-500">{comparison.skippedWords?.length || 0}</p>
                  <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase">Skipped</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-[var(--bg-surface)] rounded-2xl p-5 border border-[var(--border-subtle)] shadow-sm">
            <h3 className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-4 flex items-center gap-2"><Brain size={14} /> NLP Analysis</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--text-secondary)]">Vocabulary</span>
                <span className="text-sm font-bold text-[var(--text-primary)] capitalize">{nlp.vocabularyLevel || 'Normal'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--text-secondary)]">Avoidance</span>
                <span className={`text-sm font-bold ${nlp.avoidanceDetected ? 'text-amber-500' : 'text-emerald-500'}`}>{nlp.avoidanceDetected ? 'Detected' : 'None'}</span>
              </div>
            </div>
          </div>

          {weakSounds.length > 0 && (
            <div className="bg-[var(--bg-surface)] rounded-2xl p-5 border border-[var(--border-subtle)] shadow-sm">
              <h3 className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-4 flex items-center gap-2"><Volume2 size={14} /> Weak Sounds</h3>
              <div className="space-y-2">
                {weakSounds.map((ws, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-[var(--bg-elevated)] rounded-lg">
                    <span className="text-sm font-black text-[var(--text-primary)]">{ws.sound || ws}</span>
                    <span className="text-[10px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">{ws.frequency || 1}×</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button onClick={() => navigate('/practice')} className="w-full h-12 bg-[var(--accent)] text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[var(--accent)]/20 flex items-center justify-center gap-2">Start Related Practice <ArrowRight size={16} /></button>
        </div>
      </div>
    </motion.div>
  );
};

export default SessionDetail;
