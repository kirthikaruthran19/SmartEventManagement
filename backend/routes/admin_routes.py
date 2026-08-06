import csv
import io

from flask import Blueprint, jsonify, request, Response

from services.admin_service import AdminService
from utils.decorators import admin_required
from models.booking import Booking


admin_bp = Blueprint(
    "admin",
    __name__
)


# ==========================================================
# Get All Users
# ==========================================================

@admin_bp.route("/users", methods=["GET"])
@admin_required
def get_users():

    users = AdminService.get_all_users()

    result = []

    for user in users:

        result.append({
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "phone": user.phone,
            "address": user.address,
            "role": user.role,
            "is_active": user.is_active,
            "created_at": str(user.created_at)
        })

    return jsonify({
        "success": True,
        "count": len(result),
        "users": result
    }), 200

# ==========================================================
# Get User By ID
# ==========================================================

@admin_bp.route("/users/<int:user_id>", methods=["GET"])
@admin_required
def get_user(user_id):

    user = AdminService.get_user(user_id)

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
            "role": user.role,
            "is_active": user.is_active
        }
    }), 200
# ==========================================================
# Update User
# ==========================================================

@admin_bp.route("/users/<int:user_id>", methods=["PUT"])
@admin_required
def update_user(user_id):

    user = AdminService.get_user(user_id)

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

    result = AdminService.update_user(
        user,
        data
    )

    return jsonify(result), 200


# ==========================================================
# Toggle User Status
# ==========================================================

@admin_bp.route("/users/<int:user_id>/status", methods=["PUT"])
@admin_required
def toggle_user_status(user_id):

    user = AdminService.get_user(user_id)

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    result = AdminService.toggle_user_status(user)

    return jsonify(result), 200


# ==========================================================
# Delete User
# ==========================================================

@admin_bp.route("/users/<int:user_id>", methods=["DELETE"])
@admin_required
def delete_user(user_id):

    user = AdminService.get_user(user_id)

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    result = AdminService.delete_user(user)

    return jsonify(result), 200


# ==========================================================
# Export Booking Report (CSV)
# ==========================================================

@admin_bp.route("/bookings/export", methods=["GET"])
@admin_required
def export_bookings():

    bookings = Booking.query.all()

    output = io.StringIO()

    writer = csv.writer(output)

    writer.writerow([
        "Booking ID",
        "User Name",
        "Event Title",
        "Tickets",
        "Status",
        "Booked At"
    ])

    for booking in bookings:

        writer.writerow([
            booking.id,
            booking.user.full_name,
            booking.event.title,
            booking.number_of_tickets,
            booking.booking_status,
            booking.booked_at
        ])

    output.seek(0)

    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=booking_report.csv"
        }
    )