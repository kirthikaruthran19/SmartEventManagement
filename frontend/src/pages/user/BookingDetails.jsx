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

    const [loading, setLoading] = useState(true);

    const [booking, setBooking] = useState(null);

    useEffect(() => {

        const loadBooking = async () => {

            try {

                setLoading(true);

                const response = await getBooking(id);

                setBooking(response.booking);

            } catch (error) {

                toast.error(
                    error.response?.data?.message ||
                    "Failed to load booking."
                );

                navigate("/my-bookings");

            } finally {

                setLoading(false);

            }

        };

        loadBooking();

    }, [id, navigate]);

    const handleDownload = async () => {

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

        } catch {

            toast.error(
                "Failed to download booking confirmation."
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

    if (!booking) {

        return (

            <div className="alert alert-warning">

                Booking not found.

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

                        View your booking information

                    </p>

                </div>

                <Link
                    to="/my-bookings"
                    className="btn btn-outline-secondary"
                >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back
                </Link>

            </div>

            <div className="card shadow-sm border-0">

                <div className="card-body">

                    <div className="row">                        <div className="col-md-6 mb-3">

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

                        <div className="col-md-6 mb-3">

                            <strong>Booked Date</strong>

                            <p>{booking.booked_at}</p>

                        </div>

                    </div>

                    <hr />

                    <div className="d-flex gap-2">

                        <button
                            className="btn btn-success"
                            onClick={handleDownload}
                        >

                            <i className="bi bi-download me-2"></i>

                            Download Confirmation

                        </button>

                        <Link
                            to="/my-bookings"
                            className="btn btn-outline-secondary"
                        >

                            Back to My Bookings

                        </Link>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default BookingDetails;