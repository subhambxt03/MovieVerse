from app.models import Watchlist, db
from app.services.tmdb_service import tmdb_service
import json

class WatchlistController:
    @staticmethod
    def get_watchlist(user_id):
        try:
            print(f"Fetching watchlist for user: {user_id}")
            # Convert to int if it's a string
            if isinstance(user_id, str):
                user_id = int(user_id)
                
            watchlist_items = Watchlist.query.filter_by(user_id=user_id).all()
            print(f"Found {len(watchlist_items)} items")
            
            movies = []
            for item in watchlist_items:
                try:
                    movie_data = json.loads(item.movie_data) if item.movie_data else {}
                    movies.append({
                        'id': item.id,
                        'movie_id': item.movie_id,
                        'movie_data': movie_data,
                        'created_at': item.created_at.isoformat() if item.created_at else None
                    })
                except Exception as e:
                    print(f"Error parsing movie data: {str(e)}")
                    continue
            
            return {'movies': movies, 'count': len(movies)}, 200
        except Exception as e:
            print(f"Error getting watchlist: {str(e)}")
            return {'error': str(e)}, 500
    
    @staticmethod
    def add_to_watchlist(user_id, movie_id):
        try:
            print(f"Adding to watchlist - User: {user_id}, Movie: {movie_id}")
            
            # Convert to int if it's a string
            if isinstance(user_id, str):
                user_id = int(user_id)
            
            # Check if already in watchlist
            existing = Watchlist.query.filter_by(user_id=user_id, movie_id=movie_id).first()
            if existing:
                print("Movie already in watchlist")
                return {'error': 'Movie already in watchlist'}, 409
            
            # Fetch movie details from TMDB
            movie_details = tmdb_service.get_movie_details(movie_id)
            if not movie_details:
                print(f"Movie {movie_id} not found in TMDB")
                return {'error': 'Movie not found'}, 404
            
            # Create watchlist entry
            watchlist_item = Watchlist(
                user_id=user_id,
                movie_id=movie_id,
                movie_data=json.dumps(movie_details)
            )
            
            db.session.add(watchlist_item)
            db.session.commit()
            
            print(f"Movie {movie_id} added to watchlist for user {user_id}")
            
            return {
                'message': 'Movie added to watchlist',
                'movie': {
                    'id': watchlist_item.id,
                    'movie_id': watchlist_item.movie_id,
                    'created_at': watchlist_item.created_at.isoformat() if watchlist_item.created_at else None
                }
            }, 201
        except Exception as e:
            db.session.rollback()
            print(f"Error adding to watchlist: {str(e)}")
            return {'error': str(e)}, 500
    
    @staticmethod
    def remove_from_watchlist(user_id, movie_id):
        try:
            print(f"Removing from watchlist - User: {user_id}, Movie: {movie_id}")
            
            # Convert to int if it's a string
            if isinstance(user_id, str):
                user_id = int(user_id)
            
            watchlist_item = Watchlist.query.filter_by(user_id=user_id, movie_id=movie_id).first()
            
            if not watchlist_item:
                print("Movie not in watchlist")
                return {'error': 'Movie not in watchlist'}, 404
            
            db.session.delete(watchlist_item)
            db.session.commit()
            
            print(f"Movie {movie_id} removed from watchlist for user {user_id}")
            
            return {'message': 'Movie removed from watchlist'}, 200
        except Exception as e:
            db.session.rollback()
            print(f"Error removing from watchlist: {str(e)}")
            return {'error': str(e)}, 500
    
    @staticmethod
    def check_in_watchlist(user_id, movie_id):
        try:
            # Convert to int if it's a string
            if isinstance(user_id, str):
                user_id = int(user_id)
                
            exists = Watchlist.query.filter_by(user_id=user_id, movie_id=movie_id).first() is not None
            print(f"Movie {movie_id} in watchlist: {exists}")
            return {'in_watchlist': exists}, 200
        except Exception as e:
            print(f"Error checking watchlist: {str(e)}")
            return {'error': str(e)}, 500