import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
    getProfile,
    updateProfile,
} from "../../services/profileService";

function Profile() {

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        address: "",
        role: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {

        loadProfile();

    }, []);

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

        if (formData.full_name.length < 3) {
            validationErrors.full_name =
                "Full name must be at least 3 characters.";
        }

        if (!formData.phone.trim()) {
            validationErrors.phone =
                "Phone number is required.";
        }

        if (
            formData.phone &&
            !/^[0-9]{10}$/.test(formData.phone)
        ) {
            validationErrors.phone =
                "Enter a valid 10 digit phone number.";
        }

        setErrors(validationErrors);

        return Object.keys(validationErrors).length === 0;

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validate()) return;

        try {

            setSaving(true);

            const response = await updateProfile({
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

            setSaving(false);

        }

    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5">
                <div
                    className="spinner-border text-primary"
                    role="status"
                >
                    <span className="visually-hidden">
                        Loading...
                    </span>
                </div>
            </div>
        );
    }

    return (

        <div className="container-fluid">

            <div className="row justify-content-center">

                <div className="col-xl-10">

                    <div className="card border-0 shadow-lg overflow-hidden">

                        {/* Profile Header */}

                        <div
                            className="text-white p-5"
                            style={{
                                background:
                                    "linear-gradient(135deg,#0d6efd,#6610f2)",
                            }}
                        >

                            <div className="row align-items-center">

                                <div className="col-md-auto text-center">

                                    <div
                                        className="rounded-circle bg-white text-primary fw-bold d-flex justify-content-center align-items-center mx-auto"
                                        style={{
                                            width: "110px",
                                            height: "110px",
                                            fontSize: "42px",
                                        }}
                                    >
                                        {formData.full_name
                                            ?.charAt(0)
                                            ?.toUpperCase()}
                                    </div>

                                </div>

                                <div className="col mt-4 mt-md-0">

                                    <h2 className="fw-bold mb-2">
                                        {formData.full_name}
                                    </h2>

                                    <p className="mb-2 opacity-75">
                                        {formData.email}
                                    </p>

                                    <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">
                                        {formData.role === "admin"
                                            ? "Administrator"
                                            : formData.role}
                                    </span>

                                </div>

                            </div>

                        </div>

                        <div className="card-body p-4 p-lg-5">

                            <form onSubmit={handleSubmit}>

                                {/* Personal Information */}

                                <div className="card border-0 shadow-sm mb-4">

                                    <div className="card-header bg-light border-0">

                                        <h5 className="fw-bold mb-0">
                                            Personal Information
                                        </h5>

                                    </div>

                                    <div className="card-body">

                                        <div className="row">

                                            <div className="col-md-6 mb-4">

                                                <label className="form-label fw-semibold">
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

                                            <div className="col-md-6 mb-4">

                                                <label className="form-label fw-semibold">
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

                                            <div className="col-12">

                                                <label className="form-label fw-semibold">
                                                    Address
                                                </label>

                                                <textarea
                                                    rows="4"
                                                    name="address"
                                                    className="form-control"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                />

                                            </div>

                                        </div>

                                    </div>

                                </div>
                                                                {/* Account Information */}

                                <div className="card border-0 shadow-sm mb-4">

                                    <div className="card-header bg-light border-0">

                                        <h5 className="fw-bold mb-0">
                                            Account Information
                                        </h5>

                                    </div>

                                    <div className="card-body">

                                        <div className="row">

                                            <div className="col-md-6 mb-4">

                                                <label className="form-label fw-semibold">
                                                    Email Address
                                                </label>

                                                <input
                                                    type="email"
                                                    className="form-control bg-light"
                                                    value={formData.email}
                                                    readOnly
                                                />

                                                <small className="text-muted">
                                                    Email cannot be changed.
                                                </small>

                                            </div>

                                            <div className="col-md-6 mb-4">

                                                <label className="form-label fw-semibold">
                                                    Role
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control bg-light text-capitalize"
                                                    value={
                                                        formData.role === "admin"
                                                            ? "Administrator"
                                                            : formData.role
                                                    }
                                                    readOnly
                                                />

                                                <small className="text-muted">
                                                    Your account role is managed by the system.
                                                </small>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                                {/* Action Buttons */}

                                <div className="d-flex flex-column flex-md-row justify-content-between gap-3">

                                    <button
                                        type="submit"
                                        className="btn btn-primary px-4"
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                                Updating...
                                            </>
                                        ) : (
                                            "Update Profile"
                                        )}
                                    </button>

                                    <Link
                                        to="/admin/change-password"
                                        className="btn btn-outline-secondary px-4"
                                    >
                                        Change Password
                                    </Link>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default Profile;