import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';
import { authService } from '../../services/authService';

const forgotSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const ForgotPasswordPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <AuthLayout 
        title="Check Your Email" 
        subtitle="We've sent recovery instructions"
      >
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="text-primary w-10 h-10" />
          </div>
          <p className="text-slate-600 text-sm">
            If an account exists for that email, you will receive a link shortly to reset your password.
          </p>
          <Link to="/login" className="inline-flex items-center text-primary font-bold hover:underline">
            <ArrowLeft size={16} className="mr-2" />
            Back to Login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Forgot Password?" 
      subtitle="Enter your email to reset your password"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Email Address"
          {...register('email')}
          error={errors.email?.message}
          placeholder="name@example.com"
        />

        <Button
          type="submit"
          loading={isLoading}
          className="w-full"
        >
          Send Reset Link
        </Button>

        <p className="text-center">
          <Link to="/login" className="inline-flex items-center text-slate-500 text-sm font-semibold hover:text-slate-900 transition-colors">
            <ArrowLeft size={14} className="mr-2" />
            Back to Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
