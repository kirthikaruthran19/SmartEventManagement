from io import BytesIO

from flask import (
    Blueprint,
    request,
    jsonify,
    send_file,
)
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
)
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from extensions import db
from models.booking import Booking
from models.user import User
from schemas.booking_schema import BookingValidator
from services.booking_service import BookingService
from utils.decorators import admin_required

booking_bp = Blueprint("bookings", __name__)


# ==========================================================
# Create Booking
# ==========================================================

@booking_bp.route("/", methods=["POST"])
@jwt_required()
def create_booking():

    user_id = int(get_jwt_identity())

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    errors = BookingValidator.validate_booking(data)

    if errors:
        return jsonify({
            "success": False,
            "errors": errors
        }), 400

    result = BookingService.create_booking(user_id, data)

    if not result["success"]:
        return jsonify(result), 400

    booking = result["booking"]

    return jsonify({
        "success": True,
        "message": result["message"],
        "booking": {
            "id": booking.id,
            "event_id": booking.event_id,
            "user_id": booking.user_id,
            "number_of_tickets": booking.number_of_tickets,
            "booking_status": booking.booking_status,
            "booked_at": str(booking.booked_at)
        }
    }), 201


# ==========================================================
# My Bookings
# ==========================================================

@booking_bp.route("/my-bookings", methods=["GET"])
@jwt_required()
def my_bookings():

    user_id = int(get_jwt_identity())

    bookings = BookingService.get_user_bookings(user_id)

    result = []

    for booking in bookings:

        result.append({
            "id": booking.id,
            "event": booking.event.title,
            "tickets": booking.number_of_tickets,
            "status": booking.booking_status,
            "booked_at": str(booking.booked_at)
        })

    return jsonify({
        "success": True,
        "count": len(result),
        "bookings": result
    }), 200


# ==========================================================
# Get Booking By ID
# ==========================================================

@booking_bp.route("/<int:booking_id>", methods=["GET"])
@jwt_required()
def get_booking(booking_id):

    user_id = int(get_jwt_identity())

    booking = BookingService.get_booking(booking_id)

    if not booking:
        return jsonify({
            "success": False,
            "message": "Booking not found."
        }), 404

    if booking.user_id != user_id:

        user = db.session.get(User, user_id)

        if user.role != "admin":
            return jsonify({
                "success": False,
                "message": "Access denied."
            }), 403

    return jsonify({
        "success": True,
        "booking": {
            "id": booking.id,
            "event": booking.event.title,
            "tickets": booking.number_of_tickets,
            "status": booking.booking_status,
            "booked_at": str(booking.booked_at)
        }
    }), 200


# ==========================================================
# Get All Bookings (Admin)
# ==========================================================

@booking_bp.route("/", methods=["GET"])
@admin_required
def all_bookings():

    bookings = BookingService.get_all_bookings()

    result = []

    for booking in bookings:

        result.append({
            "id": booking.id,
            "user": booking.user.full_name,
            "event": booking.event.title,
            "tickets": booking.number_of_tickets,
            "status": booking.booking_status
        })

    return jsonify({
        "success": True,
        "count": len(result),
        "bookings": result
    }), 200


# ==========================================================
# Cancel Booking
# ==========================================================

@booking_bp.route("/<int:booking_id>/cancel", methods=["PUT"])
@jwt_required()
def cancel_booking(booking_id):

    user_id = int(get_jwt_identity())

    booking = BookingService.get_booking(booking_id)

    if not booking:
        return jsonify({
            "success": False,
            "message": "Booking not found."
        }), 404

    if booking.user_id != user_id:
        return jsonify({
            "success": False,
            "message": "Access denied."
        }), 403

    result = BookingService.cancel_booking(booking)

    return jsonify(result), 200


# ==========================================================
# Delete Booking (Admin)
# ==========================================================

@booking_bp.route("/<int:booking_id>", methods=["DELETE"])
@admin_required
def delete_booking(booking_id):

    booking = BookingService.get_booking(booking_id)

    if not booking:
        return jsonify({
            "success": False,
            "message": "Booking not found."
        }), 404

    result = BookingService.delete_booking(booking)

    return jsonify(result), 200


# ==========================================================
# Booking Statistics (Admin)
# ==========================================================

@booking_bp.route("/statistics", methods=["GET"])
@admin_required
def booking_statistics():

    stats = BookingService.booking_statistics()

    return jsonify({
        "success": True,
        "statistics": stats
    }), 200

# ==========================================================
# Download Booking Confirmation (PDF)
# ==========================================================

@booking_bp.route("/<int:booking_id>/download", methods=["GET"])
@jwt_required()
def download_booking_confirmation(booking_id):

    user_id = int(get_jwt_identity())

    booking = BookingService.get_booking(booking_id)

    if not booking:
        return jsonify({
            "success": False,
            "message": "Booking not found."
        }), 404

    # Owner or Admin can download
    if booking.user_id != user_id:

        user = db.session.get(User, user_id)

        if user.role != "admin":
            return jsonify({
                "success": False,
                "message": "Access denied."
            }), 403

    # ==========================================
    # Create PDF
    # ==========================================

    buffer = BytesIO()

    pdf = canvas.Canvas(buffer)

    # Title
    pdf.setFont("Helvetica-Bold", 22)
    pdf.setFillColor(HexColor("#0d6efd"))
    pdf.drawString(60, 800, "Smart Event Management")

    # Subtitle
    pdf.setFont("Helvetica-Bold", 18)
    pdf.setFillColor(HexColor("#000000"))
    pdf.drawString(60, 770, "Booking Confirmation")

    pdf.line(60, 760, 540, 760)

    y = 725

    pdf.setFont("Helvetica", 12)

    details = [
        ("Booking ID", booking.id),
        ("User", booking.user.full_name),
        ("Event", booking.event.title),
        ("Location", booking.event.location),
        ("Event Date", str(booking.event.event_date)),
        ("Event Time", str(booking.event.event_time)),
        ("Tickets", booking.number_of_tickets),
        ("Status", booking.booking_status),
        ("Booked At", str(booking.booked_at)),
    ]

    for label, value in details:
        pdf.drawString(70, y, f"{label}: {value}")
        y -= 25

    pdf.line(60, y - 10, 540, y - 10)

    pdf.setFont("Helvetica-Oblique", 11)
    pdf.drawString(
        60,
        y - 35,
        "Thank you for booking with Smart Event Management System."
    )

    pdf.save()

    buffer.seek(0)

    return send_file(
        buffer,
        as_attachment=True,
        download_name=f"booking_{booking.id}.pdf",
        mimetype="application/pdf"
    )