import React from 'react';
import { Mic2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RecentSessions = ({ sessions = [], title = "Recent Sessions" }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-[20px_22px] shadow-sm flex flex-col h-full group/card transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-teal-600 rounded-full" />
          <h3 className="text-[16px] font-bold text-[var(--text-primary)]">{title}</h3>
        </div>
        {sessions.length > 0 && (
          <button 
            onClick={() => navigate('/analytics')}
            className="px-3 py-1.5 border border-[var(--border-subtle)] rounded-md text-[12px] font-bold text-[var(--text-secondary)] hover:text-teal-600 transition-all"
          >
            View all
          </button>
        )}
      </div>

      <div className="space-y-0 flex-1 flex flex-col">
        {sessions.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <div className="w-12 h-12 rounded-full bg-[var(--bg-base)] flex items-center justify-center text-[var(--text-muted)] mb-3 border border-[var(--border-subtle)]">
              <Mic2 size={24} className="opacity-50" />
            </div>
            <p className="text-[14px] font-black text-[var(--text-primary)] uppercase tracking-tight">No activity yet</p>
            <p className="text-[11px] text-[var(--text-muted)] mt-1 max-w-[200px] font-medium leading-relaxed">Head to the Recording Studio or Practice Engine to begin.</p>
            <button 
              onClick={() => navigate('/recording')}
              className="mt-6 px-4 py-2 bg-teal-600 text-white rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-teal-500 transition-all shadow-lg"
            >
              Start Recording
            </button>
          </div>
        ) : (
          sessions.slice(0, 6).map((session, i) => {
            const score = session.score !== undefined ? session.score : session.fluencyScore;
            const Icon = session.Icon || Mic2;
            return (
              <div 
                key={session.id || session._id || i}
                onClick={() => session.isClickable && navigate(`/sessions/${session.id || session._id}`)}
                className={`flex items-center h-[64px] px-2 -mx-2 transition-all rounded-xl ${
                  session.isClickable ? 'cursor-pointer group hover:bg-[var(--bg-base)]' : 'cursor-default opacity-90'
                } ${
                  i !== sessions.length - 1 ? 'border-b border-[var(--border-subtle)]/50' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] shrink-0 group-hover:text-teal-600 transition-all">
                   <Icon size={16} />
                </div>

                <div className="flex-1 mx-4 min-w-0">
                   <p className={`text-[13px] font-bold text-[var(--text-primary)] truncate transition-colors ${session.isClickable ? 'group-hover:text-teal-600' : ''}`}>
                     {session.name || session.title || 'Fluency Session'}
                   </p>
                   <p className="text-[10px] font-mono text-[var(--text-tertiary)] uppercase tracking-tighter opacity-70">
                      {session.date} {session.duration && `— ${session.duration}`}
                   </p>
                </div>

                <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-lg text-[12px] font-black border shadow-sm ${
                       score >= 80 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                       score >= 60 ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                       'bg-rose-500/10 text-rose-500 border-rose-500/20'
                    }`}>
                       {score || 0}%
                    </span>
                   {session.isClickable && <ChevronRight size={14} className="text-[var(--text-tertiary)] group-hover:translate-x-1 transition-transform" />}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentSessions;
