import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { getEvent } from "../../services/eventService";

function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState(null);

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

    if (loading) {
        return (
            <div className="d-flex justify-content-center py-5">
                <div
                    className="spinner-border text-primary"
                    role="status"
                >
                    <span className="visually-hidden">
                        Loading...
                    </span>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="container-fluid">
                <div className="alert alert-warning">
                    Event not found.
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h2 className="fw-bold">
                        {event.title}
                    </h2>

                    <p className="text-muted mb-0">
                        Event Details
                    </p>
                </div>

                <Link
                    to="/events"
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
                            <strong>Title</strong>
                            <p>{event.title}</p>
                        </div>

                        <div className="col-md-6 mb-3">
                            <strong>Category ID</strong>
                            <p>{event.category_id}</p>
                        </div>

                        <div className="col-md-6 mb-3">
                            <strong>Location</strong>
                            <p>{event.location}</p>
                        </div>

                        <div className="col-md-6 mb-3">
                            <strong>Organizer</strong>
                            <p>{event.organizer}</p>
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
                                            : event.status === "Completed"
                                            ? "bg-primary"
                                            : "bg-danger"
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
                            <p>₹ {event.ticket_price}</p>
                        </div>

                        <div className="col-12 mb-3">
                            <strong>Description</strong>

                            <p className="mt-2">
                                {event.description}
                            </p>
                        </div>

                        {event.image_url && (
                            <div className="col-12">
                                <strong>Event Image</strong>

                                <div className="mt-3">
                                    <img
                                        src={event.image_url}
                                        alt={event.title}
                                        className="img-fluid rounded shadow"
                                        style={{
                                            maxHeight: "400px",
                                            objectFit: "cover",
                                            width: "100%",
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default EventDetails;