import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
   Mic, Square, Pause, Play, RotateCcw,
   Waves, Ruler, Sparkles, Trash2,
   ChevronRight, Share2, Save, MoreHorizontal,
   ArrowRight, CheckCircle2, Loader2, X,
   Volume2, ShieldCheck, Zap, FileText,
   Calendar, Target, Activity, Trophy,
   Star, MessageSquare, Headphones, Upload, CloudUpload,
   Clock, FileType, Check, VolumeX
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRecording } from '../hooks/useRecording';
import WaveformCanvas from '../components/features/Recording/WaveformCanvas';
import { formatDuration } from '../utils/formatMetrics';

const RecordingStudio = () => {
   const navigate = useNavigate();
   const [showReRecordModal, setShowReRecordModal] = useState(false);
   const [currentStep, setCurrentStep] = useState(0);
   const [activePassage, setActivePassage] = useState(1);
   const [difficulty, setDifficulty] = useState('Medium');

   const {
      status,
      duration,
      audioBlob,
      analyser,
      startRecording,
      stopRecording,
      pauseRecording,
      resumeRecording,
      startAnalysis,
      resetRecording,
   } = useRecording();

   // ── Audio Player State ──
   const audioRef = useRef(null);
   const [isPlaying, setIsPlaying] = useState(false);
   const [volume, setVolume] = useState(1);
   const [audioProgress, setAudioProgress] = useState(0);
   const [isTestingMic, setIsTestingMic] = useState(false);

   // Sync real audio blob to player
   useEffect(() => {
      if (audioBlob && audioRef.current) {
         const url = URL.createObjectURL(audioBlob);
         audioRef.current.src = url;
         return () => URL.revokeObjectURL(url);
      }
   }, [audioBlob]);

   const togglePlayback = () => {
      if (!audioRef.current) {
         setIsPlaying(!isPlaying);
         return;
      }
      if (isPlaying) {
         audioRef.current.pause();
      } else {
         audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
   };

   const handleVolumeChange = (e) => {
      const val = parseFloat(e.target.value);
      setVolume(val);
      if (audioRef.current) audioRef.current.volume = val;
   };

   const handleTimeUpdate = () => {
      if (audioRef.current) {
         const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
         setAudioProgress(progress);
      }
   };

   const testMic = () => {
      setIsTestingMic(true);
      startRecording();
      setTimeout(() => {
         stopRecording();
         resetRecording();
         setIsTestingMic(false);
      }, 3000);
   };

   // ── Step Indicator Logic ──
   const steps = [
      { label: 'READY', status: 'idle' },
      { label: 'RECORDING', status: ['recording', 'paused'] },
      { label: 'REVIEW', status: 'reviewing' },
      { label: 'ANALYSIS', status: 'processing' }
   ];

   const getActiveStep = () => {
      if (status === 'idle' || status === 'permissions') return 0;
      if (status === 'recording' || status === 'paused') return 1;
      if (status === 'reviewing') return 2;
      if (status === 'processing') return 3;
      return 0;
   };

   const activeStep = getActiveStep();

   const allPassages = {
      Easy: {
         1: "The cat sat on the mat. The sun is hot today. I like to read books. Let's go for a walk in the park.",
         2: "The sky is blue. The birds sing in the trees. We can play with a ball. It is time to eat lunch.",
         3: "A small dog ran fast. He was very happy. The green grass is soft. I saw a red apple on the table."
      },
      Medium: {
         1: "The sun sets slowly over the horizon, painting the sky in shades of amber and violet. It is a peaceful end to a long day.",
         2: "The rapid development of artificial intelligence is transforming how we interact with technology in our daily lives.",
         3: "In a quiet corner of the library, the old clock chimed softly. Books of ancient lore lined the shelves, telling stories of old."
      },
      Hard: {
         1: "Philosophical inquiries into the nature of consciousness often encounter the 'hard problem', necessitating a multidisciplinary approach.",
         2: "Macroeconomic fluctuations in emerging markets are frequently exacerbated by geopolitical instability and the subsequent volatility.",
         3: "The structural integrity of the architectural marvel was compromised by unprecedented seismic activity, requiring immediate fortification."
      }
   };

   const currentPassageText = allPassages[difficulty][activePassage];

   // ── Processing Step Simulation ──
   useEffect(() => {
      if (status === 'processing') {
         const timer = setInterval(() => {
            setCurrentStep(prev => (prev < 4 ? prev + 1 : prev));
         }, 1500);
         return () => clearInterval(timer);
      } else {
         setCurrentStep(0);
      }
   }, [status]);

   return (
      <div className="min-h-[calc(100vh-56px)] lg:h-[calc(100vh-56px)] bg-[var(--bg-base)] px-4 sm:px-8 pt-2 pb-3 animate-fade-in overflow-y-auto lg:overflow-hidden flex flex-col">
         {/* Hidden Audio for Playback */}
         <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={() => setIsPlaying(false)} className="hidden" />

         {/* ── HEADER ── */}
         <div className="flex flex-col lg:flex-row justify-between items-center gap-6 shrink-0 py-2">
            <div className="flex flex-col">
               <nav className="hidden sm:flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest cursor-pointer hover:text-[var(--accent)]" onClick={() => navigate('/dashboard')}>Dashboard</span>
                  <ChevronRight size={10} className="text-[var(--text-muted)]" />
                  <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-60">Recording Studio</span>
               </nav>
               <h1 className="font-syne text-[22px] font-bold text-[var(--text-primary)] tracking-tight">Recording Session</h1>
            </div>

            {/* Step Indicator (Refined Size) */}
            <div className="hidden lg:flex flex-1 max-w-md items-center justify-center gap-7 relative px-8">
               <div className="absolute top-1/2 left-10 right-10 h-[1px] bg-[var(--border-subtle)] -z-10 -translate-y-1/2" />
               {steps.map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center justify-center gap-1.5 bg-[var(--bg-base)] px-2">
                     <div className={`w-3 h-3 rounded-full border-2 transition-all duration-500 ${activeStep === idx ? 'bg-[var(--accent)] border-[var(--accent)] ring-4 ring-teal-50/10' :
                        activeStep > idx ? 'bg-[var(--accent)] border-[var(--accent)]' : 'bg-[var(--bg-surface)] border-[var(--border-subtle)]'
                        }`} />
                     <span className={`text-[9px] font-black tracking-widest transition-all uppercase ${activeStep === idx ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
                        }`}>
                        {step.label}
                     </span>
                  </div>
               ))}
            </div>

            <div className="flex bg-[var(--bg-elevated)] p-1 rounded-xl border border-[var(--border-subtle)] shadow-sm">
               {['Easy', 'Medium', 'Hard'].map((lvl) => (
                  <button key={lvl} onClick={() => setDifficulty(lvl)} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${difficulty === lvl ? 'bg-[var(--accent)] text-white shadow-md' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>{lvl}</button>
               ))}
            </div>
         </div>

         {/* ── MAIN 3-COLUMN WORKSPACE ── */}
         <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_280px] xl:grid-cols-[280px_1fr_320px] gap-6 flex-1 mt-4 min-h-0">

            {/* LEFT PANEL */}
            <div className="hidden lg:flex flex-col gap-4 overflow-hidden h-full">
               <div className="bg-[var(--bg-surface)] rounded-2xl p-4 border border-[var(--border-subtle)] shadow-sm">
                  <h3 className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-3">This Week</h3>
                  <div className="space-y-4">
                     {[
                        { icon: Activity, label: 'Sessions', val: '4', color: 'text-teal-500' },
                        { icon: Zap, label: 'Avg WPM', val: '108', color: 'text-amber-500' },
                        { icon: Trophy, label: 'Best Score', val: '87%', color: 'text-indigo-500', valColor: 'text-teal-600' }
                     ].map((s, i) => (
                        <div key={i} className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <s.icon size={18} className={s.color} />
                              <span className="text-[13px] font-bold text-[var(--text-secondary)]">{s.label}</span>
                           </div>
                           <span className={`text-[15px] font-black ${s.valColor || 'text-[var(--text-primary)]'}`}>{s.val}</span>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="bg-[var(--bg-surface)] rounded-2xl p-4 border border-[var(--border-subtle)] shadow-sm">
                  <h3 className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Practice Goal</h3>
                  <div className="flex items-center justify-between mb-2">
                     <span className="text-[13px] font-bold text-[var(--text-primary)]">4 / 7 sessions</span>
                  </div>
                  <div className="w-full h-2 bg-[var(--bg-base)] rounded-full overflow-hidden">
                     <div className="h-full bg-[var(--accent)] rounded-full" style={{ width: '57%' }} />
                       <div className="bg-[var(--bg-surface)] rounded-2xl p-4 border border-[var(--border-subtle)] shadow-sm text-center flex-1 flex flex-col items-center justify-center max-h-[120px]">
                  <h3 className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Weekly Ring</h3>
                  <div className="relative inline-flex flex-col items-center">
                     <svg className="w-16 h-16 -rotate-90">
                        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="5" fill="transparent" className="text-[var(--bg-base)]" />
                        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="5" fill="transparent" strokeDasharray={175.9} strokeDashoffset={175.9 * (1 - 0.57)} className="text-[var(--accent)]" strokeLinecap="round" />
                     </svg>
                     <span className="absolute top-[22px] text-[18px] font-black text-[var(--text-primary)] tracking-tighter">4/7</span>
                  </div>
               </div>
           </div>
               </div>
            </div>

            {/* CENTER PANEL */}
            <div className="flex flex-col gap-5 min-h-0 h-full">
               {/* Practice Passage (Larger & More Prominent) */}
               <div className="bg-[var(--bg-surface)] rounded-2xl p-5 border border-[var(--border-subtle)] shadow-md relative shrink-0">
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-3 text-[var(--text-muted)]">
                        <FileText size={18} className="text-[var(--accent)]" />
                        <span className="text-[12px] font-black uppercase tracking-widest">Practice Passage</span>
                     </div>
                     <div className="flex gap-6">
                        {[1, 2, 3].map(n => (
                           <button key={n} onClick={() => setActivePassage(n)} className={`text-[12px] font-black uppercase tracking-widest pb-1 transition-all ${activeStep === 0 ? 'hover:text-[var(--text-secondary)]' : ''} ${activePassage === n ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text-muted)]'}`}>P{n}</button>
                        ))}
                     </div>
                  </div>
                  <div className="max-h-36 overflow-y-auto pr-2 custom-scrollbar py-2">
                     <p className="text-[20px] sm:text-[22px] font-medium text-[var(--text-secondary)] leading-relaxed font-serif italic text-center px-6">"{currentPassageText}"</p>
                  </div>
               </div>

               {/* MAIN CARD / VISUALIZATION (Fixed size, moves down to fill space) */}
               <div className="bg-[var(--bg-surface)] rounded-[32px] shadow-xl p-6 sm:p-8 border border-[var(--border-subtle)] h-[320px] flex flex-col relative overflow-hidden shrink-0">
                  <div className="flex justify-between items-center px-1 mb-2">
                     <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">VISUALIZER</span>
                     <span className="text-[12px] font-mono text-[var(--text-muted)] font-bold">{status === 'recording' ? formatDuration(duration) : '0:00'}</span>
                  </div>

                  {status === 'permissions' && (
                     <div className="flex-1 flex flex-col items-center justify-center animate-pulse">
                        <Mic size={24} className="text-[var(--text-muted)] mb-2" />
                        <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Waiting for Mic...</p>
                     </div>
                  )}

                  {status === 'idle' && (
                     <div className="flex-1 flex flex-col items-center justify-center animate-fade-in py-1">
                        <div className="w-full h-10 flex items-center justify-center gap-1 mb-2 opacity-20">
                           {[...Array(40)].map((_, i) => (
                              <div key={i} className="w-1.5 bg-[var(--text-muted)] opacity-20 rounded-full" style={{ height: `${10 + Math.random() * 20}px` }} />
                           ))}
                        </div>
                        <div className="flex flex-col items-center">
                           <button onClick={startRecording} className="relative w-14 h-14 rounded-full bg-[var(--accent)] shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
                              <Mic size={24} className="text-white" />
                           </button>
                           <p className="mt-2 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Tap to Start</p>
                           <button onClick={testMic} className="mt-1 text-[10px] text-teal-500 font-bold hover:underline">Test mic first →</button>
                        </div>
                     </div>
                  )}

                  {(status === 'recording' || status === 'paused') && (
                     <div className="flex-1 flex flex-col items-center justify-center animate-fade-in">
                        <div className="text-center mb-4">
                           <h2 className={`font-mono text-[40px] font-bold ${isTestingMic ? 'text-teal-600' : 'text-red-600'} tracking-wider leading-none`}>
                              {formatDuration(duration)}
                           </h2>
                        </div>
                        <div className="w-full h-16 mb-6 bg-[var(--bg-base)] rounded-xl flex items-center justify-center border border-[var(--border-subtle)]">
                           <WaveformCanvas analyser={analyser} isRecording={status === 'recording'} color="var(--accent)" bars={50} />
                        </div>
                        <div className="flex justify-center gap-6">
                           <button onClick={status === 'recording' ? pauseRecording : resumeRecording} className="w-10 h-10 rounded-full border border-amber-400 text-amber-500 flex items-center justify-center hover:bg-amber-400/10 transition-all">{status === 'recording' ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}</button>
                           <button onClick={stopRecording} className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-all shadow-sm"><Square size={18} fill="currentColor" /></button>
                        </div>
                     </div>
                  )}

                  {status === 'reviewing' && (
                     <div className="flex-1 flex flex-col items-center justify-center animate-fade-in py-1">
                        <div className="bg-[var(--accent-glow)] text-teal-600 px-3 py-1 rounded-full text-[10px] font-bold mb-3">RECORDING READY</div>
                        <div className="w-full max-w-sm bg-[var(--bg-base)] rounded-2xl p-4 mb-4 border border-[var(--border-subtle)] flex flex-col gap-3 shadow-sm">
                           <div className="flex items-center gap-3">
                              <button onClick={togglePlayback} className="w-9 h-9 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-md hover:scale-105 transition-all shrink-0">
                                 {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} className="ml-0.5" fill="currentColor" />}
                              </button>
                              <div className="h-1 flex-1 bg-[var(--border-subtle)] rounded-full relative overflow-hidden">
                                 <div className="absolute left-0 top-0 h-full bg-[var(--accent)] transition-all duration-100" style={{ width: `${audioProgress}%` }} />
                              </div>
                              <span className="text-[10px] font-mono text-[var(--text-muted)]">{formatDuration(duration)}</span>
                           </div>
                        </div>
                        <div className="flex flex-col gap-2 w-full max-w-xs">
                           <button onClick={startAnalysis} className="h-10 bg-[var(--accent)] text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2 justify-center shadow-lg">Start Analysis <ArrowRight size={16} /></button>
                           <button onClick={() => setShowReRecordModal(true)} className="h-9 border border-red-500/20 text-red-500 rounded-xl font-bold text-[10px] hover:bg-red-500/10 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                              <RotateCcw size={14} /> Re-record
                           </button>
                        </div>
                     </div>
                  )}

                  {status === 'processing' && (
                     <div className="flex-1 flex flex-col items-center justify-center animate-fade-in py-2">
                        <Loader2 size={32} className="text-[var(--accent)] animate-spin mb-4" />
                        <h3 className="text-[11px] font-bold text-[var(--text-primary)] mb-4 uppercase tracking-[0.2em]">{currentStep === 4 ? 'Complete!' : 'Processing...'}</h3>
                        {currentStep === 4 && (
                           <button onClick={() => navigate('/analytics')} className="mt-2 h-10 bg-[var(--accent)] text-white px-6 rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2 shadow-lg">View Results <ArrowRight size={16} /></button>
                        )}
                     </div>
                  )}
               </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="hidden lg:flex flex-col gap-3 overflow-hidden h-full">
               <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-4 shadow-sm">
                  <h3 className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-3">Preparation</h3>
                  <div className="space-y-4">
                     {[{ icon: Volume2, title: 'Natural Pace', desc: 'Maintain steady speed.' }, { icon: ShieldCheck, title: 'No Noise', desc: 'Find a quiet room.' }].map((tip, idx) => (
                        <div key={idx} className="flex gap-4 items-center">
                           <div className="w-10 h-10 rounded-xl bg-[var(--accent-glow)] flex items-center justify-center text-[var(--accent)] shrink-0"><tip.icon size={18} /></div>
                           <div><p className="text-[12px] font-bold text-[var(--text-secondary)] leading-tight">{tip.title}</p><p className="text-[10px] text-[var(--text-muted)] leading-tight">{tip.desc}</p></div>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-0">
                     <span className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-widest">Mic Status</span>
                     <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /><span className="text-[12px] font-black text-green-600 uppercase tracking-wider">Active</span></div>
                  </div>
               </div>

               <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-4 shadow-sm">
                  <h3 className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Last Session</h3>
                  <div className="flex items-center justify-between">
                     <div className="flex flex-col"><span className="text-[13px] font-bold text-[var(--text-secondary)] leading-tight">May 08</span><span className="text-[11px] text-[var(--text-muted)] italic">1m 32s</span></div>
                     <div className="bg-[var(--accent-glow)] text-[var(--accent)] px-3 py-1 rounded-lg text-[10px] font-black">GOOD</div>
                  </div>
               </div>

               <div className="bg-teal-600 rounded-2xl p-4 text-white shadow-md relative overflow-hidden group flex-1 flex items-center justify-center max-h-[120px]">
                  <Sparkles size={24} className="absolute -right-1 -bottom-1 text-white/10 group-hover:scale-110 transition-all" />
                  <p className="text-[16px] font-serif italic leading-tight relative z-10 text-center px-2">"Every practice session is a step forward."</p>
               </div>
            </div>
         </div>

         {/* MODAL */}
         {showReRecordModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
               <div className="bg-[var(--bg-surface)] rounded-3xl p-5 max-w-xs w-full text-center shadow-2xl">
                  <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mx-auto mb-3"><Trash2 size={20} /></div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Delete Recording?</h3>
                  <div className="flex flex-col gap-2 mt-4">
                     <button onClick={() => { resetRecording(); setShowReRecordModal(false); }} className="w-full py-2.5 rounded-xl bg-red-500 text-white font-bold text-[11px]">Delete & Redo</button>
                     <button onClick={() => setShowReRecordModal(false)} className="w-full py-2.5 rounded-xl bg-[var(--bg-elevated)] text-[var(--text-muted)] font-bold text-[11px]">Cancel</button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default RecordingStudio;
