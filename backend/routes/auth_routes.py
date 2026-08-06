from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
)

from extensions import db
from models.user import User
from schemas.auth_schema import AuthValidator
from services.auth_service import AuthService
from utils.password import hash_password, verify_password

auth_bp = Blueprint("auth", __name__)


# ==========================================================
# Register User
# ==========================================================

@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    errors = AuthValidator.validate_register(data)

    if errors:
        return jsonify({
            "success": False,
            "errors": errors
        }), 400

    result = AuthService.register(data)

    if not result["success"]:
        return jsonify(result), 409

    return jsonify(result), 201


# ==========================================================
# Login User
# ==========================================================

@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    errors = AuthValidator.validate_login(data)

    if errors:
        return jsonify({
            "success": False,
            "errors": errors
        }), 400

    result = AuthService.login(data)

    if not result["success"]:
        return jsonify(result), 401

    return jsonify(result), 200


# ==========================================================
# Get Logged-in User Profile
# ==========================================================

@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():

    user_id = int(get_jwt_identity())

    user = db.session.get(User, user_id)

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    return jsonify({
        "success": True,
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "phone": user.phone,
            "address": user.address,
            "role": user.role
        }
    }), 200


# ==========================================================
# Update Profile
# ==========================================================

@auth_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():

    user_id = int(get_jwt_identity())

    user = db.session.get(User, user_id)

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    user.full_name = data.get("full_name", user.full_name)
    user.phone = data.get("phone", user.phone)
    user.address = data.get("address", user.address)

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Profile updated successfully.",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "phone": user.phone,
            "address": user.address,
            "role": user.role
        }
    }), 200


# ==========================================================
# Change Password
# ==========================================================

@auth_bp.route("/change-password", methods=["PUT"])
@jwt_required()
def change_password():

    user_id = int(get_jwt_identity())

    user = db.session.get(User, user_id)

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    current_password = data.get("current_password")
    new_password = data.get("new_password")

    if not current_password or not new_password:
        return jsonify({
            "success": False,
            "message": "Current password and new password are required."
        }), 400

    if len(new_password) < 8:
        return jsonify({
            "success": False,
            "message": "New password must be at least 8 characters."
        }), 400

    if not verify_password(current_password, user.password):
        return jsonify({
            "success": False,
            "message": "Current password is incorrect."
        }), 400

    user.password = hash_password(new_password)

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Password changed successfully."
    }), 200