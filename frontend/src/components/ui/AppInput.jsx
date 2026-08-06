function AppInput({
    label,
    icon,
    error,
    className = "",
    ...props
}) {
    return (
        <div className="mb-3">

            {label && (
                <label className="form-label fw-semibold">
                    {label}
                </label>
            )}

            <div className="input-group">

                {icon && (
                    <span className="input-group-text bg-white">
                        <i className={`bi ${icon}`}></i>
                    </span>
                )}

                <input
                    className={`form-control ${error ? "is-invalid" : ""} ${className}`}
                    {...props}
                />

                {error && (
                    <div className="invalid-feedback">
                        {error}
                    </div>
                )}

            </div>

        </div>
    );
}

export default AppInput;