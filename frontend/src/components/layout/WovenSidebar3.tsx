import {
    Boxes,
    CreditCard,
    Home,
    LogOut,
    Package,
    ShoppingBag,
    User,
    Users,
} from "lucide-react";
import logo from "../../assets/logo.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface SidebarItem {
    label: string;
    path: string;
    icon: typeof Home;
}

const adminNavigation: SidebarItem[] = [
    { label: "Admin", path: "/admin", icon: Home },
    { label: "Users", path: "/admin/users", icon: Users },
    { label: "Catalog", path: "/admin/products", icon: Package },
    { label: "Rentals", path: "/admin/rentals", icon: ShoppingBag },
    { label: "Payments", path: "/admin/payments", icon: CreditCard },
    { label: "Stock", path: "/admin/inventory", icon: Boxes },
];

function WovenSidebar3() {
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
            <div className="group relative flex h-[calc(100vh-40px)] w-[72px] flex-col items-center overflow-hidden rounded-[28px] border border-white/60 bg-[rgba(250,248,242,0.62)] py-5 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_8px_20px_rgba(23,23,23,0.06),0_24px_55px_rgba(23,23,23,0.12),inset_0_1px_0_rgba(255,255,255,0.85),inset_0_-1px_0_rgba(23,23,23,0.05)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(23,23,23,0.07),0_30px_70px_rgba(23,23,23,0.16),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(23,23,23,0.06)]">
                <div aria-hidden="true" className="pointer-events-none absolute inset-[1px] rounded-[27px] bg-gradient-to-br from-white/45 via-transparent to-transparent" />
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/20" />

                {/* Logo Mark */}
                <div className="relative z-10 flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-[var(--color-ink)] shadow-[0_5px_14px_rgba(23,23,23,0.16),inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <img src={logo} alt="Logo" className="h-6 w-auto" />
                </div>

                {/* Admin Navigation */}
                <nav className="relative z-10 mt-5 flex flex-col items-center gap-3.5">
                    {adminNavigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <button
                                key={item.path}
                                type="button"
                                onClick={() => handleNavigation(item.path)}
                                className="group/item flex w-[58px] flex-col items-center"
                            >
                                <span className={`flex h-[38px] w-[38px] items-center justify-center rounded-[12px] border transition-all duration-300 ${
                                    isActive
                                        ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-ivory)] shadow-[0_5px_12px_rgba(23,23,23,0.18),inset_0_1px_0_rgba(255,255,255,0.08)]"
                                        : "border-transparent bg-transparent text-[var(--color-ink)] hover:-translate-y-0.5 hover:border-white/70 hover:bg-[rgba(255,255,255,0.42)] hover:text-[var(--color-ink)] hover:shadow-[0_5px_15px_rgba(23,23,23,0.08),inset_0_1px_0_rgba(255,255,255,0.7)]"
                                }`}>
                                    <Icon size={17} strokeWidth={1.55} />
                                </span>
                                <span className={`mt-1 text-[6.5px] font-semibold uppercase tracking-[0.12em] transition-all duration-300 ${
                                    isActive ? "text-[var(--color-accent)]" : "text-[var(--color-ink-soft)] group-hover/item:text-[var(--color-ink)]"
                                }`}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </nav>

                <div className="relative z-10 mt-4 h-px w-[48px] bg-[rgba(23,23,23,0.08)]" />

                {/* Profile */}
                <div className="relative z-10 mt-3 flex flex-col items-center gap-3">
                    <button
                        type="button"
                        onClick={() => handleNavigation("/app/profile")}
                        className="group/item flex w-[58px] flex-col items-center"
                    >
                        <span className={`flex h-[38px] w-[38px] items-center justify-center rounded-[12px] border transition-all duration-300 ${
                            location.pathname === "/app/profile"
                                ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-ivory)] shadow-[0_5px_12px_rgba(23,23,23,0.16)]"
                                : "border-transparent text-[var(--color-ink)] hover:-translate-y-0.5 hover:border-white/70 hover:bg-[rgba(255,255,255,0.42)] hover:shadow-[0_5px_15px_rgba(23,23,23,0.08),inset_0_1px_0_rgba(255,255,255,0.7)]"
                        }`}>
                            <User size={17} strokeWidth={1.5} />
                        </span>
                        <span className={`mt-1 text-[6.5px] font-semibold uppercase tracking-[0.12em] ${
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
                    <span className="flex h-[38px] w-[38px] items-center justify-center rounded-[12px] border border-transparent text-[var(--color-accent)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(196,91,60,0.18)] hover:bg-[rgba(196,91,60,0.08)] hover:shadow-[0_5px_15px_rgba(196,91,60,0.08)]">
                        <LogOut size={17} strokeWidth={1.5} />
                    </span>
                    <span className="mt-1 text-[6.5px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-soft)] transition-colors group-hover/logout:text-[var(--color-accent)]">
                        Logout
                    </span>
                </button>
            </div>
        </aside>
    );
}

export default WovenSidebar3;
