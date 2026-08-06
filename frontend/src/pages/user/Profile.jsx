import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
    getProfile,
    updateProfile,
} from "../../services/profileService";

function Profile() {

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

        const loadProfile = async () => {

            try {

                setLoading(true);

                const response = await getProfile();

                setFormData({
                    full_name: response.user.full_name || "",
                    email: response.user.email || "",
                    phone: response.user.phone || "",
                    address: response.user.address || "",
                    role: response.user.role || "",
                });

            } catch (error) {

                toast.error(
                    error.response?.data?.message ||
                    "Failed to load profile."
                );

            } finally {

                setLoading(false);

            }

        };

        loadProfile();

    }, []);

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

        if (!formData.phone.trim()) {

            validationErrors.phone =
                "Phone number is required.";

        }

        setErrors(validationErrors);

        return Object.keys(validationErrors).length === 0;

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validate()) return;

        try {

            setLoading(true);

            const response =
                await updateProfile({

                    full_name: formData.full_name,

                    phone: formData.phone,

                    address: formData.address,

                });

            toast.success(
                response.message ||
                "Profile updated successfully."
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to update profile."
            );

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <div className="text-center py-5">

                <div className="spinner-border text-primary"></div>

            </div>

        );

    }

    return (

        <div className="container-fluid">

            <div className="card shadow-sm border-0">

                <div className="card-body">

                    <div className="text-center mb-4">

                        <div
                            className="bg-primary text-white rounded-circle d-inline-flex justify-content-center align-items-center fw-bold mb-3"
                            style={{
                                width: 80,
                                height: 80,
                                fontSize: 28,
                            }}
                        >
                            {formData.full_name
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <h4>{formData.full_name}</h4>

                        <p className="text-muted">

                            {formData.email}

                        </p>

                        <span className="badge bg-success">

                            User

                        </span>

                    </div>

                    <form onSubmit={handleSubmit}>                        <div className="row">

                            <div className="col-md-6 mb-3">

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

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    className="form-control bg-light"
                                    value={formData.email}
                                    readOnly
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Phone
                                </label>

                                <input
                                    type="text"
                                    name="phone"
                                    className={`form-control ${
                                        errors.phone
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    value={formData.phone}
                                    onChange={handleChange}
                                />

                                <div className="invalid-feedback">
                                    {errors.phone}
                                </div>

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Role
                                </label>

                                <input
                                    type="text"
                                    className="form-control bg-light"
                                    value={formData.role}
                                    readOnly
                                />

                            </div>

                            <div className="col-12 mb-4">

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

                        </div>

                        <div className="d-flex gap-2">

                            <button
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading
                                    ? "Updating..."
                                    : "Update Profile"}
                            </button>

                            <Link
                                to="/change-password"
                                className="btn btn-outline-secondary"
                            >
                                Change Password
                            </Link>

                        </div>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default Profile;