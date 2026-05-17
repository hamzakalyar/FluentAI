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
    <div className="group relative bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-4 flex items-center gap-4 transition-all duration-500 hover:shadow-premium hover:-translate-y-0.5 shadow-sm overflow-hidden">
      {/* Constrained Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-teal-500/5 to-transparent rounded-full -mr-10 -mt-10 blur-2xl group-hover:from-teal-500/10 transition-all duration-700" />
      </div>
      
      {/* Icon Section - Compact Housing */}
      <div className="w-12 h-12 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] flex items-center justify-center text-teal-600 shrink-0 group-hover:scale-105 transition-all duration-500 shadow-sm">
         <Icon size={22} strokeWidth={2.5} />
      </div>
 
      {/* Content Section */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.1em]">
            {label}
          </p>
          <div className="group/info relative cursor-help">
            <div className="w-3.5 h-3.5 rounded-full bg-[var(--bg-base)] flex items-center justify-center border border-[var(--border-subtle)]">
              <Info size={8} className="text-[var(--text-muted)] group-hover/info:text-teal-600 transition-colors" />
            </div>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight font-syne group-hover:text-teal-500 transition-colors">
            {value}
          </h2>
          {subValue && (
            <span className="text-[9px] font-bold text-[var(--text-muted)] tracking-tight bg-[var(--bg-base)] px-1.5 py-0.5 rounded-md border border-[var(--border-subtle)]">{subValue}</span>
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
