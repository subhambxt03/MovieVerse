from flask import jsonify
from werkzeug.exceptions import HTTPException

def register_error_handlers(app):
    @app.errorhandler(HTTPException)
    def handle_http_error(error):
        response = jsonify({
            'error': error.description,
            'status_code': error.code
        })
        return response, error.code
    
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({'error': 'Bad request', 'status_code': 400}), 400
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Resource not found', 'status_code': 404}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error', 'status_code': 500}), 500