import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UnifiedAuth from './pages/auth/UnifiedAuth';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import { AuthProvider } from './context/AuthContext';
import { DashboardProvider } from './context/DashboardContext';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Toast from './components/shared/Toast';
import Dashboard from './pages/Dashboard';
import RecordingStudio from './pages/RecordingStudio';
import Analytics from './pages/Analytics';
import SessionDetail from './pages/SessionDetail';
import Practice from './pages/Practice';
import Settings from './pages/Settings';
import AiAssistant from './pages/AiAssistant';
import SupportCenter from './pages/SupportCenter';
import AdminDashboard from './pages/AdminDashboard';
import AdminOverview from './pages/admin/AdminOverview';
import AdminPlaceholder from './pages/admin/AdminPlaceholder';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<UnifiedAuth />} />
          <Route path="/register" element={<UnifiedAuth />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />

          {/* Protected Routes */}
          <Route element={
            <ProtectedRoute>
              <DashboardProvider>
                <MainLayout />
              </DashboardProvider>
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="recording" element={<RecordingStudio />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="sessions/:id" element={<SessionDetail />} />
            <Route path="practice" element={<Practice />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<SupportCenter />} />
            <Route path="assistant" element={<AiAssistant />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin Route - Separate Layout */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }>
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<AdminPlaceholder title="User Management" description="Manage platform users and access controls." />} />
            <Route path="sessions" element={<AdminPlaceholder title="Global Sessions" description="View and analyze system-wide recording sessions." />} />
            <Route path="system" element={<AdminPlaceholder title="System Status" description="Monitor server health, API quotas, and database metrics." />} />
            <Route path="settings" element={<AdminPlaceholder title="Admin Settings" description="Configure global platform variables." />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toast />
    </AuthProvider>
  );
}

export default App;
