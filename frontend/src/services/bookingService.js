import api from "./api";

// ======================================
// Create Booking
// ======================================

export const createBooking = async (data) => {
    const response = await api.post("/bookings/", data);
    return response.data;
};

// ======================================
// Get My Bookings
// ======================================

export const getMyBookings = async () => {
    const response = await api.get("/bookings/my-bookings");
    return response.data;
};

// ======================================
// Get Booking By ID
// ======================================

export const getBooking = async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
};

// ======================================
// Get All Bookings (Admin)
// ======================================

export const getBookings = async () => {
    const response = await api.get("/bookings/");
    return response.data;
};

// ======================================
// Cancel Booking
// ======================================

export const cancelBooking = async (id) => {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
};

// ======================================
// Delete Booking (Admin)
// ======================================

export const deleteBooking = async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
};

// ======================================
// Booking Statistics
// ======================================

export const getBookingStatistics = async () => {
    const response = await api.get("/bookings/statistics");
    return response.data;
};

// ======================================
// Download Booking Confirmation (PDF)
// ======================================

export const downloadBooking = async (id) => {
    const response = await api.get(
        `/bookings/${id}/download`,
        {
            responseType: "blob",
        }
    );

    return response;
};