import React from 'react';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';

const StatCard = ({ label, value, subValue, delta = '', icon: Icon, isNegativeMetric = false }) => {
  const isGoodTrend = isNegativeMetric 
    ? (delta?.startsWith?.('-') ?? false) 
    : (delta?.startsWith?.('+') ?? true);

  // Screenshot Match Colors
  const trendColor = isGoodTrend ? 'text-teal-600' : 'text-orange-500';
  const trendIcon = isGoodTrend ? <TrendingUp size={12} /> : <TrendingDown size={12} />;

  return (
    <div className="group relative bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[2rem] p-6 flex items-center gap-6 transition-all duration-500 hover:shadow-premium hover:-translate-y-1 shadow-sm">
      {/* Constrained Background Elements */}
      <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-teal-500/5 to-transparent rounded-full -mr-12 -mt-12 blur-2xl group-hover:from-teal-500/10 transition-all duration-700" />
        
        {/* Background Waveform - Subtle Aesthetic */}
        <div className="absolute bottom-0 right-0 left-16 h-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
          <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full">
            <path 
              d="M0 10 Q 25 20 50 10 T 100 10" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1" 
              className="text-teal-600"
            />
          </svg>
        </div>
      </div>
      
      {/* Icon Section - Robust Housing */}
      <div className="w-16 h-16 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-subtle)] flex items-center justify-center text-teal-600 shrink-0 group-hover:scale-110 group-hover:bg-[var(--bg-elevated)] transition-all duration-500 shadow-sm">
         <Icon size={28} strokeWidth={2} />
      </div>
 
      {/* Content Section */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <p className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-[0.15em] truncate">
            {label}
          </p>
          <div className="group/info relative cursor-help">
            <div className="w-4 h-4 rounded-full bg-[var(--bg-base)] flex items-center justify-center border border-[var(--border-subtle)]">
              <Info size={10} className="text-[var(--text-muted)] group-hover/info:text-teal-600 transition-colors" />
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3 bg-slate-900/95 backdrop-blur-md text-white text-[10px] font-medium rounded-xl opacity-0 translate-y-2 pointer-events-none group-hover/info:opacity-100 group-hover/info:translate-y-0 transition-all z-50 shadow-2xl border border-white/10">
              <div className="font-bold text-teal-400 mb-1 uppercase tracking-widest text-[9px]">Metric Analysis</div>
              This data point monitors your {label.toLowerCase()} performance to provide objective clinical insights into your fluency progression.
            </div>
          </div>
        </div>
        <div className="flex items-baseline gap-3">
          <h2 className="text-4xl font-black text-[var(--text-primary)] tracking-tight font-syne group-hover:text-teal-500 transition-colors">
            {value}
          </h2>
          {subValue && (
            <span className="text-xs font-bold text-[var(--text-muted)] tracking-tight bg-[var(--bg-base)] px-2 py-0.5 rounded-md border border-[var(--border-subtle)]">{subValue}</span>
          )}
        </div>
      </div>

      {/* Trend - High Impact Badge */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black shadow-sm border transition-all ${isGoodTrend ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
          {trendIcon}
          {delta}
        </div>
        <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Growth</span>
      </div>

    </div>
  );
};

export default StatCard;
