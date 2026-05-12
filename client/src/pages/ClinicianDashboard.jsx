import React, { useState, useMemo } from 'react';
import { 
  Users, AlertCircle, TrendingDown, Calendar, 
  Search, ArrowUpRight, Filter, MessageSquare, ExternalLink,
  MoreVertical, ChevronRight, Activity, Bell
} from 'lucide-react';
import StatCard from '../components/features/Dashboard/StatCard';

const ClinicianDashboard = () => {
  const stats = [
    { label: 'Total Patients',   value: '24',    delta: '+2',   icon: Users },
    { label: 'Critical Alerts',  value: '3',     delta: '-1',   icon: AlertCircle, isNegativeMetric: true },
    { label: 'Avg Improvement',  value: '18%',   delta: '+4%',  icon: Activity },
    { label: 'Sessions Today',   value: '12',    delta: '+3',   icon: Calendar },
  ];

  const [searchTerm, setSearchTerm] = useState('');

  const patients = [
    { id: 1, name: 'Hassan Ali', lastSession: '2h ago', status: 'improving', trend: '+12%', score: 84, alert: false },
    { id: 2, name: 'Sarah Miller', lastSession: '1d ago', status: 'critical', trend: '-8%', score: 42, alert: true },
    { id: 3, name: 'John Doe', lastSession: '5h ago', status: 'stable', trend: '+2%', score: 71, alert: false },
    { id: 4, name: 'Emma Wilson', lastSession: '3d ago', status: 'inactive', trend: 'N/A', score: 65, alert: true },
  ];

  const filteredPatients = useMemo(() => {
    return patients.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `P-1002${p.id}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, patients]);

  return (
    <div className="space-y-12 animate-fade-in max-w-[1500px] mx-auto">
      
      {/* ── Clinician Hero ── */}
      <div className="bg-[var(--hero-bg)] rounded-[32px] p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                <Bell size={12} /> Priority Command Center
             </div>
             <h1 className="text-4xl sm:text-5xl font-black tracking-tighter mb-4 leading-none">
                Clinic <span className="opacity-60">Status</span>
             </h1>
             <p className="text-white/80 font-bold max-w-md">
                Monitor patient progress and respond to alerts. 
                You have <span className="text-white underline decoration-white/40 font-black">3 critical reviews</span> pending.
             </p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-4">
             <div className="bg-white/10 backdrop-blur-md p-4 sm:p-6 rounded-[24px] border border-white/10 text-center min-w-[120px] sm:min-w-[140px] flex-1 sm:flex-initial">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Clinic Capacity</p>
                <p className="text-2xl sm:text-3xl font-black">84%</p>
             </div>
             <div className="bg-white/10 backdrop-blur-md p-4 sm:p-6 rounded-[24px] border border-white/10 text-center min-w-[120px] sm:min-w-[140px] flex-1 sm:flex-initial">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Active Trials</p>
                <p className="text-2xl sm:text-3xl font-black">12</p>
             </div>
          </div>
        </div>
      </div>

      {/* ── Rapid Insights ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={s.label} className="animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
            <StatCard {...s} />
          </div>
        ))}
      </div>

      {/* ── Patient Management Table ── */}
      <div className="bg-[var(--bg-surface)] rounded-[32px] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] overflow-hidden">
        <div className="p-8 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">Patient Management</h3>
            <p className="text-xs text-[var(--text-muted)] font-bold mt-1 uppercase tracking-widest">Global Clinic Roster</p>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={14} />
              <input 
                type="text" 
                placeholder="Search patient ID or name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-2xl text-xs font-bold outline-none focus:border-[var(--accent)] w-full sm:w-80 transition-all"
              />
            </div>
            <button className="p-3 bg-[var(--bg-base)] rounded-2xl text-[var(--text-secondary)] hover:bg-[var(--accent-glow)] hover:text-[var(--accent)] transition-all">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[var(--bg-base)]/50 text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-8 py-5">Full Name & Identifier</th>
                <th className="px-8 py-5">Status Flag</th>
                <th className="px-8 py-5">Last Interactive Session</th>
                <th className="px-8 py-5">Fluency Index</th>
                <th className="px-8 py-5">Delta Trend</th>
                <th className="px-8 py-5 text-right">Administrative</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredPatients.map((p, i) => (
                <tr key={p.id} className="hover:bg-[var(--bg-base)] transition-all cursor-pointer group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-subtle)] shadow-sm flex items-center justify-center font-black text-[var(--text-primary)] text-sm group-hover:scale-110 group-hover:shadow-md transition-all">
                        {p.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-black text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">{p.name}</p>
                        <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mt-1">ID: P-1002{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] shadow-sm ${
                      p.status === 'critical' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                      p.status === 'improving' ? 'bg-[var(--accent-glow)] text-[var(--accent)] border border-[var(--accent-border)]' : 
                      'bg-[var(--bg-base)] text-[var(--text-muted)] border border-[var(--border-subtle)]'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-xs font-black text-[var(--text-secondary)]">{p.lastSession}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-2 bg-[var(--bg-base)] rounded-full w-28 overflow-hidden shadow-inner border border-[var(--border-subtle)]">
                        <div className={`h-full rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)] transition-all duration-1000 ${p.score > 70 ? 'bg-[var(--accent)]' : 'bg-amber-400'}`} style={{ width: `${p.score}%` }} />
                      </div>
                      <span className="text-xs font-black text-[var(--text-primary)]">{p.score}%</span>
                    </div>
                  </td>
                  <td className={`px-8 py-6 text-xs font-black flex items-center gap-1 ${p.trend.startsWith('+') ? 'text-[var(--accent)]' : 'text-[var(--data-danger)]'}`}>
                    {p.trend.startsWith('+') ? <Activity size={14} /> : <TrendingDown size={14} />}
                    {p.trend}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:shadow-lg transition-all">
                        <MessageSquare size={18} />
                      </button>
                      <button className="p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] hover:shadow-lg transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-8 bg-[var(--bg-base)]/30 border-t border-[var(--border-subtle)] flex items-center justify-between">
           <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Showing {filteredPatients.length} of {patients.length} patients</p>
           <div className="flex gap-2">
              <button className="px-6 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all">Previous</button>
              <button className="px-6 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all">Next</button>
           </div>
        </div>
      </div>

    </div>
  );
};

export default ClinicianDashboard;
