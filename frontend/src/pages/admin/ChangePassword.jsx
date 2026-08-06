import { useMemo, useState } from "react";
import { toast } from "react-toastify";

import { changePassword } from "../../services/profileService";

function ChangePassword() {

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [formData, setFormData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });

    const [errors, setErrors] = useState({});

    const passwordStrength = useMemo(() => {

        const password = formData.new_password;

        if (!password) {
            return {
                text: "",
                width: "0%",
                color: "bg-secondary",
            };
        }

        let score = 0;

        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score <= 2) {
            return {
                text: "Weak",
                width: "33%",
                color: "bg-danger",
            };
        }

        if (score <= 4) {
            return {
                text: "Medium",
                width: "66%",
                color: "bg-warning",
            };
        }

        return {
            text: "Strong",
            width: "100%",
            color: "bg-success",
        };

    }, [formData.new_password]);

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

        if (!formData.current_password.trim()) {
            validationErrors.current_password =
                "Current password is required.";
        }

        if (!formData.new_password.trim()) {
            validationErrors.new_password =
                "New password is required.";
        } else if (formData.new_password.length < 8) {
            validationErrors.new_password =
                "Password must be at least 8 characters.";
        }

        if (
            formData.current_password ===
            formData.new_password
        ) {
            validationErrors.new_password =
                "New password must be different.";
        }

        if (!formData.confirm_password.trim()) {
            validationErrors.confirm_password =
                "Confirm password is required.";
        }

        if (
            formData.confirm_password !==
            formData.new_password
        ) {
            validationErrors.confirm_password =
                "Passwords do not match.";
        }

        setErrors(validationErrors);

        return Object.keys(validationErrors).length === 0;

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validate()) return;

        try {

            setLoading(true);

            const response = await changePassword({
                current_password:
                    formData.current_password,
                new_password:
                    formData.new_password,
            });

            toast.success(
                response.message ||
                "Password changed successfully."
            );

            setFormData({
                current_password: "",
                new_password: "",
                confirm_password: "",
            });

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to change password."
            );

        } finally {

            setLoading(false);

        }

    };

    const togglePassword = (field) => {

        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));

    };

    return (

        <div className="container-fluid">

            <div className="row justify-content-center">

                <div className="col-lg-7 col-xl-6">

                    <div className="card border-0 shadow-lg overflow-hidden">

                        <div
                            className="text-white p-4"
                            style={{
                                background:
                                    "linear-gradient(135deg,#0d6efd,#6610f2)",
                            }}
                        >

                            <h2 className="fw-bold mb-2">
                                Change Password
                            </h2>

                            <p className="mb-0 opacity-75">
                                Keep your administrator account secure.
                            </p>

                        </div>

                        <div className="card-body p-4">

                            <div className="alert alert-info">

                                <strong>Password Requirements</strong>

                                <ul className="mb-0 mt-2">

                                    <li>Minimum 8 characters</li>
                                    <li>Use uppercase & lowercase letters</li>
                                    <li>Include numbers</li>
                                    <li>Include special characters</li>

                                </ul>

                            </div>

                            <form onSubmit={handleSubmit}>

                                <div className="mb-4">

                                    <label className="form-label fw-semibold">
                                        Current Password
                                    </label>

                                    <div className="input-group">

                                        <input
                                            type={
                                                showPassword.current
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="current_password"
                                            className={`form-control ${
                                                errors.current_password
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            value={formData.current_password}
                                            onChange={handleChange}
                                        />

                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() =>
                                                togglePassword("current")
                                            }
                                        >
                                            {showPassword.current
                                                ? "Hide"
                                                : "Show"}
                                        </button>

                                        <div className="invalid-feedback">
                                            {errors.current_password}
                                        </div>

                                    </div>

                                </div>

                                <div className="mb-3">

                                    <label className="form-label fw-semibold">
                                        New Password
                                    </label>

                                    <div className="input-group">

                                        <input
                                            type={
                                                showPassword.new
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="new_password"
                                            className={`form-control ${
                                                errors.new_password
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            value={formData.new_password}
                                            onChange={handleChange}
                                        />

                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() =>
                                                togglePassword("new")
                                            }
                                        >
                                            {showPassword.new
                                                ? "Hide"
                                                : "Show"}
                                        </button>

                                        <div className="invalid-feedback">
                                            {errors.new_password}
                                        </div>

                                    </div>

                                    {formData.new_password && (

                                        <>

                                            <div className="progress mt-3">

                                                <div
                                                    className={`progress-bar ${passwordStrength.color}`}
                                                    style={{
                                                        width:
                                                            passwordStrength.width,
                                                    }}
                                                />

                                            </div>

                                            <small className="text-muted">

                                                Password Strength :{" "}

                                                <strong>
                                                    {passwordStrength.text}
                                                </strong>

                                            </small>

                                        </>

                                    )}

                                </div>

                                <div className="mb-4">

                                    <label className="form-label fw-semibold">
                                        Confirm Password
                                    </label>

                                    <div className="input-group">

                                        <input
                                            type={
                                                showPassword.confirm
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="confirm_password"
                                            className={`form-control ${
                                                errors.confirm_password
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            value={formData.confirm_password}
                                            onChange={handleChange}
                                        />

                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() =>
                                                togglePassword("confirm")
                                            }
                                        >
                                            {showPassword.confirm
                                                ? "Hide"
                                                : "Show"}
                                        </button>

                                        <div className="invalid-feedback">
                                            {errors.confirm_password}
                                        </div>

                                    </div>

                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >

                                    {loading ? (

                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Updating Password...
                                        </>

                                    ) : (

                                        "Change Password"

                                    )}

                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default ChangePassword;