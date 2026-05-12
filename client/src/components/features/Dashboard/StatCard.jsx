import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ label, value, subValue, delta = '', icon: Icon, isNegativeMetric = false }) => {
  const isGoodTrend = isNegativeMetric 
    ? (delta?.startsWith?.('-') ?? false) 
    : (delta?.startsWith?.('+') ?? true);

  // Screenshot Match Colors
  const trendColor = isGoodTrend ? 'text-teal-600' : 'text-orange-500';
  const trendIcon = isGoodTrend ? <TrendingUp size={12} /> : <TrendingDown size={12} />;

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-4 sm:p-5 flex flex-col min-h-[140px] h-auto shadow-card hover:shadow-premium hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-[var(--accent)]/5 rounded-full blur-2xl group-hover:bg-[var(--accent)]/10 transition-colors" />
      
      {/* 1. Icon Frame (Screenshot Match) */}
      <div className="w-10 h-10 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] flex items-center justify-center mb-5 text-[var(--accent)] shadow-sm group-hover:scale-110 transition-transform">
         <Icon size={20} />
      </div>
 
      {/* 2. Primary Metric */}
      <div className="flex items-baseline gap-1.5 mb-0.5">
         <h2 className="font-syne text-[32px] font-black text-[var(--text-primary)] leading-none tracking-tighter">
           {value}
         </h2>
         {subValue && (
           <span className="text-xl font-bold text-[var(--text-secondary)] tracking-tight">{subValue}</span>
         )}
      </div>

      {/* 3. Label (Screenshot Match: Bold & Muted) */}
      <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] mb-4">
        {label}
      </p>

      {/* 4. Delta Trend (Screenshot Match: Teal/Orange logic) */}
      <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-wider mt-auto`}>
         <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${isGoodTrend ? 'bg-teal-500/10 text-teal-600' : 'bg-orange-500/10 text-orange-600'}`}>
            {trendIcon}
            <span>{delta}</span>
         </div>
         <span className="text-[var(--text-muted)] font-bold ml-1 opacity-60">VS LAST WEEK</span>
      </div>
    </div>
  );
};

export default StatCard;
