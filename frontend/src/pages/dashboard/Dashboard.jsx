import { useAuth } from "../../context/AuthContext";

import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";

function Dashboard() {
    const { isAdmin } = useAuth();

    return isAdmin ? <AdminDashboard /> : <UserDashboard />;
}

export default Dashboard;