import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import HeroBanner from '../components/movies/HeroBanner';
import MovieSlider from '../components/movies/MovieSlider';
import movieService from '../services/movieService';
import './Home.css';

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

     
        const [trendingData, popularData] = await Promise.all([
          movieService.getTrending('day', 1),
          movieService.getPopular(1),
        ]);

        setTrendingMovies(trendingData?.results || []);
        setPopularMovies(popularData?.results || []);
        
        setLoading(false);

        
        if (trendingData?.results && trendingData.results.length > 0) {
          const firstMovie = trendingData.results[0];
          try {
            const recommendations = await movieService.getRecommendations(firstMovie.id);
            setRecommendedMovies(recommendations?.results || []);
          } catch (recError) {
            console.warn('⚠️ Failed to load recommendations:', recError);
          }
        }
      } catch (error) {
        console.error('❌ Error fetching movies:', error);
        setError('Failed to load movies. Please try again.');
        setLoading(false);
      }
    };

    fetchMovies();

    return () => {
      fetchedRef.current = false;
    };
  }, []);


  if (loading) {
    return (
      <div className="home-loading">
        <div className="home-skeleton">
          <div className="skeleton-hero"></div>
          <div className="skeleton-section">
            <div className="skeleton-title"></div>
            <div className="skeleton-cards">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className="skeleton-card"></div>
              ))}
            </div>
          </div>
          <div className="skeleton-section">
            <div className="skeleton-title"></div>
            <div className="skeleton-cards">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className="skeleton-card"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-error">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>MovieVerse - Discover Amazing Movies</title>
        <meta name="description" content="Discover and explore amazing movies with MovieVerse. Get personalized recommendations and build your watchlist." />
      </Helmet>

      <div className="home-page">
      
        {trendingMovies.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <HeroBanner movies={trendingMovies} />
          </motion.div>
        )}

        
        {popularMovies.length > 0 && (
          <motion.section
            className="home-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="section-header">
              <h2 className="section-title">Popular Movies</h2>
              <a href="/movies?sort=popular" className="see-all">See All</a>
            </div>
            <MovieSlider movies={popularMovies} />
          </motion.section>
        )}

       
        {recommendedMovies.length > 0 && (
          <motion.section
            className="home-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="section-header">
              <h2 className="section-title">Recommended For You</h2>
              <a href="/movies" className="see-all">See All</a>
            </div>
            <MovieSlider movies={recommendedMovies} />
          </motion.section>
        )}
      </div>
    </>
  );
};

export default Home;