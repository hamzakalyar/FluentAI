import React from 'react';
import { 
  Play, 
  Download, 
  Share2, 
  Clock, 
  Calendar, 
  Mic2,
  AlertCircle,
  ChevronLeft,
  Activity
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import Badge from '../components/shared/Badge';
import Breadcrumb from '../components/layout/Breadcrumb';
import Tooltip from '../components/shared/Tooltip';
import { motion } from 'framer-motion';

const TranscriptViewer = ({ transcript }) => {
  return (
    <div className="bg-[var(--bg-elevated)]/50 rounded-3xl p-8 border border-[var(--border-subtle)] min-h-[300px]">
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-amber-400 rounded-sm" />
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Repeated Word</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 border-b-2 border-dashed border-indigo-400" />
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Significant Pause</span>
        </div>
      </div>

      <div className="text-lg md:text-xl text-[var(--text-primary)] leading-[2] font-medium font-sans whitespace-pre-wrap">
        {transcript.map((token, i) => (
          <span key={i} className="relative inline-block mr-1.5">
            {token.type === 'repetition' ? (
              <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100 px-1 rounded-md border-b-2 border-amber-400 cursor-help group">
                {token.text}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-[10px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
                  Detected repetition: "{token.text}" repeated {token.count} times.
                </div>
              </span>
            ) : token.type === 'pause' ? (
              <span className="inline-block border-b-2 border-dashed border-indigo-300 mx-1 px-2 text-indigo-400 text-sm font-black tracking-[0.2em]">
                ....
              </span>
            ) : (
              token.text
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

const SessionDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock session data
  const session = {
    id: id || '#42',
    title: 'Morning Reading Session',
    date: 'March 14, 2026',
    duration: '2m 45s',
    fluencyScore: 84,
    wpm: 124,
    repetitions: 4,
    pauses: 7,
    transcript: [
      { text: 'The' }, { text: 'quick' }, { text: 'brown' }, { text: 'fox' },
      { type: 'repetition', text: 'jumps', count: 2 }, { text: 'over' }, { text: 'the' },
      { type: 'pause', duration: 1.2 }, { text: 'lazy' }, { text: 'dog.' },
      { text: 'He' }, { type: 'repetition', text: 'sat', count: 2 }, { text: 'down' },
      { text: 'near' }, { text: 'the' }, { text: 'river' }, { text: 'and' },
      { type: 'pause', duration: 0.8 }, { text: 'watched' }, { text: 'the' },
      { type: 'repetition', text: 'the', count: 3 }, { text: 'sunset.' }
    ]
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="animate-fade-in-up pb-12"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Breadcrumb />
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-[var(--bg-elevated)] rounded-xl transition-all text-[var(--text-muted)] hover:text-[var(--accent)]"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">{session.title}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-1">
                  <Calendar size={12} /> {session.date}
                </span>
                <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-1">
                  <Clock size={12} /> {session.duration}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="border-[var(--border-subtle)]"><Share2 size={16} className="mr-2" /> Share</Button>
          <Button variant="ghost" size="sm" className="border-[var(--border-subtle)]"><Download size={16} className="mr-2" /> Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Transcript Area */}
        <div className="lg:col-span-2 space-y-8">
          <Card padded={false} className="overflow-hidden">
            <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <h3 className="font-bold text-[var(--text-primary)]">Transcript Analysis</h3>
              <div className="flex items-center gap-2">
                <Badge variant="teal">AI Verified</Badge>
              </div>
            </div>
            <div className="p-8">
              <TranscriptViewer transcript={session.transcript} />
            </div>
            <div className="bg-[var(--bg-elevated)] p-6 flex items-center gap-6 border-t border-[var(--border-subtle)]">
              <button className="w-12 h-12 bg-[var(--accent)] rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform shadow-lg shadow-[var(--accent)]/20">
                <Play fill="currentColor" size={20} />
              </button>
              <div className="flex-1 h-1.5 bg-[var(--bg-surface)] rounded-full relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-1/3 bg-[var(--accent)] rounded-full" />
              </div>
              <span className="text-[var(--text-muted)] text-xs font-mono">0:45 / {session.duration}</span>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-[var(--text-primary)] mb-6">Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/20">
                <h4 className="font-bold text-amber-900 dark:text-amber-400 text-sm mb-2 flex items-center gap-2">
                  <AlertCircle size={16} />
                  Reduce Repetitions
                </h4>
                <p className="text-amber-800/70 dark:text-amber-400/60 text-xs leading-relaxed">
                  You repeated the word "the" 3 times at the end. Try taking a breath before starting a new sentence.
                </p>
              </div>
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/20">
                <h4 className="font-bold text-indigo-900 dark:text-indigo-400 text-sm mb-2 flex items-center gap-2">
                  <Activity size={16} />
                  Stable Pace
                </h4>
                <p className="text-indigo-800/70 dark:text-indigo-400/60 text-xs leading-relaxed">
                  Your speech rate was very consistent (124 WPM). This is a great improvement over your last session.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <Card>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-8 border-[var(--bg-elevated)] border-t-[var(--accent)] mb-4">
                <span className="text-3xl font-black text-[var(--text-primary)]">{session.fluencyScore}%</span>
              </div>
              <h4 className="font-bold text-[var(--text-primary)]">Fluency Score</h4>
              <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-widest mt-1">Excellent Progress</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2">
                  <Mic2 size={14} /> WPM
                </span>
                <span className="text-sm font-black text-[var(--text-primary)]">{session.wpm}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2">
                  <Activity size={14} /> Repetitions
                </span>
                <span className="text-sm font-black text-amber-600">{session.repetitions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2">
                  <Clock size={14} /> Pauses
                </span>
                <span className="text-sm font-black text-indigo-600">{session.pauses}</span>
              </div>
            </div>
          </Card>

          <Button className="w-full shadow-xl shadow-[var(--accent)]/20" onClick={() => navigate('/practice')}>
            Start Related Practice
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default SessionDetail;
