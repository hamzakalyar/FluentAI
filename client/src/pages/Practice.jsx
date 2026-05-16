import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, Target, Zap, Mic, CheckCircle2, 
  RotateCcw, Play, Pause, ChevronRight, Info, 
  TrendingUp, ArrowRight, Square, Loader2, Sparkles
} from 'lucide-react';
import { sessionsService } from '../services/sessionsService';
import { analyticsService } from '../services/analyticsService';
import { practiceService } from '../services/practiceService';
import { useRecording } from '../hooks/useRecording';
import Badge from '../components/shared/Badge';
import Breadcrumb from '../components/layout/Breadcrumb';
import Card from '../components/shared/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import WaveformCanvas from '../components/features/Recording/WaveformCanvas';

const ProgressCheckCard = ({ targetSound, onComplete }) => {
  const [passage, setPassage] = useState(null);
  const [comparison, setComparison] = useState(null);
  const { status, duration, startRecording, stopRecording, startAnalysis, analysisResults, resetRecording } = useRecording();

  useEffect(() => {
    const passageMap = {
      'S': 'fricatives_s', 'SH': 'fricatives_s',
      'TH': 'fricatives_th', 'DH': 'fricatives_th',
      'B': 'plosives_bp', 'P': 'plosives_bp',
      'T': 'plosives_td', 'D': 'plosives_td',
      'K': 'plosives_kg', 'G': 'plosives_kg',
      'F': 'fricatives_f', 'V': 'fricatives_f',
      'R': 'liquids_rl', 'L': 'liquids_rl',
      'STR': 'clusters', 'SP': 'clusters'
    };
    
    const passageId = passageMap[targetSound?.toUpperCase()] || 'screening';
    sessionsService.getPassageById(passageId).then(res => setPassage(res.data.passage));
  }, [targetSound]);

  useEffect(() => {
    if (status === 'success' && analysisResults) {
      const newScore = analysisResults.fluencyScore || analysisResults.metrics?.fluencyScore || 0;
      analyticsService.getSummary().then(res => {
        const baseline = res.data.averageFluencyScore || 60;
        setComparison({ current: newScore, previous: baseline, improvement: newScore - baseline });
      });
    }
  }, [status, analysisResults]);

  if (!passage) return null;

  return (
    <Card className="border-2 border-[var(--accent)] bg-gradient-to-br from-[var(--bg-surface)] to-[var(--accent)]/5 overflow-hidden relative p-8">
      <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp size={120} /></div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent)] text-white flex items-center justify-center shadow-lg"><Trophy size={20} /></div>
          <div>
            <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">Progress Verification</h3>
            <p className="text-xs font-bold text-[var(--accent)] uppercase tracking-widest">Challenge: Master your {targetSound} sounds</p>
          </div>
        </div>
        {!comparison ? (
          <div className="space-y-6">
            <div className="p-6 bg-[var(--bg-base)] rounded-2xl border border-[var(--border-subtle)] shadow-inner">
              <p className="text-lg font-medium text-[var(--text-secondary)] italic leading-relaxed text-center">"{passage.text}"</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              {status === 'idle' ? (
                <button onClick={startRecording} className="w-16 h-16 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-xl hover:scale-110 transition-all"><Mic size={28} /></button>
              ) : status === 'recording' ? (
                <button onClick={stopRecording} className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center shadow-xl animate-pulse"><Square size={24} fill="currentColor" /></button>
              ) : status === 'reviewing' ? (
                <div className="flex gap-4 w-full max-w-xs">
                   <button onClick={resetRecording} className="flex-1 h-12 rounded-xl border-2 border-[var(--border-subtle)] text-[var(--text-muted)] font-black text-xs uppercase tracking-widest">Retake</button>
                   <button onClick={() => startAnalysis(passage.id)} className="flex-[2] h-12 rounded-xl bg-[var(--accent-navy)] text-white font-black text-xs uppercase tracking-widest shadow-lg">Verify Progress</button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2"><Loader2 className="animate-spin text-[var(--accent)]" /><span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Analyzing...</span></div>
              )}
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4">
            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center"><p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">Previous Baseline</p><p className="text-3xl font-black text-[var(--text-secondary)]">{comparison.previous}%</p></div>
              <div className="w-[1px] h-12 bg-[var(--border-subtle)] mt-2" />
              <div className="text-center"><p className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest mb-1">New Score</p><p className="text-3xl font-black text-[var(--text-primary)]">{comparison.current}%</p></div>
            </div>
            <button onClick={() => onComplete()} className="px-8 py-3 bg-[var(--accent-navy)] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[var(--accent)] transition-all shadow-lg flex items-center gap-2 mx-auto">Finish Daily Practice <ArrowRight size={16} /></button>
          </motion.div>
        )}
      </div>
    </Card>
  );
};

const ExerciseCard = ({ exercise, onComplete, isInitiallyCompleted }) => {
  const { status, duration, audioBlob, startRecording, stopRecording, startAnalysis, analysisResults, resetRecording, analyser } = useRecording();
  const [isCompleted, setIsCompleted] = useState(isInitiallyCompleted || false);
  const [score, setScore] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (status === 'success' && analysisResults && !isCompleted) {
      const fluencyScore = analysisResults.fluencyScore || analysisResults.metrics?.fluencyScore || 0;
      setScore(fluencyScore);
      setIsCompleted(true);
      practiceService.saveResult({
        targetSound: exercise.tag,
        targetSentence: exercise.text,
        exerciseType: 'sentence',
        difficulty: exercise.difficulty.toLowerCase(),
        score: fluencyScore
      }).catch(err => console.error("Failed to save result:", err));
      onComplete(exercise.id);
    }
  }, [status, analysisResults]);

  const isRecording = status === 'recording' || status === 'permissions';

  return (
    <div className={cn(
      "relative p-6 rounded-3xl border transition-all duration-500 overflow-hidden group/card",
      isCompleted ? "bg-[var(--accent)]/[0.03] border-[var(--accent)]/20 shadow-sm" : "bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--accent)]/40 shadow-premium"
    )}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-all duration-500 border shadow-sm", isCompleted ? "bg-teal-700 text-white border-teal-700" : "bg-[var(--bg-base)] text-[var(--text-primary)] border-[var(--border-subtle)]")}>
            {isCompleted ? <CheckCircle2 size={18} strokeWidth={3} /> : `0${exercise.num}`}
          </div>
          <div>
            <h4 className="text-lg font-black font-syne tracking-tight text-[var(--text-primary)]">{exercise.title}</h4>
            <div className="flex items-center gap-2 mt-2"><Badge variant="slate" size="sm">{exercise.tag}</Badge><Badge size="sm" variant={exercise.difficulty?.toLowerCase() === 'easy' ? 'success' : 'warning'}>{exercise.difficulty}</Badge></div>
          </div>
        </div>
        {isCompleted && score !== null && <div className="text-[var(--accent)] font-black text-sm">Score: {score}/100 <Zap size={18} className="inline ml-1" /></div>}
      </div>
      <div className="bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-2xl p-4 mb-4">
        <p className="text-base font-medium italic font-serif text-[var(--text-primary)]">"{exercise.text}"</p>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              if (status === 'recording') stopRecording();
              else if (status === 'reviewing') {
                if (isPlaying) {
                  audioRef.current.pause();
                  setIsPlaying(false);
                } else {
                  const url = URL.createObjectURL(audioBlob);
                  if (!audioRef.current) audioRef.current = new Audio(url);
                  audioRef.current.play();
                  setIsPlaying(true);
                  audioRef.current.onended = () => setIsPlaying(false);
                }
              }
              else startRecording();
            }} 
            disabled={isCompleted} 
            className={cn("w-12 h-12 rounded-full flex items-center justify-center transition-all shrink-0 shadow-lg", 
              isRecording ? "bg-red-500 text-white animate-pulse" : 
              status === 'reviewing' ? "bg-[var(--accent)] text-white hover:scale-105" :
              "bg-[var(--accent)] text-white hover:scale-105", 
              isCompleted && "bg-[var(--bg-elevated)] text-[var(--text-muted)] cursor-not-allowed"
            )}
          >
            {isRecording ? <Pause size={20} /> : 
             status === 'reviewing' ? (isPlaying ? <Pause size={20} /> : <Play size={20} fill="currentColor" />) : 
             <Mic size={20} />}
          </button>

          {(status === 'reviewing' || status === 'success') && (
            <button 
              onClick={resetRecording}
              className="w-10 h-10 rounded-full bg-[var(--bg-elevated)] text-[var(--text-muted)] flex items-center justify-center hover:text-amber-500 transition-all border border-[var(--border-subtle)]"
              title="Re-record"
            >
              <RotateCcw size={18} />
            </button>
          )}
        </div>

        {status === 'recording' && (
          <div className="flex-1 h-10 bg-[var(--bg-base)] rounded-xl border border-[var(--border-subtle)] flex items-center justify-center px-4 overflow-hidden">
            <WaveformCanvas analyser={analyser} isRecording={true} color="var(--accent)" bars={30} />
          </div>
        )}

        {!isCompleted && (
           <button onClick={() => startAnalysis(null, exercise.text)} disabled={status !== 'reviewing'} className={cn("h-10 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all", status === 'reviewing' ? "bg-[var(--accent-navy)] text-white shadow-lg" : "bg-[var(--bg-elevated)] text-[var(--text-muted)] cursor-not-allowed")}>
              Analyze Speech <ChevronRight size={14} className="inline ml-2" />
           </button>
        )}
      </div>
    </div>
  );
};

const Practice = () => {
  const [completedIds, setCompletedIds] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(true);
  const [soundProgress, setSoundProgress] = useState([]);
  const [topWeakSound, setTopWeakSound] = useState(null);
  const [userWeakSounds, setUserWeakSounds] = useState([]);
  const [noWeakSounds, setNoWeakSounds] = useState(false);

  const loadPracticeData = async () => {
    setLoading(true);
    setNoWeakSounds(false);
    try {
      // Step 1: Get user's detected weak sounds from analytics (recordings)
      const summaryRes = await analyticsService.getSummary();
      const detectedWeakSounds = (summaryRes.data?.topWeakSounds || []).map(ws => ws.sound);
      setUserWeakSounds(detectedWeakSounds);

      if (detectedWeakSounds.length === 0) {
        console.log('No weak sounds in profile — server will use session or default fallback');
      }

      if (detectedWeakSounds.length > 0) setTopWeakSound(detectedWeakSounds[0]);

      // Step 2: Generate exercises targeting those exact weak sounds
      const [exercisesRes, progressRes, todayResultsRes] = await Promise.all([
        practiceService.generateExercises(difficulty, detectedWeakSounds),
        practiceService.getSoundProgress(),
        practiceService.getResults({ limit: 50 }) // Get recent results to find today's progress
      ]);

      setExercises(exercisesRes.data.exercises || []);

      // Step 3: Set completed IDs based on today's results
      const today = new Date().toDateString();
      const todayCompleted = (todayResultsRes.data.results || [])
        .filter(r => new Date(r.createdAt).toDateString() === today)
        .map(r => r.targetSentence);
      setCompletedIds(todayCompleted);

      // Step 4: Build Mastery Tracker using ALL practice history
      const practiceHistory = progressRes.data.soundProgress || [];
      const allSoundsToTrack = Array.from(new Set([
        ...practiceHistory.map(p => p.sound?.toUpperCase()),
        ...detectedWeakSounds.map(s => s?.toUpperCase())
      ])).filter(Boolean);

      const mergedProgress = allSoundsToTrack.map(sound => {
        const history = practiceHistory.find(p => p.sound?.toUpperCase() === sound);
        return {
          sound,
          averageScore: history?.averageScore || 0,
          bestScore: history?.bestScore || 0,
          totalAttempts: history?.totalAttempts || 0,
          lastAttempt: history?.lastAttempt || null,
        };
      }).sort((a, b) => b.totalAttempts - a.totalAttempts);

      setSoundProgress(mergedProgress);

    } catch (err) {
      console.error("Failed to load practice data", err);
      if (err.response?.status === 400) setNoWeakSounds(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPracticeData();
  }, [difficulty]);

  const getMasteryLevel = (score) => {
    if (score >= 90) return { label: 'Mastered', color: 'text-emerald-600', bg: 'bg-emerald-500', track: 'bg-emerald-100' };
    if (score >= 75) return { label: 'Proficient', color: 'text-teal-600', bg: 'bg-teal-500', track: 'bg-teal-100' };
    if (score >= 50) return { label: 'Improving', color: 'text-amber-600', bg: 'bg-amber-400', track: 'bg-amber-100' };
    return { label: 'Needs Practice', color: 'text-rose-600', bg: 'bg-rose-400', track: 'bg-rose-100' };
  };

  const completedCount = completedIds.length;
  const totalExercises = exercises.length || 5;
  const showVerification = completedCount >= totalExercises && totalExercises > 0 && !completedIds.includes('verification-done');
  
  const handleComplete = (id) => { 
    if (!completedIds.includes(id)) {
      setCompletedIds(prev => [...prev, id]);
      // Refresh mastery tracker and stats after a few seconds to let DB settle
      setTimeout(() => loadPracticeData(), 1500);
    } 
  };

  return (
    <div className="animate-fade-in-up min-h-screen relative pb-20">
      <div className="relative mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Breadcrumb />
            <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight font-syne">Practice Engine</h1>
            {userWeakSounds.length > 0 ? (
              <p className="text-[var(--text-secondary)] font-medium mt-1 text-sm">
                Targeting your weak sounds: {userWeakSounds.map(s => (
                  <span key={s} className="inline-block bg-[var(--accent-glow)] text-[var(--accent)] font-black text-[10px] px-2 py-0.5 rounded-md mr-1 uppercase">{s}</span>
                ))}
              </p>
            ) : (
              <p className="text-[var(--text-secondary)] font-medium mt-1 text-sm">Complete a recording session to unlock personalized exercises</p>
            )}
          </div>
          <div className="flex items-center gap-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-3 shadow-sm">
            <div className="text-center px-1">
              <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-1">Daily Progress</p>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-[var(--text-primary)] tracking-tighter">{completedCount}/{totalExercises}</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-[var(--accent-glow)] rounded-xl flex items-center justify-center text-[var(--accent)]"><Trophy size={20} /></div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mr-2">Difficulty:</span>
        {['easy', 'medium', 'hard'].map(d => (
          <button key={d} onClick={() => setDifficulty(d)} className={cn("px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all", difficulty === d ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-subtle)]")}>{d}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Exercises */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="animate-spin text-[var(--accent)]" size={32} />
              <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Loading personalized exercises...</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {showVerification ? (
                <motion.div key="verification" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                  <ProgressCheckCard targetSound={topWeakSound} onComplete={() => setCompletedIds(prev => [...prev, 'verification-done'])} />
                </motion.div>
              ) : (
                exercises.map((ex, index) => (
                  <motion.div key={ex.sentence} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                    <ExerciseCard
                      exercise={{ id: ex.sentence, num: index+1, title: `${ex.targetSound} Focus`, tag: ex.soundLabel || ex.targetSound, difficulty: ex.difficulty || 'Medium', text: ex.sentence }}
                      onComplete={handleComplete}
                      isInitiallyCompleted={completedIds.includes(ex.sentence)}
                    />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          )}
          {!showVerification && exercises.length === 0 && !loading && !noWeakSounds && (
            <div className="p-12 text-center bg-[var(--bg-surface)] rounded-3xl border border-dashed border-[var(--border-subtle)]">
              <Sparkles size={40} className="mx-auto text-[var(--text-muted)] mb-4 opacity-20" />
              <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-xs">No exercises remaining for today</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:sticky lg:top-24 space-y-6">
          {/* Today's Focus */}
          <Card className="bg-[var(--accent-navy)] text-white border-none p-5">
            <h3 className="font-black text-base mb-3 flex items-center gap-2 font-syne uppercase tracking-tight"><Target size={18} /> Today's Focus</h3>
            <p className="text-white/80 text-sm leading-relaxed font-medium">
              {topWeakSound
                ? `The AI has identified "${topWeakSound}" as your primary challenge. These exercises are designed to build your confidence with this sound.`
                : "Practice daily to improve your fluency."}
            </p>
          </Card>

          {/* Sound Mastery Tracker */}
          <Card className="p-5">
            <h4 className="font-black text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-4 flex items-center gap-2">
              <TrendingUp size={13} /> Sound Mastery Tracker
            </h4>
            {soundProgress.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] font-medium text-center py-4 opacity-60">Complete exercises to start tracking your progress per sound.</p>
            ) : (
              <div className="space-y-4">
                {soundProgress.map(sp => {
                  const mastery = getMasteryLevel(sp.averageScore);
                  return (
                    <div key={sp.sound} className="p-3 bg-[var(--bg-base)] rounded-2xl border border-[var(--border-subtle)]">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[10px] font-black text-[var(--text-primary)]">{sp.sound}</span>
                          <div>
                            <span className={`text-[9px] font-black uppercase tracking-wider ${mastery.color}`}>{mastery.label}</span>
                            <p className="text-[9px] text-[var(--text-muted)] font-bold">{sp.totalAttempts} attempt{sp.totalAttempts !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                        <span className="text-sm font-black text-[var(--text-primary)]">{sp.averageScore}<span className="text-[9px] text-[var(--text-muted)]">/100</span></span>
                      </div>
                      <div className={`h-1.5 ${mastery.track} rounded-full overflow-hidden`}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${sp.averageScore}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`h-full ${mastery.bg} rounded-full`}
                        />
                      </div>
                      {sp.bestScore > 0 && (
                        <p className="text-[8px] text-[var(--text-muted)] font-bold mt-1.5">Best: {sp.bestScore}/100</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Practice;
