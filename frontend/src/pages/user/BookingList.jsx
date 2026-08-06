import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
    getMyBookings,
    cancelBooking,
    downloadBooking,
} from "../../services/bookingService";

function BookingList() {

    const [bookings, setBookings] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadBookings();

    }, []);

    const loadBookings = async () => {

        try {

            setLoading(true);

            const response = await getMyBookings();

            setBookings(response.bookings || []);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to load bookings."
            );

        } finally {

            setLoading(false);

        }

    };

    const handleCancel = async (id) => {

        const confirm = window.confirm(
            "Cancel this booking?"
        );

        if (!confirm) return;

        try {

            const response =
                await cancelBooking(id);

            toast.success(response.message);

            loadBookings();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Cancellation failed."
            );

        }

    };

    const handleDownload = async (id) => {

        try {

            const response =
                await downloadBooking(id);

            const url = window.URL.createObjectURL(
                new Blob([response.data])
            );

            const link =
                document.createElement("a");

            link.href = url;

            link.download = `booking_${id}.pdf`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch  {

            toast.error(
                "Failed to download booking."
            );

        }

    };

    if (loading) {

        return (

            <div className="text-center py-5">

                <div className="spinner-border text-primary"></div>

            </div>

        );

    }
        return (

        <div className="container-fluid">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold">
                        My Bookings
                    </h2>

                    <p className="text-muted mb-0">
                        View and manage your event bookings
                    </p>

                </div>

            </div>

            <div className="card border-0 shadow-sm">

                <div className="card-body">

                    <div className="table-responsive">

                        <table className="table table-hover align-middle">

                            <thead className="table-light">

                                <tr>

                                    <th>#</th>

                                    <th>Event</th>

                                    <th>Tickets</th>

                                    <th>Status</th>

                                    <th>Booked Date</th>

                                    <th className="text-center">
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {bookings.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="text-center py-5 text-muted"
                                        >

                                            No bookings found.

                                        </td>

                                    </tr>

                                ) : (

                                    bookings.map((booking) => (

                                        <tr key={booking.id}>

                                            <td>

                                                {booking.id}

                                            </td>

                                            <td>

                                                {booking.event}

                                            </td>

                                            <td>

                                                {booking.tickets}

                                            </td>

                                            <td>

                                                <span
                                                    className={`badge ${
                                                        booking.status === "Confirmed"
                                                            ? "bg-success"
                                                            : "bg-danger"
                                                    }`}
                                                >

                                                    {booking.status}

                                                </span>

                                            </td>

                                            <td>

                                                {booking.booked_at}

                                            </td>

                                            <td className="text-center">

                                                <Link
                                                    to={`/my-bookings/${booking.id}`}
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

                                                {booking.status ===
                                                    "Confirmed" && (

                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() =>
                                                            handleCancel(
                                                                booking.id
                                                            )
                                                        }
                                                    >

                                                        <i className="bi bi-x-circle"></i>

                                                    </button>

                                                )}

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