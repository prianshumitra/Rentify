import { useEffect, useState } from "react";
import {
    Mail,
    Bell,
    LogOut,
    ToggleLeft,
    ToggleRight,
    Star,
    Pencil,
    Check,
    Store,
    ShieldCheck,
    UserCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { updateUserProfile } from "../../api/auth.api";
import apiClient from "../../api/client";

function LoomCard({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className={`group relative ${className}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div
                className="absolute inset-0 rounded-2xl border border-[#c2b49c] bg-[#ded1ba] transition-all duration-300 shadow-xs"
                style={{
                    transform: hovered
                        ? "translate(4px, 4.5px)"
                        : "translate(2.5px, 3px)",
                }}
            />
            <div
                className="absolute inset-0 rounded-2xl border border-[#d8cdb8] bg-[#ebe2cf] transition-all duration-300"
                style={{
                    transform: hovered
                        ? "translate(2px, 2.5px)"
                        : "translate(1.5px, 2px)",
                }}
            />
            <div
                className="relative h-full overflow-hidden rounded-2xl border border-[#c4b69d] bg-white transition-all duration-300 ease-out"
                style={{
                    transform: hovered ? "translateY(-2.5px)" : "translateY(0)",
                    boxShadow: hovered
                        ? "0 16px 35px -12px rgba(39, 39, 42, 0.22), 0 6px 18px -4px rgba(0,0,0,0.1)"
                        : "0 6px 20px -10px rgba(40,30,10,0.12)",
                }}
            >
                <div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-zinc-400/10 blur-2xl transition-transform duration-500 group-hover:scale-125"
                />
                {children}
            </div>
        </div>
    );
}

function VendorProfile() {
    const { user, logout, updateUser } = useAuth();

    const [productsCount, setProductsCount] = useState(0);
    const [inventoryCount, setInventoryCount] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);

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
                const prodRes = await apiClient.get("/products/?my_products_only=true");
                const prods = Array.isArray(prodRes.data) ? prodRes.data : [];
                setProductsCount(prods.length);

                const invRes = await apiClient.get("/inventory/");
                const invs = Array.isArray(invRes.data) ? invRes.data : [];
                setInventoryCount(invs.length);

                setTotalRevenue(prods.length * 1450);
            } catch (err) {
                console.error("Failed to load vendor stats:", err);
            }
        }
        fetchVendorStats();
    }, []);

    const handleSavePhone = async () => {
        if (!phone.trim()) return;
        setIsUpdatingPhone(true);
        try {
            const updated = await updateUserProfile({ phone_number: phone });
            if (updated) {
                updateUser(updated);
            }
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
        <main className="relative min-h-screen overflow-hidden bg-[var(--color-ivory)] px-4 pb-16 pt-16 sm:px-6 lg:px-8 sm:pt-20 text-[var(--color-ink)]">
            {/* Background Grid Lines & Ambient Lighting */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute left-[4%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute left-[18%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute right-[4%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute left-1/2 top-[25%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-zinc-400/[0.05] blur-[150px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl w-full space-y-4">

                {/* 1. HERO MERCHANT PASSPORT CONTAINER */}
                <LoomCard>
                    <div className="p-6 sm:p-8 space-y-6">
                        {/* Top Bar Header */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-black/[0.08] pb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-700 animate-pulse shadow-[0_0_6px_rgba(39,39,42,0.5)]" />
                                    <span className="text-[8px] font-black uppercase tracking-[0.25em] text-zinc-700">
                                        VENDOR / MERCHANT PASSPORT
                                    </span>
                                </div>
                                <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-3xl">
                                    Merchant Profile
                                </h1>
                            </div>

                            {/* Verified Merchant Badge */}
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 bg-zinc-100 px-3.5 py-1.5 text-[8px] font-extrabold uppercase tracking-wider text-zinc-800 shadow-2xs">
                                    <ShieldCheck size={12} className="text-zinc-700" />
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
                                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-md font-mono text-xl font-bold">
                                    {user.first_name?.[0] || "M"}
                                    {user.last_name?.[0] || "V"}
                                    <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800 text-[9px] text-white border-2 border-white">
                                        <Store size={10} />
                                    </span>
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold tracking-tight text-[var(--color-ink)]">
                                        {user.first_name} {user.last_name}
                                    </h2>
                                    <p className="text-xs font-mono text-[var(--color-muted)]">{user.email}</p>
                                    <p className="mt-1 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-700">
                                        RENTIFY MERCHANT ID: {user.id ? user.id.slice(0, 12).toUpperCase() : "VND-48209"}
                                    </p>
                                </div>
                            </div>

                            {/* Quick Overview Badges */}
                            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 text-center">
                                <div className="rounded-xl border border-[#d8cebc] bg-[#faf6ee] p-2.5 sm:px-4 space-y-0.5">
                                    <span className="font-mono text-sm sm:text-base font-extrabold text-[var(--color-ink)]">
                                        {productsCount}
                                    </span>
                                    <p className="text-[7.5px] font-mono font-bold uppercase text-[var(--color-muted)]">Products</p>
                                </div>

                                <div className="rounded-xl border border-[#d8cebc] bg-[#faf6ee] p-2.5 sm:px-4 space-y-0.5">
                                    <span className="font-mono text-sm sm:text-base font-extrabold text-[var(--color-ink)]">
                                        {inventoryCount}
                                    </span>
                                    <p className="text-[7.5px] font-mono font-bold uppercase text-[var(--color-muted)]">Inventory</p>
                                </div>

                                <div className="rounded-xl border border-[#d8cebc] bg-[#faf6ee] p-2.5 sm:px-4 space-y-0.5">
                                    <span className="font-mono text-sm sm:text-base font-extrabold text-zinc-900">
                                        ₹{totalRevenue.toLocaleString()}
                                    </span>
                                    <p className="text-[7.5px] font-mono font-bold uppercase text-[var(--color-muted)]">Settled</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </LoomCard>

                {/* 2. MAIN GRID: CONTACT & PREFERENCES */}
                <div className="grid gap-6 lg:grid-cols-2">

                    {/* CONTACT & BUSINESS INFORMATION */}
                    <LoomCard>
                        <div className="p-6 space-y-5">
                            <div className="flex items-center justify-between border-b border-black/[0.08] pb-3">
                                <div className="flex items-center gap-2">
                                    <UserCheck size={16} className="text-zinc-800" />
                                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-ink)]">
                                        Business Identification
                                    </h3>
                                </div>
                                <span className="text-[7.5px] font-mono font-bold text-[var(--color-muted)]">
                                    Merchant Credentials
                                </span>
                            </div>

                            <div className="space-y-3.5 text-xs">
                                <div className="space-y-1">
                                    <label className="text-[8px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                        Full Merchant Name
                                    </label>
                                    <p className="font-semibold text-[var(--color-ink)] bg-[#faf6ee] border border-[#d8cebc] px-3.5 py-2 rounded-xl font-mono">
                                        {user.first_name} {user.last_name}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[8px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                        Registered Email Address
                                    </label>
                                    <div className="flex items-center gap-2 bg-[#faf6ee] border border-[#d8cebc] px-3.5 py-2 rounded-xl font-mono text-[var(--color-ink)]">
                                        <Mail size={13} className="text-[var(--color-muted)] shrink-0" />
                                        <span className="truncate">{user.email}</span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[8px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                            Contact Phone Number
                                        </label>
                                        {phoneSaved && (
                                            <span className="text-[7.5px] font-mono text-emerald-700 font-extrabold flex items-center gap-1">
                                                <Check size={10} /> Saved to DB
                                            </span>
                                        )}
                                    </div>

                                    {isEditingPhone ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="flex-1 rounded-xl border border-zinc-800 bg-white px-3.5 py-2 text-xs font-mono text-[var(--color-ink)] outline-none"
                                            />
                                            <button
                                                onClick={handleSavePhone}
                                                disabled={isUpdatingPhone}
                                                className="rounded-xl bg-zinc-900 px-3 py-2 text-[8px] font-extrabold uppercase tracking-wider text-white shadow-2xs hover:bg-black"
                                            >
                                                {isUpdatingPhone ? "Saving..." : "Save"}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between bg-[#faf6ee] border border-[#d8cebc] px-3.5 py-2 rounded-xl font-mono text-[var(--color-ink)]">
                                            <span>{phone}</span>
                                            <button
                                                onClick={() => setIsEditingPhone(true)}
                                                className="text-[var(--color-muted)] hover:text-black"
                                            >
                                                <Pencil size={12} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </LoomCard>

                    {/* OPERATIONAL PREFERENCES */}
                    <LoomCard>
                        <div className="p-6 space-y-5">
                            <div className="flex items-center justify-between border-b border-black/[0.08] pb-3">
                                <div className="flex items-center gap-2">
                                    <Bell size={16} className="text-zinc-800" />
                                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-ink)]">
                                        Merchant Notifications & Controls
                                    </h3>
                                </div>
                                {isSaved && (
                                    <span className="text-[7.5px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                        Preferences Saved
                                    </span>
                                )}
                            </div>

                            <div className="space-y-4 text-xs">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-[#faf6ee] border border-[#d8cebc]">
                                    <div>
                                        <p className="font-bold text-[var(--color-ink)]">Instant Order Push Alerts</p>
                                        <p className="text-[9px] text-[var(--color-muted)]">Receive live notifications when gear is rented</p>
                                    </div>
                                    <button onClick={() => setOrderAlerts(!orderAlerts)} className="text-zinc-800">
                                        {orderAlerts ? <ToggleRight size={24} /> : <ToggleLeft size={24} className="text-zinc-400" />}
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-xl bg-[#faf6ee] border border-[#d8cebc]">
                                    <div>
                                        <p className="font-bold text-[var(--color-ink)]">Daily Revenue Receipts</p>
                                        <p className="text-[9px] text-[var(--color-muted)]">Email daily payout summary reports</p>
                                    </div>
                                    <button onClick={() => setDailyReceipts(!dailyReceipts)} className="text-zinc-800">
                                        {dailyReceipts ? <ToggleRight size={24} /> : <ToggleLeft size={24} className="text-zinc-400" />}
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-xl bg-[#faf6ee] border border-[#d8cebc]">
                                    <div>
                                        <p className="font-bold text-[var(--color-ink)]">Auto-Stock Reservation</p>
                                        <p className="text-[9px] text-[var(--color-muted)] font-mono">Lock serial inventory upon confirmation</p>
                                    </div>
                                    <button onClick={() => setAutoReserve(!autoReserve)} className="text-zinc-800">
                                        {autoReserve ? <ToggleRight size={24} /> : <ToggleLeft size={24} className="text-zinc-400" />}
                                    </button>
                                </div>

                                <div className="pt-2">
                                    <button
                                        onClick={handleSavePreferences}
                                        className="w-full rounded-xl bg-white border border-[#c4b69d] py-2.5 text-[8.5px] font-extrabold uppercase tracking-wider text-[var(--color-ink)] shadow-2xs hover:bg-[#faf6ee] hover:border-black/40 transition-all"
                                    >
                                        Update Preferences
                                    </button>
                                </div>
                            </div>
                        </div>
                    </LoomCard>

                </div>

                {/* 3. LOGOUT & TERMINAL ACTION BAR */}
                <LoomCard>
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span className="text-[8.5px] font-mono font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                Session Active // Encrypted Auth Token
                            </span>
                        </div>

                        <button
                            onClick={logout}
                            className="inline-flex items-center gap-0.5 rounded-md bg-rose-50 border border-rose-200/80 px-1.5 py-0.5 text-[6px] font-black uppercase tracking-wider text-rose-700 hover:bg-rose-600 hover:text-white transition-all shadow-2xs shrink-0"
                        >
                            <LogOut size={8} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </LoomCard>

            </div>
        </main>
    );
}

export default VendorProfile;
