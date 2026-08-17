import type { ReactNode } from "react";

import Header from "./Header";
import Footer from "./Footer";

interface AppLayoutProps {
    children: ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-[var(--color-ivory)] text-[var(--color-ink)]">
            <Header />

            <main className="flex-1">
                {children}
            </main>

            <Footer />
        </div>
    );
}

export default AppLayout;