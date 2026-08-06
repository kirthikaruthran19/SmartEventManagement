from flask_jwt_extended import create_access_token

from extensions import db
from models.user import User
from utils.password import hash_password, verify_password


class AuthService:

    @staticmethod
    def register(data):
        """
        Register a new user.
        """

        existing_user = User.query.filter_by(
            email=data["email"]
        ).first()

        if existing_user:
            return {
                "success": False,
                "message": "Email already exists."
            }

        user = User(
            full_name=data["full_name"],
            email=data["email"],
            password=hash_password(data["password"]),
            phone=data.get("phone"),
            address=data.get("address"),
            role="user"
        )

        db.session.add(user)
        db.session.commit()

        return {
            "success": True,
            "message": "Registration successful."
        }

    @staticmethod
    def login(data):
        """
        Login user.
        """

        user = User.query.filter_by(
            email=data["email"]
        ).first()

        if not user:
            return {
                "success": False,
                "message": "Invalid email or password."
            }

        if not verify_password(
            data["password"],
            user.password
        ):
            return {
                "success": False,
                "message": "Invalid email or password."
            }

        access_token = create_access_token(
            identity=str(user.id),
            additional_claims={
                "role": user.role
            }
        )

        return {
            "success": True,
            "message": "Login successful.",
            "access_token": access_token,
            "user": {
                "id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "role": user.role
            }
        }