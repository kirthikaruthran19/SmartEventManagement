from flask import Blueprint, request, jsonify

from extensions import db
from models.category import Category
from utils.decorators import admin_required
from schemas.category_schema import CategorySchema

category_bp = Blueprint("categories", __name__)


# ==========================================================
# Create Category
# ==========================================================
@category_bp.route("/", methods=["POST"])
@admin_required
def create_category():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    errors = CategorySchema.validate(data)

    if errors:
        return jsonify({
            "success": False,
            "errors": errors
        }), 400

    name = data.get("name").strip()
    description = data.get("description", "").strip()

    existing = Category.query.filter_by(name=name).first()

    if existing:
        return jsonify({
            "success": False,
            "message": "Category already exists."
        }), 409

    category = Category(
        name=name,
        description=description
    )

    db.session.add(category)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Category created successfully.",
        "category": {
            "id": category.id,
            "name": category.name,
            "description": category.description,
            "created_at": category.created_at.isoformat(),
            "updated_at": category.updated_at.isoformat()
        }
    }), 201


# ==========================================================
# Get All Categories
# ==========================================================
@category_bp.route("/", methods=["GET"])
def get_categories():

    categories = Category.query.order_by(Category.name.asc()).all()

    return jsonify({
        "success": True,
        "count": len(categories),
        "categories": [
            {
                "id": category.id,
                "name": category.name,
                "description": category.description,
                "created_at": category.created_at.isoformat(),
                "updated_at": category.updated_at.isoformat()
            }
            for category in categories
        ]
    }), 200


# ==========================================================
# Get Single Category
# ==========================================================
@category_bp.route("/<int:category_id>", methods=["GET"])
def get_category(category_id):

    category = db.session.get(Category, category_id)

    if not category:
        return jsonify({
            "success": False,
            "message": "Category not found."
        }), 404

    return jsonify({
        "success": True,
        "category": {
            "id": category.id,
            "name": category.name,
            "description": category.description,
            "created_at": category.created_at.isoformat(),
            "updated_at": category.updated_at.isoformat()
        }
    }), 200


# ==========================================================
# Update Category
# ==========================================================
@category_bp.route("/<int:category_id>", methods=["PUT"])
@admin_required
def update_category(category_id):

    category = db.session.get(Category, category_id)

    if not category:
        return jsonify({
            "success": False,
            "message": "Category not found."
        }), 404

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    errors = CategorySchema.validate(data)

    if errors:
        return jsonify({
            "success": False,
            "errors": errors
        }), 400

    name = data.get("name").strip()
    description = data.get("description", "").strip()

    existing = Category.query.filter(
        Category.name == name,
        Category.id != category_id
    ).first()

    if existing:
        return jsonify({
            "success": False,
            "message": "Category already exists."
        }), 409

    category.name = name
    category.description = description

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Category updated successfully.",
        "category": {
            "id": category.id,
            "name": category.name,
            "description": category.description,
            "created_at": category.created_at.isoformat(),
            "updated_at": category.updated_at.isoformat()
        }
    }), 200


# ==========================================================
# Delete Category
# ==========================================================
@category_bp.route("/<int:category_id>", methods=["DELETE"])
@admin_required
def delete_category(category_id):

    category = db.session.get(Category, category_id)

    if not category:
        return jsonify({
            "success": False,
            "message": "Category not found."
        }), 404

    db.session.delete(category)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Category deleted successfully."
    }), 200