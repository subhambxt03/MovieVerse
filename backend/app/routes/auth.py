from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from app.controllers.auth_controller import AuthController

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    if not all([name, email, password]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    result, status_code = AuthController.register(name, email, password)
    return jsonify(result), status_code

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not all([email, password]):
        return jsonify({'error': 'Email and password are required'}), 400
    
    result, status_code = AuthController.login(email, password)
    return jsonify(result), status_code

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user_id = get_jwt_identity()
    access_token = create_access_token(identity=current_user_id)
    return jsonify({'access_token': access_token}), 200

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    return jsonify({'message': 'Logged out successfully'}), 200

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    result, status_code = AuthController.forgot_password(email)
    return jsonify(result), status_code

@auth_bp.route('/reset-password-direct', methods=['POST'])
def reset_password_direct():
    """Direct password reset without email"""
    data = request.get_json()
    email = data.get('email')
    new_password = data.get('new_password')
    confirm_password = data.get('confirm_password')
    
    if not all([email, new_password, confirm_password]):
        return jsonify({'error': 'Email, new password, and confirm password are required'}), 400
    
    result, status_code = AuthController.reset_password_direct(email, new_password, confirm_password)
    return jsonify(result), status_code

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('new_password')
    
    if not all([token, new_password]):
        return jsonify({'error': 'Token and new password are required'}), 400
    
    result, status_code = AuthController.reset_password(token, new_password)
    return jsonify(result), status_code