import React, { useState } from 'react';
import { 
  Trophy, 
  Target, 
  Zap, 
  Mic, 
  CheckCircle2, 
  RotateCcw,
  Play,
  Pause,
  ChevronRight,
  Info,
  TrendingUp,
  ArrowRight,
  Square,
  Loader2
} from 'lucide-react';
import { sessionsService } from '../services/sessionsService';
import { analyticsService } from '../services/analyticsService';
import Badge from '../components/shared/Badge';
import Breadcrumb from '../components/layout/Breadcrumb';
import Card from '../components/shared/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { useRecording } from '../hooks/useRecording';
import { practiceService } from '../services/practiceService';

const ProgressCheckCard = ({ targetSound, onComplete }) => {
  const [passage, setPassage] = useState(null);
  const [comparison, setComparison] = useState(null);
  const { status, duration, startRecording, stopRecording, startAnalysis, analysisResults, resetRecording } = useRecording();

  React.useEffect(() => {
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

  React.useEffect(() => {
    if (status === 'success' && analysisResults) {
      const newScore = analysisResults.metrics?.fluencyScore || 0;
      analyticsService.getSummary().then(res => {
        const baseline = res.data.averageFluencyScore || 60;
        setComparison({
          current: newScore,
          previous: baseline,
          improvement: newScore - baseline
        });
      });
    }
  }, [status, analysisResults]);

  if (!passage) return null;

  return (
    <Card className="border-2 border-[var(--accent)] bg-gradient-to-br from-[var(--bg-surface)] to-[var(--accent)]/5 overflow-hidden relative p-8">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <TrendingUp size={120} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent)] text-white flex items-center justify-center shadow-lg">
            <Trophy size={20} />
          </div>
          <div>
            <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">Progress Verification</h3>
            <p className="text-xs font-bold text-[var(--accent)] uppercase tracking-widest">Challenge: Master your {targetSound} sounds</p>
          </div>
        </div>

        {!comparison ? (
          <div className="space-y-6">
            <div className="p-6 bg-[var(--bg-base)] rounded-2xl border border-[var(--border-subtle)] shadow-inner">
              <p className="text-lg font-medium text-[var(--text-secondary)] italic leading-relaxed text-center">
                "{passage.text}"
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              {status === 'idle' ? (
                <button onClick={startRecording} className="w-16 h-16 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-xl hover:scale-110 transition-all group">
                  <Mic size={28} className="group-hover:animate-bounce" />
                </button>
              ) : status === 'recording' ? (
                <button onClick={stopRecording} className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center shadow-xl animate-pulse">
                  <Square size={24} fill="currentColor" />
                </button>
              ) : status === 'reviewing' ? (
                <div className="flex gap-4 w-full max-w-xs">
                  <button onClick={resetRecording} className="flex-1 h-12 rounded-xl border-2 border-[var(--border-subtle)] text-[var(--text-muted)] font-black text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all">Retake</button>
                  <button onClick={() => startAnalysis(passage.id)} className="flex-[2] h-12 rounded-xl bg-[var(--accent-navy)] text-white font-black text-xs uppercase tracking-widest shadow-lg hover:bg-[var(--accent)] transition-all">Verify Progress</button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="animate-spin text-[var(--accent)]" />
                  <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Analyzing your improvement...</span>
                </div>
              )}
              {status === 'idle' && <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Read the passage aloud to finish your session</p>}
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4">
            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">Previous Baseline</p>
                <p className="text-3xl font-black text-[var(--text-secondary)]">{comparison.previous}%</p>
              </div>
              <div className="w-[1px] h-12 bg-[var(--border-subtle)] mt-2" />
              <div className="text-center">
                <p className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest mb-1">New Score</p>
                <p className="text-3xl font-black text-[var(--text-primary)]">{comparison.current}%</p>
              </div>
            </div>

            <div className={cn(
              "p-6 rounded-3xl mb-8 flex flex-col items-center gap-2",
              comparison.improvement >= 0 ? "bg-teal-50 border border-teal-100" : "bg-amber-50 border border-amber-100"
            )}>
              <div className="flex items-center gap-2">
                {comparison.improvement >= 0 ? <CheckCircle2 className="text-teal-600" /> : <Info className="text-amber-600" />}
                <span className={cn("text-lg font-black", comparison.improvement >= 0 ? "text-teal-700" : "text-amber-700")}>
                  {comparison.improvement >= 0 ? `+${comparison.improvement}% Improvement!` : `${Math.abs(comparison.improvement)}% Change`}
                </span>
              </div>
              <p className="text-xs font-medium text-teal-800/60 max-w-xs">
                {comparison.improvement >= 5 
                  ? "Outstanding growth! Your dedication to these drills is showing clear results in your fluency."
                  : "Good effort! Consistency is key. Keep practicing those target transitions."
                }
              </p>
            </div>

            <button onClick={() => onComplete()} className="px-8 py-3 bg-[var(--accent-navy)] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[var(--accent)] transition-all shadow-lg flex items-center gap-2 mx-auto">
              Finish Daily Practice <ArrowRight size={16} />
            </button>
          </motion.div>
        )}
      </div>
    </Card>
  );
};

const ExerciseCard = ({ exercise, onComplete, isInitiallyCompleted }) => {
  const {
    status,
    startRecording,
    stopRecording,
    startAnalysis,
    analysisResults,
    resetRecording
  } = useRecording();

  const [isCompleted, setIsCompleted] = useState(isInitiallyCompleted || false);
  const [score, setScore] = useState(null);

  React.useEffect(() => {
    if (status === 'success' && analysisResults && !isCompleted) {
      const fluencyScore = analysisResults.metrics?.fluencyScore || 0;
      setScore(fluencyScore);
      setIsCompleted(true);
      
      // Save practice result to DB
      practiceService.saveResult({
        targetSound: exercise.targetSound || exercise.tag,
        targetSentence: exercise.text,
        exerciseType: 'sentence',
        difficulty: exercise.difficulty.toLowerCase(),
        score: fluencyScore,
        totalTargetWords: exercise.totalTargetWords || 0,
        correctTargetWords: exercise.totalTargetWords || 0, // Placeholder
      }).catch(err => console.error("Failed to save result:", err));

      onComplete(exercise.id);
    }
  }, [status, analysisResults]);

  const toggleRecording = () => {
    if (status === 'recording') {
      stopRecording();
    } else if (status === 'idle') {
      startRecording();
    }
  };

  const handleAnalyze = () => {
    if (status === 'reviewing') {
      startAnalysis(null, exercise.text);
    }
  };

  const isRecording = status === 'recording' || status === 'permissions';
  const hasRecorded = status === 'reviewing' || status === 'processing' || status === 'success';

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
            <h4 className={cn(
              "text-lg font-black transition-all duration-500 font-syne tracking-tight",
              isCompleted ? "text-[var(--text-primary)]" : "text-[var(--text-primary)]"
            )}>
              {exercise.title}
            </h4>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="slate" size="sm">{exercise.tag}</Badge>
              <Badge 
                size="sm"
                variant={exercise.difficulty === 'Easy' ? 'success' : exercise.difficulty === 'Medium' ? 'warning' : 'error'}
              >
                {exercise.difficulty}
              </Badge>
            </div>
          </div>
        </div>

        {isCompleted && score !== null && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-[var(--accent)] font-black text-sm uppercase tracking-tighter"
          >
            Score: {score}/100 <Zap size={18} fill="currentColor" />
          </motion.div>
        )}
      </div>

      <div className={cn(
        "bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-2xl p-6 mb-6 transition-all duration-500",
        isCompleted && "bg-[var(--accent-glow)] border-[var(--accent)]/10"
      )}>
        <p className={cn(
          "text-lg font-medium leading-relaxed italic font-serif transition-colors duration-500",
          isCompleted ? "text-[var(--text-primary)]" : "text-[var(--text-primary)]"
        )}>
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
            {status === 'recording' ? (
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
            ) : status === 'processing' ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
                <span className="text-[10px] font-black text-[var(--accent)] uppercase tracking-[0.2em]">Analyzing Voice...</span>
              </div>
            ) : status === 'reviewing' ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Audio Captured</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--border-subtle)]" />
                <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Ready to analyze</span>
              </div>
            )}
          </div>
        </div>

        {!isCompleted && (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {status === 'reviewing' && (
              <button 
                onClick={resetRecording}
                className="flex items-center gap-2 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest hover:text-red-500 transition-colors px-3 h-10 rounded-xl hover:bg-red-50"
              >
                <RotateCcw size={14} />
                Retake
              </button>
            )}
            <button 
              onClick={handleAnalyze} 
              disabled={status !== 'reviewing'}
              className={cn(
                "h-10 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center gap-2",
                status === 'reviewing'
                  ? "bg-[var(--accent-navy)] text-white shadow-lg shadow-[var(--accent-navy)]/20 hover:bg-[var(--accent)]" 
                  : "bg-[var(--bg-elevated)] text-[var(--text-muted)] cursor-not-allowed"
              )}
            >
              Analyze Speech
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Practice = () => {
  const [completedIds, setCompletedIds] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [soundProgress, setSoundProgress] = useState([]);
  const [topWeakSound, setTopWeakSound] = useState(null);

  React.useEffect(() => {
    // Fetch personalized exercises and user's sound progress
    const loadPracticeData = async () => {
      try {
        const [exercisesRes, progressRes] = await Promise.all([
          practiceService.generateExercises('medium'),
          practiceService.getSoundProgress()
        ]);
        
        setExercises(exercisesRes.data.exercises || []);
        setSoundProgress(progressRes.data.soundProgress || []);
        
        if (exercisesRes.data.targetSounds && exercisesRes.data.targetSounds.length > 0) {
          setTopWeakSound(exercisesRes.data.targetSounds[0]);
        }
      } catch (err) {
        console.error("Failed to load practice data", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadPracticeData();
  }, []);

  const totalExercises = exercises.length || 5;
  const completedCount = completedIds.length;
  const showVerification = completedCount >= 5 && !completedIds.includes('verification-done');

  const handleVerificationComplete = () => {
    setCompletedIds(prev => [...prev, 'verification-done']);
  };

  const handleComplete = (id) => {
    if (!completedIds.includes(id)) {
      setCompletedIds(prev => [...prev, id]);
    }
  };

  return (
    <div className="animate-fade-in-up min-h-screen relative">
      {/* Background Decorative Mesh */}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="popLayout">
            {showVerification ? (
              <motion.div
                key="verification"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <ProgressCheckCard 
                  targetSound={topWeakSound} 
                  onComplete={handleVerificationComplete}
                />
              </motion.div>
            ) : (
              exercises.map((ex, index) => {
                const mappedEx = {
                  id: ex.sentence,
                  num: index + 1,
                  title: `${ex.targetSound} Focus`,
                  tag: ex.soundLabel || ex.targetSound,
                  difficulty: ex.difficulty || 'Medium',
                  text: ex.sentence
                };
                return (
                  <motion.div
                    key={mappedEx.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <ExerciseCard 
                      exercise={mappedEx} 
                      onComplete={handleComplete} 
                      isInitiallyCompleted={completedIds.includes(mappedEx.id)}
                    />
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
          
          {!showVerification && exercises.length === 0 && !loading && (
            <div className="p-12 text-center bg-[var(--bg-surface)] rounded-[32px] border border-dashed border-[var(--border-subtle)]">
              <Sparkles size={40} className="mx-auto text-[var(--text-muted)] mb-4 opacity-20" />
              <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-xs">No exercises remaining for today</p>
            </div>
          )}
        </div>

        {/* Info & Goals */}
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
              {topWeakSound 
                ? `Your profile shows that you struggle with the "${topWeakSound}" sound. We've highlighted custom exercises targeting this to help stabilize your airflow.`
                : `We've prepared custom exercises to help stabilize your airflow and reduce repetitions.`
              }
            </p>
            <div className="p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 relative z-10 shadow-inner">
              <div className="flex items-start gap-3">
                <Info size={18} className="text-[var(--accent)] mt-0.5 shrink-0" />
                <p className="text-xs text-white/70 font-bold leading-relaxed tracking-tight">
                  Focus on smooth transitions and slow down your speech rate when approaching target sounds.
                </p>
              </div>
            </div>
          </div>

          <Card>
            <h4 className="font-bold text-[var(--text-primary)] mb-4">Milestone Progress</h4>
            <div className="space-y-4">
              {[
                { label: 'Fluency Master', current: completedCount, target: totalExercises, icon: '🏆' },
                { label: 'Total Exercises Practiced', current: soundProgress.reduce((sum, item) => sum + item.totalAttempts, 0), target: 50, icon: '🔥' },
              ].map((m) => (
                <div key={m.label} className="p-4 bg-[var(--bg-base)] rounded-2xl">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-bold text-[var(--text-primary)]">{m.icon} {m.label}</span>
                    <span className="text-xs font-bold text-[var(--text-muted)]">{m.current}/{m.target}</span>
                  </div>
                  <div className="h-1.5 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[var(--accent)]" 
                      style={{ width: `${Math.min(100, (m.current / m.target) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
              
              {soundProgress.length > 0 && (
                <div className="mt-6 pt-6 border-t border-[var(--border-subtle)]">
                  <h5 className="font-bold text-xs text-[var(--text-muted)] uppercase tracking-widest mb-4">Target Sounds Progress</h5>
                  <div className="space-y-3">
                    {soundProgress.slice(0, 3).map(sp => (
                      <div key={sp.sound} className="flex items-center justify-between">
                        <span className="text-sm font-bold">Sound: {sp.sound}</span>
                        <span className="text-xs font-medium text-[var(--text-muted)]">Avg Score: {sp.averageScore}/100</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Practice;
