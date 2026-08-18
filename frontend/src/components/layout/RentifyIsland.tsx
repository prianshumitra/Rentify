import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import RentifyIsland1 from "./RentifyIsland1";
import RentifyIsland2 from "./RentifyIsland2";
import RentifyIsland3 from "./RentifyIsland3";

function RentifyIsland() {
    const { role } = useAuth();
    const location = useLocation();

    // If on a vendor route, always display Vendor Island
    if (location.pathname.startsWith("/vendor")) {
        return <RentifyIsland2 />;
    }

    // If on an admin route, always display Admin Island
    if (location.pathname.startsWith("/admin")) {
        return <RentifyIsland3 />;
    }

    // Default by role for shared pages (e.g. /app/profile)
    if (role === "admin") {
        return <RentifyIsland3 />;
    }

    if (role === "vendor") {
        return <RentifyIsland2 />;
    }

    return <RentifyIsland1 />;
}

export default RentifyIsland;