import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IoPlayCircle, IoInformationCircle } from 'react-icons/io5';
import './HeroBanner.css';

const HeroBanner = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (movies.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [movies]);

  if (!movies || movies.length === 0) {
    return null;
  }

  const movie = movies[currentIndex];
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : '';

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '';

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : 'N/A';

  const voteAverage = movie.vote_average
    ? movie.vote_average.toFixed(1)
    : 'N/A';

  const genres = movie.genre_ids || [];

  return (
    <div className="hero-banner">
      <div
        className="hero-backdrop"
        style={{
          backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'none',
          backgroundColor: '#0B0F19',
        }}
      >
        <div className="hero-overlay"></div>
      </div>

      <div className="hero-content">
        <div className="hero-container">
          <div className="hero-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="hero-info"
              >
                <h1 className="hero-title">{movie.title}</h1>
                <div className="hero-meta">
                  <span className="hero-rating">
                    ⭐ {voteAverage}
                  </span>
                  <span className="hero-year">{releaseYear}</span>
                  <span className="hero-genres">
                    {genres.slice(0, 3).join(' • ')}
                  </span>
                </div>
                <p className="hero-overview">{movie.overview}</p>
                <div className="hero-actions">
                  <Link to={`/movie/${movie.id}`} className="hero-btn primary">
                    <IoPlayCircle /> Watch Trailer
                  </Link>
                  <Link to={`/movie/${movie.id}`} className="hero-btn secondary">
                    <IoInformationCircle /> More Details
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="hero-right">
            <AnimatePresence mode="wait">
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="hero-poster"
              >
                {posterUrl && (
                  <img src={posterUrl} alt={movie.title} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {movies.length > 1 && (
          <div className="hero-indicators">
            {movies.map((_, index) => (
              <button
                key={index}
                className={`hero-indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroBanner;