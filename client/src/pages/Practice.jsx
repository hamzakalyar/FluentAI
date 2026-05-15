import React, { useState, useEffect } from 'react';
import { 
  Trophy, Target, Zap, Mic, CheckCircle2, 
  RotateCcw, Play, Pause, ChevronRight, Info, Loader2, RefreshCw
} from 'lucide-react';
import Badge from '../components/shared/Badge';
import Breadcrumb from '../components/layout/Breadcrumb';
import Card from '../components/shared/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import api from '../services/api';
import { toast } from 'sonner';

const ExerciseCard = ({ exercise, onComplete, isInitiallyCompleted }) => {
  const [isRecording, setIsRecording]   = useState(false);
  const [isCompleted, setIsCompleted]   = useState(isInitiallyCompleted || false);
  const [hasRecorded, setHasRecorded]   = useState(false);
  const [isSaving,    setIsSaving]      = useState(false);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasRecorded(true);
    } else {
      setIsRecording(true);
      setHasRecorded(false);
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    try {
      await api.post('/practice/results', {
        targetSound:     exercise.targetSounds?.[0] || exercise.tag || 'unknown',
        targetSentence:  exercise.text,
        exerciseType:    'sentence',
        difficulty:      (exercise.difficulty || 'easy').toLowerCase(),
        score:           80, // Self-assessed score (can be enhanced later)
        totalTargetWords:    1,
        correctTargetWords:  1,
        stutteredWords:      [],
      });
      setIsCompleted(true);
      onComplete(exercise.id);
    } catch (err) {
      toast.error('Failed to save result. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={cn(
      "relative p-6 rounded-3xl border transition-all duration-500 overflow-hidden group/card",
      isCompleted 
        ? "bg-[var(--accent)]/[0.03] border-[var(--accent)]/20 shadow-sm" 
        : "bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--accent)]/40 shadow-premium hover:-translate-y-1"
    )}>
      {isCompleted && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent)]/5 rounded-full -mr-12 -mt-12 blur-2xl" />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-all duration-500 border shadow-sm",
            isCompleted 
              ? "bg-teal-700 text-white border-teal-700" 
              : "bg-[var(--bg-base)] text-[var(--text-primary)] border-[var(--border-subtle)]"
          )}>
            {isCompleted ? <CheckCircle2 size={18} strokeWidth={3} /> : `0${exercise.num}`}
          </div>
          <div>
            <h4 className="text-lg font-black transition-all duration-500 font-syne tracking-tight text-[var(--text-primary)]">
              {exercise.title}
            </h4>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="slate" size="sm">{exercise.tag}</Badge>
              <Badge 
                size="sm"
                variant={exercise.difficulty === 'Easy' || exercise.difficulty === 'easy' ? 'success' : exercise.difficulty === 'Medium' || exercise.difficulty === 'medium' ? 'warning' : 'error'}
              >
                {exercise.difficulty}
              </Badge>
            </div>
          </div>
        </div>

        {isCompleted && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-[var(--accent)] font-black text-sm uppercase tracking-tighter"
          >
            Session Mastered <Zap size={18} fill="currentColor" />
          </motion.div>
        )}
      </div>

      <div className={cn(
        "bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-2xl p-6 mb-6 transition-all duration-500",
        isCompleted && "bg-[var(--accent-glow)] border-[var(--accent)]/10"
      )}>
        <p className="text-lg font-medium leading-relaxed italic font-serif text-[var(--text-primary)]">
          "{exercise.text}"
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button
            onClick={toggleRecording}
            disabled={isCompleted}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg shrink-0",
              isRecording 
                ? "bg-red-500 text-white animate-pulse shadow-red-200" 
                : "bg-[var(--accent)] text-white hover:scale-105 shadow-[var(--accent)]/20",
              isCompleted && "bg-[var(--bg-elevated)] text-[var(--text-muted)] cursor-not-allowed shadow-none"
            )}
          >
            {isRecording ? <Pause size={20} fill="currentColor" /> : <Mic size={20} />}
          </button>
          
          <div className="flex-1 sm:w-56 h-10 bg-[var(--bg-base)] rounded-xl border border-[var(--border-subtle)] flex items-center px-4 gap-3 overflow-hidden">
            {isRecording ? (
              <div className="flex gap-1.5 items-center">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [6, 24, 6] }}
                    transition={{ repeat: Infinity, duration: 0.4 + (i * 0.1), ease: "easeInOut" }}
                    className="w-1 bg-[var(--accent)] rounded-full"
                  />
                ))}
              </div>
            ) : hasRecorded ? (
              <div className="flex items-center gap-3 text-[10px] font-black text-[var(--accent)] uppercase tracking-[0.15em]">
                <Play size={14} fill="currentColor" />
                Ready to complete
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--border-subtle)]" />
                <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Tap mic to practice</span>
              </div>
            )}
          </div>
        </div>

        {!isCompleted && (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {hasRecorded && (
              <button 
                onClick={() => setHasRecorded(false)}
                className="flex items-center gap-2 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest hover:text-red-500 transition-colors px-3 h-10 rounded-xl hover:bg-red-50"
              >
                <RotateCcw size={14} />
                Reset
              </button>
            )}
            <button 
              onClick={handleComplete} 
              disabled={!hasRecorded || isSaving}
              className={cn(
                "h-10 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center gap-2",
                hasRecorded && !isSaving
                  ? "bg-[var(--accent-navy)] text-white shadow-lg shadow-[var(--accent-navy)]/20 hover:bg-[var(--accent)]" 
                  : "bg-[var(--bg-elevated)] text-[var(--text-muted)] cursor-not-allowed"
              )}
            >
              {isSaving ? <><Loader2 size={12} className="animate-spin" /> Saving…</> : <>Complete Exercise <ChevronRight size={14} /></>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────

const Practice = () => {
  const [completedIds, setCompletedIds] = useState([1, 2]);
  const totalExercises = 5;

  const exercises = [
    { id: 1, num: 1, title: 'Sound Prolongation', tag: '/s/ Sound', difficulty: 'Easy', text: 'Sally sells seashells by the seashore.' },
    { id: 2, num: 2, title: 'Soft Onsets', tag: '/b/ Sound', difficulty: 'Medium', text: 'Beautiful blue birds build big bright baskets.' },
    { id: 3, num: 3, title: 'Light Contacts', tag: '/t/ Sound', difficulty: 'Easy', text: 'Take two tickets to the tiny town tonight.' },
    { id: 4, num: 4, title: 'Vocal Ease', tag: 'Vowels', difficulty: 'Medium', text: 'Apples and apricots are always appetizing.' },
    { id: 5, num: 5, title: 'Flow Control', tag: 'Mixed', difficulty: 'Hard', text: 'Through the thick thicket, the three thinkers thought.' },
  ];

  const handleComplete = (id) => {
    if (!completedIds.includes(id)) {
      setCompletedIds(prev => [...prev, id]);
    }
  };

  const handleDifficultyChange = (d) => {
    setDifficulty(d);
    fetchExercises(d);
  };

  const completedCount  = completedIds.length;
  const totalExercises  = exercises.length || 5;

  return (
    <div className="animate-fade-in-up min-h-screen relative">
      {/* Background Mesh */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[10%] right-[5%] w-[40rem] h-[40rem] bg-[var(--accent)]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[30rem] h-[30rem] bg-indigo-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative mb-14">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Breadcrumb />
            <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight font-syne">Practice Engine</h1>
            <p className="text-[var(--text-secondary)] font-medium mt-2 text-lg">Daily exercises tailored to your fluency patterns</p>
          </div>
          <div className="flex items-center gap-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-4 shadow-sm">
            <div className="text-center px-1">
              <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-1.5">Daily Progress</p>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-[var(--text-primary)] tracking-tighter">{completedCount}/{totalExercises}</span>
                <div className="w-24 h-2.5 bg-[var(--bg-base)] rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedCount / totalExercises) * 100}%` }}
                    className="h-full bg-gradient-to-r from-[var(--accent)] to-[#14B8A6]"
                  />
                </div>
              </div>
            </div>
            <div className="w-10 h-10 bg-[var(--accent-glow)] rounded-xl flex items-center justify-center text-[var(--accent)] shadow-sm">
              <Trophy size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Selector */}
      <div className="flex items-center gap-2 mb-8">
        <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mr-2">Difficulty:</span>
        {['easy', 'medium', 'hard'].map(d => (
          <button
            key={d}
            onClick={() => handleDifficultyChange(d)}
            disabled={loading}
            className={cn(
              "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all capitalize",
              difficulty === d
                ? "bg-[var(--accent)] text-white shadow-md"
                : "bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)]"
            )}
          >
            {d}
          </button>
        ))}
        <button
          onClick={() => fetchExercises(difficulty)}
          disabled={loading}
          className="ml-2 p-2 rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
          title="Regenerate exercises"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {exercises.map((ex) => (
            <ExerciseCard 
              key={ex.id} 
              exercise={ex} 
              onComplete={handleComplete} 
              isInitiallyCompleted={completedIds.includes(ex.id)}
            />
          ))}
        </div>

        {/* Info & Goals Sidebar */}
        <div className="space-y-8">
          <div className="p-6 rounded-3xl bg-[var(--accent-navy)] text-white shadow-premium relative overflow-hidden group border border-white/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-125 transition-transform duration-1000" />
            <h3 className="font-black text-xl mb-5 flex items-center gap-3 relative z-10 font-syne uppercase tracking-tighter">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <Target size={20} className="text-white" />
              </div>
              Today's Focus
            </h3>
            <p className="text-white/80 text-base leading-relaxed mb-6 relative z-10 font-medium">
              {exercises.length > 0
                ? <>Practising <strong className="text-white">{exercises[0]?.tag}</strong> exercises to improve your fluency.</>
                : 'Complete a recording session to get personalised exercise recommendations.'}
            </p>
            <div className="p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 relative z-10 shadow-inner">
              <div className="flex items-start gap-3">
                <Info size={18} className="text-[var(--accent)] mt-0.5 shrink-0" />
                <p className="text-xs text-white/70 font-bold leading-relaxed tracking-tight">
                  Focus on the natural flow of each sentence. Don't rush — steady pace beats speed.
                </p>
              </div>
            </div>
          </div>

          <Card>
            <h4 className="font-bold text-[var(--text-primary)] mb-4">Session Progress</h4>
            <div className="space-y-4">
              {[
                { label: 'Exercises Today', current: completedCount, target: totalExercises, icon: '🏆' },
                { label: 'Difficulty', current: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3, target: 3, icon: '🎯' },
              ].map((m) => (
                <div key={m.label} className="p-4 bg-[var(--bg-base)] rounded-2xl">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-bold text-[var(--text-primary)]">{m.icon} {m.label}</span>
                    <span className="text-xs font-bold text-[var(--text-muted)]">{m.current}/{m.target}</span>
                  </div>
                  <div className="h-1.5 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[var(--accent)]" 
                      style={{ width: `${(m.current / m.target) * 100}%` }}
                    />
                  </div>
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
