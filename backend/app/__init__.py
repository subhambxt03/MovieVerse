from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from flask_mail import Mail
from dotenv import load_dotenv
import os
import pymysql

# Install pymysql as MySQLdb
pymysql.install_as_MySQLdb()

# Load environment variables
load_dotenv()

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()
mail = Mail()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 86400
    
    # ✅ Email Configuration - READ FROM ENV
    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
    app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True').lower() == 'true'
    app.config['MAIL_USE_SSL'] = os.getenv('MAIL_USE_SSL', 'False').lower() == 'true'
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')
    
    # Disable strict slashes
    app.url_map.strict_slashes = False
    
    # Check if DATABASE_URL is set
    if not app.config['SQLALCHEMY_DATABASE_URI']:
        raise RuntimeError("DATABASE_URL is not set. Please check your .env file.")
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)  # ✅ Initialize mail
    
    # CORS
    cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',')
    CORS(app, origins=cors_origins, supports_credentials=True)
    
    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.movies import movies_bp
    from app.routes.user import user_bp
    from app.routes.watchlist import watchlist_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(movies_bp, url_prefix='/api/movies')
    app.register_blueprint(user_bp, url_prefix='/api/user')
    app.register_blueprint(watchlist_bp, url_prefix='/api/watchlist')
    
    # Register error handlers
    from app.middlewares.error_handler import register_error_handlers
    register_error_handlers(app)
    
    # Health check route
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return {'status': 'healthy', 'message': 'MovieVerse API is running!'}, 200
    
    return app