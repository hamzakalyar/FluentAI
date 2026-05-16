import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/layout/AuthLayout';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

/* ── Design tokens (matching landing page) ── */
const T = {
  teal:   '#0D9488',
  navy:   '#0F2744',
  text:   '#374151',
  muted:  '#6B7280',
  border: '#E5E7EB',
  error:  '#DC2626',
};

const loginSchema = z.object({
  email:    z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const LoginPage = ({ isUnified = false }) => {
  const [isLoading,   setIsLoading]   = useState(false);
  const [showPass,    setShowPass]    = useState(false);
  const [serverError, setServerError] = useState('');
  const { login } = useAuth();
  const navigate  = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (error) {
      setServerError('Incorrect email or password. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>

      {/* Server error banner */}
      {serverError && (
        <div
          className="mb-5 px-4 py-3 rounded-xl text-sm font-medium"
          style={{ background: '#FEF2F2', color: T.error, border: '1px solid #FCA5A5' }}
        >
          {serverError}
        </div>
      )}

      {/* Email */}
      <div className="mb-4">
        <label className="block text-[11px] font-black uppercase tracking-[0.2em] mb-2 ml-1" style={{ color: 'var(--text-secondary)' }}>
          Email address
        </label>
        <input
          {...register('email')}
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
          className="w-full h-12 px-4 rounded-xl text-sm outline-none transition-all border border-slate-200 focus:border-teal-500/40 focus:ring-4 focus:ring-teal-500/5"
          style={{ color: T.navy, background: '#fff' }}
        />
        {errors.email && (
          <p className="text-xs mt-1.5 font-medium" style={{ color: T.error }}>
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] ml-1" style={{ color: 'var(--text-secondary)' }}>Password</label>
          <Link
            to="/forgot-password"
            className="text-xs font-bold transition-colors hover:underline"
            style={{ color: T.teal }}
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <input
            {...register('password')}
            type={showPass ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="current-password"
            className="w-full h-12 px-4 pr-12 rounded-xl text-sm outline-none transition-all border border-slate-200 focus:border-teal-500/40 focus:ring-4 focus:ring-teal-500/5"
            style={{ color: T.navy, background: '#fff' }}
          />
          <button
            type="button"
            onClick={() => setShowPass(v => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 transition-colors rounded"
            style={{ color: T.muted }}
            tabIndex={-1}
          >
            {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs mt-1.5 font-medium" style={{ color: T.error }}>
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Remember me */}
      <div className="flex items-center gap-2.5 mb-8">
        <input
          id="remember"
          type="checkbox"
          className="w-4 h-4 rounded cursor-pointer border-slate-300"
          style={{ accentColor: T.teal }}
        />
        <label htmlFor="remember" className="text-sm font-medium cursor-pointer" style={{ color: T.muted }}>
          Keep me signed in
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 rounded-xl font-black text-white text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-teal-500/20"
        style={{
          background: 'linear-gradient(135deg,#0D9488,#0891B2)',
        }}
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Signing in…
          </>
        ) : (
          <>
            Sign in
            <ArrowRight size={16} />
          </>
        )}
      </button>

    </form>
  );

  if (isUnified) return formContent;

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your fluency journey"
    >
      {formContent}
      
      {/* Divider */}
      <div className="my-8 flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-100" />
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">or</span>
        <div className="flex-1 h-px bg-slate-100" />
      </div>

      <p className="text-center text-sm font-medium text-slate-500">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-black text-teal-600 transition-colors hover:underline"
        >
          Create one free
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
