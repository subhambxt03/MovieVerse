import bcrypt
import jwt
import os
from datetime import datetime, timedelta
from flask import current_app
from flask_mail import Message
from app.models import User, db
from app import mail
import json

class AuthController:
    @staticmethod
    def register(name, email, password):
        try:
            print(f"Registration attempt: {email}")
            
            # Check if user exists
            existing_user = User.query.filter_by(email=email).first()
            if existing_user:
                return {'error': 'User already exists'}, 409
            
            # Validate inputs
            if not name or len(name) < 2:
                return {'error': 'Name must be at least 2 characters'}, 400
            
            if not email or '@' not in email:
                return {'error': 'Invalid email address'}, 400
            
            if not password or len(password) < 6:
                return {'error': 'Password must be at least 6 characters'}, 400
            
            # Hash password
            salt = bcrypt.gensalt()
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
            hashed_password_str = hashed_password.decode('utf-8')
            
            # Create user
            user = User(
                name=name,
                email=email,
                password_hash=hashed_password_str
            )
            
            db.session.add(user)
            db.session.commit()
            
            print(f"User registered successfully: {email}")
            
            return {
                'message': 'User registered successfully',
                'user': user.to_dict()
            }, 201
            
        except Exception as e:
            db.session.rollback()
            print(f"Registration error: {str(e)}")
            return {'error': str(e)}, 500

    @staticmethod
    def login(email, password):
        try:
            print(f"Login attempt: {email}")
            
            # Find user by email
            user = User.query.filter_by(email=email).first()
            if not user:
                print(f"User not found: {email}")
                return {'error': 'Invalid credentials'}, 401
            
            print(f"User found: {email}, ID: {user.id}")
            
            # Verify password
            try:
                password_match = bcrypt.checkpw(
                    password.encode('utf-8'),
                    user.password_hash.encode('utf-8')
                )
                print(f"Password match: {password_match}")
            except Exception as e:
                print(f"Password verification error: {str(e)}")
                return {'error': 'Invalid credentials'}, 401
            
            if not password_match:
                return {'error': 'Invalid credentials'}, 401
            
            # Generate tokens
            access_token = jwt.encode(
                {
                    'sub': str(user.id),
                    'user_id': user.id,
                    'exp': datetime.utcnow() + timedelta(days=1)
                },
                current_app.config['JWT_SECRET_KEY'],
                algorithm='HS256'
            )
            
            refresh_token = jwt.encode(
                {
                    'sub': str(user.id),
                    'user_id': user.id,
                    'exp': datetime.utcnow() + timedelta(days=7)
                },
                current_app.config['JWT_SECRET_KEY'],
                algorithm='HS256'
            )
            
            print(f"Tokens generated for user: {email}")
            
            return {
                'access_token': access_token,
                'refresh_token': refresh_token,
                'user': user.to_dict()
            }, 200
            
        except Exception as e:
            print(f"Login error: {str(e)}")
            import traceback
            traceback.print_exc()
            return {'error': str(e)}, 500

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
                # Validate image size
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
    def forgot_password(email):
        try:
            print(f"Password reset requested for: {email}")
            
            # Find user by email
            user = User.query.filter_by(email=email).first()
            if not user:
                return {'error': 'User not found'}, 404
            
            # Generate reset token (for email-based reset)
            reset_token = jwt.encode(
                {
                    'sub': str(user.id),
                    'user_id': user.id,
                    'exp': datetime.utcnow() + timedelta(hours=1)
                },
                current_app.config['SECRET_KEY'],
                algorithm='HS256'
            )
            
            frontend_url = os.getenv('FRONTEND_URL', 'https://movieessverse.netlify.app')
            reset_link = f"{frontend_url}/reset-password?token={reset_token}"
            
            print(f"🔗 RESET LINK: {reset_link}")
            print(f"🔑 RESET TOKEN: {reset_token}")
            print(f"📧 User email: {email}")
            
            # Send email with reset link
            try:
                msg = Message(
                    subject="Password Reset - MovieVerse",
                    sender=os.getenv('MAIL_DEFAULT_SENDER', 'shubhambxt25@gmail.com'),
                    recipients=[email],
                    body=f"Reset your password: {reset_link}",
                    html=f'<a href="{reset_link}">Reset Password</a>'
                )
                mail.send(msg)
                print(f"✅ Reset email sent to: {email}")
                return {'message': 'Password reset email sent successfully'}, 200
            except Exception as e:
                print(f"❌ Email send error: {str(e)}")
                return {
                    'message': 'Password reset link generated',
                    'reset_link': reset_link
                }, 200
            
        except Exception as e:
            print(f"Forgot password error: {str(e)}")
            return {'error': str(e)}, 500

    @staticmethod
    def reset_password_direct(email, new_password, confirm_password):
        """Direct password reset without email verification"""
        try:
            print(f"Direct password reset requested for: {email}")
            
            # Check if passwords match
            if new_password != confirm_password:
                return {'error': 'Passwords do not match'}, 400
            
            # Validate password strength
            if len(new_password) < 6:
                return {'error': 'Password must be at least 6 characters'}, 400
            
            # Find user by email
            user = User.query.filter_by(email=email).first()
            if not user:
                return {'error': 'User not found. Please check your email.'}, 404
            
            # Update password
            salt = bcrypt.gensalt()
            hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), salt)
            user.password_hash = hashed_password.decode('utf-8')
            db.session.commit()
            
            print(f"✅ Password reset successful for: {email}")
            
            return {
                'message': 'Password reset successfully! Please login with your new password.'
            }, 200
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Reset password error: {str(e)}")
            return {'error': str(e)}, 500

    @staticmethod
    def reset_password(token, new_password):
        try:
            print(f"Password reset attempt with token")
            
            # Decode token
            payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            user_id = payload.get('user_id')
            user = User.query.get(user_id)
            
            if not user:
                return {'error': 'Invalid token'}, 400
            
            # Update password
            salt = bcrypt.gensalt()
            hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), salt)
            user.password_hash = hashed_password.decode('utf-8')
            db.session.commit()
            
            print(f"✅ Password reset successful for: {user.email}")
            
            return {'message': 'Password reset successfully'}, 200
            
        except jwt.ExpiredSignatureError:
            return {'error': 'Token has expired'}, 400
        except jwt.InvalidTokenError:
            return {'error': 'Invalid token'}, 400
        except Exception as e:
            print(f"Reset password error: {str(e)}")
            return {'error': str(e)}, 500