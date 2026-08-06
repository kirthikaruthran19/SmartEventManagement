import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
    createCategory,
    getCategory,
    updateCategory,
} from "../../services/categoryService";

function CategoryForm() {
    const navigate = useNavigate();
    const { id } = useParams();

    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!isEdit) return;

        async function fetchCategory() {
            try {
                setLoading(true);

                const response = await getCategory(id);

                const category = response.category;

                setFormData({
                    name: category.name || "",
                    description: category.description || "",
                });
            } catch (error) {
                toast.error(
                    error.response?.data?.message ||
                    "Failed to load category."
                );

                navigate("/categories");
            } finally {
                setLoading(false);
            }
        }

        fetchCategory();
    }, [id, isEdit, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const validate = () => {
        const validationErrors = {};

        if (!formData.name.trim()) {
            validationErrors.name = "Category name is required.";
        }

        if (
            formData.description &&
            formData.description.length > 500
        ) {
            validationErrors.description =
                "Description cannot exceed 500 characters.";
        }

        setErrors(validationErrors);

        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setLoading(true);

            if (isEdit) {
                const response = await updateCategory(id, formData);

                toast.success(
                    response.message ||
                    "Category updated successfully."
                );
            } else {
                const response = await createCategory(formData);

                toast.success(
                    response.message ||
                    "Category created successfully."
                );
            }

            navigate("/categories");
        } catch (error) {
            const data = error.response?.data;

            if (data?.errors) {
                setErrors(data.errors);
            }

            toast.error(
                data?.message ||
                Object.values(data?.errors || {})[0] ||
                "Operation failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid py-3">

            <div className="row justify-content-center">

                <div className="col-lg-8 col-md-10">

                    <div className="card shadow-sm border-0">

                        <div className="card-header bg-white py-3">
                            <h3 className="fw-bold mb-0">
                                {isEdit ? "Edit Category" : "Add Category"}
                            </h3>
                        </div>

                        <div className="card-body p-4">

                            <form onSubmit={handleSubmit} noValidate>

                                <div className="mb-4">

                                    <label className="form-label fw-semibold">
                                        Category Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        className={`form-control ${
                                            errors.name ? "is-invalid" : ""
                                        }`}
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter category name"
                                    />

                                    {errors.name && (
                                        <div className="invalid-feedback">
                                            {errors.name}
                                        </div>
                                    )}

                                </div>

                                <div className="mb-4">

                                    <label className="form-label fw-semibold">
                                        Description
                                    </label>

                                    <textarea
                                        rows="5"
                                        name="description"
                                        className={`form-control ${
                                            errors.description
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Enter description"
                                    />

                                    {errors.description && (
                                        <div className="invalid-feedback">
                                            {errors.description}
                                        </div>
                                    )}

                                </div>

                                <div className="d-flex gap-2">

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading
                                            ? "Saving..."
                                            : isEdit
                                            ? "Update Category"
                                            : "Create Category"}
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => navigate("/categories")}
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default CategoryForm;