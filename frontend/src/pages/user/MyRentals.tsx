import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowUpRight,
    Calendar,
    Package,
    AlertCircle,
    Copy,
    Check,
    Compass,
    CreditCard,
    Plus,
    PieChart as PieIcon

} from "lucide-react";
import { getRentals, cancelRental, type RentalDetail } from "../../api/rentals.api";
import StripePaymentModal from "../../components/payment/StripePaymentModal";

function MyRentals() {
    const navigate = useNavigate();

    const [rentals, setRentals] = useState<RentalDetail[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [activeTab, setActiveTab] = useState<"all" | "active" | "completed" | "cancelled">("all");
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    const [selectedPaymentRental, setSelectedPaymentRental] = useState<RentalDetail | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const fetchRentals = async () => {
        setIsLoading(true);
        setError("");
        try {
            const data = await getRentals();
            setRentals(data);
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to load your rentals.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRentals();
    }, []);

    const handleCancel = async (e: React.MouseEvent, rentalId: string) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to cancel this rental?")) return;

        try {
            await cancelRental(rentalId);
            fetchRentals();
        } catch (err: any) {
            alert(err.response?.data?.detail || "Failed to cancel rental.");
        }
    };

    const handleCopyId = (e: React.MouseEvent, rentalId: string) => {
        e.stopPropagation();
        const formattedId = `RN-${rentalId.slice(0, 8).toUpperCase()}`;
        navigator.clipboard.writeText(formattedId);
        setCopiedId(rentalId);
        setTimeout(() => setCopiedId(null), 1800);
    };

    const getStatusStyle = (status: string) => {
        const s = (status || "").toLowerCase().trim();
        switch (s) {
            case "confirmed":
            case "active":
            case "ready_for_pickup":
                return {
                    text: "text-emerald-700",
                    dot: "bg-emerald-500",
                    label: "Active",
                    bg: "bg-emerald-50/80 border-emerald-200"
                };
            case "pending_payment":
                return {
                    text: "text-[var(--color-accent)]",
                    dot: "bg-amber-500 animate-pulse",
                    label: "Pay Required",
                    bg: "bg-amber-50/80 border-amber-200"
                };
            case "return_pending":
                return {
                    text: "text-blue-700",
                    dot: "bg-blue-500",
                    label: "Return Pending",
                    bg: "bg-blue-50/80 border-blue-200"
                };
            case "returned":
            case "completed":
                return {
                    text: "text-blue-700",
                    dot: "bg-blue-500",
                    label: "Completed",
                    bg: "bg-blue-50/80 border-blue-200"
                };
            case "overdue":
                return {
                    text: "text-rose-700",
                    dot: "bg-rose-500 animate-bounce",
                    label: "Overdue",
                    bg: "bg-rose-50/80 border-rose-200"
                };
            case "cancelled":
                return {
                    text: "text-[var(--color-muted)]",
                    dot: "bg-stone-400",
                    label: "Cancelled",
                    bg: "bg-stone-100/80 border-stone-200"
                };
            default:
                return {
                    text: "text-[var(--color-muted)]",
                    dot: "bg-stone-400",
                    label: status,
                    bg: "bg-stone-100/80 border-stone-200"
                };
        }
    };

    const getTabCount = (tab: "all" | "active" | "completed" | "cancelled") => {
        return rentals.filter((r) => {
            const s = (r.status || "").toLowerCase().trim();
            if (tab === "active") return ["confirmed", "ready_for_pickup", "active", "pending_payment", "overdue"].includes(s);
            if (tab === "completed") return ["returned", "completed", "return_pending"].includes(s);
            if (tab === "cancelled") return s === "cancelled";
            return true;
        }).length;
    };

    const activeCount = getTabCount("active");
    const completedCount = getTabCount("completed");
    const cancelledCount = getTabCount("cancelled");
    const totalCount = rentals.length;

    const filteredRentals = rentals.filter((r) => {
        const s = (r.status || "").toLowerCase().trim();
        if (activeTab === "active") return ["confirmed", "ready_for_pickup", "active", "pending_payment", "overdue"].includes(s);
        if (activeTab === "completed") return ["returned", "completed", "return_pending"].includes(s);
        if (activeTab === "cancelled") return s === "cancelled";
        return true;
    });

    const activeRentals = rentals.filter((r) =>
        ["confirmed", "ready_for_pickup", "active", "pending_payment", "overdue"].includes((r.status || "").toLowerCase().trim())
    );

    const primaryActiveRental = activeRentals[0] || rentals[0] || null;


    // ENLARGED PIE CHART MATH (size=165px)
    const size = 165;
    const center = size / 2;
    const strokeWidth = 22;
    const radius = center - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;

    const activePct = totalCount > 0 ? activeCount / totalCount : 0;
    const completedPct = totalCount > 0 ? completedCount / totalCount : 0;
    const cancelledPct = totalCount > 0 ? cancelledCount / totalCount : 0;

    const activeOffset = 0;
    const completedOffset = activePct * circumference;
    const cancelledOffset = (activePct + completedPct) * circumference;

    if (isLoading) {
        return (
            <main className="min-h-screen bg-[var(--color-ivory)] px-6 py-20">
                <div className="mx-auto max-w-6xl space-y-4">
                    <div className="h-6 w-44 animate-pulse rounded-xl bg-black/10" />
                    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="h-72 animate-pulse rounded-3xl bg-black/5" />
                        <div className="h-72 animate-pulse rounded-3xl bg-black/5" />
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-[var(--color-ivory)] px-5 pb-20 pt-24 text-[var(--color-ink)]">
            {/* Loom Threads Background */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute left-[8%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute right-[8%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute left-0 top-[22%] h-px w-full bg-[var(--color-line-soft)]" />
            </div>

            <div className="relative z-10 mx-auto max-w-6xl space-y-6">
                {/* Editorial Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--color-line-soft)] pb-4">
                    <div>
                        <div className="flex items-center gap-2.5 mb-1.5">
                            <span className="h-px w-8 bg-[var(--color-accent)]" />
                            <span className="text-[8.5px] font-semibold uppercase tracking-[0.28em] text-[var(--color-muted)]">
                                RENTAL / MY ORDERS WORKSPACE
                            </span>
                        </div>
                        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
                            My Rentals
                        </h1>
                    </div>


                    <Link
                        to="/app/explore"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-[8.5px] font-semibold uppercase tracking-wider !text-white shadow-xs hover:bg-[var(--color-ink)] hover:-translate-y-0.5 transition-all shrink-0"
                    >
                        <Plus size={13} />
                        <span>New Rental</span>
                    </Link>
                </div>

                {error && (
                    <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/90 p-3 text-xs text-rose-700 shadow-sm">
                        <AlertCircle size={14} className="text-rose-500 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* ═════════════════════════════════════════════════════════
                    SPOTLIGHT WINDOW & ENLARGED HERO PIE CHART WINDOW
                ═════════════════════════════════════════════════════════ */}
                <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-stretch">
                    
                    {/* LEFT: SPOTLIGHT WINDOW */}
                    <div
                        onMouseEnter={() => setHoveredCard("spotlight")}
                        onMouseLeave={() => setHoveredCard(null)}
                        className="relative group transition-all duration-300 ease-out flex flex-col"
                    >
                        <div
                            className="absolute inset-0 rounded-3xl bg-[#e3decf] border border-black/5 transition-all duration-300 ease-out"
                            style={{
                                transform: hoveredCard === "spotlight" ? "translate(4px, 6px)" : "translate(2px, 3px)",
                                opacity: hoveredCard === "spotlight" ? 0.9 : 0.6
                            }}
                        />
                        
                        <div
                            className="relative flex-1 overflow-hidden rounded-3xl border border-white/90 bg-gradient-to-b from-[#fffefc] via-[#fcfaf5] to-[#f6f1e5] backdrop-blur-2xl transition-all duration-300 ease-out shadow-md flex flex-col justify-between"
                            style={{
                                transform: hoveredCard === "spotlight" ? "translateY(-3px)" : "translateY(0px)",
                                boxShadow: hoveredCard === "spotlight"
                                    ? "0 18px 36px -10px rgba(23, 23, 23, 0.12)"
                                    : "0 8px 18px -8px rgba(23, 23, 23, 0.04)"
                            }}
                        >

                            {/* Window Top Controls */}
                            <div className="flex items-center justify-between border-b border-black/[0.06] bg-white/40 px-4 py-2 backdrop-blur-md">
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/80 px-2 py-0.2 text-[7px] font-semibold text-emerald-800">
                                    <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                                    Spotlight
                                </span>
                            </div>

                            {/* Window Content */}
                            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                                {primaryActiveRental ? (
                                    <>
                                        {(() => {
                                            const item = primaryActiveRental.items[0];
                                            const statusStyle = getStatusStyle(primaryActiveRental.status);

                                            return (
                                                <div className="space-y-3">
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3.5">
                                                        <div
                                                            className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white bg-gradient-to-b from-[#f7f4ea] to-[#e4ded0] shadow-xs"
                                                        >
                                                            <Package size={26} className="text-stone-700" strokeWidth={1.2} />
                                                        </div>

                                                        <div className="space-y-0.5">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.2 text-[7px] font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                                                                    <span className={`h-1 w-1 rounded-full ${statusStyle.dot}`} />
                                                                    {statusStyle.label}
                                                                </span>
                                                            </div>
                                                            <h2 className="text-xl font-medium tracking-tight group-hover:text-[var(--color-accent)] transition-colors">
                                                                {item?.product_name || "Rental Reservation"}
                                                            </h2>
                                                            <p className="text-[10.5px] text-[var(--color-muted)]">
                                                                SKU: <span className="font-mono text-[var(--color-ink)]">{item?.variant_sku || "Standard"}</span> • Qty: <span className="text-[var(--color-ink)]">{item?.quantity || 1}</span>
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="grid gap-2.5 sm:grid-cols-2 rounded-xl border border-[var(--color-line-soft)] bg-white/50 p-3 text-xs">
                                                        <div>
                                                            <span className="text-[7px] font-semibold uppercase tracking-wider text-[var(--color-muted)] block mb-0.5">
                                                                Duration
                                                            </span>
                                                            <div className="flex items-center gap-1 text-[10.5px]">
                                                                <Calendar size={11} className="text-[var(--color-accent)] shrink-0" />
                                                                <span>{new Date(primaryActiveRental.start_at).toLocaleDateString()} – {new Date(primaryActiveRental.end_at).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <span className="text-[7px] font-semibold uppercase tracking-wider text-[var(--color-muted)] block mb-0.5">
                                                                Order Total
                                                            </span>
                                                            <p className="text-base font-medium tracking-tight">
                                                                ₹{Number(primaryActiveRental.total_amount).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                        {/* Action Footer */}
                                        <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-[var(--color-line-soft)]">
                                            <button
                                                onClick={(e) => handleCopyId(e, primaryActiveRental.id)}
                                                className="inline-flex items-center gap-1 rounded-md border border-white bg-white/70 px-2 py-0.5 text-[7.5px] font-mono text-[var(--color-muted)] hover:text-[var(--color-ink)] shadow-xs transition-all"
                                            >
                                                <span>RN-{primaryActiveRental.id.slice(0, 8).toUpperCase()}</span>
                                                {copiedId === primaryActiveRental.id ? <Check size={10} className="text-emerald-600" /> : <Copy size={9} />}
                                            </button>

                                            <div className="flex items-center gap-2">
                                                {primaryActiveRental.status.toLowerCase() === "pending_payment" && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedPaymentRental(primaryActiveRental);
                                                            setIsPaymentModalOpen(true);
                                                        }}
                                                        className="inline-flex items-center gap-1 rounded-xl bg-[var(--color-accent)] px-3 py-1.5 text-[8px] font-semibold uppercase tracking-wider !text-white hover:bg-[var(--color-ink)] active:scale-95 shadow-xs transition-all"
                                                    >
                                                        <CreditCard size={11} />
                                                        <span>Pay Now</span>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => navigate(`/app/rentals/${primaryActiveRental.id}`)}
                                                    className="inline-flex items-center gap-1 rounded-xl bg-[var(--color-ink)] px-3 py-1.5 text-[8px] font-semibold uppercase tracking-wider text-white hover:bg-[var(--color-accent)] active:scale-95 shadow-xs transition-all"
                                                >
                                                    <span>Details</span>
                                                    <ArrowUpRight size={11} />
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="py-6 text-center space-y-2">
                                        <Package size={24} className="mx-auto text-[var(--color-muted)]" strokeWidth={1} />
                                        <h3 className="text-sm font-medium">No Active Rentals</h3>
                                        <Link
                                            to="/app/explore"
                                            className="inline-flex items-center gap-1 rounded-xl bg-[var(--color-ink)] px-3 py-1.5 text-[7.5px] font-semibold uppercase tracking-wider text-white hover:bg-[var(--color-accent)] transition-all shadow-xs"
                                        >
                                            <Compass size={11} />
                                            <span>Explore Catalog</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: ENLARGED HERO PIE CHART WINDOW */}
                    <div
                        onMouseEnter={() => setHoveredCard("pieCard")}
                        onMouseLeave={() => setHoveredCard(null)}
                        className="relative group transition-all duration-300 ease-out flex flex-col"
                    >
                        <div
                            className="absolute inset-0 rounded-3xl bg-[#ded8ca] border border-black/5 transition-all duration-300 ease-out"
                            style={{
                                transform: hoveredCard === "pieCard" ? "translate(4px, 6px)" : "translate(2px, 3px)",
                                opacity: hoveredCard === "pieCard" ? 0.9 : 0.6
                            }}
                        />

                        <div
                            className="relative flex-1 overflow-hidden rounded-3xl border border-white/90 bg-gradient-to-b from-[#fffefc] via-[#fcfaf5] to-[#f6f1e5] p-5 backdrop-blur-2xl transition-all duration-300 ease-out shadow-md flex flex-col justify-between items-center space-y-3"
                            style={{
                                transform: hoveredCard === "pieCard" ? "translateY(-3px)" : "translateY(0px)",
                                boxShadow: hoveredCard === "pieCard"
                                    ? "0 18px 36px -10px rgba(23, 23, 23, 0.12)"
                                    : "0 8px 18px -8px rgba(23, 23, 23, 0.04)"
                            }}
                        >

                            {/* Window Header */}
                            <div className="w-full flex items-center justify-between border-b border-black/[0.06] pb-2">
                                <div className="flex items-center gap-1 text-[8px] font-semibold text-[var(--color-ink)]">
                                    <PieIcon size={12} className="text-[var(--color-accent)]" />
                                    <span>Status Distribution</span>
                                </div>
                            </div>

                            {/* ENLARGED HERO PIE CHART */}
                            <div className="relative flex items-center justify-center my-1">
                                <svg width={size} height={size} className="rotate-[-90deg] drop-shadow-md">
                                    {/* Empty Base Ring */}
                                    <circle
                                        cx={center}
                                        cy={center}
                                        r={radius}
                                        fill="transparent"
                                        stroke="#e7e2d4"
                                        strokeWidth={strokeWidth}
                                    />

                                    {/* Active Slice */}
                                    {activePct > 0 && (
                                        <circle
                                            cx={center}
                                            cy={center}
                                            r={radius}
                                            fill="transparent"
                                            stroke="#10b981"
                                            strokeWidth={strokeWidth}
                                            strokeDasharray={`${activePct * circumference} ${circumference}`}
                                            strokeDashoffset={-activeOffset}
                                            className="transition-all duration-500 ease-out cursor-pointer hover:opacity-80"
                                            onClick={() => setActiveTab("active")}
                                        />
                                    )}

                                    {/* Completed Slice */}
                                    {completedPct > 0 && (
                                        <circle
                                            cx={center}
                                            cy={center}
                                            r={radius}
                                            fill="transparent"
                                            stroke="#3b82f6"
                                            strokeWidth={strokeWidth}
                                            strokeDasharray={`${completedPct * circumference} ${circumference}`}
                                            strokeDashoffset={-completedOffset}
                                            className="transition-all duration-500 ease-out cursor-pointer hover:opacity-80"
                                            onClick={() => setActiveTab("completed")}
                                        />
                                    )}

                                    {/* Cancelled Slice */}
                                    {cancelledPct > 0 && (
                                        <circle
                                            cx={center}
                                            cy={center}
                                            r={radius}
                                            fill="transparent"
                                            stroke="#ef4444"
                                            strokeWidth={strokeWidth}
                                            strokeDasharray={`${cancelledPct * circumference} ${circumference}`}
                                            strokeDashoffset={-cancelledOffset}
                                            className="transition-all duration-500 ease-out cursor-pointer hover:opacity-80"
                                            onClick={() => setActiveTab("cancelled")}
                                        />
                                    )}
                                </svg>

                                {/* Big Counter in Center */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                                    <span className="text-3xl font-bold tracking-tight text-[var(--color-ink)] font-mono">{totalCount}</span>
                                    <span className="text-[7.5px] font-semibold text-[var(--color-muted)]">Rentals</span>
                                </div>
                            </div>

                            {/* Enlarged Legend Badges */}
                            <div className="w-full grid grid-cols-3 gap-2 pt-1">
                                <button
                                    onClick={() => setActiveTab("active")}
                                    className={`flex flex-col items-center p-2 rounded-xl border text-[8px] transition-all shadow-xs ${
                                        activeTab === "active" ? "bg-emerald-100/90 border-emerald-300 text-emerald-900 shadow-sm scale-[1.03]" : "bg-white/60 border-black/5 text-[var(--color-muted)] hover:bg-white"
                                    }`}
                                >
                                    <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                        <span>Active</span>
                                    </div>
                                    <span className="font-mono mt-1 font-extrabold text-xl text-[var(--color-ink)]">{activeCount}</span>
                                </button>

                                <button
                                    onClick={() => setActiveTab("completed")}
                                    className={`flex flex-col items-center p-2 rounded-xl border text-[8px] transition-all shadow-xs ${
                                        activeTab === "completed" ? "bg-blue-100/90 border-blue-300 text-blue-900 shadow-sm scale-[1.03]" : "bg-white/60 border-black/5 text-[var(--color-muted)] hover:bg-white"
                                    }`}
                                >
                                    <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                                        <span>Done</span>
                                    </div>
                                    <span className="font-mono mt-1 font-extrabold text-xl text-[var(--color-ink)]">{completedCount}</span>
                                </button>

                                <button
                                    onClick={() => setActiveTab("cancelled")}
                                    className={`flex flex-col items-center p-2 rounded-xl border text-[8px] transition-all shadow-xs ${
                                        activeTab === "cancelled" ? "bg-rose-100/90 border-rose-300 text-rose-900 shadow-sm scale-[1.03]" : "bg-white/60 border-black/5 text-[var(--color-muted)] hover:bg-white"
                                    }`}
                                >
                                    <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                                        <span className="h-2 w-2 rounded-full bg-rose-500" />
                                        <span>Cancel</span>
                                    </div>
                                    <span className="font-mono mt-1 font-extrabold text-xl text-[var(--color-ink)]">{cancelledCount}</span>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                {/* ═════════════════════════════════════════════════════════
                    CLEAN FILTER DOCK BAR
                ═════════════════════════════════════════════════════════ */}
                <div
                    onMouseEnter={() => setHoveredCard("filterDock")}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="relative z-20 group transition-all duration-300 ease-out"
                >
                    <div
                        className="absolute inset-0 rounded-2xl bg-[#ded8ca] border border-black/5 transition-all duration-300 ease-out"
                        style={{
                            transform: hoveredCard === "filterDock" ? "translate(3px, 5px)" : "translate(1.5px, 3px)"
                        }}
                    />

                    <div
                        className="relative rounded-2xl border border-white/90 bg-gradient-to-r from-white/85 via-white/75 to-white/65 p-2.5 backdrop-blur-2xl flex flex-col sm:flex-row items-center justify-between gap-3 transition-all duration-300 ease-out"
                        style={{
                            transform: hoveredCard === "filterDock" ? "translateY(-3px)" : "translateY(0px)",
                            boxShadow: hoveredCard === "filterDock"
                                ? "0 16px 32px -10px rgba(23, 23, 23, 0.12)"
                                : "0 8px 16px -8px rgba(23, 23, 23, 0.05)"
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-[8px] font-semibold tracking-wider text-[var(--color-ink)]">Filters</span>
                        </div>

                        <div className="flex items-center gap-1 rounded-xl bg-stone-200/50 p-1 border border-stone-300/40 shadow-inner w-full sm:w-auto overflow-x-auto">
                            {(["all", "active", "completed", "cancelled"] as const).map((tab) => {
                                const count = getTabCount(tab);
                                const isActive = activeTab === tab;
                                return (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-lg px-3 py-1 text-[8px] font-semibold uppercase tracking-wider transition-all duration-300 active:scale-95 ${
                                            isActive
                                                ? "bg-[var(--color-ink)] !text-white shadow-xs scale-[1.02]"
                                                : "text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-white/60"
                                        }`}
                                    >
                                        <span>{tab}</span>
                                        <span className={`text-[7px] font-mono px-1.5 py-0.2 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-black/10 text-[var(--color-muted)]"}`}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ═════════════════════════════════════════════════════════
                    RENTAL HISTORY CARD STACK
                ═════════════════════════════════════════════════════════ */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-[var(--color-line-soft)] pb-2">
                        <span className="text-[8px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                            Rental Archive
                        </span>
                        <span className="font-mono text-[8px] text-[var(--color-muted)]">
                            Showing {filteredRentals.length} orders
                        </span>
                    </div>

                    {filteredRentals.length === 0 ? (
                        <div className="rounded-2xl border border-[var(--color-line)] bg-white/40 p-8 text-center backdrop-blur-md space-y-2">
                            <Package size={28} className="mx-auto text-[var(--color-muted)]" strokeWidth={1} />
                            <h3 className="text-base font-medium">No rentals found</h3>
                            <p className="text-xs text-[var(--color-muted)]">Select another filter tab or create a new rental order.</p>
                        </div>
                    ) : (
                        <div className="space-y-2.5">
                            {filteredRentals.map((rental, idx) => {
                                const mainItem = rental.items[0];
                                const canCancel = ["confirmed", "ready_for_pickup", "pending_payment"].includes(rental.status.toLowerCase());
                                const isPendingPayment = rental.status.toLowerCase() === "pending_payment";
                                const statusStyle = getStatusStyle(rental.status);
                                const isHovered = hoveredCard === rental.id;

                                const offsetStyles = [
                                    "translate-x-0",
                                    "translate-x-1 -translate-y-0.5",
                                    "-translate-x-0.5 translate-y-0.5",
                                    "translate-x-1.5",
                                ][idx % 4];

                                return (
                                    <div
                                        key={rental.id}
                                        onMouseEnter={() => setHoveredCard(rental.id)}
                                        onMouseLeave={() => setHoveredCard(null)}
                                        className={`relative group ${offsetStyles} transition-all duration-300 ease-out`}
                                    >
                                        <div
                                            className="absolute inset-0 rounded-2xl bg-[#dfd9cb] border border-black/5 transition-all duration-300 ease-out"
                                            style={{
                                                transform: isHovered ? "translate(3px, 5px)" : "translate(1.5px, 3px)",
                                                opacity: isHovered ? 0.9 : 0.7
                                            }}
                                        />

                                        <div
                                            onClick={() => navigate(`/app/rentals/${rental.id}`)}
                                            className="relative cursor-pointer overflow-hidden rounded-2xl border border-white/90 bg-gradient-to-b from-[#fffefc] via-[#fcfaf5] to-[#f6f1e5] p-3.5 sm:p-4 backdrop-blur-xl transition-all duration-300 ease-out hover:border-[var(--color-accent)]/60"
                                            style={{
                                                transform: isHovered ? "translateY(-3px) scale(1.004)" : "translateY(0px) scale(1)",
                                                boxShadow: isHovered
                                                    ? "0 12px 24px -8px rgba(23, 23, 23, 0.1)"
                                                    : "0 6px 12px -6px rgba(23, 23, 23, 0.04)"
                                            }}
                                        >

                                            {/* Titlebar */}
                                            <div className="flex items-center justify-between border-b border-black/[0.06] bg-white/40 px-3 py-1.5 rounded-t-lg backdrop-blur-md mb-3 -mx-4 -mt-4">
                                                <span className="font-mono text-[7.5px] text-[var(--color-muted)]">
                                                    RN-{rental.id.slice(0, 8).toUpperCase()}
                                                </span>
                                            </div>

                                            {/* Card Content */}
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white bg-gradient-to-b from-[#f5f2e9] to-[#ebe7dc] shadow-xs"
                                                    >
                                                        <Package size={20} className="text-stone-700" strokeWidth={1.2} />
                                                    </div>

                                                    <div className="space-y-0.5">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.2 text-[7px] font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                                                                <span className={`h-1 w-1 rounded-full ${statusStyle.dot}`} />
                                                                {statusStyle.label}
                                                            </span>
                                                        </div>

                                                        <h3 className="text-base font-medium tracking-tight text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors">
                                                            {mainItem?.product_name || "Rental Order"}
                                                        </h3>

                                                        <div className="flex items-center gap-3 text-[9px] text-[var(--color-muted)]">
                                                            <span>SKU: <span className="font-mono text-[var(--color-ink)]">{mainItem?.variant_sku || "Standard"}</span></span>
                                                            <span>Qty: <span className="text-[var(--color-ink)]">{mainItem?.quantity || 1}</span></span>
                                                            <span className="flex items-center gap-1">
                                                                <Calendar size={9} className="text-[var(--color-accent)]" />
                                                                {new Date(rental.start_at).toLocaleDateString()} – {new Date(rental.end_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right Pricing & Actions */}
                                                <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 border-black/[0.06] pt-2 sm:pt-0">
                                                    <div className="text-left sm:text-right">
                                                        <span className="text-[7px] font-semibold text-[var(--color-muted)] block">Amount</span>
                                                        <p className="text-base font-medium tracking-tight">₹{Number(rental.total_amount).toFixed(2)}</p>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        {isPendingPayment && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedPaymentRental(rental);
                                                                    setIsPaymentModalOpen(true);
                                                                }}
                                                                className="inline-flex items-center gap-1 rounded-lg bg-[var(--color-accent)] px-3 py-1.5 text-[8px] font-semibold uppercase tracking-wider !text-white hover:bg-[var(--color-ink)] active:scale-95 shadow-xs transition-all"
                                                            >
                                                                <CreditCard size={11} />
                                                                <span>PAY NOW</span>
                                                            </button>
                                                        )}

                                                        {canCancel && (
                                                            <button
                                                                onClick={(e) => handleCancel(e, rental.id)}
                                                                className="rounded-lg border border-rose-200/90 bg-rose-50/80 px-2.5 py-1 text-[7.5px] font-semibold text-rose-700 hover:bg-rose-100 active:scale-95 shadow-xs transition-all"
                                                            >
                                                                Cancel
                                                            </button>
                                                        )}

                                                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-ink)] text-white shadow-xs group-hover:bg-[var(--color-accent)] group-hover:scale-105 transition-all">
                                                            <ArrowUpRight size={12} />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* STRIPE PAYMENT CHECKOUT MODAL */}
            {selectedPaymentRental && (
                <StripePaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => {
                        setIsPaymentModalOpen(false);
                        setSelectedPaymentRental(null);
                    }}
                    rentalId={selectedPaymentRental.id}
                    amount={Number(selectedPaymentRental.total_amount)}
                    onSuccess={fetchRentals}
                />
            )}
        </main>
    );
}

export default MyRentals;
