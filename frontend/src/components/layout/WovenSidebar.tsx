import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import WovenSidebar1 from "./WovenSidebar1";
import WovenSidebar2 from "./WovenSidebar2";
import WovenSidebar3 from "./WovenSidebar3";

function WovenSidebar() {
    const location = useLocation();
    const { user } = useAuth();

    // If route starts with /admin OR if logged-in user is an admin (is_admin === true), display Admin Sidebar (WovenSidebar3)
    if (location.pathname.startsWith("/admin") || (user?.is_admin && !location.pathname.startsWith("/vendor"))) {
        return <WovenSidebar3 />;
    }

    // If route starts with /vendor, display Vendor Sidebar (WovenSidebar2)
    if (location.pathname.startsWith("/vendor")) {
        return <WovenSidebar2 />;
    }

    // Otherwise, display Customer / User Sidebar (WovenSidebar1)
    return <WovenSidebar1 />;
}

export default WovenSidebar;