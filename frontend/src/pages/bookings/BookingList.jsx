import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
    getBookings,
    deleteBooking,
    getBookingStatistics,
    downloadBooking,
} from "../../services/bookingService";

function BookingList() {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [statistics, setStatistics] = useState({});
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const keyword = search.toLowerCase();

        const filtered = bookings.filter(
            (booking) =>
                booking.user.toLowerCase().includes(keyword) ||
                booking.event.toLowerCase().includes(keyword) ||
                booking.status.toLowerCase().includes(keyword)
        );

        setFilteredBookings(filtered);
    }, [search, bookings]);

    const fetchData = async () => {
        try {
            setLoading(true);

            const [bookingRes, statsRes] = await Promise.all([
                getBookings(),
                getBookingStatistics(),
            ]);

            setBookings(bookingRes.bookings || []);
            setFilteredBookings(bookingRes.bookings || []);
            setStatistics(statsRes.statistics || {});
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to load bookings."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this booking?")) return;

        try {
            const response = await deleteBooking(id);

            toast.success(
                response.message ||
                    "Booking deleted successfully."
            );

            fetchData();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to delete booking."
            );
        }
    };

    const handleDownload = async (id) => {
    try {
        const response = await downloadBooking(id);

        const blob = new Blob(
            [response.data],
            {
                type: "application/pdf",
            }
        );

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = `booking_${id}.pdf`;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);

        toast.success("Booking PDF downloaded successfully.");
    } catch (error) {
        toast.error(
            error.response?.data?.message ||
            "Failed to download booking."
        );
    }
};
    if (loading) {
        return (
            <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary"></div>
            </div>
        );
    }

    return (
        <div className="container-fluid">

            <div className="mb-4">
                <h2 className="fw-bold">
                    Booking Management
                </h2>

                <p className="text-muted">
                    Manage all event bookings
                </p>
            </div>

            <div className="row g-3 mb-4">

                <div className="col-md-3">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h6>Total Bookings</h6>
                            <h3>
                                {statistics.total_bookings ?? 0}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h6>Confirmed</h6>
                            <h3>
                                {statistics.confirmed_bookings ?? 0}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h6>Cancelled</h6>
                            <h3>
                                {statistics.cancelled_bookings ?? 0}
                            </h3>
                        </div>
                    </div>
                </div>

            </div>

            <div className="card shadow-sm border-0">

                <div className="card-body">

                    <div className="row mb-3">

                        <div className="col-md-4">

                            <input
                                className="form-control"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>

                    </div>

                    <div className="table-responsive">

                        <table className="table table-hover align-middle">

                            <thead className="table-light">

                                <tr>
                                    <th>ID</th>
                                    <th>User</th>
                                    <th>Event</th>
                                    <th>Tickets</th>
                                    <th>Status</th>
                                    <th className="text-center">
                                        Actions
                                    </th>
                                </tr>

                            </thead>

                            <tbody>

                                {filteredBookings.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center py-4"
                                        >
                                            No bookings found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBookings.map((booking) => (
                                        <tr key={booking.id}>

                                            <td>{booking.id}</td>

                                            <td>{booking.user}</td>

                                            <td>{booking.event}</td>

                                            <td>{booking.tickets}</td>

                                            <td>
                                                <span
                                                    className={`badge ${
                                                        booking.status ===
                                                        "Confirmed"
                                                            ? "bg-success"
                                                            : "bg-danger"
                                                    }`}
                                                >
                                                    {booking.status}
                                                </span>
                                            </td>

                                            <td className="text-center">

                                                <Link
                                                    to={`/bookings/${booking.id}`}
                                                    className="btn btn-sm btn-info me-2"
                                                >
                                                    <i className="bi bi-eye"></i>
                                                </Link>

                                                <button
                                                    className="btn btn-sm btn-success me-2"
                                                    onClick={() =>
                                                        handleDownload(
                                                            booking.id
                                                        )
                                                    }
                                                >
                                                    <i className="bi bi-download"></i>
                                                </button>

                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() =>
                                                        handleDelete(
                                                            booking.id
                                                        )
                                                    }
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>

                                            </td>

                                        </tr>
                                    ))
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default BookingList;