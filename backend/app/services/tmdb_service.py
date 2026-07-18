import os
import requests
from flask import current_app
from datetime import datetime, timedelta
import json
import hashlib

class TMDBService:
    def __init__(self):
        self.api_key = os.getenv('TMDB_API_KEY')
        self.base_url = os.getenv('TMDB_API_URL', 'https://api.themoviedb.org/3')
        self.image_base_url = 'https://image.tmdb.org/t/p'
        
        # Cache configuration - longer TTL
        self.cache = {}
        self.cache_ttl = 3600  # 1 hour cache (was 5 minutes)
        
        # Pre-fetch popular data on startup
        self._prefetch_data()
    
    def _get_cache_key(self, endpoint, params=None):
        """Generate cache key from endpoint and params"""
        key = endpoint
        if params:
            # Sort params to ensure consistent key
            sorted_params = dict(sorted(params.items()))
            key += json.dumps(sorted_params, sort_keys=True)
        # Hash the key to keep it short
        return hashlib.md5(key.encode()).hexdigest()
    
    def _get_from_cache(self, key):
        """Get data from cache if not expired"""
        if key in self.cache:
            data, timestamp = self.cache[key]
            if datetime.now() - timestamp < timedelta(seconds=self.cache_ttl):
                return data
            else:
                # Cache expired, remove it
                del self.cache[key]
        return None
    
    def _set_in_cache(self, key, data):
        """Store data in cache"""
        self.cache[key] = (data, datetime.now())
    
    def _prefetch_data(self):
        """Pre-fetch popular data on startup"""
        try:
            print("🔄 Pre-fetching popular movies...")
            self.get_popular(1)
            self.get_trending('day', 1)
            self.get_genres()
            print("✅ Pre-fetch complete")
        except Exception as e:
            print(f"⚠️ Pre-fetch error: {e}")
    
    def _make_request(self, endpoint, params=None, use_cache=True):
        """Make a request to TMDB API with caching"""
        params = params or {}
        params['api_key'] = self.api_key
        params['language'] = 'en-US'
        
        # Generate cache key
        cache_key = self._get_cache_key(endpoint, params)
        
        # Check cache first
        if use_cache:
            cached_data = self._get_from_cache(cache_key)
            if cached_data:
                return cached_data
        
        # Make API request with timeout
        url = f"{self.base_url}/{endpoint}"
        print(f"📡 API REQUEST: {endpoint}")
        
        try:
            response = requests.get(url, params=params, timeout=5)  # Reduced timeout
            response.raise_for_status()
            data = response.json()
            
            # Store in cache
            if use_cache:
                self._set_in_cache(cache_key, data)
            
            return data
        except requests.exceptions.Timeout:
            print(f"⏱️ Timeout: {endpoint}")
            return None
        except requests.exceptions.RequestException as e:
            print(f"❌ API error: {str(e)}")
            return None
    
    def clear_cache(self):
        """Clear all cached data"""
        self.cache.clear()
        print("🗑️ Cache cleared")
    
    # All existing methods remain the same...
    def get_trending(self, time_window='day', page=1):
        return self._make_request(f'trending/movie/{time_window}', {'page': page})
    
    def get_popular(self, page=1):
        return self._make_request('movie/popular', {'page': page})
    
    def get_top_rated(self, page=1):
        return self._make_request('movie/top_rated', {'page': page})
    
    def get_upcoming(self, page=1):
        return self._make_request('movie/upcoming', {'page': page})
    
    def get_now_playing(self, page=1):
        return self._make_request('movie/now_playing', {'page': page})
    
    def get_movie_details(self, movie_id):
        return self._make_request(f'movie/{movie_id}')
    
    def get_movie_credits(self, movie_id):
        return self._make_request(f'movie/{movie_id}/credits')
    
    def get_movie_videos(self, movie_id):
        return self._make_request(f'movie/{movie_id}/videos')
    
    def get_movie_reviews(self, movie_id, page=1):
        return self._make_request(f'movie/{movie_id}/reviews', {'page': page})
    
    def get_movie_images(self, movie_id):
        return self._make_request(f'movie/{movie_id}/images')
    
    def get_recommendations(self, movie_id, page=1):
        return self._make_request(f'movie/{movie_id}/recommendations', {'page': page})
    
    def get_similar_movies(self, movie_id, page=1):
        return self._make_request(f'movie/{movie_id}/similar', {'page': page})
    
    def get_genres(self):
        return self._make_request('genre/movie/list')
    
    def search_movies(self, query, page=1, include_adult=False):
        params = {
            'query': query,
            'page': page,
            'include_adult': str(include_adult).lower()
        }
        return self._make_request('search/movie', params)
    
    def get_image_url(self, path, size='w500'):
        if not path:
            return None
        return f"{self.image_base_url}/{size}{path}"
    
    def get_backdrop_url(self, path, size='original'):
        if not path:
            return None
        return f"{self.image_base_url}/{size}{path}"
    
    def format_movie_data(self, movie_data):
        """Format movie data for consistent response"""
        if not movie_data:
            return {}
        return {
            'id': movie_data.get('id'),
            'title': movie_data.get('title'),
            'overview': movie_data.get('overview'),
            'poster_path': movie_data.get('poster_path'),
            'backdrop_path': movie_data.get('backdrop_path'),
            'release_date': movie_data.get('release_date'),
            'vote_average': movie_data.get('vote_average'),
            'vote_count': movie_data.get('vote_count'),
            'genres': [genre['name'] for genre in movie_data.get('genres', [])],
            'runtime': movie_data.get('runtime'),
            'status': movie_data.get('status'),
            'tagline': movie_data.get('tagline')
        }

tmdb_service = TMDBService()