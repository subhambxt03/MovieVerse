import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BiHeart, BiBookmarkPlus, BiBookmark } from 'react-icons/bi';
import { useAuth } from '../../context/AuthContext';
import watchlistService from '../../services/watchlistService';
import './MovieCard.css';

const MovieCard = ({ movie, showWatchlistBtn = true, showFavoriteBtn = true }) => {
  const { isAuthenticated } = useAuth();
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : 'N/A';

  const rating = movie.vote_average
    ? movie.vote_average.toFixed(1)
    : 'N/A';

  const handleWatchlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    try {
      if (inWatchlist) {
        await watchlistService.removeFromWatchlist(movie.id);
        setInWatchlist(false);
      } else {
        await watchlistService.addToWatchlist(movie.id);
        setInWatchlist(true);
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.id}`} className="movie-card-link">
        <div className="movie-card-poster">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title}
              loading="lazy"
              className="movie-card-image"
            />
          ) : (
            <div className="movie-card-no-poster">
              <span>No Poster</span>
            </div>
          )}
          
          <div className="movie-card-overlay">
            {showWatchlistBtn && (
              <button
                className={`movie-card-btn watchlist-btn ${inWatchlist ? 'active' : ''}`}
                onClick={handleWatchlistToggle}
                disabled={loading}
                title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              >
                {inWatchlist ? <BiBookmark /> : <BiBookmarkPlus />}
              </button>
            )}
            {showFavoriteBtn && (
              <button
                className={`movie-card-btn favorite-btn ${isFavorite ? 'active' : ''}`}
                onClick={handleFavoriteToggle}
                title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              >
                <BiHeart />
              </button>
            )}
          </div>

          <div className="movie-card-rating">
            ⭐ {rating}
          </div>
        </div>

        <div className="movie-card-info">
          <h3 className="movie-card-title">{movie.title}</h3>
          <div className="movie-card-meta">
            <span className="movie-card-year">{releaseYear}</span>
            {movie.genres && movie.genres.length > 0 && (
              <span className="movie-card-genre">{movie.genres[0]}</span>
            )}
          </div>
          <button className="movie-card-details-btn">
            View Details
          </button>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;