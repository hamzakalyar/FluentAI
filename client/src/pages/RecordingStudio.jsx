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
import Breadcrumb from '../components/layout/Breadcrumb';
import WaveformCanvas from '../components/features/Recording/WaveformCanvas';
import { formatDuration } from '../utils/formatMetrics';
import api from '../services/api';

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

   const currentPassageText = activePassage ? activePassage.text : "Loading passage...";

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
      <div className="min-h-[calc(100vh-56px)] bg-[var(--bg-base)] px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10 flex flex-col transition-colors duration-300">
         {/* Hidden Audio for Playback */}
         <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={() => setIsPlaying(false)} className="hidden" />



         {/* ── MAIN 2-COLUMN WORKSPACE ── */}
         <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-8 flex-1 mt-0 min-h-0">



            {/* CENTER PANEL */}
            <div className="flex flex-col gap-4 min-h-0 h-full">
               {/* Page Header (Consistent with Analytics) */}
               <div className="mb-6">
                  <Breadcrumb />
                  <div className="flex flex-col gap-2 mt-2">
                     <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight font-syne">Recording Studio</h1>
                     <p className="text-[var(--text-secondary)] font-medium text-lg">Improve your speech fluency with real-time feedback.</p>
                  </div>
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
                         <div className="flex flex-col">
                            <span className="text-[13px] font-black text-[var(--text-primary)] uppercase tracking-tight">Active Practice</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                           onClick={async () => {
                              const res = await api.get(`/assessment-passages/dynamic`);
                              setActivePassage(res.data.passage || res.data);
                              setLiveTranscript('');
                           }}
                           className={`h-7 px-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${activePassage?.id === 'dynamic' ? 'bg-[var(--accent)] text-white shadow-md' : 'bg-[var(--bg-base)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'}`}
                           title="Generate a random passage"
                        >
                           <RotateCcw size={10} className={activePassage?.id === 'dynamic' ? 'animate-spin-once' : ''} /> Random
                        </button>
                        <div className="w-[1px] h-6 bg-[var(--border-subtle)] mx-0.5" />
                        <div className="flex items-center gap-1">
                           {!loadingPassages && passages?.slice(0, 3).map((p, idx) => (
                              <button
                                 key={p.id}
                                 onClick={async () => {
                                    const res = await api.get(`/assessment-passages/${p.id}`);
                                    setActivePassage(res.data.passage || res.data);
                                    setLiveTranscript('');
                                 }}
                                 className={`w-7 h-7 rounded-lg text-[10px] font-black transition-all ${activePassage?.id === p.id ? 'bg-[var(--accent)] text-white shadow-md' : 'bg-[var(--bg-base)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'}`}
                              >
                                 {idx + 1}
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="mb-2">
                     <div className="max-h-32 overflow-y-auto pr-4 custom-scrollbar py-1">
                        <p className="text-[16px] sm:text-[18px] font-medium text-[var(--text-primary)] leading-[1.5] font-serif selection:bg-[var(--accent)]/20">
                           {currentPassageText}
                        </p>
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
                     <div className="flex-1 flex flex-col items-center justify-center animate-pulse relative z-10">
                        <Mic size={32} className="text-slate-500 mb-3" />
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Awaiting Audio Access...</p>
                     </div>
                  )}

                  {status === 'idle' && (
                     <div className="flex-1 flex flex-col items-center justify-center animate-fade-in relative z-10">
                        <div className="flex items-center gap-16">
                           {/* Record Path */}
                           <div className="flex flex-col items-center gap-4 group/btn">
                              <button 
                                 onClick={startRecording} 
                                 className="relative w-20 h-20 rounded-full bg-teal-500 shadow-[0_0_30px_rgba(20,184,166,0.3)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all group-hover/btn:shadow-[0_0_40px_rgba(20,184,166,0.5)]"
                              >
                                 <Mic size={32} className="text-white" />
                                 <div className="absolute inset-0 rounded-full bg-teal-400 animate-ping opacity-20 pointer-events-none group-hover/btn:opacity-0" />
                              </button>
                              <span className="text-[12px] font-black text-slate-200 uppercase tracking-widest">Start Live</span>
                           </div>

                           <div className="h-16 w-[1px] bg-slate-800" />

                           {/* Upload Path */}
                           <div className="flex flex-col items-center gap-4 group/btn">
                              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="audio/*" className="hidden" />
                              <button 
                                 onClick={() => fileInputRef.current?.click()}
                                 className="relative w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-700 text-slate-400 flex items-center justify-center hover:scale-110 active:scale-95 transition-all hover:border-teal-500 hover:text-teal-500 group-hover/btn:bg-slate-700"
                              >
                                 <CloudUpload size={32} />
                              </button>
                              <span className="text-[12px] font-black text-slate-200 uppercase tracking-widest">Upload Device</span>
                           </div>
                        </div>
                        <p className="mt-8 text-[11px] text-slate-500 font-bold uppercase tracking-[0.2em]">Select input to begin</p>
                     </div>
                  )}

                  {(status === 'recording' || status === 'paused') && (
                     <div className="flex-1 flex flex-col items-center justify-center animate-fade-in relative z-10">
                        <div className="w-full h-12 mb-6 flex items-center justify-center">
                           <WaveformCanvas analyser={analyser} isRecording={status === 'recording'} color="#14b8a6" bars={60} />
                        </div>
                        <div className="flex justify-center gap-8 items-center">
                           <button onClick={status === 'recording' ? pauseRecording : resumeRecording} className="w-12 h-12 rounded-full border-2 border-amber-500/50 text-amber-500 flex items-center justify-center hover:bg-amber-500/10 transition-all">
                              {status === 'recording' ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
                           </button>
                           <button onClick={stopRecording} className="w-16 h-16 rounded-full bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] text-white flex items-center justify-center hover:scale-105 transition-all">
                              <Square size={24} fill="currentColor" />
                           </button>
                           <button className="w-12 h-12 rounded-full border-2 border-slate-700 text-slate-500 flex items-center justify-center opacity-50 cursor-not-allowed">
                              <RotateCcw size={20} />
                           </button>
                        </div>
                     </div>
                  )}

                  {status === 'reviewing' && (
                     <div className="flex-1 flex flex-col items-center justify-center animate-fade-in relative z-10">
                        <div className="w-full max-w-sm bg-slate-800/40 rounded-2xl p-4 mb-5 border border-slate-700/50 backdrop-blur-md flex flex-col gap-3 shadow-xl">
                           <div className="flex items-center gap-4">
                              <button onClick={togglePlayback} className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:scale-110 transition-all shrink-0">
                                 {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-1" fill="currentColor" />}
                              </button>
                              <div className="flex-1">
                                 <div className="flex justify-between items-center mb-1">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Master Playback</span>
                                    <span className="text-[10px] font-mono text-teal-400 font-bold">{formatDuration(duration)}</span>
                                 </div>
                                 <div className="h-1.5 w-full bg-slate-900/50 rounded-full relative overflow-hidden">
                                    <div 
                                       className="absolute left-0 top-0 h-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.4)] transition-all duration-100" 
                                       style={{ width: `${audioProgress}%` }} 
                                    />
                                 </div>
                              </div>
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

            {/* RIGHT PANEL (Balanced & Distributed) */}
            <div className="hidden lg:flex flex-col gap-6 h-full overflow-hidden">
               {/* Weekly Goal */}
               <div className="bg-[var(--bg-surface)] rounded-2xl p-3 border border-[var(--border-subtle)] shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                     <span className="text-[12px] font-black text-[var(--text-muted)] uppercase tracking-widest">Weekly Goal</span>
                     <span className="text-[13px] font-black text-[var(--accent)]">57%</span>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="relative inline-flex items-center justify-center shrink-0">
                        <svg className="w-16 h-16 -rotate-90">
                           <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-[var(--border-subtle)]" />
                           <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={175.9} strokeDashoffset={175.9 * (1 - 0.57)} className="text-[var(--accent)]" strokeLinecap="round" />
                        </svg>
                        <span className="absolute text-[16px] font-black text-[var(--text-primary)]">4/7</span>
                     </div>
                     <div className="flex-1">
                        <div className="w-full h-2 bg-[var(--bg-base)] rounded-full overflow-hidden mb-2">
                           <div className="h-full bg-[var(--accent)] rounded-full shadow-[0_0_8px_rgba(20,184,166,0.3)]" style={{ width: '57%' }} />
                        </div>
                        <p className="text-[12px] text-[var(--text-muted)] leading-tight font-medium">3 sessions left to reach target.</p>
                     </div>
                  </div>
               </div>

               {/* This Week Stats */}
               <div className="bg-[var(--bg-surface)] rounded-2xl p-5 border border-[var(--border-subtle)] shadow-sm">
                  <h3 className="text-[12px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-4">This Week</h3>
                  <div className="grid grid-cols-1 gap-1">
                     {[
                        { icon: Activity, label: 'Sessions', val: '4', color: 'text-teal-500' },
                        { icon: Zap, label: 'Avg WPM', val: '108', color: 'text-amber-500' },
                        { icon: Trophy, label: 'Best Score', val: '87%', color: 'text-indigo-500', valColor: 'text-teal-600' }
                     ].map((s, i) => (
                        <div key={i} className="flex items-center justify-between py-1.5 border-b border-[var(--bg-base)] last:border-0">
                           <div className="flex items-center gap-3">
                              <s.icon size={16} className={s.color} />
                              <span className="text-[13px] font-bold text-[var(--text-secondary)]">{s.label}</span>
                           </div>
                           <span className={`text-[14px] font-black ${s.valColor || 'text-[var(--text-primary)]'}`}>{s.val}</span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Last Session */}
               <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-4 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-teal-500/10 transition-colors" />
                  <div className="flex items-center justify-between">
                     <div>
                        <h3 className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 leading-none">Last Session</h3>
                        <p className="text-[14px] font-bold text-[var(--text-secondary)] leading-none">May 08 <span className="text-[12px] text-[var(--text-muted)] font-normal ml-2 italic">1m 32s</span></p>
                     </div>
                     <div className="bg-[var(--accent-glow)] text-[var(--accent)] px-3 py-1 rounded-lg text-[11px] font-black">GOOD</div>
                  </div>
               </div>

               {/* Preparation Tips */}
               <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-4 shadow-sm">
                  <h3 className="text-[12px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-3">Preparation</h3>
                  <div className="flex flex-col gap-3">
                     {[{ icon: Volume2, title: 'Natural Pace' }, { icon: ShieldCheck, title: 'No Noise' }].map((tip, idx) => (
                        <div key={idx} className="flex gap-3 items-center">
                           <div className="w-8 h-8 rounded-lg bg-[var(--bg-base)] flex items-center justify-center text-[var(--accent)]">
                              <tip.icon size={16} />
                           </div>
                           <span className="text-[14px] font-bold text-[var(--text-secondary)]">{tip.title}</span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Quote - Compact & Vibrant */}
               <div className="bg-teal-600 rounded-2xl p-4 relative overflow-hidden group shadow-md">
                  <Quote size={20} className="absolute -left-1 -top-1 text-white/10 -rotate-12" />
                  <p className="text-[15px] font-serif italic leading-tight text-white text-center relative z-10">
                     "Every practice session is a step forward."
                  </p>
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