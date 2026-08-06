from extensions import db
from models.booking import Booking
from models.event import Event
from models.user import User


class BookingService:
    """
    Booking Service
    """

    MAX_TICKETS_PER_USER = 5

    # ==========================================================
    # Create Booking
    # ==========================================================

    @staticmethod
    def create_booking(user_id, data):

        event = db.session.get(
            Event,
            data["event_id"]
        )

        if not event:
            return {
                "success": False,
                "message": "Event not found."
            }

        tickets = int(data["number_of_tickets"])

        # ==========================================================
        # Required Validation
        # ==========================================================

        if tickets <= 0:
            return {
                "success": False,
                "message": "Please select at least one ticket."
            }

        # ==========================================================
        # Booking Limit Validation
        # Maximum 5 tickets per user per event
        # ==========================================================

        existing_booking = Booking.query.filter(
            Booking.user_id == user_id,
            Booking.event_id == event.id,
            Booking.booking_status == "Confirmed"
        ).all()

        total_booked = sum(
            booking.number_of_tickets
            for booking in existing_booking
        )

        if total_booked + tickets > BookingService.MAX_TICKETS_PER_USER:
            return {
                "success": False,
                "message": f"You can book a maximum of {BookingService.MAX_TICKETS_PER_USER} tickets for this event."
            }

        # ==========================================================
        # Seat Availability Validation
        # ==========================================================

        if tickets > event.available_seats:
            return {
                "success": False,
                "message": f"Only {event.available_seats} seats are available."
            }

        booking = Booking(
            user_id=user_id,
            event_id=data["event_id"],
            number_of_tickets=tickets
        )

        # Reduce available seats
        event.available_seats -= tickets

        db.session.add(booking)
        db.session.commit()

        return {
            "success": True,
            "message": "Booking created successfully.",
            "booking": booking
        }

    # ==========================================================
    # Get Booking By ID
    # ==========================================================

    @staticmethod
    def get_booking(booking_id):

        return db.session.get(
            Booking,
            booking_id
        )

    # ==========================================================
    # Get User Bookings
    # ==========================================================

    @staticmethod
    def get_user_bookings(user_id):

        return Booking.query.filter_by(
            user_id=user_id
        ).all()

    # ==========================================================
    # Get All Bookings
    # ==========================================================

    @staticmethod
    def get_all_bookings():

        return Booking.query.all()

    # ==========================================================
    # Cancel Booking
    # ==========================================================

    @staticmethod
    def cancel_booking(booking):

        # Restore seats only if booking is currently confirmed
        if booking.booking_status == "Confirmed":

            event = booking.event
            event.available_seats += booking.number_of_tickets

        booking.booking_status = "Cancelled"

        db.session.commit()

        return {
            "success": True,
            "message": "Booking cancelled successfully."
        }

    # ==========================================================
    # Delete Booking
    # ==========================================================

    @staticmethod
    def delete_booking(booking):

        db.session.delete(booking)

        db.session.commit()

        return {
            "success": True,
            "message": "Booking deleted successfully."
        }

    # ==========================================================
    # Booking Statistics
    # ==========================================================

    @staticmethod
    def booking_statistics():

        total_bookings = Booking.query.count()

        confirmed = Booking.query.filter_by(
            booking_status="Confirmed"
        ).count()

        cancelled = Booking.query.filter_by(
            booking_status="Cancelled"
        ).count()

        return {
            "total_bookings": total_bookings,
            "confirmed_bookings": confirmed,
            "cancelled_bookings": cancelled
        }