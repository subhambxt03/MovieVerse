from app.services.tmdb_service import tmdb_service
from flask import current_app
import json

class MovieController:
    @staticmethod
    def get_trending_movies(time_window='day', page=1):
        """Get trending movies from TMDB"""
        try:
            result = tmdb_service.get_trending(time_window, page)
            if not result:
                return {'error': 'Failed to fetch trending movies'}, 500
            
            # Format the movies
            movies = result.get('results', [])
            formatted_movies = [tmdb_service.format_movie_data(movie) for movie in movies]
            
            return {
                'page': result.get('page', 1),
                'total_pages': result.get('total_pages', 1),
                'total_results': result.get('total_results', 0),
                'results': formatted_movies
            }, 200
        except Exception as e:
            current_app.logger.error(f"Error fetching trending movies: {str(e)}")
            return {'error': str(e)}, 500

    @staticmethod
    def get_popular_movies(page=1):
        """Get popular movies from TMDB"""
        try:
            result = tmdb_service.get_popular(page)
            if not result:
                return {'error': 'Failed to fetch popular movies'}, 500
            
            movies = result.get('results', [])
            formatted_movies = [tmdb_service.format_movie_data(movie) for movie in movies]
            
            return {
                'page': result.get('page', 1),
                'total_pages': result.get('total_pages', 1),
                'total_results': result.get('total_results', 0),
                'results': formatted_movies
            }, 200
        except Exception as e:
            current_app.logger.error(f"Error fetching popular movies: {str(e)}")
            return {'error': str(e)}, 500

    @staticmethod
    def get_top_rated_movies(page=1):
        """Get top rated movies from TMDB"""
        try:
            result = tmdb_service.get_top_rated(page)
            if not result:
                return {'error': 'Failed to fetch top rated movies'}, 500
            
            movies = result.get('results', [])
            formatted_movies = [tmdb_service.format_movie_data(movie) for movie in movies]
            
            return {
                'page': result.get('page', 1),
                'total_pages': result.get('total_pages', 1),
                'total_results': result.get('total_results', 0),
                'results': formatted_movies
            }, 200
        except Exception as e:
            current_app.logger.error(f"Error fetching top rated movies: {str(e)}")
            return {'error': str(e)}, 500

    @staticmethod
    def get_upcoming_movies(page=1):
        """Get upcoming movies from TMDB"""
        try:
            result = tmdb_service.get_upcoming(page)
            if not result:
                return {'error': 'Failed to fetch upcoming movies'}, 500
            
            movies = result.get('results', [])
            formatted_movies = [tmdb_service.format_movie_data(movie) for movie in movies]
            
            return {
                'page': result.get('page', 1),
                'total_pages': result.get('total_pages', 1),
                'total_results': result.get('total_results', 0),
                'results': formatted_movies
            }, 200
        except Exception as e:
            current_app.logger.error(f"Error fetching upcoming movies: {str(e)}")
            return {'error': str(e)}, 500

    @staticmethod
    def get_movie_details(movie_id):
        """Get detailed movie information"""
        try:
            movie = tmdb_service.get_movie_details(movie_id)
            if not movie:
                return {'error': 'Movie not found'}, 404
            
            # Get additional data
            credits = tmdb_service.get_movie_credits(movie_id)
            videos = tmdb_service.get_movie_videos(movie_id)
            images = tmdb_service.get_movie_images(movie_id)
            
            # Format response
            response = tmdb_service.format_movie_data(movie)
            response.update({
                'credits': credits,
                'videos': videos,
                'images': images,
                'budget': movie.get('budget'),
                'revenue': movie.get('revenue'),
                'status': movie.get('status'),
                'tagline': movie.get('tagline'),
                'production_companies': movie.get('production_companies', []),
                'spoken_languages': movie.get('spoken_languages', [])
            })
            
            return response, 200
        except Exception as e:
            current_app.logger.error(f"Error fetching movie details: {str(e)}")
            return {'error': str(e)}, 500

    @staticmethod
    def get_movie_credits(movie_id):
        """Get movie cast and crew"""
        try:
            credits = tmdb_service.get_movie_credits(movie_id)
            if not credits:
                return {'error': 'Credits not found'}, 404
            
            return credits, 200
        except Exception as e:
            current_app.logger.error(f"Error fetching movie credits: {str(e)}")
            return {'error': str(e)}, 500

    @staticmethod
    def get_movie_videos(movie_id):
        """Get movie videos/trailers"""
        try:
            videos = tmdb_service.get_movie_videos(movie_id)
            if not videos:
                return {'error': 'Videos not found'}, 404
            
            return videos, 200
        except Exception as e:
            current_app.logger.error(f"Error fetching movie videos: {str(e)}")
            return {'error': str(e)}, 500

    @staticmethod
    def get_movie_reviews(movie_id, page=1):
        """Get movie reviews"""
        try:
            reviews = tmdb_service.get_movie_reviews(movie_id, page)
            if not reviews:
                return {'error': 'Reviews not found'}, 404
            
            return reviews, 200
        except Exception as e:
            current_app.logger.error(f"Error fetching movie reviews: {str(e)}")
            return {'error': str(e)}, 500

    @staticmethod
    def get_movie_recommendations(movie_id, page=1):
        """Get movie recommendations"""
        try:
            recommendations = tmdb_service.get_recommendations(movie_id, page)
            if not recommendations:
                return {'error': 'Recommendations not found'}, 404
            
            movies = recommendations.get('results', [])
            formatted_movies = [tmdb_service.format_movie_data(movie) for movie in movies]
            
            return {
                'page': recommendations.get('page', 1),
                'total_pages': recommendations.get('total_pages', 1),
                'total_results': recommendations.get('total_results', 0),
                'results': formatted_movies
            }, 200
        except Exception as e:
            current_app.logger.error(f"Error fetching recommendations: {str(e)}")
            return {'error': str(e)}, 500

    @staticmethod
    def get_similar_movies(movie_id, page=1):
        """Get similar movies"""
        try:
            similar = tmdb_service.get_similar_movies(movie_id, page)
            if not similar:
                return {'error': 'Similar movies not found'}, 404
            
            movies = similar.get('results', [])
            formatted_movies = [tmdb_service.format_movie_data(movie) for movie in movies]
            
            return {
                'page': similar.get('page', 1),
                'total_pages': similar.get('total_pages', 1),
                'total_results': similar.get('total_results', 0),
                'results': formatted_movies
            }, 200
        except Exception as e:
            current_app.logger.error(f"Error fetching similar movies: {str(e)}")
            return {'error': str(e)}, 500

    @staticmethod
    def get_genres():
        """Get all movie genres"""
        try:
            genres = tmdb_service.get_genres()
            if not genres:
                return {'error': 'Genres not found'}, 404
            
            return genres, 200
        except Exception as e:
            current_app.logger.error(f"Error fetching genres: {str(e)}")
            return {'error': str(e)}, 500

    @staticmethod
    def search_movies(query, page=1, include_adult=False):
        """Search for movies"""
        try:
            if not query or len(query.strip()) < 1:
                return {'error': 'Search query is required'}, 400
            
            results = tmdb_service.search_movies(query, page, include_adult)
            if not results:
                return {'error': 'Search failed'}, 500
            
            movies = results.get('results', [])
            formatted_movies = [tmdb_service.format_movie_data(movie) for movie in movies]
            
            return {
                'page': results.get('page', 1),
                'total_pages': results.get('total_pages', 1),
                'total_results': results.get('total_results', 0),
                'query': query,
                'results': formatted_movies
            }, 200
        except Exception as e:
            current_app.logger.error(f"Error searching movies: {str(e)}")
            return {'error': str(e)}, 500

    @staticmethod
    def get_movie_images(movie_id):
        """Get movie images"""
        try:
            images = tmdb_service.get_movie_images(movie_id)
            if not images:
                return {'error': 'Images not found'}, 404
            
            return images, 200
        except Exception as e:
            current_app.logger.error(f"Error fetching movie images: {str(e)}")
            return {'error': str(e)}, 500