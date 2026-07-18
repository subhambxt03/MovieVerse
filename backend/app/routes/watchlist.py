from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from app.controllers.watchlist_controller import WatchlistController
from functools import wraps

watchlist_bp = Blueprint('watchlist', __name__)

def auth_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
            return fn(*args, **kwargs)
        except Exception as e:
            print(f"JWT Error: {str(e)}")
            return jsonify({'error': 'Authentication required', 'details': str(e)}), 401
    return wrapper

@watchlist_bp.route('', methods=['GET'])  # No trailing slash
@auth_required
def get_watchlist():
    try:
        user_id = get_jwt_identity()
        print(f"Getting watchlist for user: {user_id}")
        result, status_code = WatchlistController.get_watchlist(user_id)
        return jsonify(result), status_code
    except Exception as e:
        print(f"Error in get_watchlist: {str(e)}")
        return jsonify({'error': str(e)}), 500

@watchlist_bp.route('/<int:movie_id>', methods=['POST'])
@auth_required
def add_to_watchlist(movie_id):
    try:
        user_id = get_jwt_identity()
        print(f"Adding movie {movie_id} to watchlist for user: {user_id}")
        
        result, status_code = WatchlistController.add_to_watchlist(user_id, movie_id)
        return jsonify(result), status_code
    except Exception as e:
        print(f"Error in add_to_watchlist: {str(e)}")
        return jsonify({'error': str(e)}), 500

@watchlist_bp.route('/<int:movie_id>', methods=['DELETE'])
@auth_required
def remove_from_watchlist(movie_id):
    try:
        user_id = get_jwt_identity()
        print(f"Removing movie {movie_id} from watchlist for user: {user_id}")
        
        result, status_code = WatchlistController.remove_from_watchlist(user_id, movie_id)
        return jsonify(result), status_code
    except Exception as e:
        print(f"Error in remove_from_watchlist: {str(e)}")
        return jsonify({'error': str(e)}), 500

@watchlist_bp.route('/check/<int:movie_id>', methods=['GET'])
def check_in_watchlist(movie_id):
    try:
        # Try to get user_id from token, but don't require authentication
        try:
            verify_jwt_in_request(optional=True)
            user_id = get_jwt_identity()
        except:
            user_id = None
        
        print(f"Checking if movie {movie_id} is in watchlist for user: {user_id}")
        
        if not user_id:
            return jsonify({'in_watchlist': False}), 200
        
        result, status_code = WatchlistController.check_in_watchlist(user_id, movie_id)
        return jsonify(result), status_code
    except Exception as e:
        print(f"Error in check_in_watchlist: {str(e)}")
        return jsonify({'in_watchlist': False}), 200