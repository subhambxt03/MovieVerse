import re
from flask import request, jsonify
from functools import wraps

class Validators:
    @staticmethod
    def validate_email(email):
        """Validate email format"""
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(email_regex, email) is not None

    @staticmethod
    def validate_password(password):
        """Validate password strength"""
        if len(password) < 6:
            return False, "Password must be at least 6 characters long"
        if not any(char.isdigit() for char in password):
            return False, "Password must contain at least one number"
        if not any(char.isupper() for char in password):
            return False, "Password must contain at least one uppercase letter"
        if not any(char.islower() for char in password):
            return False, "Password must contain at least one lowercase letter"
        return True, "Password is valid"

    @staticmethod
    def validate_name(name):
        """Validate user name"""
        if not name or len(name.strip()) < 2:
            return False, "Name must be at least 2 characters long"
        if not re.match(r'^[a-zA-Z\s\-\.]+$', name):
            return False, "Name can only contain letters, spaces, hyphens, and dots"
        return True, "Name is valid"

    @staticmethod
    def validate_movie_id(movie_id):
        """Validate movie ID"""
        try:
            movie_id = int(movie_id)
            if movie_id <= 0:
                return False, "Movie ID must be a positive integer"
            return True, "Movie ID is valid"
        except (ValueError, TypeError):
            return False, "Movie ID must be an integer"

    @staticmethod
    def validate_page(page):
        """Validate page number"""
        try:
            page = int(page)
            if page < 1:
                return False, "Page must be at least 1"
            return True, "Page is valid"
        except (ValueError, TypeError):
            return False, "Page must be an integer"

    @staticmethod
    def validate_search_query(query):
        """Validate search query"""
        if not query or len(query.strip()) < 1:
            return False, "Search query cannot be empty"
        if len(query.strip()) > 100:
            return False, "Search query is too long (max 100 characters)"
        return True, "Search query is valid"

    @staticmethod
    def validate_rating(rating):
        """Validate rating filter"""
        try:
            rating = float(rating)
            if rating < 0 or rating > 10:
                return False, "Rating must be between 0 and 10"
            return True, "Rating is valid"
        except (ValueError, TypeError):
            return False, "Rating must be a number"

    @staticmethod
    def validate_year(year):
        """Validate year filter"""
        try:
            year = int(year)
            current_year = 2026  # Update as needed
            if year < 1900 or year > current_year:
                return False, f"Year must be between 1900 and {current_year}"
            return True, "Year is valid"
        except (ValueError, TypeError):
            return False, "Year must be an integer"

def validate_request(schema):
    """Decorator to validate request data against a schema"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            data = request.get_json()
            if not data:
                return jsonify({'error': 'Request body is required'}), 400
            
            errors = {}
            for field, validators in schema.items():
                if field in data:
                    value = data[field]
                    for validator_func, error_msg in validators:
                        if not validator_func(value):
                            errors[field] = error_msg
                            break
            
            if errors:
                return jsonify({'errors': errors}), 400
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def validate_query_params(params):
    """Validate query parameters"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            errors = {}
            for param, validator_func, error_msg in params:
                value = request.args.get(param)
                if value:
                    is_valid, message = validator_func(value)
                    if not is_valid:
                        errors[param] = message
            
            if errors:
                return jsonify({'errors': errors}), 400
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

class RequestValidator:
    """Request validation helper class"""
    
    @staticmethod
    def validate_register(data):
        """Validate registration data"""
        errors = {}
        
        # Validate name
        if 'name' not in data or not data['name']:
            errors['name'] = 'Name is required'
        else:
            is_valid, message = Validators.validate_name(data['name'])
            if not is_valid:
                errors['name'] = message
        
        # Validate email
        if 'email' not in data or not data['email']:
            errors['email'] = 'Email is required'
        else:
            if not Validators.validate_email(data['email']):
                errors['email'] = 'Invalid email format'
        
        # Validate password
        if 'password' not in data or not data['password']:
            errors['password'] = 'Password is required'
        else:
            is_valid, message = Validators.validate_password(data['password'])
            if not is_valid:
                errors['password'] = message
        
        return errors

    @staticmethod
    def validate_login(data):
        """Validate login data"""
        errors = {}
        
        if 'email' not in data or not data['email']:
            errors['email'] = 'Email is required'
        else:
            if not Validators.validate_email(data['email']):
                errors['email'] = 'Invalid email format'
        
        if 'password' not in data or not data['password']:
            errors['password'] = 'Password is required'
        
        return errors

    @staticmethod
    def validate_password_change(data):
        """Validate password change data"""
        errors = {}
        
        if 'current_password' not in data or not data['current_password']:
            errors['current_password'] = 'Current password is required'
        
        if 'new_password' not in data or not data['new_password']:
            errors['new_password'] = 'New password is required'
        else:
            is_valid, message = Validators.validate_password(data['new_password'])
            if not is_valid:
                errors['new_password'] = message
        
        return errors

    @staticmethod
    def validate_profile_update(data):
        """Validate profile update data"""
        errors = {}
        
        if 'name' in data:
            is_valid, message = Validators.validate_name(data['name'])
            if not is_valid:
                errors['name'] = message
        
        if 'profile_image' in data and data['profile_image']:
            if not data['profile_image'].startswith(('http://', 'https://')):
                errors['profile_image'] = 'Profile image must be a valid URL'
        
        return errors