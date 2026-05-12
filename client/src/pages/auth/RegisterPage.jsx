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
const RegisterPage = () => {
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

  return (
    <AuthLayout
      title={step === 1 ? 'Create your account' : 'Check your inbox'}
      subtitle={step === 1 ? 'Start your fluency journey today — it\'s free' : `We sent a verification link to ${userEmail}`}
    >

      {/* ── Step indicator ── */}
      {step === 1 && (
        <div className="flex items-center gap-2 mb-7">
          {[1, 2].map((s, i) => (
            <React.Fragment key={s}>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  background: step >= s ? T.teal : '#F3F4F6',
                  color:      step >= s ? '#fff'  : T.muted,
                }}
              >{s}</div>
              {i === 0 && (
                <div className="flex-1 h-0.5 rounded-full" style={{ background: step >= 2 ? T.teal : '#E5E7EB' }} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* ── Step 1: Registration form ── */}
      {step === 1 && (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

          {/* Full name */}
          <Field label="Full name" error={errors.name?.message}>
            <StyledInput
              {...register('name')}
              placeholder="Hassan Ali"
              autoComplete="name"
              error={errors.name?.message}
            />
          </Field>

          {/* Email */}
          <Field label="Email address" error={errors.email?.message}>
            <StyledInput
              {...register('email')}
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              error={errors.email?.message}
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
                className="w-full h-12 px-4 pr-12 rounded-xl text-sm outline-none transition-all"
                style={{
                  border: `1.5px solid ${errors.password ? T.error : T.border}`,
                  color: T.text,
                  background: '#fff',
                }}
                onFocus={e => { if (!errors.password) e.target.style.borderColor = T.teal; e.target.style.boxShadow = '0 0 0 3px rgba(13,148,136,0.10)'; }}
                onBlur={e  => { e.target.style.borderColor = errors.password ? T.error : T.border; e.target.style.boxShadow = 'none'; }}
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
                className="w-full h-12 px-4 pr-12 rounded-xl text-sm outline-none transition-all"
                style={{
                  border: `1.5px solid ${errors.confirmPassword ? T.error : T.border}`,
                  color: T.text,
                  background: '#fff',
                }}
                onFocus={e => { if (!errors.confirmPassword) e.target.style.borderColor = T.teal; e.target.style.boxShadow = '0 0 0 3px rgba(13,148,136,0.10)'; }}
                onBlur={e  => { e.target.style.borderColor = errors.confirmPassword ? T.error : T.border; e.target.style.boxShadow = 'none'; }}
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
                className="mt-0.5 w-4 h-4 rounded cursor-pointer flex-shrink-0"
                style={{ accentColor: T.teal }}
              />
              <label htmlFor="terms" className="text-xs leading-relaxed cursor-pointer" style={{ color: T.muted }}>
                I agree to the{' '}
                <Link to="/terms" className="font-semibold hover:underline" style={{ color: T.navy }}>Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="font-semibold hover:underline" style={{ color: T.navy }}>Privacy Policy</Link>
              </label>
            </div>
            {errors.agreeTerms && (
              <p className="text-xs mt-1 font-medium" style={{ color: T.error }}>{errors.agreeTerms.message}</p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70"
              style={{
                background: 'linear-gradient(135deg,#0D9488,#0891B2)',
                boxShadow: '0 4px 16px rgba(13,148,136,0.35)',
              }}
              onMouseEnter={e => { if (!isLoading) e.currentTarget.style.boxShadow = '0 8px 24px rgba(13,148,136,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(13,148,136,0.35)'; }}
            >
              {isLoading ? (
                <><Loader2 size={16} className="animate-spin" /> Creating account…</>
              ) : (
                <>Create account <ArrowRight size={16} /></>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px" style={{ background: T.border }} />
            <span className="text-xs font-medium" style={{ color: T.muted }}>or</span>
            <div className="flex-1 h-px" style={{ background: T.border }} />
          </div>

          {/* Login link */}
          <p className="text-center text-sm" style={{ color: T.muted }}>
            Already have an account?{' '}
            <Link to="/login" className="font-bold hover:underline" style={{ color: T.navy }}>
              Sign in
            </Link>
          </p>
        </form>
      )}

      {/* ── Step 2: Email sent ── */}
      {step === 2 && (
        <div className="text-center py-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: '#F0FDF9' }}
          >
            <Mail size={28} style={{ color: T.teal }} />
          </div>
          <p className="text-sm leading-relaxed mb-6" style={{ color: T.text }}>
            Please check your inbox and click the verification link to activate your account.
          </p>
          <div className="pt-5 border-t" style={{ borderColor: T.border }}>
            <p className="text-xs mb-4" style={{ color: T.muted }}>Didn't receive the email?</p>
            <button
              className="h-9 px-5 rounded-xl text-sm font-semibold border transition-colors hover:bg-slate-50"
              style={{ borderColor: T.border, color: T.navy }}
            >
              Resend link
            </button>
          </div>
          <Link
            to="/login"
            className="block text-sm mt-5 transition-colors hover:underline"
            style={{ color: T.muted }}
          >
            Back to sign in
          </Link>
        </div>
      )}

    </AuthLayout>
  );
};

export default RegisterPage;
