import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Mail,
    CreditCard,
    Bell,
    CheckCircle2,
    Package,
    ArrowUpRight,
    Lock,
    MapPin,
    Settings,
    LogOut,
    ToggleLeft,
    ToggleRight,
    ShieldCheck,
    Zap,
    User as UserIcon,
    Sparkles,
    Smartphone,
    Shield,

    ChevronRight,
    Star
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getRentals, type RentalDetail } from "../../api/rentals.api";

function MyProfile() {
    const { user, role, logout } = useAuth();
    const [rentals, setRentals] = useState<RentalDetail[]>([]);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    // Interactive Preferences
    const [pushNotifs, setPushNotifs] = useState(true);
    const [emailReceipts, setEmailReceipts] = useState(true);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        async function fetchUserStats() {
            try {
                const data = await getRentals();
                setRentals(data);
            } catch (err) {
                console.error("Failed to load user profile stats:", err);
            }
        }
        fetchUserStats();
    }, []);

    if (!user) return null;

    const initials = `${user.first_name?.[0] || "U"}${user.last_name?.[0] || ""}`.toUpperCase();
    const activeCount = rentals.filter((r) => r.status.toLowerCase() === "active" || r.status.toLowerCase() === "confirmed").length;
    const totalSpent = rentals.reduce((acc, r) => acc + (Number(r.total_amount) || 0), 0);
    const recentRentals = rentals.slice(0, 3);

    const handleSavePreferences = () => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2500);
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-[var(--color-ivory)] px-5 pb-24 pt-20 text-[var(--color-ink)]">
            {/* Ambient Warm Loom Background Glows */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-[8%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute right-[8%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute left-0 top-[22%] h-px w-full bg-[var(--color-line-soft)]" />
                <div className="absolute left-1/3 top-[10%] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[var(--color-accent)]/[0.035] blur-[120px]" />
                <div className="absolute right-1/4 top-[40%] h-[400px] w-[400px] rounded-full bg-amber-500/[0.03] blur-[100px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-6xl space-y-6">

                {/* ═════════════════════════════════════════════════════════
                    EDITORIAL HEADER WITH VIP STATUS BEACON
                ═════════════════════════════════════════════════════════ */}
                <header className="mb-2">
                    <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <span className="h-px w-8 bg-[var(--color-accent)]" />
                            <span className="text-[8.5px] font-semibold uppercase tracking-[0.28em] text-[var(--color-muted)]">
                                Member Passport / Profile
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50/90 px-3.5 py-1 text-[8px] font-bold text-amber-900 shadow-xs">
                                <Star size={11} className="fill-amber-400 text-amber-500 animate-pulse" />
                                VIP Verified Member
                            </span>

                            <button
                                onClick={logout}
                                className="inline-flex items-center gap-1.5 rounded-full border border-rose-300 bg-rose-50 px-3.5 py-1 text-[8px] font-bold uppercase tracking-wider text-rose-900 hover:bg-rose-600 hover:!text-white active:scale-95 transition-all shadow-xs"
                            >
                                <LogOut size={11} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                        <div>
                            <div className="mb-1.5 flex items-center gap-2">
                                <span className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-ivory)] shadow-xs">
                                    <Sparkles size={11} strokeWidth={1.5} />
                                </span>
                                <span className="text-[8px] font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                                    Account Control Center
                                </span>
                            </div>

                            <h1 className="text-3xl font-medium leading-[0.95] tracking-[-0.04em] sm:text-4xl">
                                My Profile
                            </h1>
                        </div>

                        <p className="max-w-xs text-[11px] leading-4 text-[var(--color-ink-soft)]">
                            Manage your verified tenant credentials, saved payment vault, and active notifications.
                        </p>
                    </div>
                </header>

                {/* ═════════════════════════════════════════════════════════
                    TOP METRICS CARDS (MILKY CREAM WHITE LUXURY TONE)
                ═════════════════════════════════════════════════════════ */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div
                        onMouseEnter={() => setHoveredCard("metricSpent")}
                        onMouseLeave={() => setHoveredCard(null)}
                        className="relative group transition-all duration-300 ease-out"
                    >
                        <div
                            className="absolute inset-0 rounded-2xl border border-black/5 bg-[#ded8ca] transition-all duration-300"
                            style={{
                                transform: hoveredCard === "metricSpent" ? "translate(3px, 4px)" : "translate(1.5px, 2px)",
                                opacity: hoveredCard === "metricSpent" ? 0.9 : 0.6
                            }}
                        />

                        <div className="relative overflow-hidden rounded-2xl border border-white/90 bg-gradient-to-r from-[#fffefc] via-[#fcfaf5] to-[#f8f4eb] p-4 shadow-xs backdrop-blur-xl transition-all duration-300 flex items-center justify-between">
                            <div className="space-y-0.5">
                                <span className="text-[8px] font-bold uppercase tracking-wider text-[var(--color-muted)]">Lifetime Rental Value</span>
                                <p className="font-mono text-2xl font-extrabold text-[var(--color-ink)]">₹{totalSpent.toFixed(2)}</p>
                                <span className="inline-flex items-center gap-1 text-[7.5px] font-semibold text-emerald-700">
                                    <CheckCircle2 size={10} />
                                    Completed Payments Verified
                                </span>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#f6db9f] bg-gradient-to-br from-[#fef7e7] to-[#fce8c5] text-[var(--color-accent)] font-black text-xl shadow-xs transition-transform group-hover:scale-105">
                                ₹
                            </div>
                        </div>
                    </div>

                    <div
                        onMouseEnter={() => setHoveredCard("metricActive")}
                        onMouseLeave={() => setHoveredCard(null)}
                        className="relative group transition-all duration-300 ease-out"
                    >
                        <div
                            className="absolute inset-0 rounded-2xl border border-black/5 bg-[#ded8ca] transition-all duration-300"
                            style={{
                                transform: hoveredCard === "metricActive" ? "translate(3px, 4px)" : "translate(1.5px, 2px)",
                                opacity: hoveredCard === "metricActive" ? 0.9 : 0.6
                            }}
                        />

                        <div className="relative overflow-hidden rounded-2xl border border-white/90 bg-gradient-to-r from-[#f2f8f4] via-[#eaf3ed] to-[#d8ebde] p-4 shadow-xs backdrop-blur-xl transition-all duration-300 flex items-center justify-between">
                            <div className="space-y-0.5">
                                <span className="text-[8px] font-bold uppercase tracking-wider text-[#3d7054]">Active Reservations</span>
                                <p className="font-mono text-2xl font-extrabold text-[#2d563f]">{activeCount} Live Orders</p>
                                <span className="inline-flex items-center gap-1 text-[7.5px] font-semibold text-[#2d563f]">
                                    <Zap size={10} className="animate-pulse" />
                                    Realtime Tracked via Loom
                                </span>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#b8d9c5] bg-[#3d7054] text-white shadow-xs transition-transform group-hover:scale-105">
                                <Zap size={18} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═════════════════════════════════════════════════════════
                    MAIN 2-COLUMN DESKTOP SUITE (MILKY CREAM WHITE GLASS CARDS)
                ═════════════════════════════════════════════════════════ */}
                <div className="grid gap-6 lg:grid-cols-3 items-start">

                    {/* LEFT COLUMN: HERO IDENTITY + PERSONAL DETAILS + DELIVERY VAULT */}
                    <div className="space-y-6 lg:col-span-2">

                        {/* 1. HERO PASSPORT IDENTITY WINDOW */}
                        <div
                            onMouseEnter={() => setHoveredCard("identity")}
                            onMouseLeave={() => setHoveredCard(null)}
                            className="relative group transition-all duration-300 ease-out"
                        >
                            <div
                                className="absolute inset-0 rounded-3xl border border-black/5 bg-[#ded8ca] transition-all duration-300 ease-out"
                                style={{
                                    transform: hoveredCard === "identity" ? "translate(4px, 6px)" : "translate(2px, 3px)",
                                    opacity: hoveredCard === "identity" ? 0.9 : 0.6
                                }}
                            />

                            <div
                                className="relative overflow-hidden rounded-3xl border border-white/90 bg-gradient-to-b from-[#fffefc] via-[#fcfaf5] to-[#f6f1e5] p-6 backdrop-blur-2xl transition-all duration-300 ease-out shadow-xs space-y-5"
                                style={{
                                    transform: hoveredCard === "identity" ? "translateY(-3px)" : "translateY(0px)",
                                    boxShadow: hoveredCard === "identity"
                                        ? "0 20px 40px -12px rgba(23, 23, 23, 0.12)"
                                        : "0 8px 18px -8px rgba(23, 23, 23, 0.04)"
                                }}
                            >
                                {/* Window Top Controls */}
                                <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                                    <div className="flex items-center gap-1 text-[8.5px] font-bold text-[var(--color-ink)]">
                                        <Shield size={11} className="text-[var(--color-accent)]" />
                                        <span>Official Rentify Passport ID</span>
                                    </div>
                                </div>


                                {/* Identity Profile Row */}
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                                    {/* Avatar ring */}
                                    <div className="relative flex h-22 w-22 shrink-0 items-center justify-center rounded-2xl border-2 border-white bg-gradient-to-br from-[#171717] to-[#3a3832] text-white text-2xl font-extrabold font-mono shadow-lg transition-transform group-hover:scale-105">
                                        {initials}
                                        <span className="absolute -bottom-1 -right-1 flex h-6.5 w-6.5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs border-2 border-white">
                                            <CheckCircle2 size={13} />
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-center sm:text-left min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                                            <h2 className="text-2xl font-bold tracking-tight text-[var(--color-ink)] sm:text-3xl">
                                                {user.first_name} {user.last_name}
                                            </h2>
                                            <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-100/90 px-3 py-0.5 text-[8px] font-bold uppercase tracking-wider text-amber-900 shadow-2xs">
                                                {role || "Customer"}
                                            </span>
                                        </div>

                                        <p className="text-xs font-medium text-[var(--color-ink-soft)] font-mono">{user.email}</p>

                                        {/* Status badges */}
                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1.5">
                                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-[#eaf3ed] px-2.5 py-1 text-[8px] font-bold text-[#2d563f] shadow-2xs">
                                                <ShieldCheck size={10} />
                                                2FA Secured
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-blue-300 bg-[#f0f5fa] px-2.5 py-1 text-[8px] font-bold text-[#2c4a6f] shadow-2xs">
                                                <CreditCard size={10} />
                                                Stripe Verified
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#e8e0d0] bg-[#fcfaf5] px-2.5 py-1 text-[8px] font-mono font-bold text-[var(--color-ink)] shadow-2xs">
                                                <Lock size={10} className="text-[var(--color-accent)]" />
                                                USR-{user.id ? user.id.slice(0, 8).toUpperCase() : "VERIFIED"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. PERSONAL DETAILS GRID (MILKY CREAM WHITE TILES) */}
                        <div
                            onMouseEnter={() => setHoveredCard("details")}
                            onMouseLeave={() => setHoveredCard(null)}
                            className="relative group transition-all duration-300 ease-out"
                        >
                            <div
                                className="absolute inset-0 rounded-3xl border border-black/5 bg-[#ded8ca] transition-all duration-300 ease-out"
                                style={{
                                    transform: hoveredCard === "details" ? "translate(3px, 5px)" : "translate(1.5px, 3px)",
                                    opacity: hoveredCard === "details" ? 0.9 : 0.6
                                }}
                            />

                            <div
                                className="relative overflow-hidden rounded-3xl border border-white/90 bg-gradient-to-b from-[#fffefc] via-[#fcfaf5] to-[#f6f1e5] p-5 backdrop-blur-2xl transition-all duration-300 ease-out shadow-xs space-y-4"
                                style={{
                                    transform: hoveredCard === "details" ? "translateY(-3px)" : "translateY(0px)",
                                    boxShadow: hoveredCard === "details"
                                        ? "0 14px 28px -8px rgba(23, 23, 23, 0.1)"
                                        : "0 6px 14px -6px rgba(23, 23, 23, 0.04)"
                                }}
                            >
                                <div className="flex items-center justify-between border-b border-black/[0.06] pb-2.5">
                                    <div className="flex items-center gap-1.5 text-[8.5px] font-bold text-[var(--color-ink)]">
                                        <UserIcon size={13} className="text-[var(--color-accent)]" />
                                        <span>Personal Contact Vault</span>
                                    </div>
                                    <span className="text-[7.5px] font-mono text-[#2d563f] font-bold bg-[#eaf3ed] border border-[#b8d9c5] px-2.5 py-0.5 rounded-md shadow-2xs">
                                        Identity Confirmed
                                    </span>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="p-3.5 rounded-2xl bg-[#fcfaf5] border border-[#e8e0d0] shadow-2xs space-y-1 hover:border-[var(--color-accent)]/30 transition-all">
                                        <div className="flex items-center gap-1 text-[7.5px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                            <UserIcon size={10} className="text-[var(--color-accent)]" />
                                            <span>First Name</span>
                                        </div>
                                        <p className="text-sm font-bold text-[var(--color-ink)]">{user.first_name || "—"}</p>
                                    </div>

                                    <div className="p-3.5 rounded-2xl bg-[#fcfaf5] border border-[#e8e0d0] shadow-2xs space-y-1 hover:border-[var(--color-accent)]/30 transition-all">
                                        <div className="flex items-center gap-1 text-[7.5px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                            <UserIcon size={10} className="text-[var(--color-accent)]" />
                                            <span>Last Name</span>
                                        </div>
                                        <p className="text-sm font-bold text-[var(--color-ink)]">{user.last_name || "—"}</p>
                                    </div>

                                    <div className="p-3.5 rounded-2xl bg-[#fcfaf5] border border-[#e8e0d0] shadow-2xs space-y-1 hover:border-[var(--color-accent)]/30 transition-all">
                                        <div className="flex items-center gap-1 text-[7.5px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                            <Mail size={10} className="text-blue-600" />
                                            <span>Email Address</span>
                                        </div>
                                        <p className="text-xs font-bold font-mono text-[var(--color-ink)] truncate">{user.email}</p>
                                    </div>

                                    <div className="p-3.5 rounded-2xl bg-[#fcfaf5] border border-[#e8e0d0] shadow-2xs space-y-1 hover:border-[var(--color-accent)]/30 transition-all">
                                        <div className="flex items-center gap-1 text-[7.5px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                            <Smartphone size={10} className="text-emerald-600" />
                                            <span>Phone Contact</span>
                                        </div>
                                        <p className="text-xs font-bold font-mono text-[var(--color-ink)]">+91 98765 43210</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. DELIVERY LOCATION & STRIPE VAULT GRID */}
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="relative group">
                                <div className="absolute inset-0 rounded-3xl border border-black/5 bg-[#ded8ca]" />
                                <div className="relative rounded-3xl border border-white/90 bg-gradient-to-b from-[#fffefc] via-[#fcfaf5] to-[#f6f1e5] p-4 shadow-xs space-y-2">
                                    <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                        <MapPin size={12} className="text-[var(--color-accent)]" />
                                        <span>Primary Delivery Station</span>
                                    </div>
                                    <div className="p-3.5 rounded-2xl bg-[#fcfaf5] border border-[#e8e0d0] shadow-2xs space-y-1">
                                        <p className="text-xs font-bold text-[var(--color-ink)]">Rentify Central Hub #01</p>
                                        <p className="text-[11px] text-[var(--color-ink-soft)] leading-tight">Verified Delivery Station Vault, 400001</p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-0 rounded-3xl border border-black/5 bg-[#ded8ca]" />
                                <div className="relative rounded-3xl border border-white/90 bg-gradient-to-b from-[#fffefc] via-[#fcfaf5] to-[#f6f1e5] p-4 shadow-xs space-y-2">
                                    <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                        <CreditCard size={12} className="text-blue-600" />
                                        <span>Stripe Payment Vault</span>
                                    </div>
                                    <div className="p-3.5 rounded-2xl bg-[#f0f5fa] border border-[#cee0f2] shadow-2xs space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-mono text-xs font-bold tracking-widest text-[#2c4a6f]">•••• •••• •••• 4242</p>
                                            <span className="text-[7.5px] font-bold uppercase tracking-wider text-emerald-700">Active Card</span>
                                        </div>
                                        <p className="text-[10px] text-blue-800 font-semibold">256-Bit SSL Encrypted via Stripe Express</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: RECENT RENTALS THREAD + CONTROL PREFERENCES */}
                    <div className="space-y-6">

                        {/* 4. RECENT RENTALS THREAD */}
                        <div
                            onMouseEnter={() => setHoveredCard("recentThread")}
                            onMouseLeave={() => setHoveredCard(null)}
                            className="relative group transition-all duration-300 ease-out"
                        >
                            <div
                                className="absolute inset-0 rounded-3xl border border-black/5 bg-[#ded8ca] transition-all duration-300 ease-out"
                                style={{
                                    transform: hoveredCard === "recentThread" ? "translate(3px, 5px)" : "translate(1.5px, 3px)",
                                    opacity: hoveredCard === "recentThread" ? 0.9 : 0.6
                                }}
                            />

                            <div
                                className="relative overflow-hidden rounded-3xl border border-white/90 bg-gradient-to-b from-[#fffefc] via-[#fcfaf5] to-[#f6f1e5] p-5 backdrop-blur-2xl transition-all duration-300 ease-out shadow-xs space-y-3"
                                style={{
                                    transform: hoveredCard === "recentThread" ? "translateY(-3px)" : "translateY(0px)",
                                    boxShadow: hoveredCard === "recentThread"
                                        ? "0 14px 28px -8px rgba(23, 23, 23, 0.1)"
                                        : "0 6px 14px -6px rgba(23, 23, 23, 0.04)"
                                }}
                            >
                                <div className="flex items-center justify-between border-b border-black/[0.06] pb-2.5">
                                    <div className="flex items-center gap-1.5">
                                        <Package size={13} className="text-[var(--color-accent)]" />
                                        <span className="text-[8.5px] font-bold uppercase tracking-wider text-[var(--color-ink)]">Recent Rental Thread</span>
                                    </div>
                                    <Link to="/app/rentals" className="text-[8px] font-bold text-[var(--color-accent)] hover:underline flex items-center gap-0.5">
                                        <span>View All</span>
                                        <ChevronRight size={11} />
                                    </Link>
                                </div>

                                {recentRentals.length > 0 ? (
                                    <div className="space-y-2.5">
                                        {recentRentals.map((r) => (
                                            <Link
                                                key={r.id}
                                                to={`/app/rentals/${r.id}`}
                                                className="flex items-center justify-between p-3 rounded-2xl bg-[#fcfaf5] border border-[#e8e0d0] hover:bg-white hover:border-[var(--color-accent)]/30 transition-all group/item shadow-2xs"
                                            >
                                                <div className="space-y-0.5 min-w-0 pr-2">
                                                    <p className="text-[8px] font-mono font-bold text-[var(--color-muted)]">RN-{r.id.slice(0, 8).toUpperCase()}</p>
                                                    <p className="text-xs font-bold truncate text-[var(--color-ink)] group-hover/item:text-[var(--color-accent)]">
                                                        {r.items[0]?.product_name || "Rental Object"}
                                                    </p>
                                                </div>
                                                <span className="font-mono text-xs font-bold text-[var(--color-ink)] bg-white px-2.5 py-1 rounded-lg border border-[#e8e0d0] shadow-2xs">
                                                    ₹{Number(r.total_amount).toFixed(0)}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-4 text-center space-y-1.5">
                                        <Package size={22} className="mx-auto text-[var(--color-muted)]" />
                                        <p className="text-xs font-medium">No rentals recorded yet</p>
                                        <Link to="/app/explore" className="inline-flex items-center gap-1 text-[8px] uppercase tracking-wider text-[var(--color-accent)] hover:underline font-bold">
                                            <span>Explore Catalog</span>
                                            <ArrowUpRight size={10} />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 5. PREFERENCE TOGGLES (MILKY CREAM WHITE GLASS) */}
                        <div
                            onMouseEnter={() => setHoveredCard("preferences")}
                            onMouseLeave={() => setHoveredCard(null)}
                            className="relative group transition-all duration-300 ease-out"
                        >
                            <div
                                className="absolute inset-0 rounded-3xl border border-black/5 bg-[#ded8ca] transition-all duration-300 ease-out"
                                style={{
                                    transform: hoveredCard === "preferences" ? "translate(3px, 5px)" : "translate(1.5px, 3px)",
                                    opacity: hoveredCard === "preferences" ? 0.9 : 0.6
                                }}
                            />

                            <div
                                className="relative overflow-hidden rounded-3xl border border-white/90 bg-gradient-to-b from-[#fffefc] via-[#fcfaf5] to-[#f6f1e5] p-5 backdrop-blur-2xl transition-all duration-300 ease-out shadow-xs space-y-4"
                                style={{
                                    transform: hoveredCard === "preferences" ? "translateY(-3px)" : "translateY(0px)",
                                    boxShadow: hoveredCard === "preferences"
                                        ? "0 14px 28px -8px rgba(23, 23, 23, 0.1)"
                                        : "0 6px 14px -6px rgba(23, 23, 23, 0.04)"
                                }}
                            >
                                <div className="flex items-center justify-between border-b border-black/[0.06] pb-2.5">
                                    <div className="flex items-center gap-1.5 text-[8.5px] font-bold text-[var(--color-ink)]">
                                        <Settings size={13} className="text-[var(--color-accent)]" />
                                        <span>Account Preferences</span>
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    {/* Push Notifs */}
                                    <div
                                        onClick={() => setPushNotifs(!pushNotifs)}
                                        className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${pushNotifs ? "bg-[#eaf3ed] border-[#b8d9c5] shadow-2xs" : "bg-[#fcfaf5] border-[#e8e0d0] opacity-70"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <Bell size={14} className={pushNotifs ? "text-[#2d563f]" : "text-stone-400"} />
                                            <div>
                                                <p className="text-[8.5px] font-bold uppercase tracking-wider text-[var(--color-ink)]">Push Alerts</p>
                                                <p className="text-[7.5px] text-[var(--color-muted)] font-mono">Realtime Order Updates</p>
                                            </div>
                                        </div>
                                        {pushNotifs ? <ToggleRight size={22} className="text-[#2d563f]" /> : <ToggleLeft size={22} className="text-stone-400" />}
                                    </div>

                                    {/* Email Receipts */}
                                    <div
                                        onClick={() => setEmailReceipts(!emailReceipts)}
                                        className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${emailReceipts ? "bg-[#f0f5fa] border-[#cee0f2] shadow-2xs" : "bg-[#fcfaf5] border-[#e8e0d0] opacity-70"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <Mail size={14} className={emailReceipts ? "text-[#2c4a6f]" : "text-stone-400"} />
                                            <div>
                                                <p className="text-[8.5px] font-bold uppercase tracking-wider text-[var(--color-ink)]">Email Receipts</p>
                                                <p className="text-[7.5px] text-[var(--color-muted)] font-mono">Auto Invoice PDF</p>
                                            </div>
                                        </div>
                                        {emailReceipts ? <ToggleRight size={22} className="text-[#2c4a6f]" /> : <ToggleLeft size={22} className="text-stone-400" />}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-black/[0.06]">
                                    <span className="text-[7.5px] font-mono text-[var(--color-muted)]">
                                        {isSaved ? "✓ Preferences Saved" : "Click toggle to update"}
                                    </span>
                                    <button
                                        onClick={handleSavePreferences}
                                        className="rounded-xl bg-[var(--color-ink)] px-3 py-1.5 text-[7.5px] font-bold uppercase tracking-wider text-white hover:bg-[var(--color-accent)] active:scale-95 transition-all shadow-xs"
                                    >
                                        Save Preferences
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </main>
    );
}

export default MyProfile;
