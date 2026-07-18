from app import db
from datetime import datetime
import json

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    profile_image = db.Column(db.Text, nullable=True)  # ✅ Changed to TEXT for larger images
    phone = db.Column(db.String(20), nullable=True)  # ✅ Added phone field
    favorite_genres = db.Column(db.Text, default='[]')  # JSON array
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    watchlist = db.relationship('Watchlist', backref='user', lazy=True)
    favorites = db.relationship('Favorite', backref='user', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,  # ✅ Added phone to dict
            'profile_image': self.profile_image,
            'favorite_genres': json.loads(self.favorite_genres) if self.favorite_genres else [],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def set_favorite_genres(self, genres):
        self.favorite_genres = json.dumps(genres)

class Watchlist(db.Model):
    __tablename__ = 'watchlist'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    movie_id = db.Column(db.Integer, nullable=False)
    movie_data = db.Column(db.Text)  # Store movie metadata as JSON
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        import json
        return {
            'id': self.id,
            'user_id': self.user_id,
            'movie_id': self.movie_id,
            'movie_data': json.loads(self.movie_data) if self.movie_data else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Favorite(db.Model):
    __tablename__ = 'favorites'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    movie_id = db.Column(db.Integer, nullable=False)
    movie_data = db.Column(db.Text)  # Store movie metadata as JSON
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        import json
        return {
            'id': self.id,
            'user_id': self.user_id,
            'movie_id': self.movie_id,
            'movie_data': json.loads(self.movie_data) if self.movie_data else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }