import api from "./api";

// ======================================
// Dashboard Summary
// ======================================

export const getDashboardStats = async () => {
    const response = await api.get("/dashboard/");
    return response.data;
};

// ======================================
// Recent Registrations
// ======================================

export const getRecentRegistrations = async () => {
    const response = await api.get(
        "/dashboard/recent-registrations"
    );

    return response.data;
};

// ======================================
// Event Popularity
// ======================================

export const getEventPopularity = async () => {
    const response = await api.get(
        "/dashboard/event-popularity"
    );

    return response.data;
};