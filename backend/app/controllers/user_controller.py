from app.models import User, db
import json

class UserController:
    @staticmethod
    def update_profile(user_id, data):
        """Update user profile including image"""
        try:
            user = User.query.get(user_id)
            if not user:
                return {'error': 'User not found'}, 404
            
            # Update fields
            if 'name' in data and data['name']:
                user.name = data['name']
            
            if 'phone' in data:
                user.phone = data['phone']
            
            if 'profile_image' in data:
                # Validate image size (check length of base64 string)
                if data['profile_image'] and len(data['profile_image']) > 2 * 1024 * 1024:
                    return {'error': 'Image size too large. Maximum 2MB allowed.'}, 400
                user.profile_image = data['profile_image']
            
            if 'favorite_genres' in data:
                user.favorite_genres = json.dumps(data['favorite_genres'])
            
            db.session.commit()
            
            return {
                'message': 'Profile updated successfully',
                'user': user.to_dict()
            }, 200
            
        except Exception as e:
            db.session.rollback()
            print(f"Profile update error: {str(e)}")
            return {'error': str(e)}, 500

    @staticmethod
    def get_profile(user_id):
        """Get user profile"""
        try:
            user = User.query.get(user_id)
            if not user:
                return {'error': 'User not found'}, 404
            return user.to_dict(), 200
        except Exception as e:
            print(f"Get profile error: {str(e)}")
            return {'error': str(e)}, 500