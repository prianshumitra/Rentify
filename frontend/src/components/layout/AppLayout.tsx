import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import RentifyIsland from "./RentifyIsland";
import WovenSidebar from "./WovenSidebar";
import HomeFooter from "./HomeFooter";

function AppLayout() {
    const location = useLocation();

    // Smooth scroll to top on page route changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [location.pathname]);

    return (
        <div className="min-h-screen bg-[var(--color-ivory)] flex flex-col justify-between">
            <RentifyIsland />

            <div className="flex flex-1 min-h-screen">
                {/* Sidebar */}
                <div className="hidden w-[104px] shrink-0 lg:block">
                    <WovenSidebar />
                </div>

                {/* Page content with smooth silk fade-slide animation */}
                <div className="min-w-0 flex-1 flex flex-col justify-between">
                    <div
                        key={location.pathname}
                        className="flex-1 animate-page-transition"
                    >
                        <Outlet />
                    </div>
                    <HomeFooter />
                </div>
            </div>
        </div>
    );
}

export default AppLayout;