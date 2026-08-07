from datetime import datetime

from extensions import db


class Event(db.Model):
    """
    Event Model
    """

    __tablename__ = "events"

    # ==========================================================
    # Primary Key
    # ==========================================================

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    # ==========================================================
    # Event Details
    # ==========================================================

    title = db.Column(
        db.String(200),
        nullable=False
    )

    description = db.Column(
        db.Text,
        nullable=False
    )

    location = db.Column(
        db.String(200),
        nullable=False
    )

    event_date = db.Column(
        db.Date,
        nullable=False
    )

    event_time = db.Column(
        db.Time,
        nullable=False
    )

    ticket_price = db.Column(
        db.Float,
        nullable=False,
        default=0
    )

    available_seats = db.Column(
        db.Integer,
        nullable=False,
        default=0
    )

    organizer = db.Column(
        db.String(150),
        nullable=False
    )

    registration_deadline = db.Column(
        db.Date,
        nullable=False
    )

    image_url = db.Column(
        db.String(500),
        nullable=True
    )

    status = db.Column(
        db.String(20),
        default="Upcoming"
    )
    approval_status = db.Column(
    db.String(20),
    nullable=False,
    default="Pending"
)

    # ==========================================================
    # Foreign Key
    # ==========================================================

    category_id = db.Column(
        db.Integer,
        db.ForeignKey("categories.id"),
        nullable=False
    )

    # ==========================================================
    # Relationship
    # ==========================================================

    category = db.relationship(
        "Category",
        backref="events",
        lazy=True
    )

    # ==========================================================
    # Timestamps
    # ==========================================================

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    def __repr__(self):
        return f"<Event {self.title}>"