import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

import { getProfile } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = useCallback(async () => {
        const token = localStorage.getItem("access_token");

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await getProfile();

            setUser(response.user);
        } catch (error) {
            console.error("Load User Error:", error);

            localStorage.removeItem("access_token");
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    const login = (token, userData) => {
        localStorage.setItem("access_token", token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        setUser(null);

        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                loadUser,
                isAuthenticated: !!user,
                isAdmin: user?.role === "admin",
                isUser: user?.role === "user",
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}