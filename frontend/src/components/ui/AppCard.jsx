function AppCard({
    title,
    subtitle,
    children,
    className = "",
}) {
    return (
        <div
            className={`card border-0 shadow-sm rounded-4 ${className}`}
        >
            {(title || subtitle) && (
                <div className="card-header bg-white border-0 pt-4 px-4">
                    {title && (
                        <h4 className="fw-bold mb-1">
                            {title}
                        </h4>
                    )}

                    {subtitle && (
                        <p className="text-muted mb-0">
                            {subtitle}
                        </p>
                    )}
                </div>
            )}

            <div className="card-body p-4">
                {children}
            </div>
        </div>
    );
}

export default AppCard;