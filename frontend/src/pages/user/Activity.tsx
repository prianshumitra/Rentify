import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Bell,
    CheckCircle2,
    CreditCard,
    Package,
    ArrowUpRight,
    AlertCircle,
    XCircle,
    Activity as ActivityIcon,
    Radio,
    PieChart as PieIcon
} from "lucide-react";
import { getRentals, type RentalDetail } from "../../api/rentals.api";

interface ActivityItem {
    id: string;
    rentalId: string;
    title: string;
    description: string;
    timestamp: string;
    type: "status" | "payment" | "creation" | "alert";
    status: string;
    amount?: number;
    productName?: string;
}

function Activity() {
    const navigate = useNavigate();
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeFilter, setActiveFilter] = useState<"all" | "status" | "payment">("all");
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    useEffect(() => {
        async function fetchActivity() {
            setIsLoading(true);
            setError("");
            try {
                const rentals: RentalDetail[] = await getRentals();
                
                // Map real rentals into timeline activity events
                const events: ActivityItem[] = [];

                rentals.forEach((r) => {
                    const item = r.items[0];
                    const dateStr = r.created_at
                        ? new Date(r.created_at).toLocaleString()
                        : new Date().toLocaleString();

                    // Event 1: Creation
                    events.push({
                        id: `${r.id}-created`,
                        rentalId: r.id,
                        title: `Rental Request Initiated`,
                        description: `Requested ${item?.product_name || "Rental Object"} (${item?.variant_sku || "Standard"})`,
                        timestamp: dateStr,
                        type: "creation",
                        status: r.status,
                        amount: r.total_amount,
                        productName: item?.product_name,
                    });

                    // Event 2: Status / Payment state
                    if (r.status.toLowerCase() === "pending_payment") {
                        events.push({
                            id: `${r.id}-payment`,
                            rentalId: r.id,
                            title: `Checkout Session Ready`,
                            description: `Pending payment authorization for ₹${Number(r.total_amount).toFixed(2)}`,
                            timestamp: dateStr,
                            type: "payment",
                            status: r.status,
                            amount: r.total_amount,
                            productName: item?.product_name,
                        });
                    } else if (r.status.toLowerCase() === "confirmed" || r.status.toLowerCase() === "active") {
                        events.push({
                            id: `${r.id}-confirmed`,
                            rentalId: r.id,
                            title: `Reservation Active & Confirmed`,
                            description: `Rental scheduled from ${new Date(r.start_at).toLocaleDateString()} to ${new Date(r.end_at).toLocaleDateString()}`,
                            timestamp: dateStr,
                            type: "status",
                            status: r.status,
                            amount: r.total_amount,
                            productName: item?.product_name,
                        });
                    } else if (r.status.toLowerCase() === "cancelled") {
                        events.push({
                            id: `${r.id}-cancelled`,
                            rentalId: r.id,
                            title: `Order Terminated`,
                            description: `Rental order #${r.id.slice(0, 8)} was cancelled by user`,
                            timestamp: dateStr,
                            type: "alert",
                            status: r.status,
                            amount: r.total_amount,
                            productName: item?.product_name,
                        });
                    }
                });

                setActivities(events);
            } catch (err: any) {
                setError(err.response?.data?.detail || "Failed to load activity logs.");
            } finally {
                setIsLoading(false);
            }
        }

        fetchActivity();
    }, []);

    const getFilterCount = (filter: "all" | "status" | "payment") => {
        return activities.filter((act) => {
            if (filter === "status") return act.type === "status" || act.type === "creation";
            if (filter === "payment") return act.type === "payment";
            return true;
        }).length;
    };

    const filteredActivities = activities.filter((act) => {
        if (activeFilter === "status") return act.type === "status" || act.type === "creation";
        if (activeFilter === "payment") return act.type === "payment";
        return true;
    });

    const latestEvent = activities[0] || null;

    // Counts for Pie Chart
    const paymentCount = activities.filter((a) => a.type === "payment").length;
    const statusCount = activities.filter((a) => a.type === "status").length;
    const creationCount = activities.filter((a) => a.type === "creation").length;
    const totalEvents = activities.length;

    // ENLARGED PIE CHART MATH (size=165px)
    const size = 165;
    const center = size / 2;
    const strokeWidth = 22;
    const radius = center - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;

    const paymentPct = totalEvents > 0 ? paymentCount / totalEvents : 0;
    const statusPct = totalEvents > 0 ? statusCount / totalEvents : 0;
    const creationPct = totalEvents > 0 ? creationCount / totalEvents : 0;

    const paymentOffset = 0;
    const statusOffset = paymentPct * circumference;
    const creationOffset = (paymentPct + statusPct) * circumference;

    const getTypeTheme = (type: string, status: string) => {
        if (status.toLowerCase() === "cancelled") {
            return {
                icon: <XCircle size={15} className="text-rose-600" />,
                badge: "bg-rose-50 border-rose-200 text-rose-700",
                stripe: "bg-rose-500",
                label: "Terminated"
            };
        }
        if (type === "payment") {
            return {
                icon: <CreditCard size={15} className="text-amber-600" />,
                badge: "bg-amber-50 border-amber-200 text-amber-700",
                stripe: "bg-amber-500",
                label: "Payment"
            };
        }
        if (type === "status") {
            return {
                icon: <CheckCircle2 size={15} className="text-emerald-600" />,
                badge: "bg-emerald-50 border-emerald-200 text-emerald-700",
                stripe: "bg-emerald-500",
                label: "Confirmed"
            };
        }
        return {
            icon: <Package size={15} className="text-[var(--color-accent)]" />,
            badge: "bg-stone-100 border-stone-200 text-[var(--color-ink)]",
            stripe: "bg-[var(--color-accent)]",
            label: "Initiated"
        };
    };

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
                                RENTAL / LOGS & ACTIVITY FEED
                            </span>
                        </div>
                        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
                            Activity Feed
                        </h1>
                    </div>


                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/90 px-3.5 py-1.5 text-[8px] font-semibold text-emerald-800 shadow-xs">
                            <Radio size={10} className="text-emerald-600 animate-pulse" />
                            Live Updates
                        </span>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/90 p-3 text-xs text-rose-700 shadow-sm">
                        <AlertCircle size={14} className="text-rose-500 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* ═════════════════════════════════════════════════════════
                    TOP SPOTLIGHT WINDOW & ENLARGED ACTIVITY PIE CHART WINDOW
                ═════════════════════════════════════════════════════════ */}
                <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-stretch">
                    
                    {/* LEFT: SPOTLIGHT LATEST ACTIVITY WINDOW */}
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
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100/80 px-2 py-0.2 text-[7px] font-semibold text-amber-800">
                                    <span className="h-1 w-1 rounded-full bg-amber-500 animate-pulse" />
                                    Latest Event
                                </span>
                            </div>

                            {/* Window Content */}
                            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                                {latestEvent ? (
                                    <>
                                        <div className="space-y-3">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-3.5">
                                                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white bg-white/90 shadow-xs">
                                                    {getTypeTheme(latestEvent.type, latestEvent.status).icon}
                                                </div>

                                                <div className="space-y-0.5 min-w-0">
                                                    <span className="font-mono text-[8.5px] text-[var(--color-muted)]">
                                                        {latestEvent.timestamp}
                                                    </span>
                                                    <h2 className="text-xl font-medium tracking-tight text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors truncate">
                                                        {latestEvent.title}
                                                    </h2>
                                                    <p className="text-[11px] text-[var(--color-ink-soft)] leading-tight">
                                                        {latestEvent.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Footer */}
                                        <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-[var(--color-line-soft)]">
                                            <span className="font-mono text-[8px] text-[var(--color-muted)]">
                                                RN-{latestEvent.rentalId.slice(0, 8).toUpperCase()}
                                            </span>

                                            <button
                                                onClick={() => navigate(`/app/rentals/${latestEvent.rentalId}`)}
                                                className="inline-flex items-center gap-1 rounded-xl bg-[var(--color-ink)] px-3.5 py-1.5 text-[8px] font-semibold uppercase tracking-wider text-white hover:bg-[var(--color-accent)] active:scale-95 shadow-xs transition-all"
                                            >
                                                <span>View Details</span>
                                                <ArrowUpRight size={11} />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="py-6 text-center space-y-2">
                                        <Bell size={24} className="mx-auto text-[var(--color-muted)]" strokeWidth={1} />
                                        <h3 className="text-sm font-medium">No Activity Logged</h3>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: ENLARGED HERO EVENT PIE CHART WINDOW */}
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
                                    <span>Event Breakdown</span>
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

                                    {/* Payment Slice */}
                                    {paymentPct > 0 && (
                                        <circle
                                            cx={center}
                                            cy={center}
                                            r={radius}
                                            fill="transparent"
                                            stroke="#f59e0b"
                                            strokeWidth={strokeWidth}
                                            strokeDasharray={`${paymentPct * circumference} ${circumference}`}
                                            strokeDashoffset={-paymentOffset}
                                            className="transition-all duration-500 ease-out cursor-pointer hover:opacity-80"
                                            onClick={() => setActiveFilter("payment")}
                                        />
                                    )}

                                    {/* Status Slice */}
                                    {statusPct > 0 && (
                                        <circle
                                            cx={center}
                                            cy={center}
                                            r={radius}
                                            fill="transparent"
                                            stroke="#10b981"
                                            strokeWidth={strokeWidth}
                                            strokeDasharray={`${statusPct * circumference} ${circumference}`}
                                            strokeDashoffset={-statusOffset}
                                            className="transition-all duration-500 ease-out cursor-pointer hover:opacity-80"
                                            onClick={() => setActiveFilter("status")}
                                        />
                                    )}

                                    {/* Creation Slice */}
                                    {creationPct > 0 && (
                                        <circle
                                            cx={center}
                                            cy={center}
                                            r={radius}
                                            fill="transparent"
                                            stroke="#c2410c"
                                            strokeWidth={strokeWidth}
                                            strokeDasharray={`${creationPct * circumference} ${circumference}`}
                                            strokeDashoffset={-creationOffset}
                                            className="transition-all duration-500 ease-out cursor-pointer hover:opacity-80"
                                            onClick={() => setActiveFilter("all")}
                                        />
                                    )}
                                </svg>

                                {/* Big Counter in Center */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                                    <span className="text-3xl font-bold tracking-tight text-[var(--color-ink)] font-mono">{totalEvents}</span>
                                    <span className="text-[7.5px] font-semibold text-[var(--color-muted)]">Events</span>
                                </div>
                            </div>

                            {/* Enlarged Legend Badges with Prominent Bold Numbers */}
                            <div className="w-full grid grid-cols-3 gap-2 pt-1">
                                <button
                                    onClick={() => setActiveFilter("payment")}
                                    className={`flex flex-col items-center p-2 rounded-xl border text-[8px] transition-all shadow-xs ${
                                        activeFilter === "payment" ? "bg-amber-100/90 border-amber-300 text-amber-900 shadow-sm scale-[1.03]" : "bg-white/60 border-black/5 text-[var(--color-muted)] hover:bg-white"
                                    }`}
                                >
                                    <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                                        <span>Payment</span>
                                    </div>
                                    <span className="font-mono mt-1 font-extrabold text-xl text-[var(--color-ink)]">{paymentCount}</span>
                                </button>

                                <button
                                    onClick={() => setActiveFilter("status")}
                                    className={`flex flex-col items-center p-2 rounded-xl border text-[8px] transition-all shadow-xs ${
                                        activeFilter === "status" ? "bg-emerald-100/90 border-emerald-300 text-emerald-900 shadow-sm scale-[1.03]" : "bg-white/60 border-black/5 text-[var(--color-muted)] hover:bg-white"
                                    }`}
                                >
                                    <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                        <span>Status</span>
                                    </div>
                                    <span className="font-mono mt-1 font-extrabold text-xl text-[var(--color-ink)]">{statusCount}</span>
                                </button>

                                <button
                                    onClick={() => setActiveFilter("all")}
                                    className={`flex flex-col items-center p-2 rounded-xl border text-[8px] transition-all shadow-xs ${
                                        activeFilter === "all" ? "bg-stone-200/90 border-stone-400 text-stone-900 shadow-sm scale-[1.03]" : "bg-white/60 border-black/5 text-[var(--color-muted)] hover:bg-white"
                                    }`}
                                >
                                    <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                                        <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                                        <span>Requests</span>
                                    </div>
                                    <span className="font-mono mt-1 font-extrabold text-xl text-[var(--color-ink)]">{creationCount}</span>
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
                            <span className="text-[8px] font-semibold tracking-wider text-[var(--color-ink)]">Stream Filter</span>
                        </div>

                        <div className="flex items-center gap-1 rounded-xl bg-stone-200/50 p-1 border border-stone-300/40 shadow-inner w-full sm:w-auto overflow-x-auto">
                            {(["all", "status", "payment"] as const).map((tab) => {
                                const count = getFilterCount(tab);
                                const isActive = activeFilter === tab;
                                return (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveFilter(tab)}
                                        className={`flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-lg px-3 py-1 text-[8px] font-semibold uppercase tracking-wider transition-all duration-300 active:scale-95 ${
                                            isActive
                                                ? "bg-[var(--color-ink)] !text-white shadow-xs scale-[1.02]"
                                                : "text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-white/60"
                                        }`}
                                    >
                                        <span>{tab === "all" ? "All Logs" : tab}</span>
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
                    ACTIVITY TIMELINE STREAM LOG STACK
                ═════════════════════════════════════════════════════════ */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-[var(--color-line-soft)] pb-2">
                        <span className="text-[8px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                            Event Output
                        </span>
                        <span className="font-mono text-[8px] text-[var(--color-muted)]">
                            Showing {filteredActivities.length} logs
                        </span>
                    </div>

                    {filteredActivities.length === 0 ? (
                        <div className="rounded-2xl border border-[var(--color-line)] bg-white/40 p-8 text-center backdrop-blur-md space-y-2">
                            <ActivityIcon size={28} className="mx-auto text-[var(--color-muted)]" strokeWidth={1} />
                            <h3 className="text-base font-medium">No activity records found</h3>
                            <p className="text-xs text-[var(--color-muted)]">Select another filter tab or perform rental actions.</p>
                        </div>
                    ) : (
                        <div className="space-y-2.5">
                            {filteredActivities.map((act) => {
                                const theme = getTypeTheme(act.type, act.status);
                                const isHovered = hoveredCard === act.id;

                                return (
                                    <div
                                        key={act.id}
                                        onMouseEnter={() => setHoveredCard(act.id)}
                                        onMouseLeave={() => setHoveredCard(null)}
                                        className="relative group transition-all duration-300 ease-out"
                                    >
                                        <div
                                            className="absolute inset-0 rounded-2xl bg-[#ded8ca] border border-black/5 transition-all duration-300 ease-out"
                                            style={{
                                                transform: isHovered ? "translate(3px, 5px)" : "translate(1.5px, 3px)",
                                                opacity: isHovered ? 0.9 : 0.6
                                            }}
                                        />

                                        <div
                                            onClick={() => navigate(`/app/rentals/${act.rentalId}`)}
                                            className="relative cursor-pointer overflow-hidden rounded-2xl border border-white/90 bg-gradient-to-r from-[#fffefc] via-[#fcfaf5] to-[#f6f1e5] p-3.5 sm:p-4 backdrop-blur-xl transition-all duration-300 ease-out hover:border-[var(--color-accent)]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                            style={{
                                                transform: isHovered ? "translateX(4px)" : "translateX(0px)",
                                                boxShadow: isHovered
                                                    ? "0 12px 24px -8px rgba(23, 23, 23, 0.1)"
                                                    : "0 6px 12px -6px rgba(23, 23, 23, 0.04)"
                                            }}
                                        >

                                            {/* Left Stripe */}
                                            <span className={`absolute left-0 top-0 bottom-0 w-1 ${theme.stripe}`} />

                                            <div className="flex items-center gap-3 pl-1.5 min-w-0">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white bg-white/90 shadow-xs">
                                                    {theme.icon}
                                                </div>

                                                <div className="space-y-0.5 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`inline-flex items-center rounded-md border px-1.5 py-0.2 text-[7px] font-semibold ${theme.badge}`}>
                                                            {theme.label}
                                                        </span>
                                                        <span className="font-mono text-[8.5px] text-[var(--color-muted)]">
                                                            {act.timestamp}
                                                        </span>
                                                    </div>

                                                    <h3 className="text-sm font-medium tracking-tight text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors truncate">
                                                        {act.title}
                                                    </h3>

                                                    <p className="text-[11px] text-[var(--color-ink-soft)] leading-tight truncate">
                                                        {act.description}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-black/[0.06] pl-1.5 sm:pl-0 shrink-0">
                                                <div className="text-left sm:text-right">
                                                    <span className="font-mono text-[7.5px] text-[var(--color-muted)] block">
                                                        RN-{act.rentalId.slice(0, 8).toUpperCase()}
                                                    </span>
                                                    {act.amount && (
                                                        <span className="font-mono text-xs font-medium text-[var(--color-ink)]">
                                                            ₹{Number(act.amount).toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>

                                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-ink)] text-white shadow-xs group-hover:bg-[var(--color-accent)] group-hover:translate-x-0.5 transition-all shrink-0">
                                                    <ArrowUpRight size={13} />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default Activity;
