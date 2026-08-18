import {
    Bell,
    Compass,
    Home,
    LogOut,
    Package,
    User,
} from "lucide-react";
import logo from "../../assets/logo.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface SidebarItem {
    label: string;
    path: string;
    icon: typeof Home;
}

const userNavigation: SidebarItem[] = [
    { label: "Home", path: "/app", icon: Home },
    { label: "Explore", path: "/app/explore", icon: Compass },
    { label: "Rentals", path: "/app/rentals", icon: Package },
    { label: "Activity", path: "/app/activity", icon: Bell },
];

function WovenSidebar1() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    function handleNavigation(path: string) {
        navigate(path);
    }

    function handleLogout() {
        logout();
        navigate("/login", { replace: true });
    }

    return (
        <aside className="sticky top-0 flex h-screen w-[104px] shrink-0 items-center justify-center">
            <div className="group relative flex h-[calc(100vh-40px)] w-[72px] flex-col items-center overflow-hidden rounded-[28px] border border-white/60 bg-[rgba(250,248,242,0.62)] py-5 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_8px_20px_rgba(23,23,23,0.06),0_24px_55px_rgba(23,23,23,0.12)] transition-all duration-500 hover:-translate-y-1">
                <div aria-hidden="true" className="pointer-events-none absolute inset-[1px] rounded-[27px] bg-gradient-to-br from-white/45 via-transparent to-transparent" />
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/20" />

                {/* Logo */}
                <div className="relative z-10 flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-[var(--color-ink)] shadow-md">
                    <img src={logo} alt="Logo" className="h-6 w-auto" />
                </div>

                {/* Customer Navigation */}
                <nav className="relative z-10 mt-7 flex flex-col items-center gap-5">
                    {userNavigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <button
                                key={item.path}
                                type="button"
                                onClick={() => handleNavigation(item.path)}
                                className="group/item flex w-[58px] flex-col items-center"
                            >
                                <span className={`flex h-[42px] w-[42px] items-center justify-center rounded-[12px] border transition-all duration-300 ${
                                    isActive
                                        ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-ivory)] shadow-md"
                                        : "border-transparent bg-transparent text-[var(--color-ink)] hover:border-white/70 hover:bg-white/40"
                                }`}>
                                    <Icon size={18} strokeWidth={1.55} />
                                </span>
                                <span className={`mt-1.5 text-[7px] font-semibold uppercase tracking-[0.12em] ${
                                    isActive ? "text-[var(--color-accent)]" : "text-[var(--color-ink-soft)]"
                                }`}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </nav>

                <div className="relative z-10 mt-5 h-px w-[48px] bg-[rgba(23,23,23,0.08)]" />

                {/* Profile */}
                <div className="relative z-10 mt-5 flex flex-col items-center gap-5">
                    <button
                        type="button"
                        onClick={() => handleNavigation("/app/profile")}
                        className="group/item flex w-[58px] flex-col items-center"
                    >
                        <span className={`flex h-[42px] w-[42px] items-center justify-center rounded-[12px] border transition-all duration-300 ${
                            location.pathname === "/app/profile"
                                ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-ivory)] shadow-md"
                                : "border-transparent text-[var(--color-ink)] hover:border-white/70 hover:bg-white/40"
                        }`}>
                            <User size={18} strokeWidth={1.5} />
                        </span>
                        <span className={`mt-1.5 text-[7px] font-semibold uppercase tracking-[0.12em] ${
                            location.pathname === "/app/profile" ? "text-[var(--color-accent)]" : "text-[var(--color-ink-soft)]"
                        }`}>
                            Profile
                        </span>
                    </button>
                </div>

                {/* Logout */}
                <button
                    type="button"
                    onClick={handleLogout}
                    className="group/logout relative z-10 mt-auto flex w-[58px] flex-col items-center"
                >
                    <span className="flex h-[42px] w-[42px] items-center justify-center rounded-[12px] border border-transparent text-[var(--color-accent)] transition-all duration-300 hover:bg-rose-50">
                        <LogOut size={18} strokeWidth={1.5} />
                    </span>
                    <span className="mt-1.5 text-[7px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-soft)] group-hover/logout:text-[var(--color-accent)]">
                        Logout
                    </span>
                </button>
            </div>
        </aside>
    );
}

export default WovenSidebar1;
