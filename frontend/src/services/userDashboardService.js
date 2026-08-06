import api from "./api";

export const getEvents = async () => {
    const response = await api.get("/events/");
    return response.data;
};

export const getMyBookings = async () => {
    const response = await api.get("/bookings/my-bookings");
    return response.data;
};