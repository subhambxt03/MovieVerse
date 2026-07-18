import React from 'react';
import { Link } from 'react-router-dom';
import { BiHeart, BiBookmarkPlus } from 'react-icons/bi';
import './MovieGrid.css';

const MovieGrid = ({ movies, columns = 4 }) => {
  if (!movies || movies.length === 0) {
    return <div className="grid-empty">No movies available</div>;
  }

  const gridStyle = {
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
  };

  return (
    <div className="movie-grid" style={gridStyle}>
      {movies.map((movie) => (
        <div key={movie.id} className="grid-card">
          <Link to={`/movie/${movie.id}`} className="grid-link">
            <div className="grid-poster">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  loading="lazy"
                />
              ) : (
                <div className="no-poster">No Poster</div>
              )}
              <div className="grid-overlay">
                <button className="grid-btn watchlist">
                  <BiBookmarkPlus />
                </button>
                <button className="grid-btn favorite">
                  <BiHeart />
                </button>
              </div>
              <div className="grid-rating">
                ⭐ {movie.vote_average?.toFixed(1) || 'N/A'}
              </div>
            </div>
            <div className="grid-info">
              <h3 className="grid-title">{movie.title}</h3>
              <div className="grid-meta">
                <span className="grid-year">
                  {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                </span>
                {movie.genres && movie.genres.length > 0 && (
                  <span className="grid-genre">{movie.genres[0]}</span>
                )}
              </div>
              <button className="grid-details-btn">View Details</button>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default MovieGrid;