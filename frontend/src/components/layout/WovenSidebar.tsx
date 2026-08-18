import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import WovenSidebar1 from "./WovenSidebar1";
import WovenSidebar2 from "./WovenSidebar2";
import WovenSidebar3 from "./WovenSidebar3";

function WovenSidebar() {
    const { role } = useAuth();
    const location = useLocation();

    // If on a vendor route, always display Vendor Sidebar
    if (location.pathname.startsWith("/vendor")) {
        return <WovenSidebar2 />;
    }

    // If on an admin route, always display Admin Sidebar
    if (location.pathname.startsWith("/admin")) {
        return <WovenSidebar3 />;
    }

    // Default by role for shared pages (e.g. /app/profile)
    if (role === "admin") {
        return <WovenSidebar3 />;
    }

    if (role === "vendor") {
        return <WovenSidebar2 />;
    }

    return <WovenSidebar1 />;
}

export default WovenSidebar;