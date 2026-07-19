import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { BiArrowBack } from 'react-icons/bi';
import authService from '../services/authService';
import './Auth.css';

const ResetPasswordDirect = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate email
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      toast.error('Please enter a valid email address');
      return;
    }
    
    // Validate password match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }
    
    // Validate password length
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      console.log('🔑 Direct password reset for:', email);
      const result = await authService.resetPasswordDirect(email, newPassword, confirmPassword);
      console.log('✅ Reset response:', result);
      
      setSuccess('Password reset successfully! Redirecting to login...');
      toast.success('Password reset successfully!');
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('❌ Reset error:', error);
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
              <p className="auth-subtitle">Enter your email and set a new password</p>
            </div>

            {error && <div className="auth-error">{error}</div>}
            {success && <div className="auth-success">{success}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  required
                  placeholder="Enter your registered email"
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
                  placeholder="Confirm your new password"
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

export default ResetPasswordDirect;