import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../types/auth";

interface RoleRouteProps {
    allowedRoles: UserRole[];
}

function RoleRoute({ allowedRoles }: RoleRouteProps) {
    const { user, role, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[var(--color-ivory)]">
                <div className="text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--color-muted)]">
                    Weaving session...
                </div>
            </div>
        );
    }

    if (!role || !user) {
        return <Navigate to="/login" replace />;
    }

    // Strict Admin Protection: Only prianshumitraprivateserver1@gmail.com can access admin routes
    if (allowedRoles.includes("admin")) {
        if (role === "admin" && user.email.toLowerCase() === "prianshumitraprivateserver1@gmail.com") {
            return <Outlet />;
        }
        return <Navigate to="/app" replace />;
    }

    // Customer routes (allowedRoles includes "user") are accessible by all authenticated users (customers, vendors, admin)
    if (allowedRoles.includes("user") || role === "admin" || allowedRoles.includes(role)) {
        return <Outlet />;
    }

    return <Navigate to="/" replace />;
}

export default RoleRoute;