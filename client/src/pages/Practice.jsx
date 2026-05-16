import React, { useState, useEffect } from 'react';
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
  const { status, startRecording, stopRecording, startAnalysis, analysisResults, resetRecording } = useRecording();
  const [isCompleted, setIsCompleted] = useState(isInitiallyCompleted || false);
  const [score, setScore] = useState(null);

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
      <div className="bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-2xl p-6 mb-6">
        <p className="text-lg font-medium italic font-serif text-[var(--text-primary)]">"{exercise.text}"</p>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
        <button onClick={() => status === 'recording' ? stopRecording() : startRecording()} disabled={isCompleted} className={cn("w-12 h-12 rounded-full flex items-center justify-center transition-all", isRecording ? "bg-red-500 text-white animate-pulse" : "bg-[var(--accent)] text-white hover:scale-105", isCompleted && "bg-[var(--bg-elevated)] text-[var(--text-muted)]")}>
          {isRecording ? <Pause size={20} /> : <Mic size={20} />}
        </button>
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

  useEffect(() => {
    const loadPracticeData = async () => {
      setLoading(true);
      try {
        const [exercisesRes, progressRes] = await Promise.all([
          practiceService.generateExercises(difficulty),
          practiceService.getSoundProgress()
        ]);
        setExercises(exercisesRes.data.exercises || []);
        setSoundProgress(progressRes.data.soundProgress || []);
        if (exercisesRes.data.targetSounds?.length > 0) setTopWeakSound(exercisesRes.data.targetSounds[0]);
      } catch (err) {
        console.error("Failed to load practice data", err);
      } finally {
        setLoading(false);
      }
    };
    loadPracticeData();
  }, [difficulty]);

  const completedCount = completedIds.length;
  const totalExercises = exercises.length || 5;
  const showVerification = completedCount >= totalExercises && totalExercises > 0 && !completedIds.includes('verification-done');

  const handleComplete = (id) => { if (!completedIds.includes(id)) setCompletedIds(prev => [...prev, id]); };

  return (
    <div className="animate-fade-in-up min-h-screen relative pb-20">
      <div className="relative mb-14">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Breadcrumb />
            <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight font-syne">Practice Engine</h1>
            <p className="text-[var(--text-secondary)] font-medium mt-2 text-sm">Tailored to your fluency patterns</p>
          </div>
          <div className="flex items-center gap-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-4 shadow-sm">
            <div className="text-center px-1">
              <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-1.5">Daily Progress</p>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-[var(--text-primary)] tracking-tighter">{completedCount}/{totalExercises}</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-[var(--accent-glow)] rounded-xl flex items-center justify-center text-[var(--accent)]"><Trophy size={20} /></div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-8">
        <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mr-2">Difficulty:</span>
        {['easy', 'medium', 'hard'].map(d => (
          <button key={d} onClick={() => setDifficulty(d)} className={cn("px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all", difficulty === d ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-subtle)]")}>{d}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="popLayout">
            {showVerification ? (
              <motion.div key="verification" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <ProgressCheckCard targetSound={topWeakSound} onComplete={() => setCompletedIds(prev => [...prev, 'verification-done'])} />
              </motion.div>
            ) : (
              exercises.map((ex, index) => (
                <motion.div key={ex.sentence} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <ExerciseCard exercise={{ id: ex.sentence, num: index+1, title: `${ex.targetSound} Focus`, tag: ex.soundLabel || ex.targetSound, difficulty: ex.difficulty || 'Medium', text: ex.sentence }} onComplete={handleComplete} isInitiallyCompleted={completedIds.includes(ex.sentence)} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
          {!showVerification && exercises.length === 0 && !loading && (
            <div className="p-12 text-center bg-[var(--bg-surface)] rounded-[32px] border border-dashed border-[var(--border-subtle)]"><Sparkles size={40} className="mx-auto text-[var(--text-muted)] mb-4 opacity-20" /><p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-xs">No exercises remaining for today</p></div>
          )}
        </div>
        <div className="lg:sticky lg:top-24 space-y-8">
          <Card className="bg-[var(--accent-navy)] text-white border-none p-6">
            <h3 className="font-black text-xl mb-5 flex items-center gap-3 font-syne uppercase tracking-tighter"><Target size={20} /> Today's Focus</h3>
            <p className="text-white/80 text-base leading-relaxed mb-6 font-medium">{topWeakSound ? `Practicing "${topWeakSound}" sounds will stabilize your airflow today.` : "Practice daily to improve your fluency."}</p>
          </Card>
          <Card>
            <h4 className="font-black text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-5">Target Sounds Progress</h4>
            <div className="space-y-4">
              {soundProgress.slice(0, 3).map(sp => (
                <div key={sp.sound} className="p-4 bg-[var(--bg-base)] rounded-2xl">
                  <div className="flex justify-between mb-2"><span className="text-[11px] font-bold text-[var(--text-primary)] uppercase">Sound: {sp.sound}</span><span className="text-[11px] font-black text-[var(--text-muted)]">{sp.averageScore}/100</span></div>
                  <div className="h-1.5 bg-[var(--bg-elevated)] rounded-full overflow-hidden"><div className="h-full bg-[var(--accent)]" style={{ width: `${sp.averageScore}%` }} /></div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Practice;
