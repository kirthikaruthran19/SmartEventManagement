import api from "./api";

// ======================================
// Get All Users
// ======================================

export const getUsers = async () => {
    const response = await api.get("/admin/users");
    return response.data;
};
// ======================================
// Get User By ID
// ======================================

export const getUser = async (id) => {
    const response = await api.get(
        `/admin/users/${id}`
    );

    return response.data;
};
// ======================================
// Update User
// ======================================

export const updateUser = async (id, data) => {
    const response = await api.put(
        `/admin/users/${id}`,
        data
    );

    return response.data;
};

// ======================================
// Toggle User Status
// ======================================

export const toggleUserStatus = async (id) => {
    const response = await api.put(
        `/admin/users/${id}/status`
    );

    return response.data;
};

// ======================================
// Delete User
// ======================================

export const deleteUser = async (id) => {
    const response = await api.delete(
        `/admin/users/${id}`
    );

    return response.data;
};

// ======================================
// Export Booking Report (CSV)
// ======================================

export const exportBookings = async () => {
    const response = await api.get(
        "/admin/bookings/export",
        {
            responseType: "blob",
        }
    );

    return response;
};