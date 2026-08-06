import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
    getUsers,
    deleteUser,
    toggleUserStatus,
    exportBookings,
} from "../../services/userService";

function UserList() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const keyword = search.toLowerCase();

        const filtered = users.filter(
            (user) =>
                user.full_name.toLowerCase().includes(keyword) ||
                user.email.toLowerCase().includes(keyword) ||
                user.role.toLowerCase().includes(keyword)
        );

        setFilteredUsers(filtered);
    }, [search, users]);

    const fetchUsers = async () => {
        try {
            setLoading(true);

            const response = await getUsers();

            setUsers(response.users || []);
            setFilteredUsers(response.users || []);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to load users."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleStatus = async (id) => {
        try {
            const response = await toggleUserStatus(id);

            toast.success(
                response.message || "User status updated."
            );

            fetchUsers();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to update user."
            );
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this user?")) {
            return;
        }

        try {
            const response = await deleteUser(id);

            toast.success(
                response.message ||
                "User deleted successfully."
            );

            fetchUsers();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to delete user."
            );
        }
    };

    const handleExport = async () => {
        try {
            const response = await exportBookings();

            const blob = new Blob(
                [response.data],
                {
                    type: "text/csv",
                }
            );

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = "booking_report.csv";

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            window.URL.revokeObjectURL(url);

            toast.success("CSV exported successfully.");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Export failed."
            );
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary"></div>
            </div>
        );
    }

    return (
        <div className="container-fluid">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h2 className="fw-bold">
                        User Management
                    </h2>

                    <p className="text-muted">
                        Manage registered users
                    </p>
                </div>

                <button
                    className="btn btn-success"
                    onClick={handleExport}
                >
                    <i className="bi bi-download me-2"></i>
                    Export CSV
                </button>

            </div>

            <div className="card shadow-sm border-0">

                <div className="card-body">

                    <div className="row mb-3">

                        <div className="col-md-4">

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search user..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>

                    </div>

                    <div className="table-responsive">

                        <table className="table table-hover align-middle">

                            <thead className="table-light">

                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th className="text-center">
                                        Actions
                                    </th>
                                </tr>

                            </thead>

                            <tbody>

                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="text-center py-4"
                                        >
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id}>

                                            <td>{user.id}</td>

                                            <td>{user.full_name}</td>

                                            <td>{user.email}</td>

                                            <td>{user.phone}</td>

                                            <td>
                                                <span
                                                    className={`badge ${
                                                        user.role === "admin"
                                                            ? "bg-danger"
                                                            : "bg-primary"
                                                    }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={`badge ${
                                                        user.is_active
                                                            ? "bg-success"
                                                            : "bg-secondary"
                                                    }`}
                                                >
                                                    {user.is_active
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </td>

                                            <td className="text-center">

                                                <Link
                                                    to={`/users/edit/${user.id}`}
                                                    className="btn btn-sm btn-warning me-2"
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                </Link>

                                                <button
                                                    className="btn btn-sm btn-info me-2"
                                                    onClick={() =>
                                                        handleStatus(user.id)
                                                    }
                                                >
                                                    <i className="bi bi-arrow-repeat"></i>
                                                </button>

                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() =>
                                                        handleDelete(user.id)
                                                    }
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>

                                            </td>

                                        </tr>
                                    ))
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default UserList;