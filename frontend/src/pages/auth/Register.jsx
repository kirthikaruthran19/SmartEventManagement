import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { registerUser } from "../../services/authService";

import "../../assets/styles/login.css";

function Register() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
        confirm_password: "",
    });

    const [errors, setErrors] = useState({});

    // ==========================================
    // Handle Change
    // ==========================================

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

    // ==========================================
    // Validation
    // ==========================================

    const validate = () => {

        const newErrors = {};

        if (!formData.full_name.trim()) {

            newErrors.full_name =
                "Full name is required.";

        } else if (formData.full_name.length < 3) {

            newErrors.full_name =
                "Minimum 3 characters required.";

        }

        if (!formData.email.trim()) {

            newErrors.email =
                "Email is required.";

        } else if (
            !/^\S+@\S+\.\S+$/.test(formData.email)
        ) {

            newErrors.email =
                "Enter a valid email address.";

        }

        if (!formData.password) {

            newErrors.password =
                "Password is required.";

        } else if (
            formData.password.length < 6
        ) {

            newErrors.password =
                "Password must contain at least 6 characters.";

        }

        if (!formData.confirm_password) {

            newErrors.confirm_password =
                "Confirm password is required.";

        } else if (
            formData.password !==
            formData.confirm_password
        ) {

            newErrors.confirm_password =
                "Passwords do not match.";

        }

        setErrors(newErrors);

        return (
            Object.keys(newErrors).length === 0
        );
    };

    // ==========================================
    // Register
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validate()) return;

        try {

            setLoading(true);

            setErrors({});

            await registerUser({

                full_name:
                    formData.full_name.trim(),

                email:
                    formData.email.trim(),

                password:
                    formData.password,

                confirm_password:
                    formData.confirm_password,

            });

            toast.success(
                "Registration successful."
            );

            navigate("/login");

        } catch (error) {

            const response =
                error.response?.data;

            if (response?.errors) {

                setErrors(response.errors);

                Object.values(
                    response.errors
                ).forEach((message) => {

                    toast.error(message);

                });

                return;

            }

            toast.error(

                response?.message ||

                "Registration failed."

            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="container-fluid login-page">

    <div className="row g-0 h-100">

        {/* ==========================================
            LEFT PANEL
        ========================================== */}

        <div className="col-lg-7 login-left d-none d-lg-flex">

            <div className="hero-dots"></div>

            <div className="hero-blur"></div>

            <div className="hero-content">

                <h1 className="hero-title">

                    Join the

                    <span> Smart Event</span>

                    <br />

                    Community

                </h1>

                <p className="hero-text">

                    Create your account to discover events,
                    book tickets, manage registrations and
                    experience seamless event management from
                    anywhere.

                </p>

                <div className="hero-line"></div>

                <div className="feature-list">

                    <div className="feature-item">

                        <div className="feature-icon blue">

                            <i className="bi bi-calendar-event"></i>

                        </div>

                        <div>

                            <h6 className="feature-title">

                                Discover Events

                            </h6>

                            <p className="feature-desc">

                                Browse upcoming events with
                                categories and search.

                            </p>

                        </div>

                    </div>

                    <div className="feature-item">

                        <div className="feature-icon purple">

                            <i className="bi bi-ticket-perforated"></i>

                        </div>

                        <div>

                            <h6 className="feature-title">

                                Instant Booking

                            </h6>

                            <p className="feature-desc">

                                Reserve seats quickly with
                                secure online booking.

                            </p>

                        </div>

                    </div>

                    <div className="feature-item">

                        <div className="feature-icon green">

                            <i className="bi bi-person-check"></i>

                        </div>

                        <div>

                            <h6 className="feature-title">

                                Manage Profile

                            </h6>

                            <p className="feature-desc">

                                Update your profile and
                                booking history anytime.

                            </p>

                        </div>

                    </div>

                    <div className="feature-item">

                        <div className="feature-icon orange">

                            <i className="bi bi-shield-lock"></i>

                        </div>

                        <div>

                            <h6 className="feature-title">

                                Secure Platform

                            </h6>

                            <p className="feature-desc">

                                Protected with JWT
                                authentication and role-based
                                access.

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

        {/* ==========================================
            RIGHT PANEL
        ========================================== */}

        <div className="col-lg-5 login-right">

            <div className="login-card">

                <div className="text-center mb-4">

                    <div className="login-icon">

                        <i className="bi bi-person-plus-fill"></i>

                    </div>

                    <h1 className="mt-4">

                        Create Account

                    </h1>

                    <p>

                        Register to get started

                    </p>

                </div>

                <form onSubmit={handleSubmit} noValidate>{/* ==========================================
    Full Name
========================================== */}

<div className="mb-3">

    <label className="form-label">
        Full Name
    </label>

    <div className="input-group">

        <span className="input-group-text">
            <i className="bi bi-person"></i>
        </span>

        <input
            type="text"
            name="full_name"
            className={`form-control ${
                errors.full_name ? "is-invalid" : ""
            }`}
            placeholder="Enter your full name"
            value={formData.full_name}
            onChange={handleChange}
            autoComplete="name"
        />

    </div>

    {errors.full_name && (
        <div className="invalid-feedback d-block">
            {errors.full_name}
        </div>
    )}

</div>

{/* ==========================================
    Email
========================================== */}

<div className="mb-3">

    <label className="form-label">
        Email Address
    </label>

    <div className="input-group">

        <span className="input-group-text">
            <i className="bi bi-envelope"></i>
        </span>

        <input
            type="email"
            name="email"
            className={`form-control ${
                errors.email ? "is-invalid" : ""
            }`}
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
        />

    </div>

    {errors.email && (
        <div className="invalid-feedback d-block">
            {errors.email}
        </div>
    )}

</div>

{/* ==========================================
    Password
========================================== */}

<div className="mb-3">

    <label className="form-label">
        Password
    </label>

    <div className="input-group">

        <span className="input-group-text">
            <i className="bi bi-lock"></i>
        </span>

        <input
            type={
                showPassword
                    ? "text"
                    : "password"
            }
            name="password"
            className={`form-control ${
                errors.password ? "is-invalid" : ""
            }`}
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
        />

        <button
            type="button"
            className="btn"
            onClick={() =>
                setShowPassword(!showPassword)
            }
        >
            <i
                className={
                    showPassword
                        ? "bi bi-eye-slash"
                        : "bi bi-eye"
                }
            ></i>
        </button>

    </div>

    {errors.password && (
        <div className="invalid-feedback d-block">
            {errors.password}
        </div>
    )}

</div>

{/* ==========================================
    Confirm Password
========================================== */}

<div className="mb-4">

    <label className="form-label">
        Confirm Password
    </label>

    <div className="input-group">

        <span className="input-group-text">
            <i className="bi bi-shield-lock"></i>
        </span>

        <input
            type={
                showConfirmPassword
                    ? "text"
                    : "password"
            }
            name="confirm_password"
            className={`form-control ${
                errors.confirm_password
                    ? "is-invalid"
                    : ""
            }`}
            placeholder="Confirm password"
            value={formData.confirm_password}
            onChange={handleChange}
            autoComplete="new-password"
        />

        <button
            type="button"
            className="btn"
            onClick={() =>
                setShowConfirmPassword(
                    !showConfirmPassword
                )
            }
        >
            <i
                className={
                    showConfirmPassword
                        ? "bi bi-eye-slash"
                        : "bi bi-eye"
                }
            ></i>
        </button>

    </div>

    {errors.confirm_password && (
        <div className="invalid-feedback d-block">
            {errors.confirm_password}
        </div>
    )}

</div>

{/* ==========================================
    Register Button
========================================== */}

<button
    type="submit"
    className="gradient-btn"
    disabled={loading}
>

    {loading ? (
        <>
            <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
            ></span>

            Creating Account...

        </>
    ) : (
        <>
            <i className="bi bi-person-plus me-2"></i>

            Create Account
        </>
    )}

</button>

<div className="login-divider">
    <span>OR</span>
</div>

<div className="register-text">

    Already have an account?

    <br />

    <Link to="/login">

        Login Here

    </Link>

</div>                </form>

            </div>

        </div>

    </div>

</div>

    );
}

export default Register;