import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

function AuthLayout() {
    return (
        <>
            <Navbar />

            <Outlet />
        </>
    );
}

export default AuthLayout;