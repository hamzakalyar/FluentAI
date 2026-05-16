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
  const audioRef = React.useRef(null);

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

  if (session?.status === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-full border-4 border-[var(--accent)]/10 border-t-[var(--accent)] animate-spin" />
          <Brain className="absolute inset-0 m-auto text-[var(--accent)] w-8 h-8 animate-pulse" />
        </div>
        <h2 className="text-2xl font-black text-[var(--text-primary)] mb-2">Analysis in Progress</h2>
        <p className="text-[var(--text-secondary)] max-w-md mb-8">Our AI models are currently processing your speech patterns. This usually takes 30-60 seconds.</p>
        <Button variant="ghost" onClick={() => window.location.reload()}>Refresh Page</Button>
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
  const tokens = session.transcript?.words || [];
  const stutters = session.analysis?.stutters || session.metrics?.detectedStutters || [];
  const comparison = session.analysis?.comparison || session.assessmentComparison;
  const nlp = session.analysis?.nlp || session.nlpAnalysis || {};
  const weakSounds = session.analysis?.weakSounds || session.weakSoundsDetected || [];
  const repetitions = session.analysis?.repetitions || session.metrics?.repetitions || [];
  const pauses = session.analysis?.pauses || session.metrics?.pauses || [];
  const fillers = session.analysis?.fillers || session.metrics?.fillers || [];
  const createdAt = new Date(session.createdAt);
  const scoreLabel = m.fluencyScore >= 80 ? 'Exceptional' : m.fluencyScore >= 60 ? 'Consistent' : 'Practice Needed';

  const handleExport = () => {
    window.print();
  };

  return (
     <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="animate-fade-in-up pb-12 px-2 print-container"
    >
      <style>{`
        @media print {
          .no-print, button, nav, .breadcrumb, aside { display: none !important; }
          .print-container { padding: 0 !important; margin: 0 !important; }
          body { background: white !important; color: black !important; }
          .bg-[var(--bg-surface)], .bg-[var(--bg-elevated)] { background: #f9fafb !important; border: 1px solid #e5e7eb !important; }
          .text-[var(--accent)] { color: #0d9488 !important; }
          .shadow-sm, .shadow-lg { shadow: none !important; }
          .custom-scrollbar { overflow: visible !important; max-height: none !important; }
        }
      `}</style>
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
          {session.audioUrl && (
             <Button 
                variant="ghost" 
                size="sm" 
                className="border-[var(--border-subtle)] text-[var(--accent)] hover:bg-[var(--accent-glow)]"
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    audioRef.current.play().catch(e => console.error("Playback failed:", e));
                  }
                }}
             >
               <Play size={16} className="mr-2" fill="currentColor" /> Replay Session
             </Button>
          )}
           <Button 
            variant="ghost" 
            size="sm" 
            className="border-[var(--border-subtle)]"
            onClick={handleExport}
           >
            <Download size={16} className="mr-2" /> Export
           </Button>
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
            <div className="p-0">
              <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-6 bg-[var(--bg-elevated)]/30">
                <div className="text-base text-[var(--text-primary)] leading-[2.2] font-medium whitespace-pre-wrap text-justify">
                  {(() => {
                    const whisperWords = session.transcript?.words || [];
                    const stutterEvents = (
                      session.metrics?.detectedStutters ||
                      session.analysis?.stutters ||
                      []
                    );

                    // If we have word-level tokens from Whisper, render them
                    // with timestamp-based stutter matching (accurate)
                    if (whisperWords.length > 0) {
                      return whisperWords.map((token, i) => {
                        // Find stutter event within ±0.8s of this word's start
                        const matchedStutter = stutterEvents.find(s =>
                          s.position !== undefined &&
                          Math.abs(s.position - token.start) < 0.8
                        );
                        const stutterType = matchedStutter?.type;

                        // Color scheme per stutter type
                        const colorClass =
                          stutterType === 'sound_repetition'
                            ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-900 dark:text-orange-100 border-orange-400'
                            : stutterType === 'repetition'
                            ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100 border-amber-400'
                            : stutterType === 'block'
                            ? 'bg-red-100 dark:bg-red-900/40 text-red-900 dark:text-red-100 border-red-400'
                            : stutterType === 'prolongation'
                            ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-900 dark:text-purple-100 border-purple-400'
                            : stutterType === 'filler' || stutterType === 'pause'
                            ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100 border-blue-400'
                            : null;

                        const tooltip =
                          stutterType === 'sound_repetition' ? `Phoneme burst detected (e.g. p-p-${token.word?.toLowerCase()}) at ${token.start?.toFixed(1)}s`
                            : stutterType === 'repetition' ? `Word repetition: "${token.word}" at ${token.start?.toFixed(1)}s`
                            : stutterType === 'block' ? `Block / speech struggle at ${token.start?.toFixed(1)}s`
                            : stutterType === 'prolongation' ? `Prolonged sound at ${token.start?.toFixed(1)}s`
                            : stutterType === 'filler' ? `Filler word: "${token.word}"`
                            : stutterType === 'pause' ? `Abnormal pause before this word`
                            : null;

                        return (
                          <span
                            key={i}
                            className={`mx-0.5 ${
                              colorClass
                                ? `px-1.5 py-0.5 rounded-md border-b-2 font-bold cursor-help
                                   transition-all hover:scale-105 inline-block ${colorClass}`
                                : ''
                            }`}
                            title={tooltip || ''}
                          >
                            {token.word}
                          </span>
                        );
                      });
                    }

                    // Fallback: plain text when no word tokens exist
                    return (
                      <span className="text-[var(--text-secondary)] italic">
                        {session.transcript?.text || session.transcript || 'No transcript available.'}
                      </span>
                    );
                  })()}
                </div>
              </div>
              
              {/* Color Legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 px-6 py-3 border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)]/20">
                <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest self-center mr-1">Legend:</span>
                {[
                  { color: 'bg-orange-400', label: 'Phoneme Burst (p-p-p)' },
                  { color: 'bg-amber-400',  label: 'Word Repetition' },
                  { color: 'bg-red-400',    label: 'Block' },
                  { color: 'bg-purple-400', label: 'Prolongation' },
                  { color: 'bg-blue-400',   label: 'Filler / Pause' },
                ].map(({ color, label }) => (
                  <span key={label} className="flex items-center gap-1 text-[10px] font-bold text-[var(--text-muted)]">
                    <span className={`w-2.5 h-2.5 rounded-sm ${color} inline-block flex-shrink-0`} />
                    {label}
                  </span>
                ))}
              </div>
              {session.audioUrl && (
                <div className="px-6 py-4 border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)]/10">
                  <audio 
                    ref={audioRef}
                    id="session-audio" 
                    controls 
                    controlsList="nodownload"
                    className="w-full h-10 accent-[var(--accent)]"
                    src={session.audioUrl.startsWith('http') ? session.audioUrl : `http://localhost:3001${session.audioUrl}`}
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          </div>

          {stutters.length > 0 && (
            <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-subtle)] shadow-sm p-5">
              <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2"><Activity size={16} /> Stutter Events Timeline ({stutters.length})</h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {stutters.map((s, i) => {
                  const typeConfig = {
                    sound_repetition: { color: 'bg-orange-500', label: 'Phoneme Burst',   desc: `Rapid sound burst (e.g. p-p-p) detected` },
                    repetition:       { color: 'bg-amber-500',  label: 'Word Repetition', desc: s.word ? `"${s.word}" repeated` : 'Word repeated consecutively' },
                    block:            { color: 'bg-red-500',     label: 'Block',           desc: 'Speech block — struggle at word onset' },
                    prolongation:     { color: 'bg-purple-500',  label: 'Prolongation',   desc: 'Sound stretched longer than natural' },
                    filler:           { color: 'bg-blue-500',    label: 'Filler Word',    desc: s.word ? `"${s.word}" — filler inserted` : 'Filler word used' },
                    pause:            { color: 'bg-slate-500',   label: 'Abnormal Pause', desc: s.details || 'Silence longer than 300ms' },
                  };
                  const cfg = typeConfig[s.type] || {
                    color: 'bg-slate-400',
                    label: s.type || 'Dysfluency',
                    desc: s.details || s.word || '—',
                  };
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 bg-[var(--bg-elevated)] rounded-xl">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-black ${cfg.color}`}>
                        {cfg.label[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[var(--text-primary)]">{cfg.label}</p>
                        <p className="text-[11px] text-[var(--text-muted)] truncate">{cfg.desc}</p>
                      </div>
                      <span className="text-[11px] font-mono text-[var(--text-muted)] flex-shrink-0">{s.position?.toFixed(1)}s</span>
                    </div>
                  );
                })}
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

          {tokens.length > 0 && (
            <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-subtle)] shadow-sm p-5">
              <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2"><Clock size={16} /> Word Sequence Analysis ({tokens.length})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
                {tokens.map((t, i) => {
                  const cleanWord = t.word?.replace(/[^\w]/g, '').toLowerCase();
                  const isStuttered = stutters.some(s => s.word && s.word.replace(/[^\w]/g, '').toLowerCase().includes(cleanWord));
                  
                  return (
                    <div key={i} className={`p-2 rounded-xl border transition-all ${
                      isStuttered 
                        ? 'bg-rose-50 border-rose-200 text-rose-900' 
                        : 'bg-[var(--bg-elevated)]/50 border-[var(--border-subtle)] text-[var(--text-secondary)]'
                    }`}>
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-[8px] font-black uppercase tracking-tighter ${isStuttered ? 'text-rose-500' : 'text-[var(--text-muted)]'}`}>
                          {t.start?.toFixed(1)}s
                        </span>
                        {isStuttered && <Zap size={10} className="text-rose-500" />}
                      </div>
                      <p className={`text-[12px] ${isStuttered ? 'font-black' : 'font-medium'} truncate`}>{t.word}</p>
                    </div>
                  );
                })}
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
