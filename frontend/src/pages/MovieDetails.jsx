import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { BiBookmark, BiBookmarkPlus, BiStar, BiTime, BiCalendar, BiDollar, BiUser, BiArrowBack } from 'react-icons/bi';
import { FaPlay } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import movieService from '../services/movieService';
import watchlistService from '../services/watchlistService';
import MovieSlider from '../components/movies/MovieSlider';
import './MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchMovieData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          movieData,
          creditsData,
          videosData,
          reviewsData,
          recData,
          similarData
        ] = await Promise.all([
          movieService.getMovieDetails(id),
          movieService.getMovieCredits(id),
          movieService.getMovieVideos(id),
          movieService.getMovieReviews(id),
          movieService.getRecommendations(id),
          movieService.getSimilarMovies(id),
        ]);

        setMovie(movieData);
        setCredits(creditsData);
        setVideos(videosData?.results || []);
        
        // ✅ Debug logs for reviews
        console.log('📝 Reviews API response:', reviewsData);
        console.log('📝 Reviews count:', reviewsData?.results?.length);
        
        setReviews(reviewsData?.results || []);
        setRecommendations(recData?.results || []);
        setSimilar(similarData?.results || []);

        if (isAuthenticated) {
          watchlistService.checkInWatchlist(id)
            .then(data => setInWatchlist(data.in_watchlist || false))
            .catch(() => setInWatchlist(false));
        }

        setLoading(false);
      } catch (error) {
        console.error('❌ Error fetching movie details:', error);
        setError('Failed to load movie details');
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieData();
    }

    return () => {
      fetchedRef.current = false;
    };
  }, [id, isAuthenticated]);

  const handleWatchlistToggle = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    try {
      if (inWatchlist) {
        await watchlistService.removeFromWatchlist(id);
        setInWatchlist(false);
      } else {
        await watchlistService.addToWatchlist(id);
        setInWatchlist(true);
      }
    } catch (error) {
      console.error('❌ Error toggling watchlist:', error);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="details-loading">
        <div className="details-skeleton">
          <div className="skeleton-hero"></div>
          <div className="skeleton-content">
            <div className="skeleton-poster"></div>
            <div className="skeleton-info">
              <div className="skeleton-title"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="details-error">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    );
  }

  const trailer = videos.find(video => video.type === 'Trailer' && video.site === 'YouTube');
  const director = credits?.crew?.find(person => person.job === 'Director');
  const cast = credits?.cast || [];
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '';
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : '';

  return (
    <>
      <Helmet>
        <title>{movie.title} - MovieVerse</title>
        <meta name="description" content={movie.overview?.slice(0, 160)} />
      </Helmet>

      <div className="movie-details">
        {/* Back Button */}
        <button className="details-back-btn" onClick={handleGoBack} aria-label="Go back">
          <BiArrowBack />
        </button>

        {/* Hero Section */}
        <div
          className="details-hero"
          style={{
            backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'none',
            backgroundColor: '#0B0F19',
          }}
        >
          <div className="details-hero-overlay"></div>
          <div className="details-container">
            <div className="details-content">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="details-poster"
              >
                {posterUrl ? (
                  <img src={posterUrl} alt={movie.title} />
                ) : (
                  <div className="no-poster">No Poster</div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="details-info"
              >
                <h1 className="details-title">{movie.title}</h1>
                {movie.tagline && (
                  <p className="details-tagline">{movie.tagline}</p>
                )}
                <div className="details-meta">
                  <span className="details-rating">
                    <BiStar /> {movie.vote_average?.toFixed(1) || 'N/A'}
                  </span>
                  <span className="details-year">
                    <BiCalendar /> {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                  </span>
                  <span className="details-runtime">
                    <BiTime /> {movie.runtime ? `${movie.runtime} min` : 'N/A'}
                  </span>
                </div>
                <div className="details-genres">
                  {movie.genres?.map((genre) => (
                    <span key={genre.id} className="details-genre">
                      {genre.name}
                    </span>
                  ))}
                </div>
                <p className="details-overview">{movie.overview}</p>
                <div className="details-actions">
                  {trailer && (
                    <a
                      href={`https://www.youtube.com/watch?v=${trailer.key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="details-btn primary"
                    >
                      <FaPlay /> Watch Trailer
                    </a>
                  )}
                  <button
                    className={`details-btn ${inWatchlist ? 'in-watchlist' : 'secondary'}`}
                    onClick={handleWatchlistToggle}
                  >
                    {inWatchlist ? <BiBookmark /> : <BiBookmarkPlus />}
                    {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Details Sections */}
        <div className="details-sections">
          <div className="details-container">
            {/* Production Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="details-section"
            >
              <h2 className="section-title">Production Information</h2>
              <div className="info-grid">
                {movie.status && (
                  <div className="info-item">
                    <span className="info-label">Status</span>
                    <span className="info-value">{movie.status}</span>
                  </div>
                )}
                {movie.budget > 0 && (
                  <div className="info-item">
                    <span className="info-label">Budget</span>
                    <span className="info-value">
                      ${movie.budget.toLocaleString()}
                    </span>
                  </div>
                )}
                {movie.revenue > 0 && (
                  <div className="info-item">
                    <span className="info-label">Revenue</span>
                    <span className="info-value">
                      ${movie.revenue.toLocaleString()}
                    </span>
                  </div>
                )}
                {director && (
                  <div className="info-item">
                    <span className="info-label">Director</span>
                    <span className="info-value">{director.name}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Top Cast */}
            {cast.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="details-section"
              >
                <h2 className="section-title">Top Cast</h2>
                <div className="cast-slider-wrapper">
                  <div className="cast-slider">
                    {cast.map((actor) => (
                      <div key={actor.cast_id} className="cast-card">
                        <div className="cast-avatar">
                          {actor.profile_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                              alt={actor.name}
                              loading="lazy"
                            />
                          ) : (
                            <div className="cast-placeholder">
                              <BiUser />
                            </div>
                          )}
                        </div>
                        <div className="cast-info">
                          <div className="cast-name">{actor.name}</div>
                          <div className="cast-character">{actor.character}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="details-section"
              >
                <h2 className="section-title">Recommendations</h2>
                <MovieSlider movies={recommendations} />
              </motion.div>
            )}

            {/* Similar Movies */}
            {similar.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="details-section"
              >
                <h2 className="section-title">Similar Movies</h2>
                <MovieSlider movies={similar} />
              </motion.div>
            )}

            {/* ✅ REVIEWS - Fixed Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="details-section"
            >
              <h2 className="section-title">Reviews</h2>
              
              {/* ✅ Show message if no reviews */}
              {reviews.length === 0 ? (
                <div className="no-reviews">
                  <p>No reviews available for this movie yet.</p>
                </div>
              ) : (
                <>
                  {/* Desktop Grid */}
                  <div className="reviews-grid">
                    {reviews.map((review) => (
                      <div key={review.id} className="review-card">
                        <div className="review-header">
                          <div className="review-author">
                            {review.author_details?.avatar_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w45${review.author_details.avatar_path}`}
                                alt={review.author}
                                className="review-avatar"
                              />
                            ) : (
                              <div className="review-avatar-placeholder">
                                {review.author?.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span className="review-name">{review.author}</span>
                          </div>
                          {review.author_details?.rating && (
                            <span className="review-rating">
                              ⭐ {review.author_details.rating}
                            </span>
                          )}
                        </div>
                        <p className="review-content">
                          {review.content?.slice(0, 200)}
                          {review.content?.length > 200 && '...'}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Mobile Slider */}
                  <div className="reviews-slider-wrapper">
                    <div className="reviews-slider">
                      {reviews.map((review) => (
                        <div key={review.id} className="review-card">
                          <div className="review-header">
                            <div className="review-author">
                              {review.author_details?.avatar_path ? (
                                <img
                                  src={`https://image.tmdb.org/t/p/w45${review.author_details.avatar_path}`}
                                  alt={review.author}
                                  className="review-avatar"
                                />
                              ) : (
                                <div className="review-avatar-placeholder">
                                  {review.author?.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <span className="review-name">{review.author}</span>
                            </div>
                            {review.author_details?.rating && (
                              <span className="review-rating">
                                ⭐ {review.author_details.rating}
                              </span>
                            )}
                          </div>
                          <p className="review-content">
                            {review.content?.slice(0, 200)}
                            {review.content?.length > 200 && '...'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieDetails;