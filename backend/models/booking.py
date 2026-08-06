from datetime import datetime

from extensions import db


class Booking(db.Model):
    """
    Booking Model
    """

    __tablename__ = "bookings"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    event_id = db.Column(
        db.Integer,
        db.ForeignKey("events.id"),
        nullable=False
    )

    number_of_tickets = db.Column(
        db.Integer,
        nullable=False,
        default=1
    )

    booking_status = db.Column(
        db.String(20),
        default="Confirmed"
    )

    booked_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    user = db.relationship(
        "User",
        backref="bookings",
        lazy=True
    )

    event = db.relationship(
        "Event",
        backref="bookings",
        lazy=True
    )

    def __repr__(self):
        return f"<Booking {self.id}>"