import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
    getUser,
    updateUser,
} from "../../services/userService";

function UserForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        address: "",
        role: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
    const loadUser = async () => {
        try {
            setLoading(true);

            const response = await getUser(id);

            setFormData({
                full_name: response.user.full_name || "",
                email: response.user.email || "",
                phone: response.user.phone || "",
                address: response.user.address || "",
                role: response.user.role || "user",
            });
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to load user."
            );

            navigate("/users");
        } finally {
            setLoading(false);
        }
    };

    loadUser();
}, [id, navigate]);

    

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

        if (!formData.full_name.trim()) {
            validationErrors.full_name =
                "Full name is required.";
        }

        if (!formData.email.trim()) {
            validationErrors.email =
                "Email is required.";
        }

        if (!formData.role) {
            validationErrors.role =
                "Role is required.";
        }

        setErrors(validationErrors);

        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setLoading(true);

            const response = await updateUser(
                id,
                formData
            );

            toast.success(
                response.message ||
                "User updated successfully."
            );

            navigate("/users");
        } catch (error) {
            const data = error.response?.data;

            if (data?.errors) {
                setErrors(data.errors);
            }

            toast.error(
                data?.message ||
                "Failed to update user."
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary"></div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-3">

            <div className="row justify-content-center">

                <div className="col-lg-8">

                    <div className="card shadow-sm border-0">

                        <div className="card-header bg-white">
                            <h3 className="fw-bold mb-0">
                                Edit User
                            </h3>
                        </div>

                        <div className="card-body">

                            <form onSubmit={handleSubmit}>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        name="full_name"
                                        className={`form-control ${
                                            errors.full_name
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        value={formData.full_name}
                                        onChange={handleChange}
                                    />

                                    <div className="invalid-feedback">
                                        {errors.full_name}
                                    </div>

                                </div>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        className={`form-control ${
                                            errors.email
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        value={formData.email}
                                        onChange={handleChange}
                                    />

                                    <div className="invalid-feedback">
                                        {errors.email}
                                    </div>

                                </div>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Phone
                                    </label>

                                    <input
                                        type="text"
                                        name="phone"
                                        className="form-control"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />

                                </div>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Address
                                    </label>

                                    <textarea
                                        rows="3"
                                        name="address"
                                        className="form-control"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />

                                </div>

                                <div className="mb-4">

                                    <label className="form-label">
                                        Role
                                    </label>

                                    <select
                                        name="role"
                                        className={`form-select ${
                                            errors.role
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        value={formData.role}
                                        onChange={handleChange}
                                    >
                                        <option value="user">
                                            User
                                        </option>

                                        <option value="admin">
                                            Admin
                                        </option>

                                    </select>

                                    <div className="invalid-feedback">
                                        {errors.role}
                                    </div>

                                </div>

                                <div className="d-flex gap-2">

                                    <button
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading
                                            ? "Updating..."
                                            : "Update User"}
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() =>
                                            navigate("/users")
                                        }
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

export default UserForm;