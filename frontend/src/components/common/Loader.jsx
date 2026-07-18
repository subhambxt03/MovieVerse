import React from 'react';
import './Loader.css';

const Loader = ({ size = 'medium', fullScreen = false }) => {
  const classes = [
    'loader',
    `loader-${size}`,
    fullScreen ? 'loader-fullscreen' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div className="loader-spinner"></div>
    </div>
  );
};

export default Loader;