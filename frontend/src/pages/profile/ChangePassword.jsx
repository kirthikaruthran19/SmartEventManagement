import { useState } from "react";
import { toast } from "react-toastify";

import { changePassword } from "../../services/profileService";

function ChangePassword() {

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });

    const [errors, setErrors] = useState({});

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

    return (

        <div className="container-fluid">

            <div className="row justify-content-center">

                <div className="col-lg-6">

                    <div className="card shadow-sm border-0">

                        <div className="card-header bg-white">
                            <h3 className="fw-bold mb-0">
                                Change Password
                            </h3>
                        </div>

                        <div className="card-body">

                            <form onSubmit={handleSubmit}>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Current Password
                                    </label>

                                    <input
                                        type="password"
                                        name="current_password"
                                        className={`form-control ${
                                            errors.current_password
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        value={formData.current_password}
                                        onChange={handleChange}
                                    />

                                    <div className="invalid-feedback">
                                        {errors.current_password}
                                    </div>

                                </div>

                                <div className="mb-3">

                                    <label className="form-label">
                                        New Password
                                    </label>

                                    <input
                                        type="password"
                                        name="new_password"
                                        className={`form-control ${
                                            errors.new_password
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        value={formData.new_password}
                                        onChange={handleChange}
                                    />

                                    <div className="invalid-feedback">
                                        {errors.new_password}
                                    </div>

                                </div>

                                <div className="mb-4">

                                    <label className="form-label">
                                        Confirm Password
                                    </label>

                                    <input
                                        type="password"
                                        name="confirm_password"
                                        className={`form-control ${
                                            errors.confirm_password
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        value={formData.confirm_password}
                                        onChange={handleChange}
                                    />

                                    <div className="invalid-feedback">
                                        {errors.confirm_password}
                                    </div>

                                </div>

                                <button
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Updating..."
                                        : "Change Password"}
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