import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { BiArrowBack } from 'react-icons/bi';
import authService from '../services/authService';
import './Auth.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await authService.forgotPassword(email);
      setSuccess('Password reset link has been sent to your email.');
      toast.success('Check your email for reset instructions');
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to send reset email';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password - MovieVerse</title>
      </Helmet>

      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            {/* ✅ Back Button */}
            <button className="auth-back-btn" onClick={handleGoBack}>
              <BiArrowBack /> Back
            </button>

            <div className="auth-header">
              <h1 className="auth-title">Forgot Password</h1>
              <p className="auth-subtitle">Enter your email to reset your password</p>
            </div>

            {error && <div className="auth-error">{error}</div>}
            {success && <div className="auth-success">{success}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  required
                  placeholder="Enter your email"
                />
              </div>
              <button type="submit" className="btn-primary auth-btn" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPassword;