import React, { useEffect, useRef } from 'react';
import { useCountUp } from '../../hooks/useCountUp';

const StatItem = ({ targetValue, label }) => {
  const { count, start } = useCountUp(targetValue, 2000, 200);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [start]);

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="w-8 h-0.5 bg-teal-400 mx-auto mb-4" />
      <div className="text-4xl lg:text-5xl font-black text-white">{count || '0'}</div>
      <div className="text-sm font-medium text-blue-200 mt-1 uppercase tracking-wide">{label}</div>
    </div>
  );
};

const StatsSection = () => {
  const stats = [
    { value: '10,000+', label: 'Active Users' },
    { value: '98%', label: 'Transcription Accuracy' },
    { value: '2M+', label: 'Sessions Analyzed' },
    { value: '4.9/5.0', label: 'User Satisfaction' }
  ];

  return (
    <section className="relative bg-primary pt-20 pb-32">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <StatItem key={i} targetValue={stat.value} label={stat.label} />
          ))}
        </div>
      </div>

      {/* Wave SVG Divider */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-[60px]"
        >
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.42,120.4,192.6,105.7,240.23,94.55,282.8,78.22,321.39,56.44Z" 
            className="fill-slate-50"
          />
        </svg>
      </div>
    </section>
  );
};

export default StatsSection;
