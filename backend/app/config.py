import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_ACCESS_TOKEN_EXPIRES = 86400
    
    # TMDB Configuration
    TMDB_API_KEY = os.getenv('TMDB_API_KEY')
    TMDB_API_URL = os.getenv('TMDB_API_URL', 'https://api.themoviedb.org/3')