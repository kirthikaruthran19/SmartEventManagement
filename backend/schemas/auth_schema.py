import re


class AuthValidator:
    """
    Authentication Validation Class
    """

    @staticmethod
    def validate_register(data):
        errors = {}

        # ==========================
        # Full Name
        # ==========================
        full_name = data.get("full_name", "").strip()

        if not full_name:
            errors["full_name"] = "Full name is required."

        elif len(full_name) < 3:
            errors["full_name"] = "Full name must be at least 3 characters."

        # ==========================
        # Email
        # ==========================
        email = data.get("email", "").strip()

        if not email:
            errors["email"] = "Email is required."

        else:
            pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"

            if not re.match(pattern, email):
                errors["email"] = "Invalid email format."

        # ==========================
        # Password
        # ==========================
        password = data.get("password", "")

        if not password:
            errors["password"] = "Password is required."

        elif len(password) < 8:
            errors["password"] = "Password must be at least 8 characters."

        # ==========================
        # Confirm Password
        # ==========================
        confirm_password = data.get("confirm_password", "")

        if password != confirm_password:
            errors["confirm_password"] = "Passwords do not match."

        return errors

    @staticmethod
    def validate_login(data):
        errors = {}

        email = data.get("email", "").strip()

        password = data.get("password", "")

        if not email:
            errors["email"] = "Email is required."

        if not password:
            errors["password"] = "Password is required."

        return errors