import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
    getEvents,
    searchEvents,
    getEventsByCategory,
} from "../../services/eventService";

import { getCategories } from "../../services/categoryService";

function EventList() {

    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");

    const [loading, setLoading] = useState(true);

    // ==========================================
    // Load Events
    // ==========================================

    const loadEvents = async () => {

        try {

            setLoading(true);

            const response = await getEvents();

            const upcomingEvents = (response.events || []).filter(
                (event) => event.status === "Upcoming"
            );

            setEvents(upcomingEvents);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to load events."
            );

        } finally {

            setLoading(false);

        }

    };

    // ==========================================
    // Load Categories
    // ==========================================

    const loadCategories = async () => {

        try {

            const response = await getCategories();

            setCategories(response.categories || []);

        } catch (error) {

            console.error(error);

        }

    };

    useEffect(() => {

        loadEvents();
        loadCategories();

    }, []);

    // ==========================================
    // Search Events
    // ==========================================

    const handleSearch = async (keyword) => {

        setSearch(keyword);

        if (!keyword.trim()) {

            loadEvents();

            return;
        }

        try {

            const response = await searchEvents(keyword);

            setEvents(response.events || []);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Search failed."
            );

        }

    };

    // ==========================================
    // Filter Category
    // ==========================================

    const handleCategory = async (id) => {

        setCategory(id);

        if (!id) {

            loadEvents();

            return;
        }

        try {

            const response =
                await getEventsByCategory(id);

            setEvents(response.events || []);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to filter events."
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

            {/* Header */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold">
                        Upcoming Events
                    </h2>

                    <p className="text-muted mb-0">
                        Browse and book upcoming events
                    </p>

                </div>

            </div>

            {/* Search & Filter */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-body">

                    <div className="row g-3">

                        <div className="col-md-6">

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search events..."
                                value={search}
                                onChange={(e) =>
                                    handleSearch(e.target.value)
                                }
                            />

                        </div>

                        <div className="col-md-6">

                            <select
                                className="form-select"
                                value={category}
                                onChange={(e) =>
                                    handleCategory(e.target.value)
                                }
                            >

                                <option value="">
                                    All Categories
                                </option>

                                {categories.map((item) => (

                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.name}
                                    </option>

                                ))}

                            </select>

                        </div>

                    </div>

                </div>

            </div>

            {/* Events */}

            <div className="row g-4">

                {events.length === 0 ? (

                    <div className="col-12">

                        <div className="alert alert-info text-center">

                            No upcoming events found.

                        </div>

                    </div>

                ) : (

                    events.map((event) => (

                        <div
                            className="col-lg-4 col-md-6"
                            key={event.id}
                        >

                            <div className="card border-0 shadow-sm h-100">

                                <img
                                    src={
                                        event.image_url ||
                                        "https://via.placeholder.com/600x350?text=Event"
                                    }
                                    className="card-img-top"
                                    alt={event.title}
                                    style={{
                                        height: "220px",
                                        objectFit: "cover",
                                    }}
                                />

                                <div className="card-body">

                                    <h5 className="fw-bold">

                                        {event.title}

                                    </h5>

                                    <span className="badge bg-primary mb-2">

                                        {event.category}

                                    </span>

                                    <p className="mb-2">

                                        <i className="bi bi-geo-alt me-2"></i>

                                        {event.location}

                                    </p>

                                    <p className="mb-2">

                                        <i className="bi bi-calendar-event me-2"></i>

                                        {event.event_date}

                                    </p>

                                    <p className="mb-2">

                                        <i className="bi bi-people me-2"></i>

                                        {event.available_seats} Seats

                                    </p>

                                    <h5 className="text-primary fw-bold">

                                        ₹ {event.ticket_price}

                                    </h5>

                                </div>

                                <div className="card-footer bg-white border-0">

                                    <Link
                                        to={`/user/events/${event.id}`}
                                        className="btn btn-primary w-100"
                                    >

                                        <i className="bi bi-eye me-2"></i>

                                        View Details

                                    </Link>

                                </div>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>

    );

}

export default EventList;