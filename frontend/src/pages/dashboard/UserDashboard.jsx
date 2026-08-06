import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function UserDashboard() {
    const { user } = useAuth();

    return (
        <div className="container-fluid">

            {/* Welcome Card */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-body p-5">

                    <h2 className="fw-bold">
                        Welcome, {user?.full_name}
                    </h2>

                    <p className="text-muted mt-2 mb-0">
                        Browse upcoming events, book tickets,
                        manage your bookings and update your profile.
                    </p>

                </div>

            </div>

            {/* Quick Actions */}

            <div className="row g-4">

                {/* Browse Events */}

                <div className="col-lg-4">

                    <Link
                        to="/user/events"
                        className="text-decoration-none"
                    >

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body text-center py-5">

                                <i className="bi bi-calendar-event text-primary fs-1"></i>

                                <h5 className="fw-bold mt-3">

                                    Browse Events

                                </h5>

                                <p className="text-muted mb-0">

                                    View all upcoming events and book tickets.

                                </p>

                            </div>

                        </div>

                    </Link>

                </div>

                {/* My Bookings */}

                <div className="col-lg-4">

                    <Link
                        to="/my-bookings"
                        className="text-decoration-none"
                    >

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body text-center py-5">

                                <i className="bi bi-ticket-perforated text-success fs-1"></i>

                                <h5 className="fw-bold mt-3">

                                    My Bookings

                                </h5>

                                <p className="text-muted mb-0">

                                    View, download or cancel your bookings.

                                </p>

                            </div>

                        </div>

                    </Link>

                </div>

                {/* My Profile */}

                <div className="col-lg-4">

                    <Link
                        to="/user/profile"
                        className="text-decoration-none"
                    >

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body text-center py-5">

                                <i className="bi bi-person-circle text-warning fs-1"></i>

                                <h5 className="fw-bold mt-3">

                                    My Profile

                                </h5>

                                <p className="text-muted mb-0">

                                    Update your profile and change password.

                                </p>

                            </div>

                        </div>

                    </Link>

                </div>

            </div>

        </div>
    );
}

export default UserDashboard;