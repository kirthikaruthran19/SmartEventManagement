import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
    getEvents,
    deleteEvent,
} from "../../services/eventService";

function EventList() {

    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
        page: 1,
        per_page: 5,
        total: 0,
        total_pages: 1,
    });

    const fetchEvents = async (page = 1) => {

        try {

            setLoading(true);

            const response = await getEvents(page, 5);

            const data = response.events || [];

            setEvents(data);
            setFilteredEvents(data);

            if (response.pagination) {
                setPagination(response.pagination);
            }

            setCurrentPage(page);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to load events."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchEvents(currentPage);
    }, [currentPage]);

    useEffect(() => {

        const keyword = search.toLowerCase();

        const filtered = events.filter((event) =>
            event.title.toLowerCase().includes(keyword) ||
            event.location.toLowerCase().includes(keyword) ||
            event.category.toLowerCase().includes(keyword)
        );

        setFilteredEvents(filtered);

    }, [search, events]);

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this event?"
        );

        if (!confirmDelete) return;

        try {

            const response = await deleteEvent(id);

            toast.success(
                response.message || "Event deleted successfully."
            );

            fetchEvents(currentPage);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to delete event."
            );

        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary">
                    <span className="visually-hidden">
                        Loading...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h2 className="fw-bold mb-1">
                        Events
                    </h2>

                    <p className="text-muted mb-0">
                        Manage all events
                    </p>
                </div>

                <Link
                    to="/events/add"
                    className="btn btn-primary"
                >
                    <i className="bi bi-plus-circle me-2"></i>
                    Add Event
                </Link>

            </div>

            <div className="card shadow-sm border-0">

                <div className="card-body">

                    <div className="row mb-3">

                        <div className="col-md-4">

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search event..."
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
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Location</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Price</th>
                                    <th className="text-center">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredEvents.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="text-center py-4 text-muted"
                                        >
                                            No events found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredEvents.map((event) => (
                                        <tr key={event.id}>
                                            <td>{event.id}</td>
                                            <td>{event.title}</td>
                                            <td>{event.category}</td>
                                            <td>{event.location}</td>
                                            <td>{event.event_date}</td>

                                            <td>
                                                <span
                                                    className={`badge ${
                                                        event.status === "Upcoming"
                                                            ? "bg-success"
                                                            : "bg-secondary"
                                                    }`}
                                                >
                                                    {event.status}
                                                </span>
                                            </td>

                                            <td>₹{event.ticket_price}</td>

                                            <td className="text-center">

                                                <Link
                                                    to={`/events/${event.id}`}
                                                    className="btn btn-sm btn-info me-2"
                                                >
                                                    <i className="bi bi-eye"></i>
                                                </Link>

                                                <Link
                                                    to={`/events/edit/${event.id}`}
                                                    className="btn btn-sm btn-warning me-2"
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                </Link>

                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() =>
                                                        handleDelete(event.id)
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

                    {/* Pagination */}

                    <div className="d-flex justify-content-between align-items-center mt-3">

                        <button
                            className="btn btn-outline-primary"
                            disabled={currentPage === 1}
                            onClick={() =>
                                setCurrentPage((prev) => prev - 1)
                            }
                        >
                            Previous
                        </button>

                        <span>
                            Page {pagination.page} of {pagination.total_pages}
                        </span>

                        <button
                            className="btn btn-outline-primary"
                            disabled={
                                currentPage === pagination.total_pages
                            }
                            onClick={() =>
                                setCurrentPage((prev) => prev + 1)
                            }
                        >
                            Next
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default EventList;