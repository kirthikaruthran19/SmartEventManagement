from app import app
from extensions import db
from models.user import User
from utils.password import hash_password


def create_admin():
    with app.app_context():

        email = "admin@gmail.com"

        admin = User.query.filter_by(email=email).first()

        if admin:
            admin.role = "admin"
            admin.is_active = True

            db.session.commit()

            print("=" * 50)
            print("Admin user already exists.")
            print("Role updated to ADMIN.")
            print("=" * 50)
            return

        admin = User(
            full_name="System Administrator",
            email="admin@gmail.com",
            password=hash_password("Admin@123"),
            phone="9999999999",
            address="Head Office",
            role="admin",
            is_active=True,
        )

        db.session.add(admin)
        db.session.commit()

        print("=" * 50)
        print("Admin created successfully.")
        print("=" * 50)
        print("Email    : admin@gmail.com")
        print("Password : Admin@123")
        print("=" * 50)


if __name__ == "__main__":
    create_admin()