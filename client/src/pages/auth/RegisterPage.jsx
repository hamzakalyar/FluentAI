import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/shared/Input';
import Button from '../../components/shared/Button';
import {
  Mail, CheckCircle2, ArrowRight
} from 'lucide-react';

/* ── Password strength ───────────────────────────────────────────────────────── */
function PasswordStrength({ password }) {
  const checks = [
    { label: '8+ characters', pass: password.length >= 8 },
    { label: 'Uppercase letter', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /\d/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  const colors = ['bg-slate-200', 'bg-red-500', 'bg-amber-500', 'bg-teal-500'];
  const textColors = ['text-slate-400', 'text-red-500', 'text-amber-500', 'text-teal-500'];
  const labels = ['', 'Weak', 'Fair', 'Strong'];

  if (!password) return null;
  return (
    <div className="mt-2 px-1">
      <div className="flex gap-1 mb-1.5">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= score ? colors[score] : 'bg-slate-100'}`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {checks.map(({ label, pass }) => (
            <div key={label} className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${pass ? 'text-teal-600' : 'text-slate-400'}`}>
              <CheckCircle2 size={10} strokeWidth={pass ? 3 : 2} />
              {label}
            </div>
          ))}
        </div>
        <span className={`text-[10px] font-black uppercase tracking-widest ${textColors[score]}`}>
          {labels[score]}
        </span>
      </div>
    </div>
  );
}

/* ── Validation schema ────────────────────────────────────────────────────────── */
const schema = z.object({
  name:            z.string().min(2, 'Name must be at least 2 characters'),
  email:           z.string().email('Please enter a valid email address'),
  password:        z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  agreeTerms:      z.literal(true, { errorMap: () => ({ message: 'You must agree to continue' }) }),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const RegisterPage = ({ isUnified = false }) => {
  const [step,       setStep]       = useState(1);
  const [isLoading,  setIsLoading]  = useState(false);
  const [userEmail,  setUserEmail]  = useState('');
  const [serverError, setServerError] = useState('');
  
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  const passwordValue = watch('password', '');

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');
    setUserEmail(data.email);
    try {
      await registerUser(data.name, data.email, data.password);
      // Backend auto-logs in after register currently
      navigate('/dashboard');
    } catch (err) {
      setServerError(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formContent = (
    <>
      {/* Step indicator */}
      {step === 1 && !isUnified && (
        <div className="flex items-center gap-2 mb-10">
          {[1, 2].map((s, i) => (
            <React.Fragment key={s}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all shadow-sm ${
                step >= s ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-400'
              }`}>{s}</div>
              {i === 0 && (
                <div className="flex-1 h-1 rounded-full bg-slate-100 overflow-hidden">
                   <div className="h-full transition-all duration-500 bg-teal-600" style={{ width: step >= 2 ? '100%' : '0%' }} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Server error banner */}
      {serverError && (
        <div className="mb-5 px-4 py-3 rounded-xl text-sm font-medium bg-red-50 border border-red-100 text-red-600 animate-shake">
          {serverError}
        </div>
      )}

      {/* Step 1: Registration form */}
      {step === 1 && (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <Input
            {...register('name')}
            label="Full name"
            placeholder="Enter your full name"
            error={errors.name?.message}
            autoComplete="name"
          />

          <Input
            {...register('email')}
            label="Email address"
            type="email"
            placeholder="name@example.com"
            error={errors.email?.message}
            autoComplete="email"
          />

          <div className="space-y-1">
            <Input
              {...register('password')}
              label="Password"
              type="password"
              placeholder="Min. 8 characters"
              error={errors.password?.message}
              autoComplete="new-password"
            />
            <PasswordStrength password={passwordValue} />
          </div>

          <Input
            {...register('confirmPassword')}
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            autoComplete="new-password"
          />

          <div className="px-1">
            <div className="flex items-start gap-2.5 py-1">
              <input
                {...register('agreeTerms')}
                id="terms"
                type="checkbox"
                className="mt-1 w-4 h-4 rounded cursor-pointer flex-shrink-0 accent-teal-600"
              />
              <label htmlFor="terms" className="text-xs leading-relaxed cursor-pointer font-medium text-slate-500">
                I agree to the{' '}
                <Link to="/terms" className="font-bold text-teal-600 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="font-bold text-teal-600 hover:underline">Privacy Policy</Link>
              </label>
            </div>
            {errors.agreeTerms && (
              <p className="text-xs mt-1 font-bold text-red-500 ml-6">{errors.agreeTerms.message}</p>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              loading={isLoading}
              className="w-full h-12 rounded-xl font-black text-sm shadow-lg shadow-teal-500/20"
            >
              Create account <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </form>
      )}

      {/* Step 2: Email sent (Reserved for future) */}
      {step === 2 && (
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-sm bg-teal-50">
            <Mail size={28} className="text-teal-600" />
          </div>
          <p className="text-sm font-medium leading-relaxed mb-8 text-slate-600">
            Please check your inbox and click the verification link to activate your account.
          </p>
          <div className="pt-8 border-t border-slate-100">
            <p className="text-xs font-bold uppercase tracking-widest mb-4 text-slate-400">Didn't receive the email?</p>
            <button className="h-10 px-6 rounded-xl text-sm font-black border-2 border-slate-200 text-slate-700 transition-all hover:bg-slate-50 active:scale-95">
              Resend link
            </button>
          </div>
        </div>
      )}
    </>
  );

  if (isUnified) return formContent;

  return (
    <AuthLayout
      title={step === 1 ? 'Create your account' : 'Check your inbox'}
      subtitle={step === 1 ? 'Start your fluency journey today — it\'s free' : `We sent a verification link to ${userEmail}`}
    >
      {formContent}

      {step === 1 && (
        <>
          <div className="flex items-center gap-3 py-6">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <p className="text-center text-sm font-medium text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-black text-teal-600 hover:underline">
              Sign in
            </Link>
          </p>
        </>
      )}

      {step === 2 && (
        <Link
          to="/login"
          className="block text-center text-sm font-bold mt-8 text-teal-600 hover:underline"
        >
          Back to sign in
        </Link>
      )}
    </AuthLayout>
  );
};

export default RegisterPage;
