from werkzeug.security import generate_password_hash, check_password_hash


def hash_password(password: str) -> str:
    """
    Convert plain password into hashed password.
    """
    return generate_password_hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    """
    Verify plain password against hashed password.
    """
    return check_password_hash(hashed_password, password)