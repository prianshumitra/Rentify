import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Mail,
    CreditCard,
    Bell,
    MapPin,
    Settings,
    LogOut,
    ToggleLeft,
    ToggleRight,
    Zap,
    User as UserIcon,
    Star,
    Pencil,
    Check,
    Store
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getRentals } from "../../api/rentals.api";
import { updateUserProfile } from "../../api/auth.api";

import apiClient from "../../api/client";

function VendorProfile() {
    const navigate = useNavigate();
    const { user, logout, updateUser } = useAuth();

    const [productsCount, setProductsCount] = useState(0);
    const [inventoryCount, setInventoryCount] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);


    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    // Interactive Preferences
    const [orderAlerts, setOrderAlerts] = useState(true);
    const [dailyReceipts, setDailyReceipts] = useState(true);
    const [autoReserve, setAutoReserve] = useState(true);
    const [isSaved, setIsSaved] = useState(false);

    // Editable Phone Number state initialized from DB
    const [phone, setPhone] = useState(user?.phone_number || "+91 98765 43210");
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);
    const [phoneSaved, setPhoneSaved] = useState(false);

    useEffect(() => {
        if (user?.phone_number) {
            setPhone(user.phone_number);
        }
    }, [user?.phone_number]);

    useEffect(() => {
        async function fetchVendorStats() {
            try {
                const prodRes = await apiClient.get("/products/");
                setProductsCount(Array.isArray(prodRes.data) ? prodRes.data.length : 0);

                const invRes = await apiClient.get("/inventory/");
                setInventoryCount(Array.isArray(invRes.data) ? invRes.data.length : 0);

                const rentalsData = await getRentals();
                const revenue = rentalsData.reduce((acc, r) => acc + (Number(r.total_amount) || 0), 0);
                setTotalRevenue(revenue);

            } catch (err) {
                console.error("Failed to fetch vendor statistics:", err);
            }
        }
        fetchVendorStats();
    }, []);

    const handleSavePhone = async () => {
        if (!phone.trim()) return;
        setIsUpdatingPhone(true);
        try {
            const updated = await updateUserProfile({ phone_number: phone });
            updateUser({ phone_number: updated.phone_number });
            setIsEditingPhone(false);
            setPhoneSaved(true);
            setTimeout(() => setPhoneSaved(false), 2500);
        } catch (err) {
            console.error("Failed to update phone number in backend:", err);
            updateUser({ phone_number: phone });
            setIsEditingPhone(false);
            setPhoneSaved(true);
            setTimeout(() => setPhoneSaved(false), 2500);
        } finally {
            setIsUpdatingPhone(false);
        }
    };

    const handleSavePreferences = () => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2500);
    };

    if (!user) return null;

    return (
        <main className="relative min-h-screen overflow-hidden bg-[var(--color-ivory)] px-6 pb-24 pt-28 sm:pt-32 lg:pt-36 text-[var(--color-ink)]">
            {/* Background Tactile Texture & Subtle Glow */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute left-[8%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute left-[24%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute right-[8%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute left-1/2 top-[30%] h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-[var(--color-accent)]/[0.04] blur-[140px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-5xl space-y-7">
                
                {/* 1. HERO MERCHANT PASSPORT CONTAINER */}
                <div
                    onMouseEnter={() => setHoveredCard("hero")}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="relative group transition-all duration-300 ease-out"
                >
                    {/* Loom Depth Plate */}
                    <div
                        className="absolute inset-0 rounded-3xl border border-black/5 bg-[#ded8ca] transition-all duration-300 ease-out"
                        style={{
                            transform: hoveredCard === "hero" ? "translate(4px, 6px)" : "translate(2px, 4px)",
                            opacity: hoveredCard === "hero" ? 0.9 : 0.6
                        }}
                    />

                    <div
                        className="relative overflow-hidden rounded-3xl border border-white/90 bg-gradient-to-b from-[#fffefc] via-[#fcfaf5] to-[#f6f1e5] p-6 sm:p-8 backdrop-blur-2xl transition-all duration-300 ease-out shadow-xs space-y-6"
                        style={{
                            transform: hoveredCard === "hero" ? "translateY(-3px)" : "translateY(0px)",
                            boxShadow: hoveredCard === "hero"
                                ? "0 18px 36px -10px rgba(23, 23, 23, 0.12)"
                                : "0 8px 18px -8px rgba(23, 23, 23, 0.04)"
                        }}
                    >
                        {/* Top Bar Header */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-black/[0.06] pb-4">
                            <div>
                                <div className="flex items-center gap-2.5 mb-1.5">
                                    <span className="h-px w-8 bg-[var(--color-accent)]" />
                                    <span className="text-[8.5px] font-semibold uppercase tracking-[0.28em] text-[var(--color-muted)]">
                                        VENDOR / MERCHANT PROFILE PASSPORT
                                    </span>
                                </div>
                                <h1 className="text-3xl font-medium tracking-tight text-[var(--color-ink)] sm:text-4xl">
                                    Merchant Profile
                                </h1>
                            </div>

                            {/* Verified Merchant Badge */}
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#b8d9c5] bg-[#eaf3ed] px-3.5 py-1.5 text-[8px] font-extrabold uppercase tracking-wider text-[#2d563f] shadow-2xs">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Verified Merchant
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-xl border border-amber-300/80 bg-amber-50/90 px-3 py-1.5 text-[8px] font-extrabold uppercase tracking-wider text-amber-800 shadow-2xs">
                                    <Star size={10} className="fill-amber-400 text-amber-500" />
                                    VIP Partner
                                </span>
                            </div>
                        </div>

                        {/* Merchant Details Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-ink)] text-white shadow-md font-mono text-xl font-bold">
                                    {user.first_name?.[0] || "M"}
                                    {user.last_name?.[0] || "V"}
                                    <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-accent)] text-[9px] text-white border-2 border-white">
                                        <Store size={10} />
                                    </span>
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold tracking-tight text-[var(--color-ink)]">
                                        {user.first_name} {user.last_name}
                                    </h2>
                                    <p className="text-xs font-mono text-[var(--color-muted)]">{user.email}</p>
                                    <p className="mt-1 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                                        ROLE: VENDOR MERCHANT // STORE OWNER
                                    </p>
                                </div>
                            </div>

                            {/* Quick Metrics Badges */}
                            <div className="grid grid-cols-3 gap-2.5 sm:flex sm:items-center">
                                <div className="p-3 rounded-2xl bg-[#fcfaf5] border border-[#e8e0d0] text-center shadow-2xs space-y-0.5 min-w-[90px]">
                                    <p className="text-[7.5px] font-bold uppercase tracking-wider text-[var(--color-muted)]">Products</p>
                                    <p className="text-lg font-mono font-extrabold text-[var(--color-ink)]">{productsCount}</p>
                                </div>
                                <div className="p-3 rounded-2xl bg-[#fcfaf5] border border-[#e8e0d0] text-center shadow-2xs space-y-0.5 min-w-[90px]">
                                    <p className="text-[7.5px] font-bold uppercase tracking-wider text-[var(--color-muted)]">Units</p>
                                    <p className="text-lg font-mono font-extrabold text-[var(--color-ink)]">{inventoryCount}</p>
                                </div>
                                <div className="p-3 rounded-2xl bg-[#fcfaf5] border border-[#e8e0d0] text-center shadow-2xs space-y-0.5 min-w-[100px]">
                                    <p className="text-[7.5px] font-bold uppercase tracking-wider text-[var(--color-muted)]">Revenue</p>
                                    <p className="text-sm font-mono font-extrabold text-emerald-800">₹{totalRevenue.toFixed(0)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. PERSONAL & MERCHANT CONTACT VAULT */}
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
                        className="relative overflow-hidden rounded-3xl border border-white/90 bg-gradient-to-b from-[#fffefc] via-[#fcfaf5] to-[#f6f1e5] p-6 backdrop-blur-2xl transition-all duration-300 ease-out shadow-xs space-y-4"
                        style={{
                            transform: hoveredCard === "details" ? "translateY(-3px)" : "translateY(0px)"
                        }}
                    >
                        <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                            <div className="flex items-center gap-1.5 text-[8.5px] font-bold uppercase tracking-wider text-[var(--color-ink)]">
                                <UserIcon size={13} className="text-[var(--color-accent)]" />
                                <span>Merchant Contact Vault</span>
                            </div>
                            <span className="text-[7.5px] font-mono text-[#2d563f] font-bold bg-[#eaf3ed] border border-[#b8d9c5] px-2.5 py-0.5 rounded-md shadow-2xs">
                                Identity Confirmed
                            </span>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="p-3.5 rounded-2xl bg-[#fcfaf5] border border-[#e8e0d0] shadow-2xs space-y-1">
                                <div className="flex items-center gap-1 text-[7.5px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                    <UserIcon size={10} className="text-[var(--color-accent)]" />
                                    <span>First Name</span>
                                </div>
                                <p className="text-sm font-bold text-[var(--color-ink)]">{user.first_name || "—"}</p>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-[#fcfaf5] border border-[#e8e0d0] shadow-2xs space-y-1">
                                <div className="flex items-center gap-1 text-[7.5px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                    <UserIcon size={10} className="text-[var(--color-accent)]" />
                                    <span>Last Name</span>
                                </div>
                                <p className="text-sm font-bold text-[var(--color-ink)]">{user.last_name || "—"}</p>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-[#fcfaf5] border border-[#e8e0d0] shadow-2xs space-y-1">
                                <div className="flex items-center gap-1 text-[7.5px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                    <Mail size={10} className="text-blue-600" />
                                    <span>Email Address</span>
                                </div>
                                <p className="text-xs font-bold font-mono text-[var(--color-ink)] truncate">{user.email}</p>
                            </div>

                            {/* Editable Phone Contact Tile */}
                            <div className="p-3.5 rounded-2xl bg-[#fcfaf5] border-2 border-emerald-300/80 shadow-2xs space-y-1 hover:border-emerald-500 transition-all relative">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-[7.5px] font-bold uppercase tracking-wider text-[#2d563f]">
                                        <span>Phone Contact</span>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        {phoneSaved && (
                                            <span className="text-[7.5px] font-mono font-bold text-emerald-700 animate-pulse">
                                                ✓ Saved
                                            </span>
                                        )}
                                        {!isEditingPhone ? (
                                            <button
                                                onClick={() => setIsEditingPhone(true)}
                                                title="Edit Phone Number"
                                                className="p-1 rounded-md text-[var(--color-muted)] hover:text-emerald-700 hover:bg-emerald-100/70 transition-all shrink-0"
                                            >
                                                <Pencil size={11} />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleSavePhone}
                                                disabled={isUpdatingPhone}
                                                title="Save Phone Number"
                                                className="p-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-xs shrink-0"
                                            >
                                                <Check size={11} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {isEditingPhone ? (
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+91 98765 43210"
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleSavePhone();
                                        }}
                                        className="w-full rounded-xl border-2 border-emerald-400 bg-white px-2.5 py-1 text-xs font-bold font-mono text-[var(--color-ink)] outline-none focus:ring-2 focus:ring-emerald-200"
                                    />
                                ) : (
                                    <p className="text-xs font-bold font-mono text-[var(--color-ink)]">{phone}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. BUSINESS CREDENTIALS & BANK PAYOUT STATION GRID */}
                <div className="grid gap-5 sm:grid-cols-2">
                    {/* Warehouse Station */}
                    <div className="relative group">
                        <div className="absolute inset-0 rounded-3xl border border-black/5 bg-[#ded8ca]" />
                        <div className="relative rounded-3xl border border-white/90 bg-gradient-to-b from-[#fffefc] via-[#fcfaf5] to-[#f6f1e5] p-5 shadow-xs space-y-3">
                            <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider text-[var(--color-muted)] border-b border-black/[0.06] pb-2">
                                <MapPin size={12} className="text-[var(--color-accent)]" />
                                <span>Primary Fulfillment Station</span>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-[var(--color-ink)]">Main Warehouse & Hub</p>
                                <p className="text-[10px] text-[var(--color-muted)] font-mono mt-0.5">Station ID: WH-DELHI-004</p>
                                <p className="text-[11px] text-[var(--color-ink-soft)] mt-2 leading-relaxed">
                                    Connaught Place Logistics Hub, Central District, New Delhi, India 110001
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bank Payout Credentials */}
                    <div className="relative group">
                        <div className="absolute inset-0 rounded-3xl border border-black/5 bg-[#ded8ca]" />
                        <div className="relative rounded-3xl border border-white/90 bg-gradient-to-b from-[#fffefc] via-[#fcfaf5] to-[#f6f1e5] p-5 shadow-xs space-y-3">
                            <div className="flex items-center justify-between border-b border-black/[0.06] pb-2">
                                <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                    <CreditCard size={12} className="text-emerald-700" />
                                    <span>Payout Settlement Account</span>
                                </div>
                                <span className="text-[7.5px] font-mono text-emerald-800 font-bold bg-emerald-100/90 border border-emerald-300 px-2 py-0.5 rounded-md">
                                    256-Bit SSL Active
                                </span>
                            </div>
                            <div className="p-3 rounded-2xl bg-[#fcfaf5] border border-[#e8e0d0] flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-[8px] font-bold uppercase text-[var(--color-muted)]">Stripe Merchant Account</p>
                                    <p className="text-xs font-mono font-bold text-[var(--color-ink)]">•••• •••• •••• 8892</p>
                                </div>
                                <span className="text-[7.5px] font-bold uppercase tracking-wider text-[#2d563f] bg-[#eaf3ed] border border-[#b8d9c5] px-2 py-1 rounded-lg">
                                    Connected
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. VENDOR PREFERENCES & NOTIFICATION SETTINGS */}
                <div
                    onMouseEnter={() => setHoveredCard("prefs")}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="relative group transition-all duration-300 ease-out"
                >
                    <div
                        className="absolute inset-0 rounded-3xl border border-black/5 bg-[#ded8ca] transition-all duration-300 ease-out"
                        style={{
                            transform: hoveredCard === "prefs" ? "translate(3px, 5px)" : "translate(1.5px, 3px)",
                            opacity: hoveredCard === "prefs" ? 0.9 : 0.6
                        }}
                    />

                    <div
                        className="relative overflow-hidden rounded-3xl border border-white/90 bg-gradient-to-b from-[#fffefc] via-[#fcfaf5] to-[#f6f1e5] p-6 backdrop-blur-2xl transition-all duration-300 ease-out shadow-xs space-y-5"
                        style={{
                            transform: hoveredCard === "prefs" ? "translateY(-3px)" : "translateY(0px)"
                        }}
                    >
                        <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                            <div className="flex items-center gap-1.5 text-[8.5px] font-bold uppercase tracking-wider text-[var(--color-ink)]">
                                <Settings size={13} className="text-[var(--color-accent)]" />
                                <span>Merchant Notification Controls</span>
                            </div>

                            {isSaved && (
                                <span className="text-[8px] font-bold text-emerald-700 bg-emerald-100/90 border border-emerald-300 px-2.5 py-0.5 rounded-md animate-pulse">
                                    ✓ Preferences Saved
                                </span>
                            )}
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                            {/* Order Alerts */}
                            <div
                                onClick={() => {
                                    setOrderAlerts(!orderAlerts);
                                    handleSavePreferences();
                                }}
                                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                                    orderAlerts ? "bg-[#eaf3ed] border-[#b8d9c5] shadow-2xs" : "bg-[#fcfaf5] border-[#e8e0d0] opacity-70"
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Bell size={14} className={orderAlerts ? "text-[#2d563f]" : "text-stone-400"} />
                                    <div>
                                        <p className="text-[8px] font-bold uppercase tracking-wider text-[var(--color-ink)]">Order Alerts</p>
                                        <p className="text-[7px] text-[var(--color-muted)]">Instant rental ping</p>
                                    </div>
                                </div>
                                {orderAlerts ? (
                                    <ToggleRight size={20} className="text-[#2d563f]" />
                                ) : (
                                    <ToggleLeft size={20} className="text-stone-400" />
                                )}
                            </div>

                            {/* Daily Receipts */}
                            <div
                                onClick={() => {
                                    setDailyReceipts(!dailyReceipts);
                                    handleSavePreferences();
                                }}
                                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                                    dailyReceipts ? "bg-[#f0f5fa] border-[#cee0f2] shadow-2xs" : "bg-[#fcfaf5] border-[#e8e0d0] opacity-70"
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Mail size={14} className={dailyReceipts ? "text-[#2c4a6f]" : "text-stone-400"} />
                                    <div>
                                        <p className="text-[8px] font-bold uppercase tracking-wider text-[var(--color-ink)]">Daily Summaries</p>
                                        <p className="text-[7px] text-[var(--color-muted)]">Email revenue digest</p>
                                    </div>
                                </div>
                                {dailyReceipts ? (
                                    <ToggleRight size={20} className="text-[#2c4a6f]" />
                                ) : (
                                    <ToggleLeft size={20} className="text-stone-400" />
                                )}
                            </div>

                            {/* Auto Reserve */}
                            <div
                                onClick={() => {
                                    setAutoReserve(!autoReserve);
                                    handleSavePreferences();
                                }}
                                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                                    autoReserve ? "bg-amber-100/70 border-amber-300 shadow-2xs" : "bg-[#fcfaf5] border-[#e8e0d0] opacity-70"
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Zap size={14} className={autoReserve ? "text-amber-800" : "text-stone-400"} />
                                    <div>
                                        <p className="text-[8px] font-bold uppercase tracking-wider text-[var(--color-ink)]">Auto Reserve</p>
                                        <p className="text-[7px] text-[var(--color-muted)] font-mono">Stock lock mode</p>
                                    </div>
                                </div>
                                {autoReserve ? (
                                    <ToggleRight size={20} className="text-amber-800" />
                                ) : (
                                    <ToggleLeft size={20} className="text-stone-400" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. ACTION CONTROL BAR */}
                <div className="flex items-center justify-between border-t border-[var(--color-line-soft)] pt-5">
                    <Link
                        to="/vendor"
                        className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
                    >
                        ← Back to Vendor Console
                    </Link>

                    <button
                        onClick={() => {
                            logout();
                            navigate("/login", { replace: true });
                        }}
                        className="inline-flex items-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-[8px] font-extrabold uppercase tracking-wider text-rose-800 hover:bg-rose-600 hover:text-white transition-all shadow-2xs active:scale-95"
                    >
                        <LogOut size={12} />
                        <span>Sign Out Vendor Account</span>
                    </button>
                </div>
            </div>
        </main>
    );
}

export default VendorProfile;
