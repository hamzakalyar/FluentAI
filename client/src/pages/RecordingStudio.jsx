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
      analysisResults,
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
      { label: 'ANALYSIS', status: 'processing' },
      { label: 'SUCCESS', status: 'success' }
   ];

   const getActiveStep = () => {
      if (status === 'recording' || status === 'paused') return 1;
      if (status === 'reviewing') return 2;
      if (status === 'processing') return 3;
      if (status === 'success') return 4;
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

   const activePassage = (Array.isArray(passages) ? passages[activePassageIndex] : null) || {};
   const currentPassageText = isFreeRecord ? "Free Record Mode: Read anything or speak freely. No text will be evaluated." : activePassage.description || "Loading passages...";

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
      <div className="h-[calc(100vh-64px)] bg-[var(--bg-base)] px-2 lg:px-4 py-2 animate-fade-in overflow-hidden flex flex-col min-w-0">
         {/* Hidden Audio for Playback */}
         <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={() => setIsPlaying(false)} className="hidden" />

         {/* ── MAIN WORKSPACE ── */}
         <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px] gap-4 flex-1 min-h-0 min-w-0">
            
            {/* CENTER PANEL (MAIN LEFT) */}
            <div className="flex flex-col gap-2 min-h-0 h-full">
               
               {/* ── HEADER & TOGGLE ── */}
               <div className="flex justify-between items-start pt-0.5 pb-0.5">
                  <div className="flex flex-col gap-0.5 shrink-0">
                     <nav className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold text-slate-400 hover:text-teal-600 cursor-pointer transition-colors" onClick={() => navigate('/dashboard')}>Home</span>
                        <ChevronRight size={10} className="text-slate-300" />
                        <span className="text-[10px] font-bold text-teal-600">Recording</span>
                     </nav>
                     <h1 className="font-syne text-[24px] font-bold text-slate-900 tracking-tight leading-none">Recording Studio</h1>
                     <p className="text-[12px] text-slate-500 font-medium mt-0.5">Improve your speech fluency with real-time feedback.</p>
                  </div>
                  
                  {/* Mode Toggle - Now above the pipeline, in the header area */}
                  <div className="hidden sm:flex bg-white p-1 rounded-xl border border-[var(--border-subtle)] shadow-sm">
                     <button onClick={() => setIsFreeRecord(false)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!isFreeRecord ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Daily Routine</button>
                     <button onClick={() => setIsFreeRecord(true)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${isFreeRecord ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Free Record</button>
                  </div>
               </div>

               {/* Step Indicator */}
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

               {/* Practice Passage */}
               <div className="bg-white rounded-[20px] p-3 shadow-sm border border-[var(--border-subtle)] relative shrink-0">
                  <div className="flex items-center justify-between mb-1.5 border-b border-[var(--border-subtle)] pb-1.5">
                     <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                           <Target size={10} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">ACTIVE PRACTICE</span>
                     </div>
                     <div className="flex items-center gap-1 min-w-0">
                        {!isFreeRecord && (
                           <div className="relative group min-w-0">
                              <select 
                                 value={activePassageIndex} 
                                 onChange={(e) => setActivePassageIndex(Number(e.target.value))}
                                 disabled={activeStep !== 0}
                                 className="bg-[var(--bg-elevated)] text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border border-[var(--border-subtle)] outline-none cursor-pointer appearance-none pr-6 hover:border-[var(--accent)] transition-all disabled:opacity-50 disabled:cursor-not-allowed max-w-[120px] truncate"
                              >
                                 {passages.map((p, idx) => (
                                    <option key={p.id} value={idx}>{p.title || `P${idx + 1}`}</option>
                                 ))}
                              </select>
                              <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]">
                                 <ChevronRight size={10} className="rotate-90" />
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
                  <div className="h-12 overflow-y-auto pr-2 custom-scrollbar py-0.5">
                     <p className="text-[14px] sm:text-[15px] font-medium text-[var(--text-secondary)] leading-snug font-serif italic text-center px-4">"{currentPassageText}"</p>
                  </div>
               </div>

               {/* MAIN CARD / VISUALIZATION */}
               <div className="bg-[#0B1120] rounded-[20px] shadow-2xl p-3 flex-1 flex flex-col relative overflow-hidden min-h-0 text-white">
                  <div className="flex justify-between items-center px-1 mb-0.5 shrink-0">
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">STUDIO CONSOLE</span>
                     </div>
                     <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded-full text-slate-300 font-bold">{status === 'recording' ? formatDuration(duration) : '0:00'}</span>
                  </div>

                  {status === 'permissions' && (
                     <div className="flex-1 flex flex-col items-center justify-center animate-pulse">
                        <Mic size={24} className="text-slate-500 mb-2" />
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Waiting for Mic...</p>
                     </div>
                  )}

                  {status === 'idle' && (
                     <div className="flex-1 flex flex-col items-center justify-center animate-fade-in relative">
                        {/* Background subtle waveform graphic */}
                        <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-10 pointer-events-none">
                           {[...Array(40)].map((_, i) => (
                              <div key={i} className="w-1.5 bg-white rounded-full" style={{ height: `${10 + Math.random() * 50}px` }} />
                           ))}
                        </div>
                        <div className="relative z-10 flex items-center justify-center gap-12 w-full">
                           {/* Start Live Button */}
                           <div className="flex flex-col items-center gap-3">
                              <button 
                                 onClick={startRecording} 
                                 className="group relative w-16 h-16 rounded-full bg-[#0D9488] shadow-[0_0_30px_rgba(13,148,136,0.3)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300"
                              >
                                 <Mic size={24} className="text-white" />
                                 <div className="absolute inset-0 rounded-full ring-2 ring-white/20 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500" />
                              </button>
                              <span className="text-[10px] font-black text-white uppercase tracking-widest">START LIVE</span>
                           </div>
                           
                           {/* Upload Device Button */}
                           <div className="flex flex-col items-center gap-3 opacity-70 hover:opacity-100 transition-opacity">
                              <button 
                                 className="group relative w-16 h-16 rounded-full bg-[#1E293B] border border-slate-700 flex items-center justify-center hover:bg-[#2A3B52] active:scale-95 transition-all duration-300"
                              >
                                 <CloudUpload size={22} className="text-slate-300 group-hover:text-white" />
                              </button>
                              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">UPLOAD DEVICE</span>
                           </div>
                        </div>
                        <div className="absolute bottom-3 text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">Select input to begin</div>
                     </div>
                  )}

                  {(status === 'recording' || status === 'paused') && (
                     <div className="flex-1 flex flex-col items-center justify-center animate-fade-in min-h-0 py-1">
                        <div className="text-center mb-2 shrink-0">
                           <h2 className={`font-mono text-[36px] font-bold ${isTestingMic ? 'text-teal-400' : 'text-red-400'} tracking-wider leading-none`}>
                              {formatDuration(duration)}
                           </h2>
                        </div>
                        <div className="w-full h-10 mb-3 bg-[#1E293B] rounded-xl flex items-center justify-center border border-slate-700 px-6 shrink-0">
                           <WaveformCanvas analyser={analyser} isRecording={status === 'recording'} color="#2DD4BF" bars={36} />
                        </div>
                        <div className="flex justify-center gap-3 w-full px-6 shrink-0">
                           <button onClick={status === 'recording' ? pauseRecording : resumeRecording} className="flex-1 max-w-[120px] h-10 rounded-xl border-2 border-amber-500 text-amber-500 flex items-center justify-center gap-2 hover:bg-amber-500/10 transition-all font-bold text-[12px] tracking-wide">
                              {status === 'recording' ? <><Pause size={16} /> PAUSE</> : <><Play size={16} fill="currentColor" /> RESUME</>}
                           </button>
                           <button onClick={stopRecording} className="flex-1 max-w-[120px] h-10 rounded-xl bg-red-500 text-white flex items-center justify-center gap-2 hover:bg-red-600 transition-all shadow-md font-bold text-[12px] tracking-wide">
                              <Square size={14} fill="currentColor" /> FINISH
                           </button>
                        </div>
                     </div>
                  )}

                  {status === 'reviewing' && (
                     <div className="flex-1 flex flex-col items-center justify-center animate-fade-in py-1 min-h-0">
                        <div className="bg-teal-500/10 text-teal-400 px-3 py-0.5 rounded-full text-[9px] font-black mb-2 shrink-0">RECORDING READY</div>
                        <div className="w-full max-w-sm bg-[#1E293B] rounded-2xl p-3 mb-3 border border-slate-700 flex flex-col gap-2 shadow-sm shrink-0">
                           <div className="flex items-center gap-2">
                              <button onClick={togglePlayback} className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-md hover:scale-105 transition-all shrink-0">
                                 {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} className="ml-0.5" fill="currentColor" />}
                              </button>
                              <div className="h-1 flex-1 bg-slate-700 rounded-full relative overflow-hidden">
                                 <div className="absolute left-0 top-0 h-full bg-teal-500 transition-all duration-100" style={{ width: `${audioProgress}%` }} />
                              </div>
                              <span className="text-[10px] font-mono text-slate-400">{formatDuration(duration)}</span>
                           </div>
                        </div>
                        <div className="flex flex-col gap-2 w-full max-w-[240px] shrink-0">
                           <button onClick={() => startAnalysis(isFreeRecord ? undefined : activePassage.id)} className="h-10 bg-teal-500 text-white rounded-xl font-bold text-[12px] hover:bg-teal-400 transition-all flex items-center gap-2 justify-center shadow-lg">Start Analysis <ArrowRight size={16} /></button>
                           <button onClick={() => setShowReRecordModal(true)} className="h-8 border border-red-500/20 text-red-400 rounded-xl font-bold text-[9px] hover:bg-red-500/10 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                              <RotateCcw size={12} /> Re-record
                           </button>
                        </div>
                     </div>
                  )}

                  {status === 'processing' && (
                     <div className="flex-1 flex flex-col items-center justify-center animate-fade-in py-2">
                        <Loader2 size={32} className="text-[var(--accent)] animate-spin mb-4" />
                        <h3 className="text-[11px] font-bold text-[var(--text-primary)] mb-4 uppercase tracking-[0.2em]">Processing Audio...</h3>
                     </div>
                  )}

                  {status === 'success' && analysisResults && (
                     <div className="flex-1 flex flex-col animate-fade-in py-2 overflow-y-auto custom-scrollbar pr-2 h-full w-full">
                        <div className="flex items-center gap-4 mb-5">
                           <div className="w-14 h-14 rounded-full bg-teal-50 border-2 border-teal-100 flex items-center justify-center shrink-0">
                              <span className="text-xl font-black text-teal-600">{analysisResults.metrics?.fluencyScore || 0}%</span>
                           </div>
                           <div>
                              <h3 className="text-[14px] font-bold text-[var(--text-primary)] uppercase tracking-[0.1em]">Analysis Complete</h3>
                              <p className="text-[11px] font-medium text-[var(--text-muted)]">Detailed fluency report generated.</p>
                           </div>
                        </div>

                        {/* Core Metrics */}
                        <div className="grid grid-cols-3 gap-3 mb-5 shrink-0">
                           <div className="bg-[var(--bg-base)] p-3 rounded-xl border border-[var(--border-subtle)]">
                              <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">WPM</div>
                              <div className="text-lg font-black text-[var(--text-primary)]">{analysisResults.metrics?.speechRateWPM || 0}</div>
                           </div>
                           <div className="bg-[var(--bg-base)] p-3 rounded-xl border border-[var(--border-subtle)]">
                              <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">Pauses</div>
                              <div className="text-lg font-black text-amber-500">{analysisResults.metrics?.pauseCount || 0}</div>
                           </div>
                           <div className="bg-[var(--bg-base)] p-3 rounded-xl border border-[var(--border-subtle)]">
                              <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">Repeats</div>
                              <div className="text-lg font-black text-red-500">{analysisResults.metrics?.repetitionCount || 0}</div>
                           </div>
                        </div>

                        {/* Transcript Analysis */}
                        <div className="mb-5 shrink-0">
                           <h4 className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Transcript Analysis</h4>
                           <div className="bg-[var(--bg-base)] p-4 rounded-xl border border-[var(--border-subtle)] text-[13px] leading-relaxed text-[var(--text-secondary)]">
                              {(typeof analysisResults.transcript === 'string' ? analysisResults.transcript : analysisResults.transcript?.text || '').split(' ').map((word, i) => {
                                 const cleanWord = word.replace(/[^\w]/g, '').toLowerCase();
                                 const stutters = analysisResults.metrics?.detectedStutters || [];
                                 const isStuttered = cleanWord && stutters.some(s => s.word && s.word.replace(/[^\w]/g, '').toLowerCase().includes(cleanWord));
                                 return (
                                    <span key={i} className={isStuttered ? 'bg-red-100 text-red-700 font-bold px-1 rounded mx-0.5' : 'mx-0.5'}>
                                       {word}
                                    </span>
                                 );
                              })}
                           </div>
                           
                           {/* Detailed Stutters View */}
                           {(analysisResults.metrics?.detectedStutters?.length > 0) && (
                              <div className="mt-3 flex flex-col gap-2">
                                 {analysisResults.metrics.detectedStutters.map((stutter, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-[11px] bg-red-50 p-2 rounded-lg border border-red-100 text-red-800">
                                       <span className="font-bold uppercase tracking-widest text-[9px] bg-white/50 px-2 py-0.5 rounded-full">{stutter.type}</span>
                                       <span className="truncate max-w-[120px] font-serif italic">"{stutter.word}"</span>
                                       <span className="font-mono text-[9px] bg-red-900/10 px-2 py-0.5 rounded text-red-900">{stutter.position}s</span>
                                    </div>
                                 ))}
                              </div>
                           )}
                        </div>

                        {/* Assessment Comparison (If any) */}
                        {analysisResults.assessmentComparison && (
                           <div className="mb-5 shrink-0">
                              <h4 className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Reading Accuracy ({analysisResults.assessmentComparison.matchScore}%)</h4>
                              <div className="bg-[var(--bg-base)] p-3 rounded-xl border border-[var(--border-subtle)] space-y-2">
                                 {analysisResults.assessmentComparison.skippedWords?.length > 0 && (
                                    <div className="flex gap-2 text-[12px]">
                                       <span className="font-bold text-red-500 shrink-0">Skipped:</span>
                                       <span className="text-[var(--text-secondary)]">{analysisResults.assessmentComparison.skippedWords.join(', ')}</span>
                                    </div>
                                 )}
                                 {analysisResults.assessmentComparison.addedWords?.length > 0 && (
                                    <div className="flex gap-2 text-[12px]">
                                       <span className="font-bold text-amber-500 shrink-0">Added:</span>
                                       <span className="text-[var(--text-secondary)]">{analysisResults.assessmentComparison.addedWords.join(', ')}</span>
                                    </div>
                                 )}
                                 {(!analysisResults.assessmentComparison.skippedWords?.length && !analysisResults.assessmentComparison.addedWords?.length) && (
                                    <div className="text-[12px] text-teal-600 font-medium">Perfectly matched the passage text!</div>
                                 )}
                              </div>
                           </div>
                        )}

                        {/* Weak Sounds */}
                        {analysisResults.weakSounds && analysisResults.weakSounds.length > 0 && (
                           <div className="mb-5 shrink-0">
                              <h4 className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Target Sounds Detected</h4>
                              <div className="flex flex-wrap gap-2">
                                 {analysisResults.weakSounds.map(ws => (
                                    <span key={ws} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[11px] font-black border border-indigo-100">
                                       /{ws.toUpperCase()}/
                                    </span>
                                 ))}
                              </div>
                           </div>
                        )}

                     </div>
                  )}
               </div>
            </div>

            {/* RIGHT PANEL (Merged Sidebar) */}
            <div className="hidden lg:flex flex-col gap-3 min-h-0 h-full overflow-y-auto pr-2 custom-scrollbar pb-2 pt-0.5">
               
               {/* Weekly Goal */}
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
                           <span className="text-[10px] font-black text-slate-800">4/7</span>
                        </div>
                     </div>
                     <p className="text-[11px] text-slate-500 font-medium">3 sessions left to reach target.</p>
                  </div>
               </div>

               {/* This Week Stats */}
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

               {/* Last Session */}
               <div className="bg-white rounded-[20px] border border-[var(--border-subtle)] p-4 shadow-sm">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">LAST SESSION</h3>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <span className="text-[12px] font-bold text-slate-800">
                           {lastSession ? new Date(lastSession.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'May 08'}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400 italic">
                           {lastSession ? `${Math.floor(lastSession.duration / 60)}m ${Math.round(lastSession.duration % 60)}s` : '1m 32s'}
                        </span>
                     </div>
                     <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-wider">
                        {lastSession?.metrics?.fluencyScore ? (lastSession.metrics.fluencyScore > 80 ? 'EXCELLENT' : 'GOOD') : 'GOOD'}
                     </div>
                  </div>
               </div>

               {/* Preparation */}
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

               <div className="bg-teal-600 rounded-[20px] p-4 text-white shadow-md relative overflow-hidden group flex-1 flex flex-col items-center justify-center min-h-0 min-w-0">
                  <Sparkles size={18} className="absolute -right-1 -bottom-1 text-white/10 group-hover:scale-110 transition-all" />
                  <p className="text-[13px] font-serif italic leading-snug relative z-10 text-center px-2 font-medium">"Every practice session is a step forward in your journey."</p>
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
