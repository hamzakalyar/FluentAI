import React, { useState, useEffect, useRef } from 'react';
import {
   Mic, Square, Pause, Play, RotateCcw,
   Waves, Ruler, Sparkles, Trash2,
   ChevronRight, Share2, Save, MoreHorizontal,
   ArrowRight, CheckCircle2, Loader2, X,
   Volume2, ShieldCheck, Zap, FileText,
   Calendar, Target, Activity, Trophy,
   Star, MessageSquare, Headphones, Upload, CloudUpload,
   Clock, FileType, Check, VolumeX, Info, Quote
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRecording } from '../hooks/useRecording';
import Breadcrumb from '../components/layout/Breadcrumb';
import WaveformCanvas from '../components/features/Recording/WaveformCanvas';
import { formatDuration } from '../utils/formatMetrics';
import { sessionsService } from '../services/sessionsService';
import { analyticsService } from '../services/analyticsService';

const RecordingStudio = () => {
   const navigate = useNavigate();
   const [showReRecordModal, setShowReRecordModal] = useState(false);
   const [currentStep, setCurrentStep] = useState(0);
   const [passages, setPassages] = useState([]);
   const [activePassageIndex, setActivePassageIndex] = useState(0);
   const [isFreeRecord, setIsFreeRecord] = useState(false);
   const [weeklyStats, setWeeklyStats] = useState(null);
   const [lastSession, setLastSession] = useState(null);

   const {
      status,
      duration,
      audioBlob,
      analyser,
      sessionId,
      analysisResults,
      analysisError,
      startRecording,
      stopRecording,
      pauseRecording,
      resumeRecording,
      startAnalysis,
      resetRecording,
   } = useRecording();

   const audioRef = useRef(null);
   const [isPlaying, setIsPlaying] = useState(false);
   const [volume, setVolume] = useState(1);
   const [audioProgress, setAudioProgress] = useState(0);

   useEffect(() => {
      if (audioBlob && audioRef.current) {
         const url = URL.createObjectURL(audioBlob);
         audioRef.current.src = url;
         return () => URL.revokeObjectURL(url);
      }
   }, [audioBlob]);

   const togglePlayback = () => {
      if (!audioRef.current) return;
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
   };

   const handleTimeUpdate = () => {
      if (audioRef.current) {
         const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
         setAudioProgress(progress);
      }
   };

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

   useEffect(() => {
      const loadSidebarData = async () => {
         try {
            const [passagesRes, statsRes, lastSessionRes] = await Promise.all([
               sessionsService.getPassages(),
               analyticsService.getSummary(),
               sessionsService.getSessions({ limit: 1 })
            ]);
            
            setPassages(passagesRes.data?.passages || passagesRes.data || []);
            setWeeklyStats(statsRes.data);
            if (lastSessionRes.data.sessions?.length > 0) {
               setLastSession(lastSessionRes.data.sessions[0]);
            }
         } catch (e) {
            console.error("Failed to fetch sidebar data", e);
         }
      };
      loadSidebarData();
   }, []);

   const activePassage = passages[activePassageIndex] || null;
   const currentPassageText = activePassage ? activePassage.text : "Select a passage to begin your practice.";

   return (
      <div className="h-[calc(100vh-64px)] bg-[var(--bg-base)] px-2 lg:px-4 py-2 animate-fade-in overflow-hidden flex flex-col min-w-0">
         <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={() => setIsPlaying(false)} className="hidden" />

         <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px] gap-4 flex-1 min-h-0 min-w-0">
            <div className="flex flex-col gap-2 min-h-0 h-full">
               <div className="flex justify-between items-start pt-0.5 pb-0.5">
                  <div className="flex flex-col gap-0.5 shrink-0">
                     <nav className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold text-slate-400 hover:text-teal-600 cursor-pointer transition-colors" onClick={() => navigate('/dashboard')}>Home</span>
                        <ChevronRight size={10} className="text-slate-300" />
                        <span className="text-[10px] font-bold text-teal-600">Recording</span>
                     </nav>
                     <h1 className="font-syne text-[24px] font-bold text-slate-900 tracking-tight leading-none">Recording Studio</h1>
                  </div>
                  
                  <div className="hidden sm:flex bg-white p-1 rounded-xl border border-[var(--border-subtle)] shadow-sm">
                     <button onClick={() => setIsFreeRecord(false)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!isFreeRecord ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Daily Routine</button>
                     <button onClick={() => setIsFreeRecord(true)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${isFreeRecord ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Free Record</button>
                  </div>
               </div>

               <div className="flex w-full max-w-lg mx-auto items-center justify-center gap-8 relative mb-1">
                  <div className="absolute top-[8px] left-8 right-8 h-[1.5px] bg-slate-100 -z-10" />
                  {steps.map((step, idx) => (
                     <div key={idx} className="flex flex-col items-center justify-center gap-1.5 bg-[var(--bg-base)] px-2 z-10">
                        <div className={`w-3.5 h-3.5 rounded-full border-4 transition-all duration-500 ${
                           activeStep === idx ? 'bg-teal-500 border-teal-500 ring-4 ring-teal-500/20' :
                           activeStep > idx ? 'bg-teal-500 border-teal-500' : 'bg-white border-slate-200'
                        }`} />
                        <span className={`text-[8px] font-black tracking-widest transition-all uppercase ${
                           activeStep === idx ? 'text-teal-600' : 'text-slate-400'
                        }`}>
                           {step.label}
                        </span>
                     </div>
                  ))}
               </div>

               {isFreeRecord ? (
                  /* FREE RECORD MODE — no script, no passage, just record freely */
                  <div className="bg-white rounded-[24px] p-4 shadow-sm border border-[var(--border-subtle)] relative flex-1 flex flex-col min-h-0 items-center justify-center">
                     <div className="flex flex-col items-center gap-3 text-center px-8">
                        <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-500">
                           <Mic size={22} />
                        </div>
                        <p className="text-[15px] font-semibold text-slate-600 leading-relaxed">
                           Speak freely — talk about anything you like.
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium">
                           Your fluency, speech rate, and stutters will be analyzed without comparing to any script.
                        </p>
                     </div>
                  </div>
               ) : (
                  /* DAILY ROUTINE MODE — passage reading with script */
                  <div className="bg-white rounded-[24px] p-4 shadow-sm border border-[var(--border-subtle)] relative flex-1 flex flex-col min-h-0">
                     <div className="flex items-center justify-between mb-1.5 border-b border-[var(--border-subtle)] pb-1.5">
                        <div className="flex items-center gap-2">
                           <div className="w-5 h-5 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                              <Target size={10} />
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">ACTIVE PRACTICE</span>
                        </div>
                        <select 
                           value={activePassageIndex} 
                           onChange={(e) => setActivePassageIndex(Number(e.target.value))}
                           disabled={activeStep !== 0}
                           className="bg-[var(--bg-elevated)] text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border border-[var(--border-subtle)] outline-none cursor-pointer max-w-[120px] truncate"
                        >
                           {passages.map((p, idx) => (
                              <option key={p.id} value={idx}>{p.title || `P${idx + 1}`}</option>
                           ))}
                        </select>
                     </div>
                     <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar py-6 px-8">
                        <p className="text-[16px] sm:text-[18px] font-medium text-[var(--text-secondary)] leading-relaxed font-serif italic text-center">"{currentPassageText}"</p>
                     </div>
                  </div>
               )}

               <div className="bg-[#0B1120] rounded-[24px] shadow-2xl p-4 flex-1 flex flex-col relative overflow-hidden min-h-0 text-white">
                  <div className="flex justify-between items-center px-1 mb-0.5 shrink-0">
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">STUDIO CONSOLE</span>
                     </div>
                     <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded-full text-slate-300 font-bold">{status === 'recording' ? formatDuration(duration) : '0:00'}</span>
                  </div>

                  {status === 'idle' && (
                     <div className="flex-1 flex flex-col items-center justify-center animate-fade-in relative">
                        <div className="relative z-10 flex items-center justify-center gap-12 w-full">
                           <div className="flex flex-col items-center gap-3">
                              <button onClick={startRecording} className="group relative w-16 h-16 rounded-full bg-[#0D9488] shadow-[0_0_30px_rgba(13,148,136,0.3)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300">
                                 <Mic size={24} className="text-white" />
                              </button>
                              <span className="text-[10px] font-black text-white uppercase tracking-widest">START LIVE</span>
                           </div>
                           <div className="flex flex-col items-center gap-3 opacity-70">
                              <button className="group relative w-16 h-16 rounded-full bg-[#1E293B] border border-slate-700 flex items-center justify-center">
                                 <CloudUpload size={22} className="text-slate-300" />
                              </button>
                              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">UPLOAD DEVICE</span>
                           </div>
                        </div>
                     </div>
                  )}

                  {(status === 'recording' || status === 'paused') && (
                     <div className="flex-1 flex flex-col items-center justify-center animate-fade-in min-h-0 py-1">
                        <div className="text-center mb-2 shrink-0">
                           <h2 className="font-mono text-[36px] font-bold text-red-400 tracking-wider leading-none">{formatDuration(duration)}</h2>
                        </div>
                        <div className="w-full h-10 mb-3 bg-[#1E293B] rounded-xl flex items-center justify-center border border-slate-700 px-6 shrink-0">
                           <WaveformCanvas analyser={analyser} isRecording={status === 'recording'} color="#2DD4BF" bars={36} />
                        </div>
                        <div className="flex justify-center gap-3 w-full px-6 shrink-0">
                           <button onClick={status === 'recording' ? pauseRecording : resumeRecording} className="flex-1 max-w-[120px] h-10 rounded-xl border-2 border-amber-500 text-amber-500 flex items-center justify-center gap-2 font-bold text-[12px]">
                              {status === 'recording' ? <><Pause size={16} /> PAUSE</> : <><Play size={16} fill="currentColor" /> RESUME</>}
                           </button>
                           <button onClick={stopRecording} className="flex-1 max-w-[120px] h-10 rounded-xl bg-red-500 text-white flex items-center justify-center gap-2 font-bold text-[12px]">
                              <Square size={14} fill="currentColor" /> FINISH
                           </button>
                        </div>
                     </div>
                  )}

                  {status === 'reviewing' && (
                     <div className="flex-1 flex flex-col items-center justify-center animate-fade-in py-1 min-h-0">
                        <div className="w-full max-w-sm bg-[#1E293B] rounded-2xl p-3 mb-3 border border-slate-700 flex flex-col gap-2 shrink-0">
                           <div className="flex items-center gap-2">
                              <button onClick={togglePlayback} className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center shrink-0">
                                 {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                              </button>
                              <div className="h-1 flex-1 bg-slate-700 rounded-full relative overflow-hidden">
                                 <div className="absolute left-0 top-0 h-full bg-teal-500" style={{ width: `${audioProgress}%` }} />
                              </div>
                              <span className="text-[10px] font-mono text-slate-400">{formatDuration(duration)}</span>
                           </div>
                        </div>
                        <div className="flex flex-col gap-2 w-full max-w-[240px] shrink-0">
                           {/* Free Record: no passageId, no expectedText → pure fluency analysis, no script comparison */}
                           <button onClick={() => startAnalysis(isFreeRecord ? null : activePassage?.id, isFreeRecord ? null : activePassage?.text)} className="h-10 bg-teal-500 text-white rounded-xl font-bold text-[12px] flex items-center gap-2 justify-center shadow-lg">START ANALYSIS <ArrowRight size={16} /></button>
                           <button onClick={() => setShowReRecordModal(true)} className="h-8 border border-red-500/20 text-red-400 rounded-xl font-bold text-[9px] uppercase tracking-widest flex items-center justify-center gap-2">
                              <RotateCcw size={12} /> RE-RECORD
                           </button>
                        </div>
                     </div>
                  )}

                  {status === 'processing' && (
                     <div className="flex-1 flex flex-col items-center justify-center animate-fade-in py-2">
                        <Loader2 size={32} className="text-teal-500 animate-spin mb-4" />
                        <h3 className="text-[11px] font-bold text-slate-200 mb-1 uppercase tracking-[0.2em]">Analyzing your speech…</h3>
                        <p className="text-[10px] text-slate-400">This may take up to 2 minutes</p>
                     </div>
                  )}

                  {status === 'success' && (
                     <div className="flex-1 flex flex-col items-center justify-center animate-fade-in relative z-10 overflow-y-auto custom-scrollbar p-2">
                        <div className="w-12 h-12 bg-teal-500/20 text-teal-500 rounded-full flex items-center justify-center mb-3 shrink-0">
                           <CheckCircle2 size={24} />
                        </div>
                        <h3 className="text-[12px] font-black text-slate-200 mb-1 uppercase tracking-[0.2em]">Analysis Complete</h3>
                        <button onClick={() => navigate(`/sessions/${sessionId}`)} className="h-10 px-8 bg-teal-500 text-slate-900 rounded-xl font-black text-[12px] tracking-widest hover:scale-[1.05] active:scale-[0.95] transition-all flex items-center gap-2 justify-center shadow-[0_0_40px_rgba(20,184,166,0.3)]">
                           VIEW FULL REPORT <ChevronRight size={18} />
                        </button>
                     </div>
                  )}
               </div>
            </div>

            <div className="hidden lg:flex flex-col gap-3 min-h-0 h-full overflow-y-auto pr-2 custom-scrollbar pb-2 pt-0.5">
               <div className="bg-white rounded-[20px] border border-[var(--border-subtle)] p-4 shadow-sm shrink-0">
                  <div className="flex items-center justify-between mb-2">
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">WEEKLY GOAL</span>
                     <span className="text-[11px] font-black text-teal-600">57%</span>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="relative w-12 h-12 shrink-0">
                        <svg className="w-12 h-12 -rotate-90">
                           <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
                           <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={125.6} strokeDashoffset={125.6 * (1 - Math.min((weeklyStats?.totalSessions || 0) / 7, 1))} className="text-teal-600" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                           <span className="text-[10px] font-black text-slate-800">{(weeklyStats?.totalSessions || 0)}/7</span>
                        </div>
                     </div>
                     <p className="text-[11px] text-slate-500 font-medium">Progress towards your goal.</p>
                  </div>
               </div>

               <div className="bg-white rounded-[20px] border border-[var(--border-subtle)] p-4 shadow-sm">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">THIS WEEK</h3>
                  <div className="space-y-2">
                     {[
                        { icon: Activity, label: 'Sessions', val: weeklyStats?.totalSessions || '0', color: 'text-teal-500' },
                        { icon: Zap, label: 'Avg WPM', val: weeklyStats?.avgSpeechRate || '0', color: 'text-amber-500' },
                        { icon: Trophy, label: 'Best Score', val: `${weeklyStats?.latestFluencyScore || 0}%`, color: 'text-indigo-500', valColor: 'text-teal-600' }
                     ].map((s, i) => (
                        <div key={i} className="flex items-center justify-between border-b border-slate-50 last:border-0 pb-2 last:pb-0">
                           <div className="flex items-center gap-3">
                              <s.icon size={14} className={s.color} />
                              <span className="text-[12px] font-bold text-slate-700">{s.label}</span>
                           </div>
                           <span className={`text-[12px] font-black ${s.valColor || 'text-slate-900'}`}>{s.val}</span>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="bg-white rounded-[20px] border border-[var(--border-subtle)] p-4 shadow-sm">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">PREPARATION</h3>
                  <div className="space-y-2">
                     {[{ icon: Volume2, title: 'Natural Pace' }, { icon: ShieldCheck, title: 'No Noise' }].map((tip, idx) => (
                        <div key={idx} className="flex gap-3 items-center">
                           <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-teal-600 shrink-0 border border-slate-100"><tip.icon size={12} /></div>
                           <p className="text-[12px] font-bold text-slate-700">{tip.title}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>

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
