import { useState } from "react";
import logo from "../../assets/logo.jpg";
import {
    Boxes,
    CreditCard,
    Home,
    LogOut,
    Menu,
    Package,
    ShoppingBag,
    Users,
    X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function RentifyIsland3() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false);

    const displayName = user
        ? `${user.first_name} ${user.last_name}`.trim()
        : "Admin Superuser";

    function handleNavigation(path: string) {
        navigate(path);
        setIsExpanded(false);
    }

    function handleLogout() {
        logout();
        navigate("/login", { replace: true });
    }

    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-[rgba(23,23,23,0.16)] backdrop-blur-[6px] transition-all duration-500 ${
                    isExpanded ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
                }`}
                onClick={() => setIsExpanded(false)}
            />

            <div className="pointer-events-none fixed left-0 right-0 top-5 z-50 flex justify-center px-4">
                <div className={`pointer-events-auto w-full transition-all duration-500 ${isExpanded ? "max-w-2xl" : "max-w-[430px]"}`}>
                    <div className="overflow-hidden rounded-[2rem] border border-[rgba(255,255,255,0.12)] bg-[var(--color-ink)] text-[var(--color-ivory)] shadow-[0_22px_60px_rgba(23,23,23,0.24)]">
                        {/* Compact Header Bar */}
                        <div className="flex h-14 items-center justify-between px-5">
                            <button type="button" onClick={() => setIsExpanded(!isExpanded)} className="flex items-center gap-3">
                                <img src={logo} alt="Rentify Logo" className="h-5 w-auto" />
                                <span className="text-xs font-semibold tracking-[-0.01em]">RENTIFY</span>
                            </button>

                            <div className="hidden items-center gap-2 sm:flex">
                                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                                <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-[rgba(245,241,232,0.55)]">ADMIN</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <button type="button" onClick={() => setIsExpanded(!isExpanded)} className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-ivory)] text-[var(--color-ink)]">
                                    {isExpanded ? <X size={15} /> : <Menu size={15} />}
                                </button>
                            </div>
                        </div>

                        {/* Expanded Menu */}
                        <div className={`grid transition-all duration-500 ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                            <div className="min-h-0 overflow-hidden">
                                <div className="border-t border-[rgba(255,255,255,0.1)] px-5 pb-5 pt-4">
                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                        <IslandItem icon={Home} label="Admin" onClick={() => handleNavigation("/admin")} />
                                        <IslandItem icon={Users} label="Users" onClick={() => handleNavigation("/admin/users")} />
                                        <IslandItem icon={Package} label="Catalog" onClick={() => handleNavigation("/admin/products")} />
                                        <IslandItem icon={ShoppingBag} label="Rentals" onClick={() => handleNavigation("/admin/rentals")} />
                                        <IslandItem icon={CreditCard} label="Payments" onClick={() => handleNavigation("/admin/payments")} />
                                        <IslandItem icon={Boxes} label="Stock" onClick={() => handleNavigation("/admin/inventory")} />
                                    </div>

                                    <div className="mt-5 flex items-center justify-between border-t border-[rgba(255,255,255,0.1)] pt-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-ivory)] text-[var(--color-ink)] font-bold text-xs">
                                                {user?.first_name?.[0] || "A"}
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium">{displayName}</p>
                                                <p className="text-[9px] uppercase tracking-[0.15em] text-[rgba(245,241,232,0.45)]">Admin Superuser</p>
                                            </div>
                                        </div>

                                        <button type="button" onClick={handleLogout} className="flex h-8 w-8 items-center justify-center rounded-full text-[rgba(245,241,232,0.55)] transition-colors hover:bg-[rgba(196,91,60,0.18)] hover:text-[var(--color-accent)]">
                                            <LogOut size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function IslandItem({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) {
    return (
        <button type="button" onClick={onClick} className="flex items-center gap-3 rounded-2xl border border-transparent px-3 py-3 text-left text-[var(--color-ivory)] hover:border-[rgba(255,255,255,0.1)] hover:bg-[var(--color-accent)] transition-all">
            <Icon size={15} className="shrink-0 text-[rgba(245,241,232,0.65)]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.12em]">{label}</span>
        </button>
    );
}

export default RentifyIsland3;
