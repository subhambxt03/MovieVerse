from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers.user_controller import UserController
from app.models import User, db
import bcrypt

user_bp = Blueprint('user', __name__)

@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    result, status_code = UserController.get_profile(user_id)
    return jsonify(result), status_code

@user_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    result, status_code = UserController.update_profile(user_id, data)
    return jsonify(result), status_code

@user_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    current_password = data.get('current_password')
    new_password = data.get('new_password')
    
    if not all([current_password, new_password]):
        return jsonify({'error': 'Current password and new password are required'}), 400
    
    # Verify current password
    if not bcrypt.checkpw(current_password.encode('utf-8'), user.password_hash.encode('utf-8')):
        return jsonify({'error': 'Current password is incorrect'}), 401
    
    # Update password
    hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
    user.password_hash = hashed_password.decode('utf-8')
    
    try:
        db.session.commit()
        return jsonify({'message': 'Password changed successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500