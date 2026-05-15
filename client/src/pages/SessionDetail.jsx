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

const MetricCard = ({ icon: Icon, label, value, color = 'text-[var(--accent)]', sub }) => (
  <div className="bg-[var(--bg-surface)] rounded-2xl p-4 border border-[var(--border-subtle)] flex items-center gap-4">
    <div className={`w-10 h-10 rounded-xl bg-[var(--bg-elevated)] flex items-center justify-center ${color}`}>
      <Icon size={18} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{label}</p>
      <p className="text-xl font-black text-[var(--text-primary)]">{value}</p>
      {sub && <p className="text-[11px] text-[var(--text-muted)]">{sub}</p>}
    </div>
  </div>
);

const SessionDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock session data
  const session = {
    id: id || '#42',
    title: 'Morning Reading Session',
    date: 'March 14, 2026',
    duration: '2m 45s',
    fluencyScore: 84,
    wpm: 124,
    repetitions: 4,
    pauses: 7,
    transcript: [
      { text: 'The' }, { text: 'quick' }, { text: 'brown' }, { text: 'fox' },
      { type: 'repetition', text: 'jumps', count: 2 }, { text: 'over' }, { text: 'the' },
      { type: 'pause', duration: 1.2 }, { text: 'lazy' }, { text: 'dog.' },
      { text: 'He' }, { type: 'repetition', text: 'sat', count: 2 }, { text: 'down' },
      { text: 'near' }, { text: 'the' }, { text: 'river' }, { text: 'and' },
      { type: 'pause', duration: 0.8 }, { text: 'watched' }, { text: 'the' },
      { type: 'repetition', text: 'the', count: 3 }, { text: 'sunset.' }
    ]
  };

  return (
    <div className="animate-fade-in-up pb-12 px-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Breadcrumb />
          <div className="flex items-center gap-4 mt-1">
            <button onClick={() => navigate(-1)}
              className="p-2 hover:bg-[var(--bg-elevated)] rounded-xl transition-all text-[var(--text-muted)] hover:text-[var(--accent)]">
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight font-syne">
                Session Report
              </h1>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ─── LEFT: Main Content ─── */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Score + Key Metrics Row */}
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

          {/* Transcript */}
          <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-subtle)] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                <FileText size={16} /> Transcript Analysis
              </h3>
              <span className="text-[10px] font-bold text-[var(--accent)] bg-[var(--accent-glow)] px-2 py-1 rounded-lg uppercase tracking-widest">
                AI Analyzed
              </span>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-amber-400 rounded-sm" />
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Repetition</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-red-400 rounded-sm" />
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Stutter Event</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-0.5 border-b-2 border-dashed border-indigo-400" />
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Pause</span>
                </div>
              </div>
              <div className="text-base text-[var(--text-primary)] leading-[2] font-medium whitespace-pre-wrap">
                {tokens.map((tok, i) => (
                  <span key={i} className="relative inline-block mr-1">
                    {tok.type === 'repetition' ? (
                      <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100 px-1 rounded border-b-2 border-amber-400 cursor-help"
                        title={`Repeated ${tok.count}x`}>{tok.text}</span>
                    ) : tok.type === 'stutter' ? (
                      <span className="bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-100 px-1 rounded border-b-2 border-red-400 cursor-help"
                        title={tok.details || tok.stutterType}>{tok.text}</span>
                    ) : tok.type === 'pause' ? (
                      <span className="inline-block border-b-2 border-dashed border-indigo-300 mx-1 px-2 text-indigo-400 text-sm font-black tracking-widest">…</span>
                    ) : tok.text}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Detected Stutter Events Timeline */}
          {stutters.length > 0 && (
            <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-subtle)] shadow-sm p-5">
              <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Activity size={16} /> Stutter Events Timeline ({stutters.length})
              </h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {stutters.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-[var(--bg-elevated)] rounded-xl">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-black ${
                      s.type === 'repetition' ? 'bg-amber-500' :
                      s.type === 'block' ? 'bg-red-500' :
                      s.type === 'prolongation' ? 'bg-purple-500' :
                      s.type === 'pause' ? 'bg-indigo-500' :
                      s.type === 'filler' ? 'bg-rose-400' : 'bg-slate-500'
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

          {/* Assessment Comparison (if passage mode) */}
          {comparison && (
            <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-subtle)] shadow-sm p-5">
              <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Target size={16} /> Passage Assessment
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="text-center p-3 bg-[var(--bg-elevated)] rounded-xl">
                  <p className="text-xl font-black text-[var(--accent)]">{comparison.accuracy}%</p>
                  <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase">Accuracy</p>
                </div>
                <div className="text-center p-3 bg-[var(--bg-elevated)] rounded-xl">
                  <p className="text-xl font-black text-[var(--text-primary)]">{comparison.expectedWordCount}</p>
                  <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase">Expected</p>
                </div>
                <div className="text-center p-3 bg-[var(--bg-elevated)] rounded-xl">
                  <p className="text-xl font-black text-[var(--text-primary)]">{comparison.actualWordCount}</p>
                  <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase">Spoken</p>
                </div>
                <div className="text-center p-3 bg-[var(--bg-elevated)] rounded-xl">
                  <p className="text-xl font-black text-amber-500">{comparison.skippedWords?.length || 0}</p>
                  <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase">Skipped</p>
                </div>
              </div>

              {/* Sound accuracy breakdown */}
              {comparison.soundsTestedResults && Object.keys(comparison.soundsTestedResults).length > 0 && (
                <div>
                  <h4 className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-3">Sound Accuracy</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(comparison.soundsTestedResults).map(([sound, data]) => (
                      <div key={sound} className="flex items-center justify-between p-2 bg-[var(--bg-elevated)] rounded-lg">
                        <span className="text-sm font-black text-[var(--text-primary)]">{sound}</span>
                        <span className={`text-sm font-bold ${data.accuracy >= 80 ? 'text-emerald-500' : data.accuracy >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                          {data.accuracy}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ─── RIGHT: Sidebar ─── */}
        <div className="space-y-6">
          {/* NLP Analysis */}
          <div className="bg-[var(--bg-surface)] rounded-2xl p-5 border border-[var(--border-subtle)] shadow-sm">
            <h3 className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-4 flex items-center gap-2">
              <Brain size={14} /> NLP Analysis
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--text-secondary)]">Vocabulary Level</span>
                <span className="text-sm font-bold text-[var(--text-primary)] capitalize">
                  {nlp.complexity?.typeTokenRatio > 0.6 ? 'Advanced' : nlp.complexity?.typeTokenRatio > 0.4 ? 'Normal' : 'Basic'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--text-secondary)]">Lexical Density</span>
                <span className="text-sm font-bold text-[var(--text-primary)]">
                  {((nlp.complexity?.lexicalDensity || 0) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--text-secondary)]">Avg Word Length</span>
                <span className="text-sm font-bold text-[var(--text-primary)]">
                  {nlp.complexity?.avgWordLength?.toFixed(1) || '—'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--text-secondary)]">Avoidance</span>
                <span className={`text-sm font-bold ${nlp.avoidanceDetected ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {nlp.avoidanceDetected ? 'Detected' : 'None'}
                </span>
              </div>
            </div>
          </div>

          {/* Weak Sounds */}
          {weakSounds.length > 0 && (
            <div className="bg-[var(--bg-surface)] rounded-2xl p-5 border border-[var(--border-subtle)] shadow-sm">
              <h3 className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-4 flex items-center gap-2">
                <Volume2 size={14} /> Weak Sounds
              </h3>
              <div className="space-y-2">
                {weakSounds.map((ws, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-[var(--bg-elevated)] rounded-lg">
                    <span className="text-sm font-black text-[var(--text-primary)]">{ws.sound}</span>
                    <span className="text-[10px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">
                      {ws.frequency}× detected
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Repetition Details */}
          {repetitions.length > 0 && (
            <div className="bg-[var(--bg-surface)] rounded-2xl p-5 border border-[var(--border-subtle)] shadow-sm">
              <h3 className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-4 flex items-center gap-2">
                <Repeat size={14} /> Word Repetitions
              </h3>
              <div className="space-y-2">
                {repetitions.map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-[var(--bg-elevated)] rounded-lg">
                    <span className="text-sm font-bold text-[var(--text-primary)]">"{r.word}"</span>
                    <div className="text-right">
                      <span className="text-sm font-black text-amber-500">{r.times}×</span>
                      <span className="text-[10px] text-[var(--text-muted)] ml-2">{r.position?.toFixed(1)}s</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pause Details */}
          {pauses.length > 0 && (
            <div className="bg-[var(--bg-surface)] rounded-2xl p-5 border border-[var(--border-subtle)] shadow-sm">
              <h3 className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-4 flex items-center gap-2">
                <PauseIcon size={14} /> Abnormal Pauses
              </h3>
              <div className="space-y-2">
                {pauses.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-[var(--bg-elevated)] rounded-lg">
                    <span className="text-sm text-[var(--text-secondary)]">@ {p.position?.toFixed(1)}s</span>
                    <span className="text-sm font-bold text-indigo-500">{p.duration_ms || p.durationMs}ms</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filler Words */}
          {fillers.length > 0 && (
            <div className="bg-[var(--bg-surface)] rounded-2xl p-5 border border-[var(--border-subtle)] shadow-sm">
              <h3 className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-3">
                Filler Words
              </h3>
              <div className="flex flex-wrap gap-2">
                {fillers.map((f, i) => (
                  <span key={i} className="text-sm font-bold text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-3 py-1 rounded-full">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <button onClick={() => navigate('/practice')}
            className="w-full h-12 bg-[var(--accent)] text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[var(--accent)]/20 flex items-center justify-center gap-2">
            Start Related Practice <ArrowRight size={16} />
          </button>
          <button onClick={() => navigate('/recording')}
            className="w-full h-10 border border-[var(--border-subtle)] text-[var(--text-secondary)] font-bold rounded-xl hover:bg-[var(--bg-elevated)] transition-all text-sm">
            Record Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionDetail;
