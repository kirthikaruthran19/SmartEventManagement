"""
Category Service
Handles all business logic related to categories.
"""

from extensions import db
from models.category import Category


class CategoryService:
    """
    Service class for Category CRUD operations.
    """

    @staticmethod
    def create_category(data):
        """
        Create a new category.
        """

        name = data.get("name").strip()
        description = data.get("description", "").strip()

        # Check duplicate
        existing = Category.query.filter_by(name=name).first()

        if existing:
            return {
                "success": False,
                "message": "Category already exists."
            }

        category = Category(
            name=name,
            description=description
        )

        db.session.add(category)
        db.session.commit()

        return {
            "success": True,
            "message": "Category created successfully.",
            "category": category.to_dict()
        }

    @staticmethod
    def get_all_categories():
        """
        Get all categories.
        """

        categories = Category.query.order_by(Category.id.desc()).all()

        return [category.to_dict() for category in categories]

    @staticmethod
    def get_category(category_id):
        """
        Get category by ID.
        """

        category = Category.query.get(category_id)

        if not category:
            return None

        return category.to_dict()

    @staticmethod
    def update_category(category_id, data):
        """
        Update category.
        """

        category = Category.query.get(category_id)

        if not category:
            return {
                "success": False,
                "message": "Category not found."
            }

        name = data.get("name").strip()
        description = data.get("description", "").strip()

        duplicate = Category.query.filter(
            Category.name == name,
            Category.id != category_id
        ).first()

        if duplicate:
            return {
                "success": False,
                "message": "Category already exists."
            }

        category.name = name
        category.description = description

        db.session.commit()

        return {
            "success": True,
            "message": "Category updated successfully.",
            "category": category.to_dict()
        }

    @staticmethod
    def delete_category(category_id):
        """
        Delete category.
        """

        category = Category.query.get(category_id)

        if not category:
            return {
                "success": False,
                "message": "Category not found."
            }

        db.session.delete(category)
        db.session.commit()

        return {
            "success": True,
            "message": "Category deleted successfully."
        }