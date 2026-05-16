import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/layout/AuthLayout';
import {
  Eye, EyeOff, Loader2, ArrowRight, Mail, CheckCircle2
} from 'lucide-react';

/* ── Design tokens ── */
const T = {
  teal:   '#0D9488',
  navy:   '#0F2744',
  text:   '#374151',
  muted:  '#6B7280',
  border: '#E5E7EB',
  error:  '#DC2626',
};

/* ── Password strength ── */
function PasswordStrength({ password }) {
  const checks = [
    { label: '8+ characters', pass: password.length >= 8 },
    { label: 'Uppercase letter', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /\d/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  const colors = ['#E5E7EB', '#EF4444', '#F59E0B', '#0D9488'];
  const labels = ['', 'Weak', 'Fair', 'Strong'];

  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1.5">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ background: i <= score ? colors[score] : '#E5E7EB' }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {checks.map(({ label, pass }) => (
            <div key={label} className="flex items-center gap-1 text-[11px]" style={{ color: pass ? T.teal : T.muted }}>
              <CheckCircle2 size={11} strokeWidth={pass ? 2.5 : 1.5} />
              {label}
            </div>
          ))}
        </div>
        <span className="text-[11px] font-semibold" style={{ color: colors[score] }}>
          {labels[score]}
        </span>
      </div>
    </div>
  );
}

/* ── Validation schema ── */
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

/* ── Field component ── */
function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5" style={{ color: T.navy }}>{label}</label>
      {children}
      {error && <p className="text-xs mt-1.5 font-medium" style={{ color: T.error }}>{error}</p>}
    </div>
  );
}

function StyledInput({ error, ...props }) {
  return (
    <input
      {...props}
      className="w-full h-12 px-4 rounded-xl text-sm outline-none transition-all"
      style={{ border: `1.5px solid ${error ? T.error : T.border}`, color: T.text, background: '#fff' }}
      onFocus={e => { if (!error) e.target.style.borderColor = T.teal; e.target.style.boxShadow = '0 0 0 3px rgba(13,148,136,0.10)'; }}
      onBlur={e  => { e.target.style.borderColor = error ? T.error : T.border; e.target.style.boxShadow = 'none'; }}
    />
  );
}

/* ═══════════════════════════════════════ */
const RegisterPage = ({ isUnified = false }) => {
  const [step,       setStep]       = useState(1);
  const [isLoading,  setIsLoading]  = useState(false);
  const [userEmail,  setUserEmail]  = useState('');
  const [showPass,   setShowPass]   = useState(false);
  const [showConf,   setShowConf]   = useState(false);
  const { login } = useAuth();

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  const passwordValue = watch('password', '');

  const onSubmit = async (data) => {
    setIsLoading(true);
    setUserEmail(data.email);
    try {
      // TODO: Call register service
      setTimeout(() => { setIsLoading(false); setStep(2); }, 1500);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const formContent = (
    <>
      {/* ── Step indicator ── */}
      {step === 1 && (
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map((s, i) => (
            <React.Fragment key={s}>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all shadow-sm"
                style={{
                  background: step >= s ? T.teal : '#F1F5F9',
                  color:      step >= s ? '#fff'  : '#94A3B8',
                }}
              >{s}</div>
              {i === 0 && (
                <div className="flex-1 h-1 rounded-full bg-slate-100 overflow-hidden">
                   <div className="h-full transition-all duration-500" style={{ width: step >= 2 ? '100%' : '0%', background: T.teal }} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* ── Step 1: Registration form ── */}
      {step === 1 && (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

          {/* Full name */}
          <Field label="Full name" error={errors.name?.message}>
            <input
              {...register('name')}
              placeholder="Enter your full name"
              autoComplete="name"
              className="w-full h-12 px-4 rounded-xl text-sm outline-none transition-all border border-slate-200 focus:border-teal-500/40 focus:ring-4 focus:ring-teal-500/5"
              style={{ color: T.navy, background: '#fff' }}
            />
          </Field>

          {/* Email */}
          <Field label="Email address" error={errors.email?.message}>
            <input
              {...register('email')}
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              className="w-full h-12 px-4 rounded-xl text-sm outline-none transition-all border border-slate-200 focus:border-teal-500/40 focus:ring-4 focus:ring-teal-500/5"
              style={{ color: T.navy, background: '#fff' }}
            />
          </Field>

          {/* Password */}
          <Field label="Password" error={errors.password?.message}>
            <div className="relative">
              <input
                {...register('password')}
                type={showPass ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                className="w-full h-12 px-4 pr-12 rounded-xl text-sm outline-none transition-all border border-slate-200 focus:border-teal-500/40 focus:ring-4 focus:ring-teal-500/5"
                style={{ color: T.navy, background: '#fff' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1"
                style={{ color: T.muted }}
                tabIndex={-1}
              >
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            <PasswordStrength password={passwordValue} />
          </Field>

          {/* Confirm password */}
          <Field label="Confirm password" error={errors.confirmPassword?.message}>
            <div className="relative">
              <input
                {...register('confirmPassword')}
                type={showConf ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full h-12 px-4 pr-12 rounded-xl text-sm outline-none transition-all border border-slate-200 focus:border-teal-500/40 focus:ring-4 focus:ring-teal-500/5"
                style={{ color: T.navy, background: '#fff' }}
              />
              <button
                type="button"
                onClick={() => setShowConf(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1"
                style={{ color: T.muted }}
                tabIndex={-1}
              >
                {showConf ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </Field>

          {/* Terms */}
          <div>
            <div className="flex items-start gap-2.5 py-1">
              <input
                {...register('agreeTerms')}
                id="terms"
                type="checkbox"
                className="mt-1 w-4 h-4 rounded cursor-pointer flex-shrink-0"
                style={{ accentColor: T.teal }}
              />
              <label htmlFor="terms" className="text-xs leading-relaxed cursor-pointer font-medium" style={{ color: T.muted }}>
                I agree to the{' '}
                <Link to="/terms" className="font-bold text-teal-600 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="font-bold text-teal-600 hover:underline">Privacy Policy</Link>
              </label>
            </div>
            {errors.agreeTerms && (
              <p className="text-xs mt-1 font-medium" style={{ color: T.error }}>{errors.agreeTerms.message}</p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl font-black text-white text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-teal-500/20"
              style={{
                background: 'linear-gradient(135deg,#0D9488,#0891B2)',
              }}
            >
              {isLoading ? (
                <><Loader2 size={16} className="animate-spin" /> Creating account…</>
              ) : (
                <>Create account <ArrowRight size={16} /></>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ── Step 2: Email sent ── */}
      {step === 2 && (
        <div className="text-center py-4">
          <div
            className="w-16 h-16 rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-sm"
            style={{ background: '#F0FDF9' }}
          >
            <Mail size={28} style={{ color: T.teal }} />
          </div>
          <p className="text-sm font-medium leading-relaxed mb-8" style={{ color: T.text }}>
            Please check your inbox and click the verification link to activate your account.
          </p>
          <div className="pt-8 border-t border-slate-100">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: T.muted }}>Didn't receive the email?</p>
            <button
              className="h-10 px-6 rounded-xl text-sm font-black border-2 transition-all hover:bg-slate-50 active:scale-95"
              style={{ borderColor: T.border, color: T.navy }}
            >
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
          {/* Divider */}
          <div className="flex items-center gap-3 py-6">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Login link */}
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
