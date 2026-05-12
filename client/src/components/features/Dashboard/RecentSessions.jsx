import React from 'react';
import { Mic2, ChevronRight, BookOpen, Wind } from 'lucide-react';

const SESSIONS = [
  { id: 1, type: 'Free Speech', name: 'Free Speech · 2 min 4 sec', date: 'Today, 11:21 AM', duration: '2:04', score: 91, Icon: Mic2 },
  { id: 2, type: 'Reading', name: 'Reading Passage · 5 min 40 sec', date: 'Yesterday, 4:15 PM', duration: '5:40', score: 78, Icon: BookOpen },
  { id: 3, type: 'Exercise', name: 'Breathing Drill · 2 min 30 sec', date: 'May 12, 10:30 AM', duration: '2:30', score: 84, Icon: Wind },
  { id: 4, type: 'Free Speech', name: 'Free Speech · 1 min 55 sec', date: 'May 11, 2:45 PM', duration: '1:55', score: 55, Icon: Mic2 },
];

const RecentSessions = () => {
  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-[20px_22px] shadow-sm flex flex-col">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[16px] font-bold text-[var(--text-primary)]">Recent Sessions</h3>
        <button className="px-3 py-1.5 border border-[var(--border-subtle)] rounded-md text-[12px] font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-default)] transition-all">
          View all
        </button>
      </div>

      {/* Session Rows */}
      <div className="space-y-0">
        {SESSIONS.map((session, i) => (
          <div 
            key={session.id}
            className={`flex items-center h-[56px] px-2 -mx-2 cursor-pointer group transition-all hover:bg-[var(--bg-base)] rounded-lg ${
              i !== SESSIONS.length - 1 ? 'border-b border-[var(--border-subtle)]' : ''
            }`}
          >
            {/* Left: Icon */}
            <div className="w-8 h-8 rounded-full bg-[var(--bg-base)] flex items-center justify-center text-[var(--text-muted)] shrink-0">
               <session.Icon size={14} />
            </div>

            {/* Middle: Info */}
            <div className="flex-1 mx-3 min-w-0">
               <p className="text-[13px] font-bold text-[var(--text-primary)] truncate">{session.name}</p>
               <p className="text-[11px] font-mono text-[var(--text-tertiary)] uppercase tracking-tighter">
                  {session.date} — {session.duration}
               </p>
            </div>

            {/* Right: Score + Chevron */}
            <div className="flex items-center gap-2">
               <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-bold ${
                  session.score >= 80 ? 'bg-[var(--accent-glow)] text-[var(--accent)]' :
                  session.score >= 60 ? 'bg-amber-500/10 text-amber-500' :
                  'bg-red-500/10 text-red-500'
               }`}>
                  {session.score}%
               </span>
               <ChevronRight size={14} className="text-[var(--text-tertiary)] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSessions;
