import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import AuthLayout from '../../components/layout/AuthLayout';
import OTPInput from '../../components/shared/OTPInput';
import { authService } from '../../services/authService';

const VerifyEmailPage = () => {
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'your email';

  const handleComplete = async (otp) => {
    setIsError(false);
    try {
      await authService.verifyEmail(otp);
      toast.success('Email verified successfully!');
      navigate('/login');
    } catch (err) {
      setIsError(true);
      toast.error('Invalid or expired code. Please try again.');
    }
  };

  return (
    <AuthLayout 
      title="Verify Email" 
      subtitle={`Enter the 6-digit code sent to ${email}`}
    >
      <div className="space-y-8">
        <OTPInput 
          length={6} 
          onComplete={handleComplete} 
          error={isError}
        />

        <div className="text-center space-y-4">
          <p className="text-sm text-slate-500">
            Didn't receive a code?{' '}
            <button className="text-primary font-bold hover:underline">
              Resend
            </button>
          </p>

          <Link to="/login" className="block text-slate-400 text-sm hover:text-slate-600">
            Back to Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
