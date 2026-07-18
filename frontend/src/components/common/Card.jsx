import React from 'react';
import './Card.css';

const Card = ({ children, className = '', hoverable = true }) => {
  const classes = [
    'card',
    hoverable ? 'card-hoverable' : '',
    className
  ].filter(Boolean).join(' ');

  return <div className={classes}>{children}</div>;
};

export default Card;