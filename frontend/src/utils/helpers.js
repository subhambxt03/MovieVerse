/**
 * Utility helper functions
 */

/**
 * Format a date string to a readable format
 * @param {string} dateString - Date string to format
 * @param {string} format - Format to use (default: 'MMM D, YYYY')
 * @returns {string} Formatted date
 */
export const formatDate = (dateString, format = 'MMM D, YYYY') => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';

  const options = {
    'MMM': { month: 'short' },
    'MMMM': { month: 'long' },
    'D': { day: 'numeric' },
    'DD': { day: '2-digit' },
    'YYYY': { year: 'numeric' },
    'YY': { year: '2-digit' },
  };

  let result = format;
  for (const [key, option] of Object.entries(options)) {
    if (result.includes(key)) {
      const value = date.toLocaleDateString('en-US', option);
      result = result.replace(key, value);
    }
  }

  return result;
};

/**
 * Format a number to a readable format (e.g., 1000 -> 1K)
 * @param {number} num - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number
 */
export const formatNumber = (num, decimals = 1) => {
  if (num === undefined || num === null) return 'N/A';
  
  if (num >= 1e9) {
    return (num / 1e9).toFixed(decimals) + 'B';
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(decimals) + 'M';
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(decimals) + 'K';
  }
  return num.toString();
};

/**
 * Truncate text to a specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 100, suffix = '...') => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + suffix;
};

/**
 * Generate a random ID
 * @param {number} length - Length of the ID
 * @returns {string} Random ID
 */
export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Debounce a function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle a function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Get query parameters from URL
 * @returns {Object} Query parameters
 */
export const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
};

/**
 * Build URL with query parameters
 * @param {string} baseUrl - Base URL
 * @param {Object} params - Query parameters
 * @returns {string} URL with query parameters
 */
export const buildUrl = (baseUrl, params) => {
  const url = new URL(baseUrl, window.location.origin);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.toString();
};

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean} True if empty
 */
export const isEmptyObject = (obj) => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

/**
 * Convert RGB to Hex
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {string} Hex color code
 */
export const rgbToHex = (r, g, b) => {
  const toHex = (num) => {
    const hex = num.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/**
 * Get color from rating
 * @param {number} rating - Rating value (0-10)
 * @returns {string} Color hex code
 */
export const getRatingColor = (rating) => {
  if (rating >= 8) return '#22C55E'; // Green
  if (rating >= 6) return '#FBBF24'; // Yellow
  if (rating >= 4) return '#FB923C'; // Orange
  return '#EF4444'; // Red
};

/**
 * Get movie runtime in hours and minutes
 * @param {number} minutes - Total minutes
 * @returns {string} Formatted runtime
 */
export const formatRuntime = (minutes) => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

/**
 * Get release year from date
 * @param {string} dateString - Date string
 * @returns {string} Year
 */
export const getYear = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).getFullYear().toString();
  } catch {
    return 'N/A';
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};

/**
 * Get user from localStorage
 * @returns {Object|null} User object or null
 */
export const getUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

/**
 * Save user to localStorage
 * @param {Object} user - User object
 */
export const saveUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Clear user data from localStorage
 */
export const clearUser = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

export default {
  formatDate,
  formatNumber,
  truncateText,
  generateId,
  debounce,
  throttle,
  getQueryParams,
  buildUrl,
  deepClone,
  isEmptyObject,
  rgbToHex,
  getRatingColor,
  formatRuntime,
  getYear,
  isAuthenticated,
  getUser,
  saveUser,
  clearUser,
};