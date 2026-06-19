import React, { useState, useEffect } from 'react';
import { 
  Play, Download, Share2, Clock, Calendar, Mic2,
  AlertCircle, ChevronLeft, Activity, Loader2,
  BarChart3, Volume2, Repeat, MessageSquare, Zap,
  Target, Brain, FileText, TrendingUp, ArrowRight,
  CheckCircle2, XCircle, Pause as PauseIcon, Printer
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import Badge from '../components/shared/Badge';
import Breadcrumb from '../components/layout/Breadcrumb';
import { motion } from 'framer-motion';
import { sessionsService } from '../services/sessionsService';
import api from '../services/api';

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
  const [passage, setPassage] = useState(null);
  const [activeTab, setActiveTab] = useState('transcript');
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = React.useRef(null);
  const wordBoundaryRef = React.useRef({ start: null, end: null });

  const MOCK_DEMO_SESSION_DETAIL = {
    id: 'mock-session-1',
    _id: 'mock-session-1',
    type: 'Evaluation',
    name: 'Vocal Prompt Evaluation',
    createdAt: new Date().toISOString(),
    audioUrl: '', 
    status: 'completed',
    metrics: {
      fluencyScore: 84,
      speechRate: 142,
      repetitions: 2,
      pauses: 1,
      fillers: 1,
      detectedStutters: 4
    },
    transcript: {
      words: [
        { word: 'When', start: 0, end: 0.3 },
        { word: 'the-the-the', start: 0.4, end: 1.5, stutter: 'repetition', label: 'Repetition' },
        { word: 'sunlight', start: 1.6, end: 2.2 },
        { word: 'strikes', start: 2.3, end: 2.8 },
        { word: 'raindrops', start: 2.9, end: 3.5 },
        { word: 'in', start: 3.6, end: 3.8 },
        { word: 'the', start: 3.9, end: 4.1 },
        { word: 'air,', start: 4.2, end: 4.6 },
        { word: 'they', start: 4.7, end: 4.9 },
        { word: 'act', start: 5.0, end: 5.2 },
        { word: 'as', start: 5.3, end: 5.5 },
        { word: 'a', start: 5.6, end: 5.7 },
        { word: '[block]', start: 5.8, end: 6.8, stutter: 'blockage', label: 'Speech Block' },
        { word: 'prism', start: 6.9, end: 7.4 },
        { word: 'and', start: 7.5, end: 7.7 },
        { word: 'form', start: 7.8, end: 8.1 },
        { word: 'a', start: 8.2, end: 8.3 },
        { word: 'raiiiiiinbow.', start: 8.4, end: 9.8, stutter: 'prolongation', label: 'Prolongation' }
      ]
    },
    analysis: {
      stutters: [
        { type: 'repetition', label: 'Repetition', start: 0.4, end: 1.5 },
        { type: 'blockage', label: 'Speech Block', start: 5.8, end: 6.8 },
        { type: 'prolongation', label: 'Prolongation', start: 8.4, end: 9.8 }
      ],
      comparison: {
        score: 92,
        unmatchedWords: ['prism']
      },
      nlp: {
        clarityRating: 'High',
        fillerRatio: '3.1%'
      },
      weakSounds: [
        { sound: '/p/', count: 2 },
        { sound: '/r/', count: 1 }
      ]
    },
    therapistFeedback: "Excellent easy-onset control. The block on 'prism' resolved quickly with light articulatory contact. Work on early breath initiation during vowel transitions."
  };

  useEffect(() => {
    const fetchSession = async () => {
      const isDemo = localStorage.getItem('is_demo_mode') === 'true' || id === 'mock-session-1';
      if (isDemo) {
        setSession(MOCK_DEMO_SESSION_DETAIL);
        setPassage({
          id: 'passage-1',
          title: 'Rainbow Passage (Plosives Focus)',
          text: 'When the sunlight strikes raindrops in the air, they act as a prism and form a rainbow.',
          targetSounds: ['/p/', '/b/', '/t/', '/d/']
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await sessionsService.getSessionById(id);
        const sessionData = response.data.session || response.data;
        setSession(sessionData);

        if (sessionData.passageId) {
          try {
            const passageResponse = await sessionsService.getPassageById(sessionData.passageId);
            setPassage(passageResponse.data.passage || passageResponse.data);
          } catch (pErr) {
            console.error('Error fetching passage details:', pErr);
          }
        }
      } catch (err) {
        console.error('Error fetching session:', err);
        setError('Failed to load session data.');
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handlePlay = () => setAudioPlaying(true);
    const handlePause = () => setAudioPlaying(false);
    
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [session, loading]);

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
  // IMPORTANT: session.metrics.detectedStutters is a NUMBER (count), not an array.
  // session.analysis.stutters is the actual array of stutter event objects.
  // Always prefer the array from analysis; fall back to empty array — never the numeric count.
  const stutters = Array.isArray(session.analysis?.stutters)
    ? session.analysis.stutters
    : Array.isArray(session.metrics?.detectedStutters)
    ? session.metrics.detectedStutters
    : [];
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

  const getAudioUrl = (relativeUrl) => {
    if (!relativeUrl) return '';
    if (relativeUrl.startsWith('http')) return relativeUrl;
    
    const cleanRelativeUrl = relativeUrl.startsWith('/') ? relativeUrl : `/${relativeUrl}`;
    
    try {
      const apiBase = api.defaults.baseURL || '';
      if (apiBase && apiBase.startsWith('http')) {
        const host = apiBase.replace(/\/api$/, '');
        return `${host}${cleanRelativeUrl}`;
      }
    } catch (e) {
      console.error("Error resolving audio host:", e);
    }
    
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    return `${protocol}//${hostname}:3001${cleanRelativeUrl}`;
  };

  const handleDownloadAudio = () => {
    if (!session?.audioUrl) return;
    const url = getAudioUrl(session.audioUrl);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `session-${session._id || 'audio'}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const playSimulatedSynth = (wordObj) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel();
      
      const word = wordObj.word || '';
      const stutter = wordObj.stutter || null;
      
      let speechText = word;
      if (stutter === 'repetition') {
        if (word.includes('-')) {
          speechText = word.split('-').join('. . ');
        } else {
          speechText = `${word}. . ${word}. . ${word}`;
        }
      } else if (stutter === 'blockage') {
        const firstChar = word.charAt(0);
        speechText = `${firstChar}. . . . ${word}`;
      } else if (stutter === 'prolongation') {
        const firstChar = word.charAt(0);
        speechText = `${firstChar}${firstChar}${firstChar}${firstChar}${word}`;
      }

      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.rate = stutter ? 0.6 : 0.85; // Slower clinical rate for stutter disfluency
      utterance.pitch = 1.05;
      
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech Synthesis failed", e);
    }
  };

  const handleWordClick = (start, end, wordObj) => {
    const isDemo = localStorage.getItem('is_demo_mode') === 'true' || id === 'mock-session-1';
    if (isDemo && wordObj) {
      playSimulatedSynth(wordObj);
      return;
    }

    if (!audioRef.current || start === undefined) return;
    
    // Track playback boundaries for isolating this word
    wordBoundaryRef.current = { start, end: end || null };
    
    try {
      if (audioRef.current.readyState === 0) {
        audioRef.current.load();
        const onLoaded = () => {
          audioRef.current.currentTime = start;
          audioRef.current.play().catch(e => console.error("Playback failed after load:", e));
          audioRef.current.removeEventListener('loadedmetadata', onLoaded);
        };
        audioRef.current.addEventListener('loadedmetadata', onLoaded);
        return;
      }
      
      audioRef.current.currentTime = start;
      audioRef.current.play().catch(e => console.error("Playback failed:", e));
    } catch (err) {
      console.error("Error setting currentTime or playing:", err);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && wordBoundaryRef.current.end !== null) {
      // Automatically pause as soon as we reach or exceed the word end timestamp
      if (audioRef.current.currentTime >= wordBoundaryRef.current.end) {
        audioRef.current.pause();
        wordBoundaryRef.current = { start: null, end: null };
      }
    }
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
             <>
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
               <Button 
                  variant="ghost" 
                  size="sm" 
                  className="border-[var(--border-subtle)] text-[var(--accent)] hover:bg-[var(--accent-glow)]"
                  onClick={handleDownloadAudio}
               >
                 <Download size={16} className="mr-2" /> Download Audio
               </Button>
             </>
          )}
           <Button 
            variant="ghost" 
            size="sm" 
            className="border-[var(--border-subtle)]"
            onClick={handleExport}
           >
            <Printer size={16} className="mr-2" /> Print Report
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
            <div className="p-5 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-[var(--accent)]" />
                <h3 className="font-bold text-[var(--text-primary)]">Speech & Script Analysis</h3>
              </div>
              {session.passageId && (
                <div className="flex gap-1.5 p-1 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-subtle)] w-fit self-start sm:self-auto shadow-sm">
                  <button
                    onClick={() => setActiveTab('transcript')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeTab === 'transcript'
                        ? 'bg-[var(--bg-surface)] text-[var(--accent)] shadow-sm ring-1 ring-[var(--border-subtle)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    Speech Transcript
                  </button>
                  <button
                    onClick={() => setActiveTab('script')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeTab === 'script'
                        ? 'bg-[var(--bg-surface)] text-[var(--accent)] shadow-sm ring-1 ring-[var(--border-subtle)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    Original Script
                  </button>
                </div>
              )}
            </div>
            
            <div className="p-0">
              {activeTab === 'transcript' ? (
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-6 bg-[var(--bg-elevated)]/30">
                  <div className="text-base text-[var(--text-primary)] leading-[2.2] font-medium whitespace-pre-wrap text-justify">
                    {(() => {
                      const whisperWords = session.transcript?.words || [];
                      // detectedStutters is a numeric count — use analysis.stutters (the array)
                      const stutterEvents = Array.isArray(session.analysis?.stutters)
                        ? session.analysis.stutters
                        : [];

                      if (whisperWords.length > 0) {
                        return whisperWords.map((token, i) => {
                          const matchedStutter = stutterEvents.find(s =>
                            s.position !== undefined &&
                            Math.abs(s.position - token.start) < 0.8
                          );
                          const stutterType = matchedStutter?.type;

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
                              : stutterType === 'missing'
                              ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-400 line-through'
                              : stutterType === 'replace'
                              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100 border-emerald-400'
                              : null;

                          const tooltip =
                            stutterType === 'sound_repetition' ? `Phoneme burst detected (e.g. p-p-${token.word?.toLowerCase()})`
                              : stutterType === 'repetition' ? `Word repetition: "${token.word}"`
                              : stutterType === 'block' ? `Speech block`
                              : stutterType === 'prolongation' ? `Prolongation`
                              : stutterType === 'filler' ? `Filler: "${token.word}"`
                              : stutterType === 'pause' ? `Abnormal pause`
                              : stutterType === 'missing' ? `Omitted word`
                              : stutterType === 'replace' ? `Replaced / mispronounced word`
                              : null;

                          return (
                            <span
                              key={i}
                              onClick={() => handleWordClick(token.start, token.end)}
                              className={`mx-0.5 cursor-pointer transition-all hover:underline select-none ${
                                colorClass
                                  ? `px-1.5 py-0.5 rounded-md border-b-2 font-bold hover:scale-105 inline-block ${colorClass}`
                                  : 'text-[var(--text-secondary)] hover:text-[var(--accent)] font-medium'
                              }`}
                              title={`${tooltip || 'Spoken word'} (Click to hear audio)`}
                            >
                              {token.word}
                            </span>
                          );
                        });
                      }

                      const transcriptText = typeof session.transcript === 'string'
                        ? session.transcript
                        : session.transcript?.text || '';

                      return (
                        <span className="text-[var(--text-secondary)] italic text-slate-400">
                          {transcriptText || 'No speech transcribed (silent/empty recording).'}
                        </span>
                      );
                    })()}
                  </div>
                </div>
              ) : (
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-6 bg-[var(--bg-elevated)]/30">
                  <div className="text-base text-[var(--text-primary)] leading-[2.2] font-medium whitespace-pre-wrap text-justify font-serif italic">
                    {(() => {
                      if (!passage?.text) {
                        return <p className="text-[var(--text-muted)] italic text-center py-4">Fetching script content...</p>;
                      }
                      
                      const words = passage.text.split(/(\s+)/);
                      const skippedList = comparison?.skippedWords || [];
                      const whisperWords = session.transcript?.words || [];

                      return words.map((part, idx) => {
                        if (/^\s+$/.test(part)) return part;
                        
                        const cleanWord = part.toLowerCase().replace(/[^\w']/g, '');
                        if (!cleanWord) return part;

                        const isSkipped = skippedList.some(s => s.word.toLowerCase().replace(/[^\w']/g, '') === cleanWord);

                        // Try to map back to Whisper timestamp
                        const matchedToken = whisperWords.find(w => w.word.toLowerCase().replace(/[^\w']/g, '') === cleanWord);

                        // Check for stutter on this matched word
                        let stutterType = null;
                        if (matchedToken) {
                          // detectedStutters is a numeric count — always use analysis.stutters array
                          const stutterEvents = Array.isArray(session.analysis?.stutters)
                            ? session.analysis.stutters
                            : [];
                          const matchedStutter = stutterEvents.find(s =>
                            s.position !== undefined &&
                            Math.abs(s.position - matchedToken.start) < 0.8
                          );
                          stutterType = matchedStutter?.type;
                        }

                        let targetSound = null;
                        if (passage.soundMap) {
                          for (const [sound, targetList] of Object.entries(passage.soundMap)) {
                            if (targetList.some(w => w.toLowerCase().replace(/[^\w']/g, '') === cleanWord)) {
                              targetSound = sound;
                              break;
                            }
                          }
                        }

                        let classes = "";
                        let tooltip = "";

                        if (isSkipped) {
                          classes = "bg-rose-50 dark:bg-rose-950/20 text-rose-500 dark:text-rose-400 line-through border-b-2 border-rose-300 font-bold px-1 py-0.5 rounded cursor-help";
                          tooltip = `Skipped: Target sound "${targetSound || ''}" word was not spoken (Omitted)`;
                        } else if (targetSound) {
                          if (stutterType) {
                            const stutterNames = {
                              sound_repetition: 'Phoneme Burst',
                              repetition: 'Word Repetition',
                              block: 'Speech Block',
                              prolongation: 'Prolongation',
                              filler: 'Filler Word',
                              pause: 'Abnormal Pause'
                            };
                            const stutterName = stutterNames[stutterType] || 'Stutter';
                            
                            classes = "border-b-2 border-amber-500 bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 font-bold px-1 py-0.5 rounded cursor-pointer transition-colors";
                            tooltip = `Target Phoneme: "${targetSound}" — Spoken with Dysfluency (${stutterName})`;
                          } else {
                            classes = `border-b-2 border-teal-500/50 text-[var(--text-primary)] font-bold hover:bg-teal-50 dark:hover:bg-teal-950/20 px-0.5 rounded transition-colors ${matchedToken ? 'cursor-pointer' : 'cursor-help'}`;
                            tooltip = `Target Phoneme: "${targetSound}" (Spoken Correctly)`;
                          }
                        } else if (stutterType) {
                          const stutterNames = {
                            sound_repetition: 'Phoneme Burst',
                            repetition: 'Word Repetition',
                            block: 'Speech Block',
                            prolongation: 'Prolongation',
                            filler: 'Filler Word',
                            pause: 'Abnormal Pause'
                          };
                          const stutterName = stutterNames[stutterType] || 'Stutter';
                          
                          classes = "border-b-2 border-orange-400/70 text-[var(--text-secondary)] px-0.5 rounded hover:bg-orange-50 dark:hover:bg-orange-950/10 cursor-pointer transition-colors";
                          tooltip = `Regular Word: Spoken with Dysfluency (${stutterName})`;
                        } else {
                          classes = `text-[var(--text-secondary)] transition-colors ${matchedToken ? 'cursor-pointer hover:text-[var(--accent)] hover:underline' : ''}`;
                          tooltip = "Spoken word";
                        }

                        return (
                          <span 
                            key={idx} 
                            onClick={matchedToken ? () => handleWordClick(matchedToken.start, matchedToken.end, matchedToken) : undefined}
                            className={classes} 
                            title={matchedToken ? `${tooltip} (Click to play word audio)` : tooltip}
                          >
                            {part}
                          </span>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}
              
              {/* Color Legends - Redesigned to render exact matching preview capsules */}
              <div className="px-6 py-4 border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)]/25">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider">
                    Diagnostic Color Legend
                  </span>
                  <span className="text-[9px] text-[var(--text-muted)] italic">
                    (Capsules match your transcript highlights. Click words in the transcript above to hear them)
                  </span>
                </div>
                
                {activeTab === 'transcript' ? (
                  <div className="flex flex-wrap gap-2">
                    {[
                      { className: 'bg-orange-100 dark:bg-orange-900/40 text-orange-900 dark:text-orange-100 border-orange-400 border-b-2', label: 'Phoneme Burst (p-p-p)' },
                      { className: 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100 border-amber-400 border-b-2', label: 'Word Repetition' },
                      { className: 'bg-red-100 dark:bg-red-900/40 text-red-900 dark:text-red-100 border-red-400 border-b-2', label: 'Block / Stutter' },
                      { className: 'bg-purple-100 dark:bg-purple-900/40 text-purple-900 dark:text-purple-100 border-purple-400 border-b-2', label: 'Prolongation' },
                      { className: 'bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100 border-blue-400 border-b-2', label: 'Filler / Pause' },
                      { className: 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-400 border-b-2 line-through', label: 'Missing Word' },
                      { className: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100 border-emerald-400 border-b-2', label: 'Replaced Word' },
                    ].map(({ className, label }) => (
                      <span key={label} className={`px-2 py-0.5 rounded text-[10px] font-bold select-none ${className}`}>
                        {label}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {[
                      { className: 'border-b-2 border-teal-500/50 text-[var(--text-primary)] font-bold bg-teal-50/50 dark:bg-teal-950/10', label: 'Target Phoneme (Correctly Spoken)' },
                      { className: 'bg-rose-50 dark:bg-rose-950/20 text-rose-500 dark:text-rose-400 line-through border-b-2 border-rose-300 font-bold', label: 'Omitted / Skipped Word (Block/Avoidance)' }
                    ].map(({ className, label }) => (
                      <span key={label} className={`px-2 py-0.5 rounded text-[10px] font-bold select-none ${className}`}>
                        {label}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {session.audioUrl && (
                <div className="px-6 py-4 border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)]/10 flex flex-col md:flex-row items-center justify-between gap-4">
                  <audio 
                    ref={audioRef}
                    id="session-audio" 
                    controls 
                    className="w-full md:flex-1 h-10 accent-[var(--accent)]"
                    src={getAudioUrl(session.audioUrl)}
                    onTimeUpdate={handleTimeUpdate}
                  >
                    Your browser does not support the audio element.
                  </audio>
                  <div className="flex gap-2 w-full md:w-auto shrink-0">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full md:w-auto border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-glow)] flex items-center justify-center"
                      onClick={handleDownloadAudio}
                    >
                      <Download size={14} className="mr-2" /> Download MP3
                    </Button>
                  </div>
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
            <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-subtle)] shadow-sm p-5 space-y-6">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Target size={16} className="text-teal-500" /> Clinical Passage Assessment
                </h3>
                {comparison.accuracy !== undefined && (
                  <span className="text-[10px] font-black bg-teal-500/10 text-teal-600 px-2 py-1 rounded-lg uppercase tracking-widest">
                    Score Calculated
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="text-center p-3 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-subtle)]">
                  <p className="text-2xl font-black text-teal-600">{comparison.accuracy || comparison.matchScore || 0}%</p>
                  <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider mt-1">Accuracy</p>
                </div>
                <div className="text-center p-3 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-subtle)]">
                  <p className="text-2xl font-black text-rose-500">{comparison.skippedWords?.length || 0}</p>
                  <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider mt-1">Skipped Words</p>
                </div>
                <div className="text-center p-3 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-subtle)]">
                  <p className="text-2xl font-black text-[var(--text-primary)]">{comparison.expectedWordCount || 0}</p>
                  <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider mt-1">Expected Words</p>
                </div>
                <div className="text-center p-3 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-subtle)]">
                  <p className="text-2xl font-black text-[var(--text-primary)]">{comparison.actualWordCount || 0}</p>
                  <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider mt-1">Spoken Words</p>
                </div>
              </div>

              {comparison.soundsTestedResults && Object.keys(comparison.soundsTestedResults).length > 0 && (
                <div className="space-y-4 pt-3 border-t border-[var(--border-subtle)]">
                  <div>
                    <h4 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
                      Target Phoneme Accuracy Breakdown
                    </h4>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1 font-medium">
                      Performance on specific clinical speech sounds targeted by this passage.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(comparison.soundsTestedResults).map(([sound, stats]) => {
                      const soundColor = stats.accuracy >= 80 ? 'bg-teal-500' : stats.accuracy >= 50 ? 'bg-amber-500' : 'bg-rose-500';
                      return (
                        <div key={sound} className="p-3 bg-[var(--bg-elevated)]/40 rounded-2xl border border-[var(--border-subtle)] flex flex-col gap-2 transition-all hover:bg-[var(--bg-elevated)]/70">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-teal-500/10 flex items-center justify-center text-[9px] font-black text-teal-600 border border-teal-200">
                                {sound[0]}
                              </span>
                              <span className="text-sm font-black text-[var(--text-primary)]">Sound "{sound}"</span>
                            </div>
                            <span className="text-xs font-mono font-bold text-[var(--text-primary)]">{stats.accuracy}%</span>
                          </div>
                          
                          <div className="h-1.5 w-full bg-[var(--border-subtle)] rounded-full overflow-hidden">
                            <div className={`h-full ${soundColor} rounded-full transition-all duration-500`} style={{ width: `${stats.accuracy}%` }} />
                          </div>
                          
                          <div className="flex justify-between items-center text-[10px] text-[var(--text-muted)] font-bold">
                            <span>Pronounced: {stats.spokenCorrectly} / {stats.totalWords}</span>
                            {stats.skipped > 0 && (
                              <span className="text-rose-500 font-bold">{stats.skipped} skipped</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
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
