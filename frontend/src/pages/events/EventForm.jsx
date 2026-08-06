import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
    createEvent,
    getEvent,
    updateEvent,
} from "../../services/eventService";

import { getCategories } from "../../services/categoryService";

function EventForm() {
    const navigate = useNavigate();
    const { id } = useParams();

    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);

    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        event_date: "",
        event_time: "",
        ticket_price: "",
        available_seats: "",
        organizer: "",
        registration_deadline: "",
        image_url: "",
        status: "Upcoming",
        category_id: "",
    });

    const [errors, setErrors] = useState({});

    // ======================================
    // Load Categories
    // ======================================

    const loadCategories = useCallback(async () => {
        try {
            const response = await getCategories();
            setCategories(response.categories || []);
        } catch {
            toast.error("Failed to load categories.");
        }
    }, []);

    // ======================================
    // Load Event
    // ======================================

    const loadEvent = useCallback(async () => {
        if (!isEdit) return;

        try {
            setLoading(true);

            const response = await getEvent(id);

            const event = response.event;

            setFormData({
                title: event.title || "",
                description: event.description || "",
                location: event.location || "",
                event_date: event.event_date || "",
                event_time: event.event_time || "",
                ticket_price: event.ticket_price || "",
                available_seats: event.available_seats || "",
                organizer: event.organizer || "",
                registration_deadline:
                    event.registration_deadline || "",
                image_url: event.image_url || "",
                status: event.status || "Upcoming",
                category_id: event.category_id || "",
            });
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to load event."
            );

            navigate("/events");
        } finally {
            setLoading(false);
        }
    }, [id, isEdit, navigate]);

    // ======================================
    // Initialize Page
    // ======================================

    useEffect(() => {
        const initialize = async () => {
            await loadCategories();

            if (isEdit) {
                await loadEvent();
            }
        };

        initialize();
    }, [loadCategories, loadEvent, isEdit]);

    // ======================================
    // Handle Change
    // ======================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    // ======================================
    // Validation
    // ======================================

    const validate = () => {
        const validationErrors = {};

        if (!formData.title.trim())
            validationErrors.title = "Title is required.";

        if (!formData.description.trim())
            validationErrors.description =
                "Description is required.";

        if (!formData.category_id)
            validationErrors.category_id =
                "Category is required.";

        if (!formData.location.trim())
            validationErrors.location =
                "Location is required.";

        if (!formData.organizer.trim())
            validationErrors.organizer =
                "Organizer is required.";

        if (!formData.event_date)
            validationErrors.event_date =
                "Event date is required.";

        if (!formData.event_time)
            validationErrors.event_time =
                "Event time is required.";

        if (!formData.registration_deadline)
            validationErrors.registration_deadline =
                "Registration deadline is required.";

        if (!formData.available_seats)
            validationErrors.available_seats =
                "Available seats are required.";

        if (!formData.ticket_price)
            validationErrors.ticket_price =
                "Ticket price is required.";

        setErrors(validationErrors);

        return Object.keys(validationErrors).length === 0;
    };

    // ======================================
    // Submit
    // ======================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setLoading(true);

            if (isEdit) {
                const response = await updateEvent(
                    id,
                    formData
                );

                toast.success(
                    response.message ||
                        "Event updated successfully."
                );
            } else {
                const response = await createEvent(
                    formData
                );

                toast.success(
                    response.message ||
                        "Event created successfully."
                );
            }

            navigate("/events");
        } catch (error) {
            const data = error.response?.data;

            if (data?.errors) {
                setErrors(data.errors);
            }

            toast.error(
                data?.message || "Operation failed."
            );
        } finally {
            setLoading(false);
        }
    };
    return (
    <div className="container-fluid py-3">
        <div className="row justify-content-center">
            <div className="col-lg-10">

                <div className="card shadow-sm border-0">

                    <div className="card-header bg-white">
                        <h3 className="fw-bold mb-0">
                            {isEdit ? "Edit Event" : "Add Event"}
                        </h3>
                    </div>

                    <div className="card-body">

                        <form onSubmit={handleSubmit} noValidate>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Event Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    className={`form-control ${
                                        errors.title ? "is-invalid" : ""
                                    }`}
                                    value={formData.title}
                                    onChange={handleChange}
                                />

                                <div className="invalid-feedback">
                                    {errors.title}
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Description
                                </label>

                                <textarea
                                    rows="4"
                                    name="description"
                                    className={`form-control ${
                                        errors.description ? "is-invalid" : ""
                                    }`}
                                    value={formData.description}
                                    onChange={handleChange}
                                />

                                <div className="invalid-feedback">
                                    {errors.description}
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Category
                                </label>

                                <select
                                    name="category_id"
                                    className={`form-select ${
                                        errors.category_id ? "is-invalid" : ""
                                    }`}
                                    value={formData.category_id}
                                    onChange={handleChange}
                                >
                                    <option value="">
                                        Select Category
                                    </option>

                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>

                                <div className="invalid-feedback">
                                    {errors.category_id}
                                </div>
                            </div>

                            <div className="row">

                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">
                                        Location
                                    </label>

                                    <input
                                        type="text"
                                        name="location"
                                        className={`form-control ${
                                            errors.location ? "is-invalid" : ""
                                        }`}
                                        value={formData.location}
                                        onChange={handleChange}
                                    />

                                    <div className="invalid-feedback">
                                        {errors.location}
                                    </div>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">
                                        Organizer
                                    </label>

                                    <input
                                        type="text"
                                        name="organizer"
                                        className={`form-control ${
                                            errors.organizer ? "is-invalid" : ""
                                        }`}
                                        value={formData.organizer}
                                        onChange={handleChange}
                                    />

                                    <div className="invalid-feedback">
                                        {errors.organizer}
                                    </div>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">
                                        Event Date
                                    </label>

                                    <input
                                        type="date"
                                        name="event_date"
                                        className={`form-control ${
                                            errors.event_date ? "is-invalid" : ""
                                        }`}
                                        value={formData.event_date}
                                        onChange={handleChange}
                                    />

                                    <div className="invalid-feedback">
                                        {errors.event_date}
                                    </div>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">
                                        Event Time
                                    </label>

                                    <input
                                        type="time"
                                        name="event_time"
                                        className={`form-control ${
                                            errors.event_time ? "is-invalid" : ""
                                        }`}
                                        value={formData.event_time}
                                        onChange={handleChange}
                                    />

                                    <div className="invalid-feedback">
                                        {errors.event_time}
                                    </div>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">
                                        Registration Deadline
                                    </label>

                                    <input
                                        type="date"
                                        name="registration_deadline"
                                        className={`form-control ${
                                            errors.registration_deadline
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        value={formData.registration_deadline}
                                        onChange={handleChange}
                                    />

                                    <div className="invalid-feedback">
                                        {errors.registration_deadline}
                                    </div>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        className="form-select"
                                        value={formData.status}
                                        onChange={handleChange}
                                    >
                                        <option value="Upcoming">Upcoming</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">
                                        Available Seats
                                    </label>

                                    <input
                                        type="number"
                                        name="available_seats"
                                        className={`form-control ${
                                            errors.available_seats
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        value={formData.available_seats}
                                        onChange={handleChange}
                                    />

                                    <div className="invalid-feedback">
                                        {errors.available_seats}
                                    </div>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">
                                        Ticket Price
                                    </label>

                                    <input
                                        type="number"
                                        name="ticket_price"
                                        className={`form-control ${
                                            errors.ticket_price
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        value={formData.ticket_price}
                                        onChange={handleChange}
                                    />

                                    <div className="invalid-feedback">
                                        {errors.ticket_price}
                                    </div>
                                </div>

                                <div className="col-12 mb-3">
                                    <label className="form-label fw-semibold">
                                        Image URL
                                    </label>

                                    <input
                                        type="text"
                                        name="image_url"
                                        className="form-control"
                                        value={formData.image_url}
                                        onChange={handleChange}
                                    />
                                </div>

                            </div>

                            <div className="d-flex gap-2 mt-3">

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Saving..."
                                        : isEdit
                                        ? "Update Event"
                                        : "Create Event"}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => navigate("/events")}
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </div>
        </div>
    </div>
);
}

export default EventForm;