import React, { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import { analyticsService } from '../../../services/analyticsService';

const WPMTrendChart = ({ initialRange = '7D' }) => {
  const [range, setRange] = useState(initialRange);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const timeframe = range.toLowerCase(); // '7d', '30d', etc.
        const res = await analyticsService.getHistorical(timeframe);
        
        // Map backend history (id, score, date) to chart (day, score)
        const mappedData = res.data.data.map(item => ({
          day: timeframe === '7d' 
            ? new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
            : new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          score: item.score
        }));
        
        setData(mappedData);
      } catch (err) {
        console.error("Failed to fetch historical data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [range]);


  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-[20px_22px] shadow-sm flex flex-col min-h-[300px]">
      {/* Card Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
           <h3 className="text-[16px] font-bold text-[var(--text-primary)]">Weekly Progress</h3>
           <p className="text-[12px] text-[var(--text-tertiary)] font-medium">Average fluency score per session</p>
        </div>
        
        {/* Segmented Control */}
        <div className="flex p-0.5 bg-[var(--bg-elevated)] rounded-lg">
           {['7D', '30D', '90D'].map((opt) => (
              <button
                key={opt}
                onClick={() => setRange(opt)}
                className={`px-3 py-1 rounded-md text-[12px] font-bold transition-all ${
                  range === opt 
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm' 
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                 {opt}
              </button>
           ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="w-full h-[220px] min-h-[220px] min-w-0 mt-2 relative">
        {loading && (
          <div className="absolute inset-0 z-10 bg-[var(--bg-surface)]/50 backdrop-blur-[1px] flex items-center justify-center">
             <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%" debounce={50}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="var(--border-subtle)" 
            />
            
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-tertiary)', fontSize: 11, fontWeight: 400, fontFamily: 'JetBrains Mono' }}
              dy={10}
            />
            
            <YAxis 
              label={{ 
                value: 'Fluency %', 
                angle: -90, 
                position: 'insideLeft', 
                style: { textAnchor: 'middle', fill: 'var(--text-tertiary)', fontSize: 10, fontWeight: 400, fontFamily: 'JetBrains Mono' } 
              }}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-tertiary)', fontSize: 10, fontWeight: 400, fontFamily: 'JetBrains Mono' }}
            />
            
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-3 shadow-xl">
                      <p className="text-[11px] font-mono text-[var(--text-muted)] uppercase mb-1">{label}</p>
                      <p className="font-syne text-[18px] font-bold text-[var(--text-primary)]">{payload[0].value}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke="var(--accent)" 
              strokeWidth={2.5}
              fillOpacity={1} 
              fill="url(#colorScore)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WPMTrendChart;
