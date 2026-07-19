import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BiArrowBack } from 'react-icons/bi';
import './Auth.css';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const handleDirectReset = () => {
    navigate('/reset-password-direct');
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password - MovieVerse</title>
      </Helmet>

      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <button className="auth-back-btn" onClick={() => navigate(-1)}>
              <BiArrowBack /> Back
            </button>

            <div className="auth-header">
              <h1 className="auth-title">Forgot Password</h1>
              <p className="auth-subtitle">Enter your email to reset your password directly</p>
            </div>

            <div className="reset-options">
              <button 
                className="btn-primary auth-btn" 
                onClick={handleDirectReset}
              >
                Reset Password
              </button>
            </div>

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