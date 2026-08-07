from datetime import datetime

from extensions import db
from models.category import Category
from models.event import Event


class EventService:
    """
    Event Service
    """

    # ==========================================================
    # Create Event
    # ==========================================================

    @staticmethod
    def create_event(data):

        category = db.session.get(
            Category,
            data["category_id"]
        )

        if not category:
            return {
                "success": False,
                "message": "Category not found."
            }

        event = Event(
    title=data["title"],
    description=data["description"],
    location=data["location"],
    event_date=datetime.strptime(
        data["event_date"],
        "%Y-%m-%d"
    ).date(),
    event_time=datetime.strptime(
        data["event_time"],
        "%H:%M"
    ).time(),
    ticket_price=float(data["ticket_price"]),
    available_seats=int(data["available_seats"]),
    organizer=data["organizer"],
    registration_deadline=datetime.strptime(
        data["registration_deadline"],
        "%Y-%m-%d"
    ).date(),
    image_url=data.get("image_url"),
    status=data.get("status", "Upcoming"),
    approval_status="Pending",
    category_id=data["category_id"]
)

        db.session.add(event)
        db.session.commit()

        return {
            "success": True,
            "message": "Event created successfully.",
            "event": event
        }

    # ==========================================================
    # Get All Events (Pagination)
    # ==========================================================

    @staticmethod
    def get_events(page=1, per_page=5):

        pagination = Event.query.order_by(
            Event.event_date
        ).paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )

        return {
            "events": pagination.items,
            "page": pagination.page,
            "per_page": pagination.per_page,
            "total": pagination.total,
            "total_pages": pagination.pages
        }

    # ==========================================================
    # Get Event By ID
    # ==========================================================

    @staticmethod
    def get_event(event_id):

        return db.session.get(
            Event,
            event_id
        )

    # ==========================================================
    # Update Event
    # ==========================================================

    @staticmethod
    def update_event(event, data):

        category = db.session.get(
            Category,
            data["category_id"]
        )

        if not category:
            return {
                "success": False,
                "message": "Category not found."
            }

        event.title = data["title"]
        event.description = data["description"]
        event.location = data["location"]

        event.event_date = datetime.strptime(
            data["event_date"],
            "%Y-%m-%d"
        ).date()

        event.event_time = datetime.strptime(
            data["event_time"],
            "%H:%M"
        ).time()

        event.ticket_price = float(
            data["ticket_price"]
        )

        event.available_seats = int(
            data["available_seats"]
        )

        event.organizer = data["organizer"]

        event.registration_deadline = datetime.strptime(
            data["registration_deadline"],
            "%Y-%m-%d"
        ).date()

        event.image_url = data.get("image_url")

        event.status = data.get(
            "status",
            event.status
        )

        event.category_id = data["category_id"]

        db.session.commit()

        return {
            "success": True,
            "message": "Event updated successfully."
        }

    # ==========================================================
    # Delete Event
    # ==========================================================

    @staticmethod
    def delete_event(event):

        db.session.delete(event)
        db.session.commit()

        return {
            "success": True,
            "message": "Event deleted successfully."
        }

    # ==========================================================
    # Search Events
    # ==========================================================

    @staticmethod
    def search_events(keyword):

        return Event.query.filter(
            Event.title.ilike(f"%{keyword}%")
        ).all()

    # ==========================================================
    # Filter By Category
    # ==========================================================

    @staticmethod
    def filter_by_category(category_id):

        return Event.query.filter_by(
            category_id=category_id
        ).all()