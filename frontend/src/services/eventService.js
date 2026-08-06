import api from "./api";

// ======================================
// Get All Events (Pagination)
// ======================================

export const getEvents = async (page = 1, perPage = 5) => {
    const response = await api.get("/events/", {
        params: {
            page,
            per_page: perPage,
        },
    });

    return response.data;
};

// ======================================
// Get Event By ID
// ======================================

export const getEvent = async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
};

// ======================================
// Create Event
// ======================================

export const createEvent = async (data) => {
    const response = await api.post("/events/", data);
    return response.data;
};

// ======================================
// Update Event
// ======================================

export const updateEvent = async (id, data) => {
    const response = await api.put(`/events/${id}`, data);
    return response.data;
};

// ======================================
// Delete Event
// ======================================

export const deleteEvent = async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
};

// ======================================
// Search Events
// ======================================

export const searchEvents = async (keyword) => {
    const response = await api.get("/events/search", {
        params: {
            keyword,
        },
    });

    return response.data;
};

// ======================================
// Get Events By Category
// ======================================

export const getEventsByCategory = async (categoryId) => {
    const response = await api.get(
        `/events/category/${categoryId}`
    );

    return response.data;
};