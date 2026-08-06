function LoadingSpinner({
    text = "Loading..."
}) {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center py-5">
            <div
                className="spinner-border text-primary"
                role="status"
            >
                <span className="visually-hidden">
                    Loading
                </span>
            </div>

            <p className="mt-3 text-muted">
                {text}
            </p>
        </div>
    );
}

export default LoadingSpinner;