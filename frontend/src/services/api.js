import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach JWT Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Handle Unauthorized Responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("access_token");

            // Only redirect if we're not already on login/register
            const currentPath = window.location.pathname;

            if (
                currentPath !== "/login" &&
                currentPath !== "/register"
            ) {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;