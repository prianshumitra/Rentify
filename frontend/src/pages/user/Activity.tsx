import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Bell,
    CheckCircle2,
    CreditCard,
    Package,
    ArrowUpRight,
    AlertCircle,
    XCircle
} from "lucide-react";
import { getRentals, type RentalDetail } from "../../api/rentals.api";
import LoomCard from "../../components/ui/LoomCard";

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
                        title: `Rental Request Placed`,
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
                            title: `Payment Pending`,
                            description: `Checkout session ready for ₹${Number(r.total_amount).toFixed(2)}`,
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
                            title: `Rental Order Confirmed`,
                            description: `Order active from ${new Date(r.start_at).toLocaleDateString()} to ${new Date(r.end_at).toLocaleDateString()}`,
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
                            title: `Rental Cancelled`,
                            description: `Rental order #${r.id.slice(0, 8)} was cancelled`,
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

    const filteredActivities = activities.filter((act) => {
        if (activeFilter === "status") return act.type === "status" || act.type === "creation";
        if (activeFilter === "payment") return act.type === "payment";
        return true;
    });

    const getIcon = (type: string, status: string) => {
        if (status.toLowerCase() === "cancelled") return <XCircle size={18} className="text-rose-600" />;
        if (type === "payment") return <CreditCard size={18} className="text-amber-600" />;
        if (type === "status") return <CheckCircle2 size={18} className="text-emerald-600" />;
        return <Package size={18} className="text-[var(--color-accent)]" />;
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-[var(--color-ivory)] px-6 py-16">
                <div className="mx-auto max-w-4xl space-y-4">
                    <div className="h-6 w-40 animate-pulse rounded-lg bg-black/10" />
                    <div className="h-48 w-full animate-pulse rounded-2xl bg-black/5" />
                </div>
            </main>
        );
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-[var(--color-ivory)] px-6 pb-24 pt-28 sm:pt-32 lg:pt-36 text-[var(--color-ink)]">
            {/* Background 3D grid line matrix */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute left-[6%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute right-[6%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute left-[6%] top-[25%] h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                <div className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-[var(--color-accent)] opacity-5 blur-[100px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-4xl space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-2 border-b border-[var(--color-line-soft)] pb-4">
                    <p className="text-[8px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
                        Customer Dashboard
                    </p>
                    <h1 className="text-3xl font-medium tracking-[-0.05em] text-[var(--color-ink)] sm:text-4xl">
                        Activity Feed
                    </h1>
                    <p className="text-xs leading-5 text-[var(--color-ink-soft)]">
                        Track real-time updates, rental status changes, and payment logs.
                    </p>
                </div>

                {/* macOS Toolbar Card */}
                <LoomCard offset={true} className="w-fit">
                    <div className="flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] border border-black/10" />
                            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e] border border-black/10" />
                            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840] border border-black/10" />
                            <span className="ml-2.5 h-3.5 w-px bg-[var(--color-line-soft)]" />
                            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                                ACTIVITY LOGS // {filteredActivities.length}
                            </span>
                        </div>

                        <div className="relative flex items-center gap-1 rounded-xl bg-[#e8e4d8]/70 p-1 border border-white/60 shadow-inner">
                            {(["all", "status", "payment"] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveFilter(tab)}
                                    className={`relative z-10 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.16em] transition-all duration-300 ${
                                        activeFilter === tab
                                            ? "bg-[var(--color-ink)] text-white shadow-sm"
                                            : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </LoomCard>

                {error && (
                    <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
                        <AlertCircle size={15} />
                        {error}
                    </div>
                )}

                {/* Activity Feed Items */}
                {filteredActivities.length === 0 ? (
                    <div className="rounded-2xl border border-[var(--color-line)] bg-white/30 p-12 text-center backdrop-blur-md">
                        <Bell size={32} className="mx-auto text-[var(--color-muted)]" strokeWidth={1.2} />
                        <h3 className="mt-3 text-base font-medium">No activity records</h3>
                        <p className="mt-1 text-xs text-[var(--color-muted)]">
                            Your recent activity updates will appear here.
                        </p>
                        <Link
                            to="/app/explore"
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--color-ink)] px-5 py-2.5 text-[8px] font-medium uppercase tracking-[0.18em] text-white hover:bg-[var(--color-accent)] transition-colors"
                        >
                            Explore products
                        </Link>
                    </div>
                ) : (
                    <div className="relative space-y-4">
                        {/* Vertical timeline line */}
                        <div aria-hidden="true" className="absolute left-7 top-4 bottom-4 w-px bg-black/[0.08]" />

                        {filteredActivities.map((act) => (
                            <div
                                key={act.id}
                                onClick={() => navigate(`/app/rentals/${act.rentalId}`)}
                                className="group relative cursor-pointer overflow-hidden rounded-[1.5rem] border border-white/90 bg-gradient-to-b from-[#faf8f3] via-[#f6f3ea] to-[#f0ebdf] p-4 sm:p-5 shadow-[0_12px_30px_rgba(23,23,23,0.06)] backdrop-blur-xl transition-all duration-300 hover:border-[var(--color-accent)]/40 hover:shadow-md"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icon Badge */}
                                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white bg-white/90 shadow-xs">
                                        {getIcon(act.type, act.status)}
                                    </div>

                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-base font-medium tracking-[-0.03em] text-[var(--color-ink)]">
                                                {act.title}
                                            </h3>
                                            <span className="text-[9px] font-mono text-[var(--color-muted)]">
                                                {act.timestamp}
                                            </span>
                                        </div>

                                        <p className="text-xs text-[var(--color-ink-soft)]">
                                            {act.description}
                                        </p>

                                        <div className="flex items-center gap-3 pt-1 text-[9px] font-mono uppercase tracking-wider text-[var(--color-muted)]">
                                            <span>ORDER ID: RN-{act.rentalId.slice(0, 8).toUpperCase()}</span>
                                            {act.amount && (
                                                <span className="font-semibold text-[var(--color-ink)]">
                                                    • ₹{Number(act.amount).toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-[var(--color-ink)] group-hover:bg-[var(--color-ink)] group-hover:text-white transition-colors">
                                        <ArrowUpRight size={14} />
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default Activity;
