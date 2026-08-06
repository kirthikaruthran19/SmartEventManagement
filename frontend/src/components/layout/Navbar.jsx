import { Link, NavLink } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg bg-white border-bottom py-3 sticky-top">
            <div className="container">

                <Link
                    to="/"
                    className="navbar-brand fw-bold fs-4 d-flex align-items-center"
                >
                    <div
                        className="rounded-3 d-flex justify-content-center align-items-center me-2"
                        style={{
                            width: 42,
                            height: 42,
                            background:
                                "linear-gradient(135deg,#4F7CFF,#7B61FF)",
                            color: "#fff",
                        }}
                    >
                        <i className="bi bi-calendar-event"></i>
                    </div>

                    <span className="text-dark">
                        SmartEvent
                    </span>
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbar"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className="collapse navbar-collapse"
                    id="navbar"
                >
                    <ul className="navbar-nav ms-auto align-items-lg-center">

                        <li className="nav-item">
                            <NavLink
                                className="nav-link px-3"
                                to="/login"
                            >
                                Login
                            </NavLink>
                        </li>

                        <li className="nav-item ms-lg-2">

                            <NavLink
                                className="btn btn-primary rounded-pill px-4"
                                to="/register"
                            >
                                Register
                            </NavLink>

                        </li>

                    </ul>
                </div>

            </div>
        </nav>
    );
}

export default Navbar;