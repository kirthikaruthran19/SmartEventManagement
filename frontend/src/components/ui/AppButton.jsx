function AppButton({
    type = "button",
    variant = "primary",
    size = "",
    className = "",
    loading = false,
    disabled = false,
    icon,
    children,
    ...props
}) {
    return (
        <button
            type={type}
            className={`btn btn-${variant} ${size} ${className}`}
            disabled={loading || disabled}
            {...props}
        >
            {loading ? (
                <>
                    <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                    ></span>
                    Please wait...
                </>
            ) : (
                <>
                    {icon && <i className={`bi ${icon} me-2`}></i>}
                    {children}
                </>
            )}
        </button>
    );
}

export default AppButton;