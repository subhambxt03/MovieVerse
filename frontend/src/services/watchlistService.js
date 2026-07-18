import api from './api';

const watchlistService = {
  getWatchlist: async () => {
    try {
      console.log('Fetching watchlist...');
      const response = await api.get('/watchlist');
      console.log('Watchlist response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      console.error('Error response:', error.response);
      return { movies: [], count: 0 };
    }
  },

  addToWatchlist: async (movieId) => {
    try {
      console.log('Adding movie to watchlist:', movieId);
      const response = await api.post(`/watchlist/${movieId}`);
      console.log('Add to watchlist response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  removeFromWatchlist: async (movieId) => {
    try {
      console.log('Removing movie from watchlist:', movieId);
      const response = await api.delete(`/watchlist/${movieId}`);
      console.log('Remove from watchlist response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  checkInWatchlist: async (movieId) => {
    try {
      console.log('Checking if movie is in watchlist:', movieId);
      const response = await api.get(`/watchlist/check/${movieId}`);
      console.log('Check in watchlist response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error checking watchlist:', error);
      if (error.response?.status === 401 || error.response?.status === 422) {
        return { in_watchlist: false };
      }
      return { in_watchlist: false };
    }
  },
};

export default watchlistService;