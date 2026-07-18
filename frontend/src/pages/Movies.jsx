import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import MovieSlider from '../components/movies/MovieSlider';
import movieService from '../services/movieService';
import './Movies.css';

const Movies = () => {
  const location = useLocation();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    sort: 'popular',
    genre: '',
    year: '',
    rating: '',
  });
  const [genres, setGenres] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('search');
    if (query) {
      setSearchQuery(query);
    }
  }, [location]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        let results;
        if (searchQuery) {
          const data = await movieService.searchMovies(searchQuery);
          results = data.results || [];
        } else {
          switch (filters.sort) {
            case 'popular':
              const popularData = await movieService.getPopular();
              results = popularData.results || [];
              break;
            case 'top_rated':
              const topRatedData = await movieService.getTopRated();
              results = topRatedData.results || [];
              break;
            case 'upcoming':
              const upcomingData = await movieService.getUpcoming();
              results = upcomingData.results || [];
              break;
            default:
              const defaultData = await movieService.getPopular();
              results = defaultData.results || [];
          }
        }

        // Apply filters
        let filtered = results;
        if (filters.genre) {
          filtered = filtered.filter(movie => 
            movie.genre_ids?.includes(parseInt(filters.genre))
          );
        }
        if (filters.year) {
          filtered = filtered.filter(movie => 
            movie.release_date?.startsWith(filters.year)
          );
        }
        if (filters.rating) {
          const rating = parseFloat(filters.rating);
          filtered = filtered.filter(movie => 
            movie.vote_average >= rating
          );
        }

        setMovies(filtered);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setError('Failed to load movies');
        setLoading(false);
      }
    };

    fetchMovies();
  }, [filters, searchQuery]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await movieService.getGenres();
        setGenres(data.genres || []);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const query = form.search.value.trim();
    if (query) {
      setSearchQuery(query);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    document.querySelector('input[name="search"]').value = '';
  };

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setFilters({ sort: 'popular', genre: '', year: '', rating: '' });
    document.querySelector('input[name="search"]').value = '';
  };

  // Split movies into two rows for horizontal scroll
  const splitMoviesIntoRows = (moviesList) => {
    const midPoint = Math.ceil(moviesList.length / 2);
    return {
      row1: moviesList.slice(0, midPoint),
      row2: moviesList.slice(midPoint)
    };
  };

  const { row1, row2 } = splitMoviesIntoRows(movies);

  if (loading) {
    return (
      <div className="movies-loading">
        <div className="loading-spinner"></div>
        <p>Loading movies...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Movies - MovieVerse</title>
        <meta name="description" content="Browse and discover movies on MovieVerse. Search, filter, and find your next favorite film." />
      </Helmet>

      <div className="movies-page">
        <div className="movies-container">
          <div className="movies-header">
            <h1 className="movies-title">
              {searchQuery ? `Search Results: "${searchQuery}"` : 'Movies'}
            </h1>
            <p className="movies-subtitle">
              {searchQuery 
                ? `Found ${movies.length} movies matching your search` 
                : 'Discover amazing movies from around the world'}
            </p>
          </div>

          {/* Search and Filters - Inline Row */}
          <div className="search-filters-row">
            {/* Search Form with Icon on Right */}
            <form className="search-form" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                name="search"
                placeholder="Search movies..."
                defaultValue={searchQuery}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                <FiSearch />
              </button>
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={handleClearSearch}
                >
                  ×
                </button>
              )}
            </form>

            {/* Filters - Inline Row */}
            <div className="filters-row">
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="filter-select"
              >
                <option value="popular">Popular</option>
                <option value="top_rated">Top Rated</option>
                <option value="upcoming">Upcoming</option>
              </select>

              <select
                value={filters.genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                className="filter-select"
              >
                <option value="">Genres</option>
                {genres.map(genre => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>

              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="filter-select"
              >
                <option value="">Years</option>
                {Array.from({ length: 30 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>

              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                className="filter-select"
              >
                <option value="">Ratings</option>
                <option value="8">8+ Stars</option>
                <option value="7">7+ Stars</option>
                <option value="6">6+ Stars</option>
                <option value="5">5+ Stars</option>
              </select>
            </div>
          </div>

          {movies.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="movies-results"
            >
              {/* Row 1 - Horizontal Scroll */}
              {row1.length > 0 && (
                <div className="movies-row">
                  <MovieSlider movies={row1} />
                </div>
              )}
              
              {/* Row 2 - Horizontal Scroll */}
              {row2.length > 0 && (
                <div className="movies-row">
                  <MovieSlider movies={row2} />
                </div>
              )}
            </motion.div>
          ) : (
            <div className="no-results">
              <h2>No movies found</h2>
              <p>Try adjusting your filters or search terms</p>
              <button
                className="btn-primary"
                onClick={handleClearAllFilters}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Movies;