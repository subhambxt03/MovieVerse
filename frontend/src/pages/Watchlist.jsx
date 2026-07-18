import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { BiTrash, BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import watchlistService from '../services/watchlistService';
import './Watchlist.css';

const Watchlist = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await watchlistService.getWatchlist();
        setMovies(data.movies || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching watchlist:', error);
        setError('Failed to load watchlist');
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  const handleRemove = async (movieId) => {
    try {
      await watchlistService.removeFromWatchlist(movieId);
      const updatedMovies = movies.filter(m => m.movie_id !== movieId);
      setMovies(updatedMovies);
      if (currentIndex >= updatedMovies.length) {
        setCurrentIndex(Math.max(0, updatedMovies.length - 1));
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const filteredMovies = movies.filter(movie => {
    const title = movie.movie_data?.title?.toLowerCase() || '';
    return title.includes(searchTerm.toLowerCase());
  });

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? filteredMovies.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === filteredMovies.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredMovies.length]);

  if (loading) {
    return (
      <div className="watchlist-loading">
        <div className="loading-spinner"></div>
        <p>Loading your watchlist...</p>
      </div>
    );
  }

  const currentMovie = filteredMovies.length > 0 ? filteredMovies[currentIndex] : null;

  return (
    <>
      <Helmet>
        <title>My Watchlist - MovieVerse</title>
        <meta name="description" content="Your personalized movie watchlist. Keep track of movies you want to watch." />
      </Helmet>

      <div className="watchlist-page">
        <div className="watchlist-container">
          <div className="watchlist-header">
            <h1 className="watchlist-title">My Watchlist</h1>
            <p className="watchlist-count">
              {movies.length} {movies.length === 1 ? 'movie' : 'movies'} in your watchlist
            </p>
          </div>

          <div className="watchlist-search">
            <input
              type="text"
              placeholder="Search your watchlist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {filteredMovies.length > 0 ? (
            <>
              {/* ✅ MOBILE: Single Movie Carousel - Poster Left, Info Right */}
              {isMobile ? (
                <div className="watchlist-carousel-wrapper">
                  <button className="watchlist-arrow watchlist-arrow-left" onClick={goToPrevious}>
                    <BiChevronLeft />
                  </button>

                  <div className="watchlist-carousel-container">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.4 }}
                        className="watchlist-carousel-slide"
                      >
                        {currentMovie && (() => {
                          const movie = currentMovie.movie_data;
                          const posterUrl = movie?.poster_path
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                            : '';

                          return (
                            <div className="watchlist-carousel-card">
                              {/* Poster - Left Side */}
                              <div className="watchlist-carousel-poster">
                                {posterUrl ? (
                                  <img src={posterUrl} alt={movie?.title} />
                                ) : (
                                  <div className="no-poster">No Poster</div>
                                )}
                              </div>

                              {/* Info - Right Side */}
                              <div className="watchlist-carousel-info">
                                <h3 className="watchlist-carousel-title">
                                  {movie?.title || 'Unknown'}
                                </h3>
                                <div className="watchlist-carousel-meta">
                                  <span className="watchlist-carousel-year">
                                    {movie?.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                                  </span>
                                  {movie?.vote_average && (
                                    <span className="watchlist-carousel-rating">
                                      ⭐ {movie.vote_average.toFixed(1)}
                                    </span>
                                  )}
                                </div>
                                <div className="watchlist-carousel-actions">
                                  <Link 
                                    to={`/movie/${currentMovie.movie_id}`} 
                                    className="watchlist-carousel-btn primary"
                                  >
                                    View Details
                                  </Link>
                                  <button
                                    className="watchlist-carousel-btn danger"
                                    onClick={() => handleRemove(currentMovie.movie_id)}
                                  >
                                    <BiTrash /> Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </motion.div>
                    </AnimatePresence>

                    {/* Dots */}
                    <div className="watchlist-carousel-dots">
                      {filteredMovies.map((_, index) => (
                        <button
                          key={index}
                          className={`watchlist-carousel-dot ${index === currentIndex ? 'active' : ''}`}
                          onClick={() => goToSlide(index)}
                        />
                      ))}
                    </div>
                  </div>

                  <button className="watchlist-arrow watchlist-arrow-right" onClick={goToNext}>
                    <BiChevronRight />
                  </button>
                </div>
              ) : (
                /* ✅ DESKTOP: Grid Layout with View Details & Remove in One Row */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="watchlist-grid"
                >
                  {filteredMovies.map((item) => {
                    const movie = item.movie_data;
                    const posterUrl = movie?.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : '';

                    return (
                      <div key={item.id} className="watchlist-card">
                        <Link to={`/movie/${item.movie_id}`} className="watchlist-link">
                          <div className="watchlist-poster">
                            {posterUrl ? (
                              <img src={posterUrl} alt={movie?.title} />
                            ) : (
                              <div className="no-poster">No Poster</div>
                            )}
                          </div>
                          <div className="watchlist-info">
                            <h3 className="watchlist-movie-title">{movie?.title || 'Unknown'}</h3>
                            <div className="watchlist-meta">
                              <span className="watchlist-year">
                                {movie?.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                              </span>
                              {movie?.vote_average && (
                                <span className="watchlist-rating">
                                  ⭐ {movie.vote_average.toFixed(1)}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                        {/* ✅ Desktop: View Details & Remove in One Row */}
                        <div className="watchlist-actions-row">
                          <Link 
                            to={`/movie/${item.movie_id}`} 
                            className="watchlist-details-btn"
                          >
                            View Details
                          </Link>
                          <button
                            className="watchlist-remove-btn"
                            onClick={() => handleRemove(item.movie_id)}
                          >
                            <BiTrash /> Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </>
          ) : (
            <div className="watchlist-empty">
              <h2>Your watchlist is empty</h2>
              <p>Start adding movies you want to watch!</p>
              {/* ✅ Desktop: Smaller Browse Movies button */}
              <Link to="/movies" className="btn-primary btn-small">
                Browse Movies
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Watchlist;