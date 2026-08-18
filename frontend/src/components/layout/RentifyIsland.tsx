import { useState } from "react";
import {
    Bell,
    Compass,
    Home,
    LogOut,
    Menu,
    Package,
    Search,
    Settings,
    Shield,
    Store,
    User,
    X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function RentifyIsland() {
    const { user, role, logout } = useAuth();
    const navigate = useNavigate();

    const [isExpanded, setIsExpanded] = useState(false);

    const displayName = user
        ? `${user.first_name} ${user.last_name}`.trim()
        : "Account";

    function handleNavigation(path: string) {
        navigate(path);
        setIsExpanded(false);
    }

    function handleLogout() {
        logout();
        navigate("/login", { replace: true });
    }

    return (
        <div className="pointer-events-none fixed left-0 right-0 top-5 z-50 flex justify-center px-4">
            <div
                className={`pointer-events-auto w-full transition-all duration-500 ease-[var(--ease-standard)] ${
                    isExpanded
                        ? "max-w-2xl"
                        : "max-w-[430px]"
                }`}
            >
                <div
                    className={`overflow-hidden rounded-[2rem] border border-[rgba(255,255,255,0.12)] bg-[var(--color-ink)] text-[var(--color-ivory)] shadow-[0_22px_60px_rgba(23,23,23,0.24)] transition-all duration-500 ${
                        isExpanded
                            ? "shadow-[0_28px_80px_rgba(23,23,23,0.3)]"
                            : ""
                    }`}
                >
                    {/* ─────────────────────────
                        COMPACT ISLAND
                    ───────────────────────── */}

                    <div className="flex h-14 items-center justify-between px-5">
                        {/* Brand */}
                        <button
                            type="button"
                            onClick={() =>
                                setIsExpanded(!isExpanded)
                            }
                            className="flex items-center gap-3"
                            aria-label="Toggle navigation"
                        >
                            <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />

                            <span className="text-xs font-semibold tracking-[-0.01em]">
                                RENTIFY
                            </span>
                        </button>

                        {/* Role */}
                        <div className="hidden items-center gap-2 sm:flex">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />

                            <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-[rgba(245,241,232,0.55)]">
                                {role ?? "Account"}
                            </span>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                aria-label="Search"
                                className="flex h-8 w-8 items-center justify-center rounded-full text-[rgba(245,241,232,0.6)] transition-colors duration-200 hover:bg-[rgba(255,255,255,0.08)] hover:text-[var(--color-ivory)]"
                            >
                                <Search
                                    size={15}
                                    strokeWidth={1.6}
                                />
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setIsExpanded(!isExpanded)
                                }
                                aria-label={
                                    isExpanded
                                        ? "Close navigation"
                                        : "Open navigation"
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-ivory)] text-[var(--color-ink)] transition-all duration-300 hover:bg-[var(--color-accent)] hover:text-[var(--color-ivory)]"
                            >
                                {isExpanded ? (
                                    <X
                                        size={15}
                                        strokeWidth={1.7}
                                    />
                                ) : (
                                    <Menu
                                        size={15}
                                        strokeWidth={1.7}
                                    />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* ─────────────────────────
                        EXPANDED ISLAND
                    ───────────────────────── */}

                    <div
                        className={`grid transition-all duration-500 ease-[var(--ease-standard)] ${
                            isExpanded
                                ? "grid-rows-[1fr] opacity-100"
                                : "grid-rows-[0fr] opacity-0"
                        }`}
                    >
                        <div className="min-h-0 overflow-hidden">
                            <div className="border-t border-[rgba(255,255,255,0.1)] px-5 pb-5 pt-4">
                                {/* Main navigation */}
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                    <IslandItem
                                        icon={Home}
                                        label="Home"
                                        onClick={() =>
                                            handleNavigation(
                                                "/app",
                                            )
                                        }
                                    />

                                    <IslandItem
                                        icon={Compass}
                                        label="Explore"
                                        onClick={() =>
                                            handleNavigation(
                                                "/app/explore",
                                            )
                                        }
                                    />

                                    <IslandItem
                                        icon={Package}
                                        label="Rentals"
                                        onClick={() =>
                                            handleNavigation(
                                                "/app/rentals",
                                            )
                                        }
                                    />

                                    <IslandItem
                                        icon={Bell}
                                        label="Activity"
                                        onClick={() =>
                                            handleNavigation(
                                                "/app/activity",
                                            )
                                        }
                                    />
                                </div>

                                {/* Role-specific navigation */}
                                <div className="mt-5 border-t border-[rgba(255,255,255,0.1)] pt-4">
                                    <p className="mb-3 text-[9px] font-medium uppercase tracking-[0.22em] text-[rgba(245,241,232,0.45)]">
                                        {role === "admin"
                                            ? "Administration"
                                            : role === "vendor"
                                              ? "Business"
                                              : "Your space"}
                                    </p>

                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                        {role === "user" && (
                                            <>
                                                <IslandItem
                                                    icon={User}
                                                    label="Profile"
                                                    onClick={() =>
                                                        handleNavigation(
                                                            "/app/profile",
                                                        )
                                                    }
                                                />

                                                <IslandItem
                                                    icon={Package}
                                                    label="My rentals"
                                                    onClick={() =>
                                                        handleNavigation(
                                                            "/app/rentals",
                                                        )
                                                    }
                                                />
                                            </>
                                        )}

                                        {role === "vendor" && (
                                            <>
                                                <IslandItem
                                                    icon={Store}
                                                    label="Inventory"
                                                    onClick={() =>
                                                        handleNavigation(
                                                            "/vendor/inventory",
                                                        )
                                                    }
                                                />

                                                <IslandItem
                                                    icon={Package}
                                                    label="Orders"
                                                    onClick={() =>
                                                        handleNavigation(
                                                            "/vendor/orders",
                                                        )
                                                    }
                                                />

                                                <IslandItem
                                                    icon={Compass}
                                                    label="Availability"
                                                    onClick={() =>
                                                        handleNavigation(
                                                            "/vendor/availability",
                                                        )
                                                    }
                                                />
                                            </>
                                        )}

                                        {role === "admin" && (
                                            <>
                                                <IslandItem
                                                    icon={Shield}
                                                    label="Users"
                                                    onClick={() =>
                                                        handleNavigation(
                                                            "/admin/users",
                                                        )
                                                    }
                                                />

                                                <IslandItem
                                                    icon={Store}
                                                    label="Vendors"
                                                    onClick={() =>
                                                        handleNavigation(
                                                            "/admin/vendors",
                                                        )
                                                    }
                                                />

                                                <IslandItem
                                                    icon={Package}
                                                    label="Rentals"
                                                    onClick={() =>
                                                        handleNavigation(
                                                            "/admin/rentals",
                                                        )
                                                    }
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Account */}
                                <div className="mt-5 flex items-center justify-between border-t border-[rgba(255,255,255,0.1)] pt-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-ivory)] text-[var(--color-ink)]">
                                            <User
                                                size={14}
                                                strokeWidth={1.5}
                                            />
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium">
                                                {displayName}
                                            </p>

                                            <p className="mt-0.5 text-[9px] uppercase tracking-[0.15em] text-[rgba(245,241,232,0.45)]">
                                                {role}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            aria-label="Settings"
                                            className="flex h-8 w-8 items-center justify-center rounded-full text-[rgba(245,241,232,0.55)] transition-colors hover:bg-[rgba(255,255,255,0.08)] hover:text-[var(--color-ivory)]"
                                        >
                                            <Settings
                                                size={14}
                                                strokeWidth={1.5}
                                            />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            aria-label="Log out"
                                            className="flex h-8 w-8 items-center justify-center rounded-full text-[rgba(245,241,232,0.55)] transition-colors hover:bg-[rgba(196,91,60,0.18)] hover:text-[var(--color-accent)]"
                                        >
                                            <LogOut
                                                size={14}
                                                strokeWidth={1.5}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface IslandItemProps {
    icon: typeof Home;
    label: string;
    onClick: () => void;
}

function IslandItem({
    icon: Icon,
    label,
    onClick,
}: IslandItemProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex items-center gap-3 rounded-2xl border border-transparent px-3 py-3 text-left text-[var(--color-ivory)] transition-all duration-200 hover:border-[rgba(255,255,255,0.1)] hover:bg-[var(--color-accent)]"
        >
            <Icon
                size={15}
                strokeWidth={1.5}
                className="shrink-0 text-[rgba(245,241,232,0.65)]"
            />

            <span className="text-[10px] font-medium uppercase tracking-[0.12em]">
                {label}
            </span>
        </button>
    );
}

export default RentifyIsland;