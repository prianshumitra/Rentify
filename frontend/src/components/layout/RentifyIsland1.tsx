import { useState } from "react";
import logo from "../../assets/logo.jpg";
import {
    Bell,
    Compass,
    Home,
    LogOut,
    Menu,
    Package,
    X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function RentifyIsland1() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false);

    const displayName = user
        ? `${user.first_name} ${user.last_name}`.trim()
        : "Customer";

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
                    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[var(--color-ink)] text-[var(--color-ivory)] shadow-2xl">
                        {/* Compact Header Bar */}
                        <div className="flex h-14 items-center justify-between px-5">
                            <button type="button" onClick={() => setIsExpanded(!isExpanded)} className="flex items-center gap-3">
                                <img src={logo} alt="Rentify" className="h-5 w-auto" />
                                <span className="text-xs font-semibold tracking-tight">RENTIFY</span>
                            </button>

                            <div className="hidden items-center gap-2 sm:flex">
                                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                                <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/60">CUSTOMER</span>
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
                                <div className="border-t border-white/10 px-5 pb-5 pt-4">
                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                        <IslandItem icon={Home} label="Home" onClick={() => handleNavigation("/app")} />
                                        <IslandItem icon={Compass} label="Explore" onClick={() => handleNavigation("/app/explore")} />
                                        <IslandItem icon={Package} label="Rentals" onClick={() => handleNavigation("/app/rentals")} />
                                        <IslandItem icon={Bell} label="Activity" onClick={() => handleNavigation("/app/activity")} />
                                    </div>

                                    <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black font-bold text-xs">
                                                {user?.first_name?.[0] || "C"}
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium">{displayName}</p>
                                                <p className="text-[9px] uppercase tracking-wider text-white/50">Customer Space</p>
                                            </div>
                                        </div>

                                        <button type="button" onClick={handleLogout} className="flex h-8 w-8 items-center justify-center rounded-full text-rose-400 hover:bg-rose-950/40">
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
        <button type="button" onClick={onClick} className="flex items-center gap-3 rounded-2xl border border-transparent px-3 py-3 text-left hover:border-white/10 hover:bg-[var(--color-accent)] transition-all">
            <Icon size={15} className="shrink-0 text-white/60" />
            <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
        </button>
    );
}

export default RentifyIsland1;
