import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { getEvent } from "../../services/eventService";
import { createBooking } from "../../services/bookingService";

function EventDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [bookingLoading, setBookingLoading] = useState(false);

    const [event, setEvent] = useState(null);

    const [tickets, setTickets] = useState(1);

    useEffect(() => {
    const loadEvent = async () => {
        try {
            setLoading(true);

            const response = await getEvent(id);

            setEvent(response.event);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to load event."
            );

            navigate("/events");

        } finally {

            setLoading(false);

        }
    };

    loadEvent();

}, [id, navigate]);
    const handleBooking = async () => {

        if (tickets < 1) {

            toast.error("Minimum one ticket is required.");

            return;

        }

        try {

            setBookingLoading(true);

            const response = await createBooking({

                event_id: event.id,

                number_of_tickets: tickets,

            });

            toast.success(
                response.message ||
                "Booking successful."
            );

            navigate("/my-bookings");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Booking failed."
            );

        } finally {

            setBookingLoading(false);

        }

    };

    if (loading) {

        return (

            <div className="text-center py-5">

                <div className="spinner-border text-primary"></div>

            </div>

        );

    }

    if (!event) {

        return (

            <div className="alert alert-warning">

                Event not found.

            </div>

        );

    }

    return (

        <div className="container-fluid">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2 className="fw-bold">

                    Event Details

                </h2>

                <Link
                    to="/events"
                    className="btn btn-outline-secondary"
                >
                    Back
                </Link>

            </div>

            <div className="card shadow-sm border-0">

                <img
                    src={
                        event.image_url ||
                        "https://via.placeholder.com/900x400?text=Event"
                    }
                    alt={event.title}
                    className="card-img-top"
                    style={{
                        height: "350px",
                        objectFit: "cover",
                    }}
                />

                <div className="card-body">

                    <h3 className="fw-bold">

                        {event.title}

                    </h3>

                    <p className="text-muted">

                        {event.description}

                    </p>

                    <hr />

                    <div className="row">                        <div className="col-md-6 mb-3">

                            <strong>Organizer</strong>

                            <p>{event.organizer}</p>

                        </div>

                        <div className="col-md-6 mb-3">

                            <strong>Location</strong>

                            <p>{event.location}</p>

                        </div>

                        <div className="col-md-6 mb-3">

                            <strong>Event Date</strong>

                            <p>{event.event_date}</p>

                        </div>

                        <div className="col-md-6 mb-3">

                            <strong>Event Time</strong>

                            <p>{event.event_time}</p>

                        </div>

                        <div className="col-md-6 mb-3">

                            <strong>Registration Deadline</strong>

                            <p>{event.registration_deadline}</p>

                        </div>

                        <div className="col-md-6 mb-3">

                            <strong>Status</strong>

                            <p>

                                <span
                                    className={`badge ${
                                        event.status === "Upcoming"
                                            ? "bg-success"
                                            : "bg-secondary"
                                    }`}
                                >
                                    {event.status}
                                </span>

                            </p>

                        </div>

                        <div className="col-md-6 mb-3">

                            <strong>Available Seats</strong>

                            <p>{event.available_seats}</p>

                        </div>

                        <div className="col-md-6 mb-3">

                            <strong>Ticket Price</strong>

                            <p className="fw-bold text-primary">

                                ₹ {event.ticket_price}

                            </p>

                        </div>

                    </div>

                    <hr />

                    {/* Booking */}

                    <h5 className="fw-bold mb-3">

                        Book Tickets

                    </h5>

                    <div className="row align-items-end">

                        <div className="col-md-4">

                            <label className="form-label">

                                Number of Tickets

                            </label>

                            <input
                                type="number"
                                min="1"
                                max={event.available_seats}
                                className="form-control"
                                value={tickets}
                                onChange={(e) =>
                                    setTickets(
                                        Number(e.target.value)
                                    )
                                }
                            />

                        </div>

                        <div className="col-md-4">

                            <button
                                className="btn btn-primary w-100"
                                disabled={bookingLoading}
                                onClick={handleBooking}
                            >

                                {bookingLoading ? (
                                    "Booking..."
                                ) : (
                                    <>
                                        <i className="bi bi-ticket-perforated me-2"></i>

                                        Book Ticket
                                    </>
                                )}

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default EventDetails;