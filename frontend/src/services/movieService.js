import api from './api';

// Persistent cache using localStorage
class MovieCache {
  constructor() {
    this.cache = {};
    this.pendingRequests = {}; // ✅ Track pending requests
    this.ttl = 3600000; // 1 hour in milliseconds
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem('movieCache');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only load if not expired
        if (Date.now() - parsed.timestamp < this.ttl) {
          this.cache = parsed.data || {};
          console.log('✅ Cache loaded from storage');
          return;
        }
      }
      console.log('🔄 No valid cache found');
    } catch (e) {
      console.log('⚠️ Cache load failed');
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem('movieCache', JSON.stringify({
        data: this.cache,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.log('⚠️ Cache save failed');
    }
  }

  get(key) {
    if (this.cache[key]) {
      const { data, timestamp } = this.cache[key];
      if (Date.now() - timestamp < this.ttl) {
        return data;
      }
      delete this.cache[key];
    }
    return null;
  }

  set(key, data) {
    this.cache[key] = {
      data: data,
      timestamp: Date.now()
    };
    this.saveToStorage();
  }

  // ✅ Add pending request tracking
  getPending(key) {
    return this.pendingRequests[key];
  }

  setPending(key, promise) {
    this.pendingRequests[key] = promise;
  }

  clearPending(key) {
    delete this.pendingRequests[key];
  }

  clear() {
    this.cache = {};
    this.pendingRequests = {};
    localStorage.removeItem('movieCache');
    console.log('🗑️ Cache cleared');
  }
}

const cache = new MovieCache();

// ✅ Helper to deduplicate requests
const dedupeRequest = async (cacheKey, fetchFn) => {
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Check if request is already in progress
  const pending = cache.getPending(cacheKey);
  if (pending) {
    return pending;
  }

  // Make new request
  const promise = fetchFn()
    .then(data => {
      cache.set(cacheKey, data);
      return data;
    })
    .finally(() => {
      cache.clearPending(cacheKey);
    });

  cache.setPending(cacheKey, promise);
  return promise;
};

const movieService = {
  getPopular: async (page = 1) => {
    const cacheKey = `popular_${page}`;
    return dedupeRequest(cacheKey, async () => {
      const response = await api.get(`/movies/popular?page=${page}`);
      return response.data;
    });
  },

  getTrending: async (timeWindow = 'day', page = 1) => {
    const cacheKey = `trending_${timeWindow}_${page}`;
    return dedupeRequest(cacheKey, async () => {
      const response = await api.get(`/movies/trending?time_window=${timeWindow}&page=${page}`);
      return response.data;
    });
  },

  getTopRated: async (page = 1) => {
    const cacheKey = `toprated_${page}`;
    return dedupeRequest(cacheKey, async () => {
      const response = await api.get(`/movies/top-rated?page=${page}`);
      return response.data;
    });
  },

  getUpcoming: async (page = 1) => {
    const cacheKey = `upcoming_${page}`;
    return dedupeRequest(cacheKey, async () => {
      const response = await api.get(`/movies/upcoming?page=${page}`);
      return response.data;
    });
  },

  getMovieDetails: async (id) => {
    const cacheKey = `details_${id}`;
    return dedupeRequest(cacheKey, async () => {
      const response = await api.get(`/movies/${id}`);
      return response.data;
    });
  },

  getMovieCredits: async (id) => {
    const cacheKey = `credits_${id}`;
    return dedupeRequest(cacheKey, async () => {
      const response = await api.get(`/movies/${id}/credits`);
      return response.data;
    });
  },

  getMovieVideos: async (id) => {
    const cacheKey = `videos_${id}`;
    return dedupeRequest(cacheKey, async () => {
      const response = await api.get(`/movies/${id}/videos`);
      return response.data;
    });
  },

  getMovieReviews: async (id, page = 1) => {
    const cacheKey = `reviews_${id}_${page}`;
    return dedupeRequest(cacheKey, async () => {
      const response = await api.get(`/movies/${id}/reviews?page=${page}`);
      return response.data;
    });
  },

  getRecommendations: async (id, page = 1) => {
    const cacheKey = `recommendations_${id}_${page}`;
    return dedupeRequest(cacheKey, async () => {
      const response = await api.get(`/movies/${id}/recommendations?page=${page}`);
      return response.data;
    });
  },

  getSimilarMovies: async (id, page = 1) => {
    const cacheKey = `similar_${id}_${page}`;
    return dedupeRequest(cacheKey, async () => {
      const response = await api.get(`/movies/${id}/similar?page=${page}`);
      return response.data;
    });
  },

  getGenres: async () => {
    const cacheKey = 'genres';
    return dedupeRequest(cacheKey, async () => {
      const response = await api.get('/movies/genres');
      return response.data;
    });
  },

  searchMovies: async (query, page = 1) => {
    const cacheKey = `search_${query}_${page}`;
    return dedupeRequest(cacheKey, async () => {
      const response = await api.get(`/movies/search?query=${encodeURIComponent(query)}&page=${page}`);
      return response.data;
    });
  },

  clearCache: () => {
    cache.clear();
  }
};

export default movieService;