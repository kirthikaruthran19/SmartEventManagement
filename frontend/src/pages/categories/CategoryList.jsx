import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
    getCategories,
    deleteCategory,
} from "../../services/categoryService";

function CategoryList() {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] =useState(true);

    const fetchCategories = async () => {
        try {
            setLoading(true);

            const response = await getCategories();

            const data = Array.isArray(response)
                ? response
                : response.categories || [];

            setCategories(data);
            setFilteredCategories(data);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to load categories."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const filtered = categories.filter((category) =>
            (category.name || "")
                .toLowerCase()
                .includes(search.toLowerCase())
        );

        setFilteredCategories(filtered);
    }, [search, categories]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmDelete) return;

        try {
            const response = await deleteCategory(id);

            toast.success(
                response.message || "Category deleted successfully."
            );

            fetchCategories();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to delete category."
            );
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Categories</h2>
                    <p className="text-muted mb-0">
                        Manage event categories
                    </p>
                </div>

                <Link
                    to="/categories/add"
                    className="btn btn-primary"
                >
                    <i className="bi bi-plus-circle me-2"></i>
                    Add Category
                </Link>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search Category..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredCategories.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="3"
                                            className="text-center py-4 text-muted"
                                        >
                                            No categories found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCategories.map((category) => (
                                        <tr key={category.id}>
                                            <td>{category.id}</td>

                                            <td>{category.name}</td>

                                            <td className="text-center">
                                                <Link
                                                    to={`/categories/edit/${category.id}`}
                                                    className="btn btn-sm btn-warning me-2"
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                </Link>

                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() =>
                                                        handleDelete(category.id)
                                                    }
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoryList;