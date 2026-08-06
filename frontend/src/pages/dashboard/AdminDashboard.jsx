import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
    Bar,
    Doughnut,
} from "react-chartjs-2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

import {
    getDashboardStats,
    getRecentRegistrations,
    getEventPopularity,
} from "../../services/dashboardService";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

function Dashboard() {

    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({});

    const [recentBookings, setRecentBookings] = useState([]);

    const [chartData, setChartData] = useState([]);

    useEffect(() => {

        loadDashboard();

    }, []);

    const loadDashboard = async () => {

        try {

            setLoading(true);

            const [
                dashboard,
                registrations,
                popularity,
            ] = await Promise.all([
                getDashboardStats(),
                getRecentRegistrations(),
                getEventPopularity(),
            ]);

            setStats(
                dashboard.dashboard || {}
            );

            setRecentBookings(
                registrations.registrations || []
            );

            setChartData(
                popularity.events || []
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to load dashboard."
            );

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <div className="text-center py-5">

                <div className="spinner-border text-primary"></div>

            </div>

        );

    }

    const cards = [

    {
        title: "Users",
        value: stats.total_users,
        icon: "bi-people-fill",
        color: "primary",
    },

    {
        title: "Categories",
        value: stats.total_categories,
        icon: "bi-tags-fill",
        color: "success",
    },

    {
        title: "Events",
        value: stats.total_events,
        icon: "bi-calendar-event-fill",
        color: "warning",
    },

    {
        title: "Active Events",
        value: stats.active_events,
        icon: "bi-calendar-check-fill",
        color: "info",
    },

    {
        title: "Completed Events",
        value: stats.completed_events,
        icon: "bi-calendar2-x-fill",
        color: "secondary",
    },

    {
        title: "Bookings",
        value: stats.total_bookings,
        icon: "bi-ticket-perforated-fill",
        color: "danger",
    },

];

    const barData = {
    labels: chartData.map(item => item.event_name),

    datasets: [
        {
            label: "Bookings",

            data: chartData.map(item => item.bookings),

            backgroundColor: [
                "#0d6efd",
                "#198754",
                "#ffc107",
                "#dc3545",
                "#6f42c1",
                "#20c997",
                "#fd7e14",
                "#0dcaf0",
            ],

            borderColor: [
                "#0a58ca",
                "#146c43",
                "#e0a800",
                "#bb2d3b",
                "#59359a",
                "#1aa179",
                "#d66b0c",
                "#0aa2c0",
            ],

            borderWidth: 1,

            borderRadius: 8,
        },
    ],
};

    const doughnutData = {
    labels: [
        "Confirmed",
        "Pending",
        "Cancelled",
    ],

    datasets: [
        {
            data: [
                stats.confirmed_bookings || 0,
                stats.pending_bookings || 0,
                stats.cancelled_bookings || 0,
            ],

            backgroundColor: [
                "#198754", // Green
                "#ffc107", // Yellow
                "#dc3545", // Red
            ],

            borderColor: [
                "#ffffff",
                "#ffffff",
                "#ffffff",
            ],

            borderWidth: 3,

            hoverOffset: 15,
        },
    ],
};
const barOptions = {

    responsive: true,

    plugins: {

        legend: {
            position: "top",
        },

    },

    scales: {

        y: {
            beginAtZero: true,
        },

    },

};

const doughnutOptions = {

    responsive: true,

    plugins: {

        legend: {
            position: "top",
        },

    },

};
    return (

        <div className="container-fluid">

            <div className="mb-4">

                <h2 className="fw-bold">
                    Dashboard
                </h2>

                <p className="text-muted">
                    Welcome back, Administrator
                </p>

            </div>

            <div className="row g-4 mb-4">

                {cards.map((card) => (

                    <div
                        className="col-xl-3 col-md-6"
                        key={card.title}
                    >

                        <div className="card shadow-sm border-0 h-100">

                            <div className="card-body d-flex justify-content-between align-items-center">

                                <div>

                                    <p className="text-muted mb-1">
                                        {card.title}
                                    </p>

                                    <h2 className="fw-bold">
                                        {card.value || 0}
                                    </h2>

                                </div>

                                <i
                                    className={`bi ${card.icon} fs-1 text-${card.color}`}
                                ></i>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

            <div className="row g-4 mb-4">

                <div className="col-lg-8">

                    <div className="card shadow-sm border-0">

                        <div className="card-header bg-white">

                            <h5 className="fw-bold mb-0">
                                Event Statistics
                            </h5>

                        </div>

                        <div className="card-body">

                            <Bar
    data={barData}
    options={barOptions}
/>

                        </div>

                    </div>

                </div>

                <div className="col-lg-4">

                    <div className="card shadow-sm border-0">

                        <div className="card-header bg-white">

                            <h5 className="fw-bold mb-0">
                                Booking Status
                            </h5>

                        </div>

                        <div className="card-body">

                            <Doughnut
    data={doughnutData}
    options={doughnutOptions}
/>

                        </div>

                    </div>

                </div>

            </div>
                        {/* Recent Registrations */}

            <div className="card shadow-sm border-0 mb-4">

                <div className="card-header bg-white">

                    <h5 className="fw-bold mb-0">
                        Recent Registrations
                    </h5>

                </div>

                <div className="card-body p-0">

                    <div className="table-responsive">

                        <table className="table table-hover align-middle mb-0">

                            <thead className="table-light">

                                <tr>

                                    <th>User</th>
                                    <th>Event</th>
                                    <th>Tickets</th>
                                    <th>Status</th>
                                    <th>Date</th>

                                </tr>

                            </thead>

                            <tbody>

                                {recentBookings.length > 0 ? (

                                    recentBookings.map((booking) => (

                                        <tr key={booking.booking_id}>

                                            <td>{booking.user}</td>

                                            <td>{booking.event}</td>

                                            <td>{booking.tickets}</td>

                                            <td>

                                                <span
                                                    className={`badge ${
                                                        booking.status === "Confirmed"
                                                            ? "bg-success"
                                                            : booking.status === "Pending"
                                                            ? "bg-warning text-dark"
                                                            : "bg-danger"
                                                    }`}
                                                >
                                                    {booking.status}
                                                </span>

                                            </td>

                                            <td>

                                                {new Date(
                                                    booking.booked_at
                                                ).toLocaleDateString()}

                                            </td>

                                        </tr>

                                    ))

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="text-center py-4"
                                        >

                                            No recent registrations found.

                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

            {/* Quick Actions */}

            <div className="row g-4">

                <div className="col-lg-3 col-md-6">

                    <Link
                        to="/events/add"
                        className="text-decoration-none"
                    >

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body text-center">

                                <i className="bi bi-calendar-plus fs-1 text-primary"></i>

                                <h5 className="mt-3 fw-bold">
                                    Add Event
                                </h5>

                            </div>

                        </div>

                    </Link>

                </div>

                <div className="col-lg-3 col-md-6">

                    <Link
                        to="/categories/add"
                        className="text-decoration-none"
                    >

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body text-center">

                                <i className="bi bi-tags fs-1 text-success"></i>

                                <h5 className="mt-3 fw-bold">
                                    Add Category
                                </h5>

                            </div>

                        </div>

                    </Link>

                </div>

                <div className="col-lg-3 col-md-6">

                    <Link
                        to="/reports"
                        className="text-decoration-none"
                    >

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body text-center">

                                <i className="bi bi-bar-chart-line fs-1 text-warning"></i>

                                <h5 className="mt-3 fw-bold">
                                    View Reports
                                </h5>

                            </div>

                        </div>

                    </Link>

                </div>

                <div className="col-lg-3 col-md-6">

                    <Link
                        to="/users"
                        className="text-decoration-none"
                    >

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body text-center">

                                <i className="bi bi-people fs-1 text-danger"></i>

                                <h5 className="mt-3 fw-bold">
                                    Manage Users
                                </h5>

                            </div>

                        </div>

                    </Link>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;