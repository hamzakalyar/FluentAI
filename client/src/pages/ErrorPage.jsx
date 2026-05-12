import React from 'react';
import { RefreshCcw, AlertTriangle } from 'lucide-react';
import Button from '../components/shared/Button';

const ErrorPage = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl shadow-navy/5 text-center border border-slate-100">
        <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-8">
          <AlertTriangle size={40} />
        </div>
        
        <h1 className="text-2xl font-black text-navy mb-4">Something went wrong</h1>
        <p className="text-slate-500 mb-8 leading-relaxed text-sm">
          The speech engine encountered an unexpected error. Don't worry, your data is safe.
        </p>

        {error && (
          <div className="bg-red-50/50 rounded-xl p-4 mb-8 text-left border border-red-100">
            <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Error Trace</p>
            <p className="text-xs font-mono text-red-800 break-all">{error.message}</p>
          </div>
        )}

        <div className="space-y-3">
          <Button className="w-full" onClick={() => window.location.reload()}>
            <RefreshCcw size={18} className="mr-2" />
            Refresh Page
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => window.location.href = '/'}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
