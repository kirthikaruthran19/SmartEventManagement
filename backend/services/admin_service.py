from extensions import db
from models.user import User


class AdminService:
    """
    Admin Service
    """

    # ==========================================================
    # Get All Users
    # ==========================================================

    @staticmethod
    def get_all_users():

        return User.query.order_by(
            User.created_at.desc()
        ).all()

    # ==========================================================
    # Get User By ID
    # ==========================================================

    @staticmethod
    def get_user(user_id):

        return db.session.get(
            User,
            user_id
        )

    # ==========================================================
    # Update User
    # ==========================================================

    @staticmethod
    def update_user(user, data):

        user.full_name = data.get(
            "full_name",
            user.full_name
        )

        user.phone = data.get(
            "phone",
            user.phone
        )

        user.address = data.get(
            "address",
            user.address
        )

        user.role = data.get(
            "role",
            user.role
        )

        db.session.commit()

        return {
            "success": True,
            "message": "User updated successfully."
        }

    # ==========================================================
    # Toggle User Status
    # ==========================================================

    @staticmethod
    def toggle_user_status(user):

        user.is_active = not user.is_active

        db.session.commit()

        return {
            "success": True,
            "message": "User status updated successfully."
        }

    # ==========================================================
    # Delete User
    # ==========================================================

    @staticmethod
    def delete_user(user):

        db.session.delete(user)
        db.session.commit()

        return {
            "success": True,
            "message": "User deleted successfully."
        }