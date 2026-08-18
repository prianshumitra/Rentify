import { Outlet } from "react-router-dom";

import RentifyIsland from "./RentifyIsland";

function AppLayout() {
    return (
        <div className="min-h-screen bg-[var(--color-ivory)] text-[var(--color-ink)]">
            <RentifyIsland />

            <main className="min-h-screen pt-24">
                <Outlet />
            </main>
        </div>
    );
}

export default AppLayout;