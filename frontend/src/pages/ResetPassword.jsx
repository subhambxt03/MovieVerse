import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { BiArrowBack } from 'react-icons/bi';
import authService from '../services/authService';
import './Auth.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (!token) {
      setError('Invalid or missing reset token');
      toast.error('Invalid or missing reset token');
      return;
    }

    setLoading(true);

    try {
      console.log('🔑 Resetting password with token:', token.substring(0, 20) + '...');
      const response = await authService.resetPassword(token, password);
      console.log('✅ Reset password response:', response);
      
      setSuccess('Password reset successfully! Redirecting to login...');
      toast.success('Password reset successfully!');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('❌ Reset password error:', error);
      const errorMsg = error.response?.data?.error || 'Failed to reset password';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/login');
  };

  // If no token, show error
  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1 className="auth-title">Invalid Reset Link</h1>
              <p className="auth-subtitle">The password reset link is missing or invalid.</p>
            </div>
            <Link to="/login" className="btn-primary auth-btn">Back to Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Reset Password - MovieVerse</title>
      </Helmet>

      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            {/* Back Button */}
            <button className="auth-back-btn" onClick={handleGoBack}>
              <BiArrowBack /> Back to Login
            </button>

            <div className="auth-header">
              <h1 className="auth-title">Reset Password</h1>
              <p className="auth-subtitle">Create a new password for your account</p>
            </div>

            {error && <div className="auth-error">{error}</div>}
            {success && <div className="auth-success">{success}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  required
                  placeholder="Enter new password (min 6 characters)"
                  minLength="6"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input"
                  required
                  placeholder="Confirm new password"
                />
              </div>
              <button 
                type="submit" 
                className="btn-primary auth-btn" 
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Remember your password? <Link to="/login">Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;