from flask import Blueprint, request, jsonify

from services.event_service import EventService
from schemas.event_schema import EventValidator
from models.event import Event
from utils.decorators import admin_required
from extensions import db

event_bp = Blueprint("events", __name__)


# ==========================================================
# Create Event
# ==========================================================

@event_bp.route("/", methods=["POST"])
@admin_required
def create_event():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    errors = EventValidator.validate_event(data)

    if errors:
        return jsonify({
            "success": False,
            "errors": errors
        }), 400

    result = EventService.create_event(data)

    if not result["success"]:
        return jsonify(result), 400

    event = result["event"]

    return jsonify({
        "success": True,
        "message": result["message"],
        "event": {
    "id": event.id,
    "title": event.title,
    "description": event.description,
    "location": event.location,
    "event_date": str(event.event_date),
    "event_time": str(event.event_time),
    "ticket_price": event.ticket_price,
    "available_seats": event.available_seats,
    "organizer": event.organizer,
    "registration_deadline": str(event.registration_deadline),
    "image_url": event.image_url,
    "status": event.status,
    "category_id": event.category_id
}
    }), 201


# ==========================================================
# Get All Events
# ==========================================================

@event_bp.route("/", methods=["GET"])
def get_events():

    page = request.args.get("page", default=1, type=int)
    per_page = request.args.get("per_page", default=5, type=int)

    data = EventService.get_events(page, per_page)

    result = []

    for event in data["events"]:
        result.append({
            "id": event.id,
            "title": event.title,
            "description": event.description,
            "location": event.location,
            "event_date": str(event.event_date),
            "event_time": str(event.event_time),
            "ticket_price": event.ticket_price,
            "available_seats": event.available_seats,
            "organizer": event.organizer,
            "registration_deadline": str(event.registration_deadline),
            "image_url": event.image_url,
            "status": event.status,
            "category": event.category.name
        })

    return jsonify({
        "success": True,
        "events": result,
        "pagination": {
            "page": data["page"],
            "per_page": data["per_page"],
            "total": data["total"],
            "total_pages": data["total_pages"]
        }
    }), 200

# ==========================================================
# Get Event By ID
# ==========================================================

@event_bp.route("/<int:event_id>", methods=["GET"])
def get_event(event_id):

    event = EventService.get_event(event_id)

    if not event:
        return jsonify({
            "success": False,
            "message": "Event not found."
        }), 404

    return jsonify({
        "success": True,
        "event": {
    "id": event.id,
    "title": event.title,
    "description": event.description,
    "location": event.location,
    "event_date": str(event.event_date),
    "event_time": str(event.event_time),
    "ticket_price": event.ticket_price,
    "available_seats": event.available_seats,
    "organizer": event.organizer,
    "registration_deadline": str(event.registration_deadline),
    "image_url": event.image_url,
    "status": event.status,
    "category_id": event.category_id
}
    }), 200


# ==========================================================
# Update Event
# ==========================================================

@event_bp.route("/<int:event_id>", methods=["PUT"])
@admin_required
def update_event(event_id):

    event = db.session.get(Event, event_id)

    if not event:
        return jsonify({
            "success": False,
            "message": "Event not found."
        }), 404

    data = request.get_json()

    errors = EventValidator.validate_event(data)

    if errors:
        return jsonify({
            "success": False,
            "errors": errors
        }), 400

    result = EventService.update_event(event, data)

    return jsonify(result), 200


# ==========================================================
# Delete Event
# ==========================================================

@event_bp.route("/<int:event_id>", methods=["DELETE"])
@admin_required
def delete_event(event_id):

    event = db.session.get(Event, event_id)

    if not event:
        return jsonify({
            "success": False,
            "message": "Event not found."
        }), 404

    result = EventService.delete_event(event)

    return jsonify(result), 200


# ==========================================================
# Search Events
# ==========================================================

@event_bp.route("/search", methods=["GET"])
def search_events():

    keyword = request.args.get("keyword", "")

    events = EventService.search_events(keyword)

    data = []

    for event in events:
        data.append({
    "id": event.id,
    "title": event.title,
    "location": event.location,
    "ticket_price": event.ticket_price,
    "available_seats": event.available_seats,
    "event_date": str(event.event_date),
    "status": event.status
})

    return jsonify({
        "success": True,
        "count": len(data),
        "events": data
    }), 200


# ==========================================================
# Filter Events By Category
# ==========================================================

@event_bp.route("/category/<int:category_id>", methods=["GET"])
def events_by_category(category_id):

    events = EventService.filter_by_category(category_id)

    data = []

    for event in events:
        data.append({
    "id": event.id,
    "title": event.title,
    "location": event.location,
    "ticket_price": event.ticket_price,
    "available_seats": event.available_seats,
    "event_date": str(event.event_date),
    "status": event.status
})

    return jsonify({
        "success": True,
        "count": len(data),
        "events": data
    }), 200