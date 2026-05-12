import React from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal } from 'lucide-react';
import Card from '../../components/shared/Card';
import Badge from '../../components/shared/Badge';

const AdminOverview = () => {
  const stats = [
    { label: 'Total Users', value: '1,248' },
    { label: 'Active Today', value: '342' },
    { label: 'Sessions Today', value: '891' },
    { label: 'Avg Fluency Score', value: '74%' },
  ];

  const users = [
    { id: 1, name: 'Alice Smith', email: 'alice@email.com', sessions: 24, lastActive: 'Today', status: 'Active' },
    { id: 2, name: 'Bob Jones', email: 'bob@email.com', sessions: 12, lastActive: 'Yesterday', status: 'Active' },
    { id: 3, name: 'Charlie Day', email: 'charlie@email.com', sessions: 5, lastActive: '2 days ago', status: 'Inactive' },
  ];

  const systemHealth = [
    { key: 'API Status', value: 'Healthy', status: 'good' },
    { key: 'Database', value: 'Healthy', status: 'good' },
    { key: 'Audio Analysis Service', value: 'Active', status: 'good' },
    { key: 'Storage Volume', value: '73% Used', status: 'warn' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-black text-navy mb-1">Overview</h1>
        <p className="text-sm text-slate-500">Platform statistics and system health.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{stat.label}</div>
            <div className="text-2xl font-black text-navy">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Management Table */}
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">User Management</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-3 text-xs font-semibold text-slate-400">Name</th>
                    <th className="pb-3 text-xs font-semibold text-slate-400">Email</th>
                    <th className="pb-3 text-xs font-semibold text-slate-400">Sessions</th>
                    <th className="pb-3 text-xs font-semibold text-slate-400">Last Active</th>
                    <th className="pb-3 text-xs font-semibold text-slate-400">Status</th>
                    <th className="pb-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="py-4 text-sm font-medium text-navy">{u.name}</td>
                      <td className="py-4 text-sm text-slate-500">{u.email}</td>
                      <td className="py-4 text-sm text-slate-600 font-mono">{u.sessions}</td>
                      <td className="py-4 text-sm text-slate-500">{u.lastActive}</td>
                      <td className="py-4">
                        <Badge variant={u.status === 'Active' ? 'teal' : 'ghost'}>{u.status}</Badge>
                      </td>
                      <td className="py-4 text-right">
                        <button className="p-1 text-slate-400 hover:text-navy rounded">
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* System Health */}
        <div>
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">System Health</h3>
              <div className="flex items-center gap-1.5 text-xs text-teal-600 bg-teal-50 px-2 py-1 rounded-md">
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" />
                Live
              </div>
            </div>
            <div className="space-y-4">
              {systemHealth.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                  <span className="text-sm font-medium text-slate-600">{item.key}</span>
                  <Badge variant={item.status === 'good' ? 'teal' : 'amber'}>{item.value}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminOverview;
