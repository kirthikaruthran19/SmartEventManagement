import { useAuth } from "../../context/AuthContext";

function Topbar() {
    const { user } = useAuth();

    return (
        <header className="bg-white shadow-sm border-bottom">
            <div className="container-fluid py-3 px-4 d-flex justify-content-between align-items-center">

                <div>
                    <h4 className="fw-bold mb-0">Dashboard</h4>
                    <small className="text-muted">
                        Welcome back! Manage your events efficiently.
                    </small>
                </div>

                <div className="d-flex align-items-center gap-3">

                    <div className="text-end">
                        <h6 className="mb-0 fw-semibold">
                            {user?.full_name || "User"}
                        </h6>

                        <small className="text-muted">
                            {user?.role || "User"}
                        </small>
                    </div>

                    <div
                        className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold"
                        style={{
                            width: "42px",
                            height: "42px",
                        }}
                    >
                        {(user?.full_name || "U").charAt(0).toUpperCase()}
                    </div>

                </div>

            </div>
        </header>
    );
}

export default Topbar;