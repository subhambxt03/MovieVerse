import { useState, useEffect } from 'react';

/**
 * Custom hook for tracking scroll position
 * 
 * @returns {Object} Scroll position and direction
 * @property {number} y - Current scroll Y position
 * @property {number} x - Current scroll X position
 * @property {string} direction - Scroll direction ('up' or 'down')
 * 
 * @example
 * const { y, direction } = useScroll();
 * // Show/hide navbar based on scroll
 * const isNavbarVisible = y < 100 || direction === 'up';
 */
const useScroll = () => {
  const [scroll, setScroll] = useState({
    y: 0,
    x: 0,
    direction: 'up',
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let lastY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const currentX = window.scrollX;
          
          setScroll({
            y: currentY,
            x: currentX,
            direction: currentY > lastY ? 'down' : 'up',
          });

          lastY = currentY;
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scroll;
};

export default useScroll;