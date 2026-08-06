import { Navigate, Route, Routes } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Dashboard from "../pages/dashboard/Dashboard";

// ===========================
// Admin Pages
// ===========================

import CategoryList from "../pages/categories/CategoryList";
import CategoryForm from "../pages/categories/CategoryForm";

import EventList from "../pages/events/EventList";
import EventForm from "../pages/events/EventForm";
import EventDetails from "../pages/events/EventDetails";

import BookingList from "../pages/bookings/BookingList";
import BookingDetails from "../pages/bookings/BookingDetails";

import UserList from "../pages/users/UserList";
import UserForm from "../pages/users/UserForm";

import ReportDashboard from "../pages/reports/ReportDashboard";

import Profile from "../pages/admin/Profile";
import ChangePassword from "../pages/admin/ChangePassword";

// ===========================
// User Pages
// ===========================

import UserEventList from "../pages/user/EventList";
import UserEventDetails from "../pages/user/EventDetails";

import UserBookingList from "../pages/user/BookingList";
import UserBookingDetails from "../pages/user/BookingDetails";

import UserProfile from "../pages/user/Profile";
import UserChangePassword from "../pages/user/ChangePassword";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

function AppRoutes() {
    return (
        <Routes>

            {/* ==========================================
                Public Routes
            ========================================== */}

            <Route element={<AuthLayout />}>

                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <Register />
                        </PublicRoute>
                    }
                />

            </Route>

            {/* ==========================================
                Protected Routes
            ========================================== */}

            <Route
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >

                {/* Dashboard */}

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                {/* ==========================================
                    Admin Module
                ========================================== */}

                {/* Categories */}

                <Route
                    path="/categories"
                    element={<CategoryList />}
                />

                <Route
                    path="/categories/add"
                    element={<CategoryForm />}
                />

                <Route
                    path="/categories/edit/:id"
                    element={<CategoryForm />}
                />

                {/* Events */}

                <Route
                    path="/events"
                    element={<EventList />}
                />

                <Route
                    path="/events/add"
                    element={<EventForm />}
                />

                <Route
                    path="/events/edit/:id"
                    element={<EventForm />}
                />

                <Route
                    path="/events/:id"
                    element={<EventDetails />}
                />

                {/* Bookings */}

                <Route
                    path="/bookings"
                    element={<BookingList />}
                />

                <Route
                    path="/bookings/:id"
                    element={<BookingDetails />}
                />

                {/* Users */}

                <Route
                    path="/users"
                    element={<UserList />}
                />

                <Route
                    path="/users/edit/:id"
                    element={<UserForm />}
                />

                {/* Reports */}

                <Route
                    path="/reports"
                    element={<ReportDashboard />}
                />

                {/* Admin Profile */}

                <Route
                    path="/profile"
                    element={<Profile />}
                />

                <Route
                    path="/change-password"
                    element={<ChangePassword />}
                />

                {/* ==========================================
                    User Module
                ========================================== */}

                <Route
                    path="/user/events"
                    element={<UserEventList />}
                />

                <Route
                    path="/user/events/:id"
                    element={<UserEventDetails />}
                />

                <Route
                    path="/my-bookings"
                    element={<UserBookingList />}
                />

                <Route
                    path="/my-bookings/:id"
                    element={<UserBookingDetails />}
                />

                <Route
                    path="/user/profile"
                    element={<UserProfile />}
                />

                <Route
                    path="/user/change-password"
                    element={<UserChangePassword />}
                />

            </Route>

            {/* ==========================================
                Default Route
            ========================================== */}

            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />

            {/* ==========================================
                404
            ========================================== */}

            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />

        </Routes>
    );
}

export default AppRoutes;