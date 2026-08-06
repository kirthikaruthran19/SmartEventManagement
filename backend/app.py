from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from extensions import db, jwt, migrate

# ==========================================================
# Import Blueprints
# ==========================================================

from routes.auth_routes import auth_bp
from routes.category_routes import category_bp
from routes.event_routes import event_bp
from routes.booking_routes import booking_bp
from routes.dashboard_routes import dashboard_bp
from routes.admin_routes import admin_bp

# ==========================================================
# Import Models
# ==========================================================

from models import User, Category


def create_app():
    """
    Application Factory
    """

    # ==========================================================
    # Create Flask Application
    # ==========================================================

    app = Flask(__name__)

    # ==========================================================
    # Load Configuration
    # ==========================================================

    app.config.from_object(Config)

    # Display Unicode characters correctly
    app.json.ensure_ascii = False

    # ==========================================================
    # Enable CORS
    # ==========================================================

    CORS(
        app,
        resources={r"/*": {"origins": "*"}},
        supports_credentials=True,
    )

    # ==========================================================
    # Initialize Extensions
    # ==========================================================

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # ==========================================================
    # Register Blueprints
    # ==========================================================

    app.register_blueprint(
        auth_bp,
        url_prefix="/api/auth"
    )

    app.register_blueprint(
        category_bp,
        url_prefix="/api/categories"
    )
    app.register_blueprint(
    event_bp,
    url_prefix="/api/events"
    )
    app.register_blueprint(
    booking_bp,
    url_prefix="/api/bookings"
   )
    app.register_blueprint(
    dashboard_bp,
    url_prefix="/api/dashboard"
    )   
    app.register_blueprint(
    admin_bp,
    url_prefix="/api/admin"
)
    # ==========================================================
    # Home Route
    # ==========================================================

    @app.route("/", methods=["GET"])
    def home():
        return jsonify({
            "success": True,
            "message": "Smart Event Management System API is running 🚀",
            "version": "1.0.0",
            "status": "Healthy"
        }), 200

    # ==========================================================
    # JWT Error Handlers
    # ==========================================================

    @jwt.unauthorized_loader
    def unauthorized_callback(error):
        return jsonify({
            "success": False,
            "message": "Authorization token is missing."
        }), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({
            "success": False,
            "message": "Invalid authentication token."
        }), 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            "success": False,
            "message": "Authentication token has expired."
        }), 401

    # ==========================================================
    # Error Handlers
    # ==========================================================

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            "success": False,
            "message": "API endpoint not found."
        }), 404

    @app.errorhandler(500)
    def internal_server_error(error):
        db.session.rollback()

        return jsonify({
            "success": False,
            "message": "Internal Server Error."
        }), 500

    return app


# ==========================================================
# Create Application
# ==========================================================

app = create_app()


# ==========================================================
# Run Server
# ==========================================================

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=app.config["DEBUG"]
    )