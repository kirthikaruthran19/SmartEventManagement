from flask import Blueprint, jsonify

from services.dashboard_service import DashboardService
from utils.decorators import admin_required


dashboard_bp = Blueprint(
    "dashboard",
    __name__
)


# ==========================================================
# Dashboard Summary
# ==========================================================

@dashboard_bp.route("/", methods=["GET"])
@admin_required
def dashboard():

    data = DashboardService.dashboard_summary()

    return jsonify({
        "success": True,
        "dashboard": data
    }), 200


# ==========================================================
# Recent Registrations
# ==========================================================

@dashboard_bp.route("/recent-registrations", methods=["GET"])
@admin_required
def recent_registrations():

    bookings = DashboardService.recent_registrations()

    data = []

    for booking in bookings:

        data.append({
            "booking_id": booking.id,
            "user": booking.user.full_name,
            "event": booking.event.title,
            "tickets": booking.number_of_tickets,
            "status": booking.booking_status,
            "booked_at": str(booking.booked_at)
        })

    return jsonify({
        "success": True,
        "count": len(data),
        "registrations": data
    }), 200


# ==========================================================
# Event Popularity
# ==========================================================

@dashboard_bp.route("/event-popularity", methods=["GET"])
@admin_required
def event_popularity():

    data = DashboardService.event_popularity()

    return jsonify({
        "success": True,
        "count": len(data),
        "events": data
    }), 200