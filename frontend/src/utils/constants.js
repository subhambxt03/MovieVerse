
export const API_BASE_URL = 'https://movieverse-zgi7.onrender.com/api';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Image Sizes
export const IMAGE_SIZES = {
  poster: {
    w92: 'w92',
    w154: 'w154',
    w185: 'w185',
    w342: 'w342',
    w500: 'w500',
    w780: 'w780',
    original: 'original',
  },
  backdrop: {
    w300: 'w300',
    w780: 'w780',
    w1280: 'w1280',
    original: 'original',
  },
  profile: {
    w45: 'w45',
    w185: 'w185',
    h632: 'h632',
    original: 'original',
  },
};

// Movie Categories
export const MOVIE_CATEGORIES = {
  TRENDING: 'trending',
  POPULAR: 'popular',
  TOP_RATED: 'top_rated',
  UPCOMING: 'upcoming',
  NOW_PLAYING: 'now_playing',
};

// Time Windows for Trending
export const TIME_WINDOWS = {
  DAY: 'day',
  WEEK: 'week',
};

// Sort Options
export const SORT_OPTIONS = {
  POPULARITY: 'popularity.desc',
  RELEASE_DATE: 'release_date.desc',
  VOTE_AVERAGE: 'vote_average.desc',
  VOTE_COUNT: 'vote_count.desc',
};

// Genres
export const GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

// Languages
export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
];

// Breakpoints for Responsive Design
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  laptop: 1024,
  desktop: 1200,
  large: 1400,
};

// Animation Constants
export const ANIMATIONS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  },
  scaleUp: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.3 },
  },
};

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  WATCHLIST: 'watchlist',
  FAVORITES: 'favorites',
};

// Toast Messages
export const TOAST_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back! 🎬',
  LOGIN_ERROR: 'Invalid credentials. Please try again.',
  REGISTER_SUCCESS: 'Account created successfully! 🎉',
  REGISTER_ERROR: 'Registration failed. Please try again.',
  LOGOUT_SUCCESS: 'Logged out successfully. See you soon! 👋',
  WATCHLIST_ADD: 'Added to watchlist! 📚',
  WATCHLIST_REMOVE: 'Removed from watchlist!',
  FAVORITE_ADD: 'Added to favorites! ❤️',
  FAVORITE_REMOVE: 'Removed from favorites!',
  PROFILE_UPDATE: 'Profile updated successfully! ✅',
  PASSWORD_CHANGE: 'Password changed successfully! 🔒',
  SEARCH_ERROR: 'Search failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
};

// Default Images
export const DEFAULT_IMAGES = {
  POSTER: '/assets/default-poster.jpg',
  BACKDROP: '/assets/default-backdrop.jpg',
  PROFILE: '/assets/default-profile.jpg',
  AVATAR: '/assets/default-avatar.png',
};

// Routes
export const ROUTES = {
  HOME: '/',
  MOVIES: '/movies',
  MOVIE_DETAILS: '/movie/:id',
  WATCHLIST: '/watchlist',
  FAVORITES: '/favorites',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  NOT_FOUND: '/404',
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USER: {
    PROFILE: '/user/profile',
    CHANGE_PASSWORD: '/user/change-password',
  },
  MOVIES: {
    TRENDING: '/movies/trending',
    POPULAR: '/movies/popular',
    TOP_RATED: '/movies/top-rated',
    UPCOMING: '/movies/upcoming',
    DETAILS: '/movies/:id',
    CREDITS: '/movies/:id/credits',
    VIDEOS: '/movies/:id/videos',
    REVIEWS: '/movies/:id/reviews',
    RECOMMENDATIONS: '/movies/:id/recommendations',
    SIMILAR: '/movies/:id/similar',
    GENRES: '/movies/genres',
    SEARCH: '/movies/search',
  },
  WATCHLIST: {
    BASE: '/watchlist',
    CHECK: '/watchlist/check/:movie_id',
  },
  FAVORITES: {
    BASE: '/favorites',
    CHECK: '/favorites/check/:movie_id',
  },
};