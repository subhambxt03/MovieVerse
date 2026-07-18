from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app.models import User

def jwt_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            
            if not user:
                return jsonify({'error': 'User not found'}), 401
            
            return fn(*args, **kwargs)
        except Exception as e:
            print(f"JWT Error: {str(e)}")
            return jsonify({'error': 'Unauthorized'}), 401
    return wrapper

def jwt_required_optional(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request(optional=True)
            current_user_id = get_jwt_identity()
            
            # If user is authenticated, get the user object
            if current_user_id:
                user = User.query.get(current_user_id)
                if not user:
                    return jsonify({'error': 'User not found'}), 401
            
            return fn(*args, **kwargs)
        except Exception as e:
            print(f"JWT Optional Error: {str(e)}")
            # Allow the request to continue even if token is invalid
            return fn(*args, **kwargs)
    return wrapper

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            
            if not user or user.role != 'admin':
                return jsonify({'error': 'Admin access required'}), 403
            
            return fn(*args, **kwargs)
        except Exception as e:
            return jsonify({'error': 'Unauthorized'}), 401
    return wrapper