import api from "./api";

// ======================================
// Get Profile
// ======================================

export const getProfile = async () => {
    const response = await api.get("/auth/profile");
    return response.data;
};

// ======================================
// Update Profile
// ======================================

export const updateProfile = async (data) => {
    const response = await api.put(
        "/auth/profile",
        data
    );

    return response.data;
};

// ======================================
// Change Password
// ======================================

export const changePassword = async (data) => {
    const response = await api.put(
        "/auth/change-password",
        data
    );

    return response.data;
};