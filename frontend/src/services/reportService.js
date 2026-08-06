import api from "./api";

// ======================================
// Export Booking Report (CSV)
// ======================================

export const exportBookingReport = async () => {
    const response = await api.get(
        "/admin/bookings/export",
        {
            responseType: "blob",
        }
    );

    return response;
};