import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  BiUser,
  BiMenu,
  BiX,
  BiBookmark,
  BiLogOut
} from 'react-icons/bi'; 
import { FiSearch } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/login');
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    clearTimeout(searchTimeoutRef.current);
    if (query.length > 2) {
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          // Implement search suggestions
        } catch (error) {
          console.error('Search error:', error);
        }
      }, 300);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  // Handle Enter key for search
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchSubmit(e);
    }
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '';
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-left">
          <button 
            className="mobile-menu-btn" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <BiX /> : <BiMenu />}
          </button>
          
          <Link to="/" className="navbar-logo" onClick={() => setIsMenuOpen(false)}>
            <span className="logo-text">MovieVerse</span>
          </Link>
          
          <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/movies" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Movies
            </Link>
            {isAuthenticated && (
              <Link to="/watchlist" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Watchlist
              </Link>
            )}
          </div>
        </div>

        <div className="navbar-right">
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <FiSearch className="search-icon-btn" />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={handleSearch}
              onKeyDown={handleKeyDown}
              className="search-input"
              aria-label="Search movies"
            />
          </form>

  

          {isAuthenticated ? (
            <div className="profile-container" ref={profileRef}>
              <button
                className="profile-btn"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                aria-label="Profile menu"
              >
                {user?.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt={user.name}
                    className="profile-avatar"
                  />
                ) : (
                  <div className="profile-avatar-initial">
                    {getInitials(user?.name)}
                  </div>
                )}
                <span className="profile-name-display">{user?.name}</span>
              </button>

              {isProfileOpen && (
                <div className="profile-dropdown">
                  <div className="profile-header">
                    {user?.profile_image ? (
                      <img
                        src={user.profile_image}
                        alt={user.name}
                        className="dropdown-avatar"
                      />
                    ) : (
                      <div className="dropdown-avatar-initial">
                        {getInitials(user?.name)}
                      </div>
                    )}
                    <div className="profile-info">
                      <div className="profile-name">{user?.name}</div>
                      <div className="profile-email">{user?.email}</div>
                    </div>
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  <Link to="/profile" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                    <BiUser className="icon" /> My Profile
                  </Link>
                  <Link to="/watchlist" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                    <BiBookmark className="icon" /> Watchlist
                  </Link>
                  
                  <div className="dropdown-divider"></div>
                  
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <BiLogOut className="icon" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-btn">
              Sign In
            </Link>
          )}
        </div>
      </div>
      
    </nav>
  );
};

export default Navbar;