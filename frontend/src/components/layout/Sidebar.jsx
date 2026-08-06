import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
    const { user, logout, isAdmin } = useAuth();

    const navLinkClass = ({ isActive }) =>
        `nav-link ${
            isActive
                ? "active bg-primary text-white rounded"
                : "text-white"
        }`;

    return (
        <aside
            className="bg-dark text-white d-flex flex-column"
            style={{
    width: "260px",
    minWidth: "260px",
    height: "100vh",
    position: "fixed",
    left: 0,
    top: 0,
}}
        >
            {/* Logo */}

            <div className="text-center py-4 border-bottom border-secondary">

                <h4 className="fw-bold mb-1">
                    Smart Event
                </h4>

                <small className="text-secondary">
                    Management System
                </small>

            </div>

            {/* User */}

            <div className="text-center py-4 border-bottom border-secondary">

                <div
                    className="rounded-circle bg-primary d-inline-flex justify-content-center align-items-center mb-3 fw-bold"
                    style={{
                        width: 60,
                        height: 60,
                        fontSize: 24,
                    }}
                >
                    {(user?.full_name || "U")
                        .charAt(0)
                        .toUpperCase()}
                </div>

                <h6 className="mb-1">
                    {user?.full_name}
                </h6>

                <span
                    className={`badge ${
                        isAdmin
                            ? "bg-danger"
                            : "bg-success"
                    }`}
                >
                    {isAdmin
                        ? "Administrator"
                        : "User"}
                </span>

            </div>

            {/* Navigation */}

            <ul className="nav flex-column p-3 flex-grow-1">

                {/* Dashboard */}

                <li className="nav-item mb-2">

                    <NavLink
                        to="/dashboard"
                        className={navLinkClass}
                    >
                        <i className="bi bi-speedometer2 me-2"></i>
                        Dashboard
                    </NavLink>

                </li>

                {/* ===========================
                    ADMIN MENU
                =========================== */}

                {isAdmin && (
                    <>

                        <li className="nav-item mb-2">
                            <NavLink
                                to="/categories"
                                className={navLinkClass}
                            >
                                <i className="bi bi-tags me-2"></i>
                                Categories
                            </NavLink>
                        </li>

                        <li className="nav-item mb-2">
                            <NavLink
                                to="/events"
                                className={navLinkClass}
                            >
                                <i className="bi bi-calendar-event me-2"></i>
                                Events
                            </NavLink>
                        </li>

                        <li className="nav-item mb-2">
                            <NavLink
                                to="/bookings"
                                className={navLinkClass}
                            >
                                <i className="bi bi-ticket-perforated me-2"></i>
                                Bookings
                            </NavLink>
                        </li>

                        <li className="nav-item mb-2">
                            <NavLink
                                to="/users"
                                className={navLinkClass}
                            >
                                <i className="bi bi-people me-2"></i>
                                Users
                            </NavLink>
                        </li>

                        <li className="nav-item mb-2">
                            <NavLink
                                to="/reports"
                                className={navLinkClass}
                            >
                                <i className="bi bi-file-earmark-bar-graph me-2"></i>
                                Reports
                            </NavLink>
                        </li>

                        <li className="nav-item mb-2">
                            <NavLink
                                to="/profile"
                                className={navLinkClass}
                            >
                                <i className="bi bi-person me-2"></i>
                                Profile
                            </NavLink>
                        </li>

                        <li className="nav-item mb-2">
                            <NavLink
                                to="/change-password"
                                className={navLinkClass}
                            >
                                <i className="bi bi-lock me-2"></i>
                                Change Password
                            </NavLink>
                        </li>

                    </>
                )}

                {/* ===========================
                    USER MENU
                =========================== */}

                {!isAdmin && (
                    <>

                        <li className="nav-item mb-2">
                            <NavLink
                                to="/user/events"
                                className={navLinkClass}
                            >
                                <i className="bi bi-calendar-event me-2"></i>
                                Events
                            </NavLink>
                        </li>

                        <li className="nav-item mb-2">
                            <NavLink
                                to="/my-bookings"
                                className={navLinkClass}
                            >
                                <i className="bi bi-ticket-perforated me-2"></i>
                                My Bookings
                            </NavLink>
                        </li>

                        <li className="nav-item mb-2">
                            <NavLink
                                to="/user/profile"
                                className={navLinkClass}
                            >
                                <i className="bi bi-person me-2"></i>
                                My Profile
                            </NavLink>
                        </li>

                        <li className="nav-item mb-2">
                            <NavLink
                                to="/user/change-password"
                                className={navLinkClass}
                            >
                                <i className="bi bi-lock me-2"></i>
                                Change Password
                            </NavLink>
                        </li>

                    </>
                )}

            </ul>

            {/* Logout */}

            <div className="p-3 border-top border-secondary">

                <button
                    className="btn btn-outline-light w-100"
                    onClick={logout}
                >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;