import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
    getBooking,
    downloadBooking,
} from "../../services/bookingService";

function BookingDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                setLoading(true);

                const response = await getBooking(id);

                setBooking(response.booking);
            } catch (error) {
                toast.error(
                    error.response?.data?.message ||
                    "Failed to load booking."
                );

                navigate("/bookings");
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [id, navigate]);

    const handleDownload = async () => {
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

    if (!booking) {
        return (
            <div className="container-fluid">
                <div className="alert alert-warning">
                    Booking not found.
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h2 className="fw-bold">
                        Booking Details
                    </h2>

                    <p className="text-muted mb-0">
                        Booking #{booking.id}
                    </p>
                </div>

                <Link
                    to="/bookings"
                    className="btn btn-outline-secondary"
                >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back
                </Link>

            </div>

            <div className="card shadow-sm border-0">

                <div className="card-body">

                    <div className="row">

                        <div className="col-md-6 mb-3">
                            <strong>Booking ID</strong>
                            <p>{booking.id}</p>
                        </div>

                        <div className="col-md-6 mb-3">
                            <strong>Event</strong>
                            <p>{booking.event}</p>
                        </div>

                        <div className="col-md-6 mb-3">
                            <strong>Tickets</strong>
                            <p>{booking.tickets}</p>
                        </div>

                        <div className="col-md-6 mb-3">
                            <strong>Status</strong>

                            <p>
                                <span
                                    className={`badge ${
                                        booking.status === "Confirmed"
                                            ? "bg-success"
                                            : "bg-danger"
                                    }`}
                                >
                                    {booking.status}
                                </span>
                            </p>
                        </div>

                        <div className="col-md-12 mb-3">
                            <strong>Booked At</strong>
                            <p>{booking.booked_at}</p>
                        </div>

                    </div>

                    <div className="mt-4">

                        <button
                            className="btn btn-success"
                            onClick={handleDownload}
                        >
                            <i className="bi bi-download me-2"></i>
                            Download Confirmation
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default BookingDetails;