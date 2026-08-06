from datetime import datetime

from extensions import db


class User(db.Model):
    """
    User Model
    """

    __tablename__ = "users"

    # ==========================
    # Primary Key
    # ==========================

    id = db.Column(db.Integer, primary_key=True)

    # ==========================
    # User Information
    # ==========================

    full_name = db.Column(
        db.String(100),
        nullable=False
    )

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False
    )

    password = db.Column(
        db.String(255),
        nullable=False
    )

    phone = db.Column(
        db.String(15),
        nullable=True
    )

    address = db.Column(
        db.Text,
        nullable=True
    )

    # ==========================
    # User Role
    # ==========================

    role = db.Column(
        db.String(20),
        default="user"
    )

    # ==========================
    # Account Status
    # ==========================

    is_active = db.Column(
        db.Boolean,
        default=True
    )

    # ==========================
    # Timestamps
    # ==========================

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    # ==========================
    # String Representation
    # ==========================

    def __repr__(self):
        return f"<User {self.email}>"