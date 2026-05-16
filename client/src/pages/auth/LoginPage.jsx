import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/layout/AuthLayout';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import Input from '../../components/shared/Input';
import Button from '../../components/shared/Button';

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
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Server error banner */}
      {serverError && (
        <div className="px-4 py-3 rounded-xl text-sm font-medium bg-red-50 border border-red-200 text-red-600 animate-shake">
          {serverError}
        </div>
      )}

      {/* Email */}
      <Input
        {...register('email')}
        label="Email address"
        type="email"
        placeholder="name@example.com"
        error={errors.email?.message}
        autoComplete="email"
      />

      {/* Password */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 font-syne">Password</label>
          <Link
            to="/forgot-password"
            className="text-xs font-bold text-teal-600 transition-colors hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          {...register('password')}
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          autoComplete="current-password"
        />
      </div>

      {/* Remember me */}
      <div className="flex items-center gap-2.5 px-1 py-2">
        <input
          id="remember"
          type="checkbox"
          className="w-4 h-4 rounded cursor-pointer border-slate-300 accent-teal-600"
        />
        <label htmlFor="remember" className="text-sm font-medium cursor-pointer text-slate-500">
          Keep me signed in
        </label>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        isLoading={isLoading}
        className="w-full h-12 rounded-xl font-black text-sm shadow-lg shadow-teal-500/20"
      >
        Sign in <ArrowRight size={16} className="ml-2" />
      </Button>
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
