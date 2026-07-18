import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { BiHeart, BiBookmarkPlus } from 'react-icons/bi';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './MovieSlider.css';

const MovieSlider = ({ movies }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  if (!movies || movies.length === 0) {
    return <div className="slider-empty">No movies available</div>;
  }

  return (
    <div className="movie-slider">
      <Slider {...settings}>
        {movies.map((movie) => (
          <div key={movie.id} className="slider-item">
            <div className="slider-card">
              <Link to={`/movie/${movie.id}`} className="slider-link">
                <div className="slider-poster">
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      loading="lazy"
                    />
                  ) : (
                    <div className="no-poster">No Poster</div>
                  )}
                  <div className="slider-overlay">
                    <button className="overlay-btn watchlist-btn">
                      <BiBookmarkPlus />
                    </button>
                    <button className="overlay-btn favorite-btn">
                      <BiHeart />
                    </button>
                  </div>
                  <div className="slider-rating">
                    ⭐ {movie.vote_average?.toFixed(1) || 'N/A'}
                  </div>
                </div>
                <div className="slider-info">
                  <h3 className="slider-title">{movie.title}</h3>
                  <div className="slider-meta">
                    <span className="slider-year">
                      {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MovieSlider;