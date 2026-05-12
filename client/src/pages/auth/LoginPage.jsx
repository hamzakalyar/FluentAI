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

const LoginPage = () => {
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

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your fluency journey"
    >
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
          <label className="block text-sm font-semibold mb-1.5" style={{ color: T.navy }}>
            Email address
          </label>
          <input
            {...register('email')}
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            className="w-full h-12 px-4 rounded-xl text-sm outline-none transition-all"
            style={{
              border: `1.5px solid ${errors.email ? T.error : T.border}`,
              color: T.text,
              background: '#fff',
            }}
            onFocus={e  => { if (!errors.email) e.target.style.borderColor = T.teal; e.target.style.boxShadow = `0 0 0 3px rgba(13,148,136,0.10)`; }}
            onBlur={e   => { e.target.style.borderColor = errors.email ? T.error : T.border; e.target.style.boxShadow = 'none'; }}
          />
          {errors.email && (
            <p className="text-xs mt-1.5 font-medium" style={{ color: T.error }}>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-semibold" style={{ color: T.navy }}>Password</label>
            <Link
              to="/forgot-password"
              className="text-xs font-semibold transition-colors hover:underline"
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
              className="w-full h-12 px-4 pr-12 rounded-xl text-sm outline-none transition-all"
              style={{
                border: `1.5px solid ${errors.password ? T.error : T.border}`,
                color: T.text,
                background: '#fff',
              }}
              onFocus={e => { if (!errors.password) e.target.style.borderColor = T.teal; e.target.style.boxShadow = `0 0 0 3px rgba(13,148,136,0.10)`; }}
              onBlur={e  => { e.target.style.borderColor = errors.password ? T.error : T.border; e.target.style.boxShadow = 'none'; }}
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
        <div className="flex items-center gap-2.5 mb-7">
          <input
            id="remember"
            type="checkbox"
            className="w-4 h-4 rounded cursor-pointer"
            style={{ accentColor: T.teal }}
          />
          <label htmlFor="remember" className="text-sm cursor-pointer" style={{ color: T.muted }}>
            Keep me signed in
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70"
          style={{
            background: isLoading
              ? T.teal
              : 'linear-gradient(135deg,#0D9488,#0891B2)',
            boxShadow: '0 4px 16px rgba(13,148,136,0.35)',
          }}
          onMouseEnter={e => { if (!isLoading) e.currentTarget.style.boxShadow = '0 8px 24px rgba(13,148,136,0.45)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(13,148,136,0.35)'; }}
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

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: T.border }} />
          <span className="text-xs font-medium" style={{ color: T.muted }}>or</span>
          <div className="flex-1 h-px" style={{ background: T.border }} />
        </div>

        {/* Register link */}
        <p className="text-center text-sm" style={{ color: T.muted }}>
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-bold transition-colors hover:underline"
            style={{ color: T.navy }}
          >
            Create one free
          </Link>
        </p>

      </form>
    </AuthLayout>
  );
};

export default LoginPage;
