import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../types/auth";

interface RoleRouteProps {
    allowedRoles: UserRole[];
}

function RoleRoute({ allowedRoles }: RoleRouteProps) {
    const { role, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[var(--color-ivory)]">
                <div className="text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--color-muted)]">
                    Weaving session...
                </div>
            </div>
        );
    }

    if (!role) {
        return <Navigate to="/login" replace />;
    }

    if (role === "admin" || allowedRoles.includes(role)) {
        return <Outlet />;
    }

    return <Navigate to="/" replace />;
}

export default RoleRoute;