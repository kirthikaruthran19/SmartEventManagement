from functools import wraps

from flask import jsonify
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
)

from extensions import db
from models.user import User


def admin_required(fn):
    """
    Allow access only to admin users.
    """

    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):

        user_id = int(get_jwt_identity())

        user = db.session.get(User, user_id)

        if not user:
            return jsonify({
                "success": False,
                "message": "User not found."
            }), 404

        if user.role != "admin":
            return jsonify({
                "success": False,
                "message": "Admin access required."
            }), 403

        return fn(*args, **kwargs)

    return wrapper