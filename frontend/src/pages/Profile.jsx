import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import { 
  BiUser, BiBookmark, BiEdit, BiLock, BiLogOut, BiCalendar, 
  BiArrowBack, BiStar, BiCheckCircle, BiCamera, BiTrash, 
  BiPhone, BiEnvelope
} from 'react-icons/bi';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import watchlistService from '../services/watchlistService';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profile_image: user?.profile_image || '',
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch real watchlist data
  useEffect(() => {
    const fetchWatchlistData = async () => {
      try {
        setLoadingStats(true);
        const data = await watchlistService.getWatchlist();
        const movies = data.movies || [];
        setWatchlistCount(movies.length);
        setWatchlistMovies(movies.slice(0, 6));
      } catch (error) {
        console.error('Error fetching watchlist:', error);
        setWatchlistCount(0);
        setWatchlistMovies([]);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchWatchlistData();
  }, []);

  const stats = {
    watchlist: watchlistCount,
    reviews: 0,
    joined: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const result = await updateProfile(formData);
    if (result.success) {
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } else {
      setError(result.error || 'Failed to update profile');
    }
    setLoading(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    if (passwordData.new_password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const result = await changePassword(
      passwordData.current_password,
      passwordData.new_password
    );
    if (result.success) {
      setSuccess('Password changed successfully!');
      setIsChangingPassword(false);
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } else {
      setError(result.error || 'Failed to change password');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setFormData({ ...formData, profile_image: imageUrl });
        // Update user context with new image
        updateProfile({ ...formData, profile_image: imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, profile_image: '' });
    // Update user context to remove image
    updateProfile({ ...formData, profile_image: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const getPosterUrl = (path) => {
    return path ? `https://image.tmdb.org/t/p/w185${path}` : '';
  };

  // If editing, show edit page
  if (isEditing) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <button className="profile-back-btn" onClick={() => setIsEditing(false)}>
            <BiArrowBack /> Back to Profile
          </button>
          <div className="profile-edit-form">
            <h2>Edit Profile</h2>
            
            {/* Profile Image Upload */}
            <div className="profile-image-upload">
              <div className="profile-image-container">
                {formData.profile_image ? (
                  <img src={formData.profile_image} alt="Profile" className="profile-upload-preview" />
                ) : (
                  <div className="profile-upload-placeholder">
                    {getInitials(user?.name)}
                  </div>
                )}
                <div className="profile-image-actions">
                  <button 
                    className="image-action-btn upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload Image"
                  >
                    <BiCamera />
                  </button>
                  {formData.profile_image && (
                    <button 
                      className="image-action-btn delete-btn"
                      onClick={handleRemoveImage}
                      title="Remove Image"
                    >
                      <BiTrash />
                    </button>
                  )}
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <p className="upload-hint">Click camera icon to upload profile image</p>
            </div>

            <form onSubmit={handleProfileUpdate}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                  disabled
                />
                <small className="form-hint">Email cannot be changed</small>
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="form-input"
                  placeholder="Enter your phone number"
                />
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // If changing password, show password page
  if (isChangingPassword) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <button className="profile-back-btn" onClick={() => setIsChangingPassword(false)}>
            <BiArrowBack /> Back to Profile
          </button>
          <div className="profile-edit-form">
            <h2>Change Password</h2>
            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  className="form-input"
                  required
                  minLength="6"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </form>

            {/* Forgot Password Section */}
            <div className="forgot-password-section">
              <p>Forgot your current password?</p>
              <button 
                className="forgot-password-btn"
                onClick={handleForgotPassword}
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Profile - MovieVerse</title>
      </Helmet>

      <div className="profile-page">
        <div className="profile-container">
          {/* Back Button */}
          <button className="profile-back-btn" onClick={handleGoBack}>
            <BiArrowBack /> Back
          </button>

          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-avatar-large">
              {user?.profile_image ? (
                <img src={user.profile_image} alt={user?.name} />
              ) : (
                <div className="profile-avatar-initial-large">
                  {getInitials(user?.name)}
                </div>
              )}
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{user?.name || 'User'}</h1>
              <div className="profile-contact">
                <p className="profile-email">
                  <BiEnvelope className="contact-icon" /> {user?.email || 'No email'}
                </p>
                {user?.phone && (
                  <p className="profile-phone">
                    <BiPhone className="contact-icon" /> {user.phone}
                  </p>
                )}
              </div>
              <div className="profile-joined">
                <BiCalendar className="joined-icon" />
                <span>Joined {stats.joined}</span>
              </div>
            </div>
            <div className="profile-actions">
              <button
                className="profile-action-btn"
                onClick={() => setIsEditing(true)}
              >
                <BiEdit /> Edit Profile
              </button>
              <button
                className="profile-action-btn"
                onClick={() => setIsChangingPassword(true)}
              >
                <BiLock /> Change Password
              </button>
              <button
                className="profile-action-btn logout-btn"
                onClick={handleLogout}
              >
                <BiLogOut /> Logout
              </button>
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {/* Account Settings - Above Statistics */}
          <div className="account-settings">
            <h2>Account Settings</h2>
            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-left">
                  <BiCheckCircle className="setting-icon verified" />
                  <span>Email Verified</span>
                </div>
                <span className="setting-status verified">Verified</span>
              </div>
              <div className="setting-item clickable" onClick={() => setIsChangingPassword(true)}>
                <div className="setting-left">
                  <BiLock className="setting-icon" />
                  <span>Change Password</span>
                </div>
                <span className="setting-arrow">→</span>
              </div>
              <div className="setting-item clickable logout-setting" onClick={handleLogout}>
                <div className="setting-left">
                  <BiLogOut className="setting-icon logout-icon" />
                  <span>Logout</span>
                </div>
                <span className="setting-arrow">→</span>
              </div>
            </div>
          </div>

          {/* Statistics Cards - One Row on Mobile */}
          <div className="profile-stats-grid">
            <div className="stat-card">
              <div className="stat-card-icon">
                <BiBookmark />
              </div>
              <div className="stat-card-info">
                <span className="stat-card-value">{loadingStats ? '...' : stats.watchlist}</span>
                <span className="stat-card-label">Watchlist</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon">
                <BiStar />
              </div>
              <div className="stat-card-info">
                <span className="stat-card-value">{stats.reviews}</span>
                <span className="stat-card-label">Reviews</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon">
                <BiCalendar />
              </div>
              <div className="stat-card-info">
                <span className="stat-card-value">{stats.joined}</span>
                <span className="stat-card-label">Member Since</span>
              </div>
            </div>
          </div>

          {/* Watchlist Preview */}
          {watchlistMovies.length > 0 && (
            <div className="watchlist-preview">
              <div className="watchlist-preview-header">
                <h2>Watchlist</h2>
                {watchlistCount > 6 && (
                  <Link to="/watchlist" className="view-all-btn">
                    View All →
                  </Link>
                )}
              </div>
              <div className="watchlist-preview-grid">
                {watchlistMovies.map((item) => {
                  const movie = item.movie_data;
                  const posterPath = movie?.poster_path;
                  return (
                    <Link 
                      to={`/movie/${item.movie_id}`} 
                      key={item.id} 
                      className="watchlist-preview-item"
                    >
                      {posterPath ? (
                        <img 
                          src={getPosterUrl(posterPath)} 
                          alt={movie?.title || 'Movie'} 
                          loading="lazy"
                        />
                      ) : (
                        <div className="no-poster-small">
                          <BiBookmark />
                        </div>
                      )}
                    </Link>
                  );
                })}
                {watchlistCount > 6 && (
                  <Link to="/watchlist" className="watchlist-preview-more">
                    <span>+{watchlistCount - 6} more</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;