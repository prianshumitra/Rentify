import { Outlet } from "react-router-dom";

import RentifyIsland from "./RentifyIsland";
import WovenSidebar from "./WovenSidebar";

function AppLayout() {
    return (
        <div className="min-h-screen bg-[var(--color-ivory)]">
            <RentifyIsland />

            <div className="flex min-h-screen">
                {/* Sidebar */}
                <div className="hidden w-[104px] shrink-0 lg:block">
                    <WovenSidebar />
                </div>

                {/* Page content */}
                <div className="min-w-0 flex-1">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default AppLayout;