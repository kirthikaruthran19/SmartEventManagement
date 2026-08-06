"""
Category Validation Schema
"""

class CategorySchema:
    """
    Handles validation for Category APIs
    """

    @staticmethod
    def validate(data):
        errors = {}

        name = data.get("name", "").strip()
        description = data.get("description", "").strip()

        # Validate Category Name
        if not name:
            errors["name"] = "Category name is required."

        elif len(name) < 3:
            errors["name"] = "Category name must be at least 3 characters."

        elif len(name) > 100:
            errors["name"] = "Category name cannot exceed 100 characters."

        # Validate Description
        if description and len(description) > 500:
            errors["description"] = "Description cannot exceed 500 characters."

        return errors