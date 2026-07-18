import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BiHome } from 'react-icons/bi';
import './NotFound.css';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found</title>
      </Helmet>

      <div className="not-found-page">
        <div className="not-found-container">
          <h1 className="not-found-code">404</h1>
          <h2 className="not-found-title">Page Not Found</h2>
          <p className="not-found-description">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="btn-primary not-found-btn">
            <BiHome /> Back to Home
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;