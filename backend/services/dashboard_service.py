from models.user import User
from models.category import Category
from models.event import Event
from models.booking import Booking


class DashboardService:
    """
    Dashboard Service
    """

    # ==========================================================
    # Dashboard Summary
    # ==========================================================

    @staticmethod
    def dashboard_summary():

        total_users = User.query.count()

        total_categories = Category.query.count()

        total_events = Event.query.count()

        total_bookings = Booking.query.count()

        active_events = Event.query.filter_by(
            status="Upcoming"
        ).count()

        completed_events = Event.query.filter_by(
            status="Completed"
        ).count()

        confirmed_bookings = Booking.query.filter_by(
            booking_status="Confirmed"
        ).count()

        pending_bookings = Booking.query.filter_by(
            booking_status="Pending"
        ).count()

        cancelled_bookings = Booking.query.filter_by(
            booking_status="Cancelled"
        ).count()

        return {
            "total_users": total_users,
            "total_categories": total_categories,
            "total_events": total_events,
            "active_events": active_events,
            "completed_events": completed_events,
            "total_bookings": total_bookings,
            "confirmed_bookings": confirmed_bookings,
            "pending_bookings": pending_bookings,
            "cancelled_bookings": cancelled_bookings,
        }

    # ==========================================================
    # Recent Registrations
    # ==========================================================

    @staticmethod
    def recent_registrations(limit=5):

        return (
            Booking.query
            .order_by(Booking.booked_at.desc())
            .limit(limit)
            .all()
        )

    # ==========================================================
    # Event Popularity
    # ==========================================================

    @staticmethod
    def event_popularity():

        events = Event.query.all()

        data = []

        for event in events:

            total_bookings = Booking.query.filter_by(
                event_id=event.id
            ).count()

            data.append({
                "event_id": event.id,
                "event_name": event.title,
                "bookings": total_bookings
            })

        return data