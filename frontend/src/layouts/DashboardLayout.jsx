import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

function DashboardLayout() {
    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                background: "#f8f9fa",
            }}
        >
            <Sidebar />

            <div
                
    style={{
        marginLeft: "260px",
        width: "calc(100% - 260px)",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
    }}
>
            
                <Topbar />

                <main className="container-fluid py-4 px-4 flex-grow-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;