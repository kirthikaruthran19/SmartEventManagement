import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

import "../../assets/styles/login.css";

function Login() {

    const navigate = useNavigate();

    const { login, loadUser } = useAuth();

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: false,
    });

    const [errors, setErrors] = useState({});

    // ==========================================
    // Handle Input Change
    // ==========================================

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    // ==========================================
    // Validation
    // ==========================================

    const validateForm = () => {

        const validationErrors = {};

        if (!formData.email.trim()) {

            validationErrors.email =
                "Email is required.";

        } else if (
            !/^\S+@\S+\.\S+$/.test(formData.email)
        ) {

            validationErrors.email =
                "Enter a valid email address.";

        }

        if (!formData.password.trim()) {

            validationErrors.password =
                "Password is required.";

        } else if (
            formData.password.length < 6
        ) {

            validationErrors.password =
                "Password must contain at least 6 characters.";

        }

        setErrors(validationErrors);

        return (
            Object.keys(validationErrors).length === 0
        );
    };

    // ==========================================
    // Login
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validateForm()) return;

        try {

            setLoading(true);

            const response = await loginUser({

                email: formData.email.trim(),

                password: formData.password,

            });

            login(
                response.access_token,
                response.user
            );

            await loadUser();

            toast.success(
                `Welcome ${response.user.full_name}`
            );

            navigate(
                "/dashboard",
                {
                    replace: true,
                }
            );

        } catch (error) {

            const data =
                error.response?.data;

            if (data?.errors) {

                setErrors(data.errors);

            }

            toast.error(

                data?.message ||

                Object.values(
                    data?.errors || {}
                )[0] ||

                "Invalid email or password."

            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="container-fluid login-page">

    <div className="row g-0 h-100">

        {/* ==========================================
            LEFT SIDE
        ========================================== */}

        <div className="col-lg-7 login-left d-none d-lg-flex">

            <div className="hero-dots"></div>

            <div className="hero-blur"></div>

            <div className="hero-content">

                <h1 className="hero-title">

                    Smart <span>Event</span>

                    <br />

                    Management

                </h1>

                <p className="hero-text">

                    Organize events, manage registrations,
                    monitor bookings and create memorable
                    experiences with a modern event management
                    platform.

                </p>

                <div className="hero-line"></div>

                <div className="feature-list">

                    <div className="feature-item">

                        <div className="feature-icon blue">

                            <i className="bi bi-calendar-event"></i>

                        </div>

                        <div>

                            <h6 className="feature-title">

                                Event Management

                            </h6>

                            <p className="feature-desc">

                                Create, edit and manage events
                                with ease.

                            </p>

                        </div>

                    </div>

                    <div className="feature-item">

                        <div className="feature-icon purple">

                            <i className="bi bi-ticket-perforated"></i>

                        </div>

                        <div>

                            <h6 className="feature-title">

                                Online Booking

                            </h6>

                            <p className="feature-desc">

                                Fast and secure ticket booking
                                for every event.

                            </p>

                        </div>

                    </div>

                    <div className="feature-item">

                        <div className="feature-icon green">

                            <i className="bi bi-bar-chart"></i>

                        </div>

                        <div>

                            <h6 className="feature-title">

                                Dashboard Analytics

                            </h6>

                            <p className="feature-desc">

                                Track registrations,
                                bookings and event statistics.

                            </p>

                        </div>

                    </div>

                    <div className="feature-item">

                        <div className="feature-icon orange">

                            <i className="bi bi-shield-check"></i>

                        </div>

                        <div>

                            <h6 className="feature-title">

                                Secure Authentication

                            </h6>

                            <p className="feature-desc">

                                JWT secured login with
                                role-based authorization.

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

        {/* ==========================================
            RIGHT SIDE
        ========================================== */}

        <div className="col-lg-5 login-right">

            <div className="login-card">

                <div className="text-center mb-4">

                    <div className="login-icon">

                        <i className="bi bi-calendar-event-fill"></i>

                    </div>

                    <h1 className="mt-4">

                        Welcome Back

                    </h1>

                    <p>

                        Sign in to continue your account

                    </p>

                </div>

                <form onSubmit={handleSubmit} noValidate>{/* ===========================
    Email
=========================== */}

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

{/* ===========================
    Password
=========================== */}

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
                errors.password
                    ? "is-invalid"
                    : ""
            }`}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
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

{/* ===========================
    Remember
=========================== */}

<div className="d-flex justify-content-between align-items-center mb-4">

    <div className="form-check">

        <input
            className="form-check-input"
            type="checkbox"
            id="remember"
            name="remember"
            checked={formData.remember}
            onChange={handleChange}
        />

        <label
            htmlFor="remember"
            className="form-check-label"
        >
            Remember Me
        </label>

    </div>

    <span className="small text-muted">

        Secure Login

    </span>

</div>

{/* ===========================
    Login Button
=========================== */}

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

            Signing In...

        </>

    ) : (

        <>

            <i className="bi bi-box-arrow-in-right me-2"></i>

            Login

        </>

    )}

</button>

<div className="login-divider">

    <span>

        OR

    </span>

</div>

<div className="register-text">

    Don't have an account?

    <br />

    <Link to="/register">

        Create Account

    </Link>

</div>                </form>

            </div>

        </div>

    </div>

</div>

    );
}

export default Login;