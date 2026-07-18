from flask import Blueprint, request, jsonify
from app.services.tmdb_service import tmdb_service

movies_bp = Blueprint('movies', __name__)

@movies_bp.route('/trending', methods=['GET'])
def get_trending():
    time_window = request.args.get('time_window', 'day')
    page = request.args.get('page', 1, type=int)
    result = tmdb_service.get_trending(time_window, page)
    
    if not result:
        return jsonify({'error': 'Failed to fetch trending movies'}), 500
    
    return jsonify(result), 200

@movies_bp.route('/popular', methods=['GET'])
def get_popular():
    page = request.args.get('page', 1, type=int)
    result = tmdb_service.get_popular(page)
    
    if not result:
        return jsonify({'error': 'Failed to fetch popular movies'}), 500
    
    return jsonify(result), 200

@movies_bp.route('/top-rated', methods=['GET'])
def get_top_rated():
    page = request.args.get('page', 1, type=int)
    result = tmdb_service.get_top_rated(page)
    
    if not result:
        return jsonify({'error': 'Failed to fetch top rated movies'}), 500
    
    return jsonify(result), 200

@movies_bp.route('/upcoming', methods=['GET'])
def get_upcoming():
    page = request.args.get('page', 1, type=int)
    result = tmdb_service.get_upcoming(page)
    
    if not result:
        return jsonify({'error': 'Failed to fetch upcoming movies'}), 500
    
    return jsonify(result), 200

@movies_bp.route('/<int:movie_id>', methods=['GET'])
def get_movie_details(movie_id):
    result = tmdb_service.get_movie_details(movie_id)
    
    if not result:
        return jsonify({'error': 'Movie not found'}), 404
    
    # Add credits
    credits = tmdb_service.get_movie_credits(movie_id)
    if credits:
        result['credits'] = credits
    
    return jsonify(result), 200

@movies_bp.route('/<int:movie_id>/credits', methods=['GET'])
def get_movie_credits(movie_id):
    result = tmdb_service.get_movie_credits(movie_id)
    
    if not result:
        return jsonify({'error': 'Credits not found'}), 404
    
    return jsonify(result), 200

@movies_bp.route('/<int:movie_id>/videos', methods=['GET'])
def get_movie_videos(movie_id):
    result = tmdb_service.get_movie_videos(movie_id)
    
    if not result:
        return jsonify({'error': 'Videos not found'}), 404
    
    return jsonify(result), 200

@movies_bp.route('/<int:movie_id>/reviews', methods=['GET'])
def get_movie_reviews(movie_id):
    page = request.args.get('page', 1, type=int)
    result = tmdb_service.get_movie_reviews(movie_id, page)
    
    if not result:
        return jsonify({'error': 'Reviews not found'}), 404
    
    return jsonify(result), 200

@movies_bp.route('/<int:movie_id>/recommendations', methods=['GET'])
def get_recommendations(movie_id):
    page = request.args.get('page', 1, type=int)
    result = tmdb_service.get_recommendations(movie_id, page)
    
    if not result:
        return jsonify({'error': 'Recommendations not found'}), 404
    
    return jsonify(result), 200

@movies_bp.route('/<int:movie_id>/similar', methods=['GET'])
def get_similar_movies(movie_id):
    page = request.args.get('page', 1, type=int)
    result = tmdb_service.get_similar_movies(movie_id, page)
    
    if not result:
        return jsonify({'error': 'Similar movies not found'}), 404
    
    return jsonify(result), 200

@movies_bp.route('/genres', methods=['GET'])
def get_genres():
    result = tmdb_service.get_genres()
    
    if not result:
        return jsonify({'error': 'Genres not found'}), 404
    
    return jsonify(result), 200

@movies_bp.route('/search', methods=['GET'])
def search_movies():
    query = request.args.get('query')
    page = request.args.get('page', 1, type=int)
    include_adult = request.args.get('include_adult', 'false').lower() == 'true'
    
    if not query:
        return jsonify({'error': 'Query parameter is required'}), 400
    
    result = tmdb_service.search_movies(query, page, include_adult)
    
    if not result:
        return jsonify({'error': 'Search failed'}), 500
    
    return jsonify(result), 200