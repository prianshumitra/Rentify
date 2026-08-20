import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    ArrowUpRight,
    Compass,
    Package,
    Sparkles,
    Zap,
    CheckCircle2,
    CreditCard,
    XCircle

} from "lucide-react";

import LoomCard from "../../components/ui/LoomCard";
import { useAuth } from "../../context/AuthContext";


import { getRentals, type RentalDetail } from "../../api/rentals.api";

interface MousePosition {
    x: number;
    y: number;
}

interface UserActivityItem {
    id: string;
    rentalId: string;
    title: string;
    description: string;
    timestamp: string;
    type: "status" | "payment" | "creation" | "alert";
    status: string;
    amount?: number;
}

function UserHome() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [rentals, setRentals] = useState<RentalDetail[]>([]);
    const [activities, setActivities] = useState<UserActivityItem[]>([]);

    const firstName = user?.first_name || "there";

    const [mouse, setMouse] = useState<MousePosition>({
        x: 0,
        y: 0,
    });

    useEffect(() => {
        async function fetchUserRentals() {
            try {
                const data = await getRentals();
                setRentals(data);

                // Map real rentals into recent activity stream
                const events: UserActivityItem[] = [];

                data.forEach((r) => {
                    const item = r.items[0];
                    const dateStr = r.created_at
                        ? new Date(r.created_at).toLocaleDateString()
                        : new Date().toLocaleDateString();

                    // Event 1: Request Initiated
                    events.push({
                        id: `${r.id}-created`,
                        rentalId: r.id,
                        title: `Rental Request Initiated`,
                        description: `${item?.product_name || "Product"} (${item?.variant_sku || "Standard"})`,
                        timestamp: dateStr,
                        type: "creation",
                        status: r.status,
                        amount: r.total_amount,
                    });

                    // Event 2: Pending Payment
                    if (r.status.toLowerCase() === "pending_payment") {
                        events.push({
                            id: `${r.id}-payment`,
                            rentalId: r.id,
                            title: `Checkout Session Ready`,
                            description: `Payment required: ₹${Number(r.total_amount).toFixed(2)}`,
                            timestamp: dateStr,
                            type: "payment",
                            status: r.status,
                            amount: r.total_amount,
                        });
                    } else if (r.status.toLowerCase() === "confirmed" || r.status.toLowerCase() === "active") {
                        events.push({
                            id: `${r.id}-confirmed`,
                            rentalId: r.id,
                            title: `Reservation Active & Confirmed`,
                            description: `Scheduled until ${new Date(r.end_at).toLocaleDateString()}`,
                            timestamp: dateStr,
                            type: "status",
                            status: r.status,
                            amount: r.total_amount,
                        });
                    } else if (r.status.toLowerCase() === "cancelled") {
                        events.push({
                            id: `${r.id}-cancelled`,
                            rentalId: r.id,
                            title: `Order Terminated`,
                            description: `Rental #${r.id.slice(0, 8)} was cancelled`,
                            timestamp: dateStr,
                            type: "alert",
                            status: r.status,
                            amount: r.total_amount,
                        });
                    }
                });

                setActivities(events.slice(0, 4)); // Get top 4 recent events
            } catch (err) {
                console.error("Failed to fetch user rentals:", err);
            }
        }
        fetchUserRentals();
    }, []);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const x = (event.clientX / window.innerWidth - 0.5) * 2;
            const y = (event.clientY / window.innerHeight - 0.5) * 2;
            setMouse({ x, y });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    const getTypeIcon = (type: string, status: string) => {
        if (status.toLowerCase() === "cancelled") return <XCircle size={14} className="text-rose-600" />;
        if (type === "payment") return <CreditCard size={14} className="text-amber-600" />;
        if (type === "status") return <CheckCircle2 size={14} className="text-emerald-600" />;
        return <Package size={14} className="text-[var(--color-accent)]" />;
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-[var(--color-ivory)]">

            {/* ═══════════════════════════════════════════
                BACKGROUND RENTAL GRID
            ═══════════════════════════════════════════ */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
            >
                <div className="absolute left-[8%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute left-[24%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute left-1/2 top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute right-[24%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute right-[8%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute left-0 top-[22%] h-px w-full bg-[var(--color-line-soft)]" />
                <div className="absolute left-0 top-1/2 h-px w-full bg-[var(--color-line-soft)]" />
                <div className="absolute left-0 top-[78%] h-px w-full bg-[var(--color-line-soft)]" />

                <div
                    className="absolute left-[24%] top-[22%] h-1.5 w-1.5 rounded-full bg-[var(--color-ink)] transition-transform duration-500"
                    style={{
                        transform: `translate(${mouse.x * 10}px, ${mouse.y * 10}px)`,
                    }}
                />

                <div
                    className="absolute right-[24%] top-1/2 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] transition-transform duration-500"
                    style={{
                        transform: `translate(${mouse.x * -10}px, ${mouse.y * -10}px)`,
                    }}
                />

                <div
                    className="absolute left-1/2 top-[38%] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[var(--color-accent)]/[0.055] blur-[120px]"
                    style={{
                        transform: `translate(calc(-50% + ${mouse.x * 30}px), ${mouse.y * 25}px)`,
                    }}
                />
            </div>

            {/* ═══════════════════════════════════════════
                MAIN CONTENT
            ═══════════════════════════════════════════ */}
            <section className="relative z-10 mx-auto max-w-[var(--content-width)] px-[var(--content-padding)] pb-16 pt-20">

                {/* TOP BAR */}
                <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <span className="h-px w-6 bg-[var(--color-accent)]" />
                        <span className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[var(--color-muted)]">
                            Rental / Home
                        </span>
                    </div>

                    <span className="hidden text-[8px] uppercase tracking-[0.24em] text-[var(--color-muted)] sm:block">
                        01 / 04
                    </span>
                </div>

                {/* HERO */}
                <div className="relative mx-auto max-w-6xl">
                    <LoomCard>
                        <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rotate-45 border border-[var(--color-accent)]/[0.08]"
                            />

                            <div
                                className="absolute right-6 top-6 hidden h-12 w-12 items-center justify-center rounded-full border border-[var(--color-line)] bg-[var(--color-ivory)]/70 shadow-sm backdrop-blur-md sm:flex"
                                style={{
                                    transform: `translate(${mouse.x * 6}px, ${mouse.y * 6}px)`,
                                }}
                            >
                                <div className="text-center">
                                    <p className="text-[9px] font-medium">01</p>
                                    <p className="text-[5.5px] uppercase tracking-[0.2em] text-[var(--color-muted)]">Home</p>
                                </div>
                            </div>

                            <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row">
                                <div className="max-w-2xl">
                                    <div className="mb-4 flex items-center gap-2.5">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-ivory)]">
                                            <Sparkles size={11} strokeWidth={1.5} />
                                        </span>
                                        <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
                                            Your rental space
                                        </p>
                                    </div>

                                    <h1 className="max-w-3xl text-[clamp(2.5rem,5.5vw,4.5rem)] font-medium leading-[0.9] tracking-[-0.06em]">
                                        Good to see
                                        <br />
                                        <span className="font-[var(--font-display)] italic">
                                            you, {firstName}.
                                        </span>
                                    </h1>

                                    <p className="mt-4 max-w-md text-xs leading-6 text-[var(--color-ink-soft)] sm:text-sm">
                                        Your rental world is waiting. Discover something useful, unexpected, or simply worth having for a while.
                                    </p>

                                    <div className="mt-6 flex flex-wrap gap-2.5">
                                        <Link
                                            to="/app/explore"
                                            className="group flex items-center gap-3 rounded-full bg-[var(--color-ink)] px-5 py-3 text-[8.5px] font-semibold uppercase tracking-[0.2em] !text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--color-accent)]"
                                        >
                                            <Compass size={13} strokeWidth={1.5} />
                                            Explore rentals
                                            <ArrowUpRight
                                                size={13}
                                                strokeWidth={1.5}
                                                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                            />
                                        </Link>
                                    </div>
                                </div>

                                <div
                                    className="hidden w-36 shrink-0 self-end lg:block"
                                    style={{
                                        transform: `translate(${mouse.x * -8}px, ${mouse.y * -8}px) rotate(${mouse.x * -1.5}deg)`,
                                    }}
                                >
                                    <div className="rounded-2xl border border-[var(--color-line)] bg-white/50 p-4 shadow-sm backdrop-blur-xl">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[6.5px] uppercase tracking-[0.22em] text-[var(--color-muted)]">Status</span>
                                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] shadow-[0_0_8px_rgba(190,85,55,.4)]" />
                                        </div>

                                        <p className="mt-4 text-2xl font-medium tracking-tight">Ready.</p>
                                        <p className="mt-1 text-[8.5px] leading-4 text-[var(--color-muted)]">
                                            Your rental journey starts here.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </LoomCard>
                </div>

                {/* QUICK DISCOVERY */}
                <div className="mx-auto mt-6 grid max-w-6xl gap-5 md:grid-cols-[1.15fr_.85fr]">
                    <LoomCard>
                        <div className="min-h-[220px] p-5 sm:p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                                        Discover
                                    </span>
                                    <Compass size={15} strokeWidth={1.4} className="text-[var(--color-accent)]" />
                                </div>

                                <div className="mt-6">
                                    <h2 className="text-2xl font-medium leading-[0.95] tracking-tight sm:text-3xl">
                                        Find something
                                        <br />
                                        <span className="font-[var(--font-display)] italic">worth renting.</span>
                                    </h2>

                                    <p className="mt-3 max-w-md text-xs leading-5 text-[var(--color-muted)]">
                                        From everyday essentials to equipment you only need for a moment.
                                    </p>
                                </div>
                            </div>

                            <Link
                                to="/app/explore"
                                className="group mt-5 flex w-fit items-center gap-1.5 text-[8.5px] font-semibold uppercase tracking-[0.2em] text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
                            >
                                Explore collection
                                <ArrowUpRight
                                    size={12}
                                    strokeWidth={1.5}
                                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                />
                            </Link>
                        </div>
                    </LoomCard>

                    <LoomCard offset={false}>
                        <div className="relative min-h-[220px] overflow-hidden rounded-[1.5rem] bg-[var(--color-ink)] p-5 text-[var(--color-ivory)] sm:p-6 flex flex-col justify-between">
                            <div
                                aria-hidden="true"
                                className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/[0.06]"
                            />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between">
                                    <span className="text-[8px] font-semibold uppercase tracking-[0.22em] text-white/45">
                                        Your rental
                                    </span>
                                    <Package size={15} strokeWidth={1.4} className="text-[var(--color-accent)]" />
                                </div>

                                <div className="mt-6">
                                    <p className="text-[7.5px] uppercase tracking-[0.2em] text-white/40">Active rentals</p>
                                    <p className="mt-1 text-4xl font-medium tracking-tight sm:text-5xl">
                                        {String(rentals.length).padStart(2, "0")}
                                    </p>
                                    <p className="mt-2 max-w-xs text-xs leading-5 text-white/50">
                                        {rentals.length > 0
                                            ? `${rentals.length} active rental item(s) in your space.`
                                            : "Nothing is currently woven into your rental space."}
                                    </p>
                                </div>

                                <Link
                                    to="/app/rentals"
                                    className="group mt-5 flex w-fit items-center gap-1.5 text-[8.5px] uppercase tracking-[0.18em] !text-white/70 transition-colors hover:!text-white"
                                >
                                    View my rentals
                                    <ArrowUpRight
                                        size={12}
                                        strokeWidth={1.5}
                                        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                    />
                                </Link>
                            </div>
                        </div>
                    </LoomCard>
                </div>

                {/* CATEGORY STRIP */}
                <div className="mx-auto mt-6 max-w-6xl">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                                Browse by feeling
                            </p>
                            <h2 className="mt-1 text-xl font-medium tracking-tight">
                                What are you looking for?
                            </h2>
                        </div>
                        <span className="hidden text-[7.5px] uppercase tracking-[0.2em] text-[var(--color-muted)] sm:block">
                            02 / 04
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
                        {[
                            { title: "For work", subtitle: "Tools & gear" },
                            { title: "For travel", subtitle: "Go further" },
                            { title: "For moments", subtitle: "Events & more" },
                            { title: "Just because", subtitle: "Discover" },
                        ].map((category, index) => (
                            <Link
                                key={category.title}
                                to="/app/explore"
                                className="group relative overflow-hidden rounded-xl border border-[var(--color-line)] bg-white/35 p-4 shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/70 hover:border-[var(--color-accent)]/50 hover:shadow-md"
                            >
                                <span className="text-[7.5px] font-mono text-[var(--color-muted)]">
                                    0{index + 1}
                                </span>

                                <div className="mt-6">
                                    <p className="text-xs font-medium text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors">{category.title}</p>
                                    <p className="mt-0.5 text-[8.5px] text-[var(--color-muted)]">{category.subtitle}</p>
                                </div>

                                <ArrowUpRight
                                    size={12}
                                    strokeWidth={1.4}
                                    className="absolute bottom-4 right-4 text-[var(--color-muted)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]"
                                />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ═══════════════════════════════════════
                    LIVE YOUR ACTIVITY STREAM SECTION
                ═══════════════════════════════════════ */}
                <div className="mx-auto mt-6 max-w-6xl">
                    <LoomCard>
                        <div className="p-5 sm:p-6 space-y-4">
                            <div className="flex items-center justify-between border-b border-[var(--color-line-soft)] pb-3">
                                <div>
                                    <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                                        Current rental thread
                                    </p>
                                    <h2 className="mt-1 text-lg font-medium tracking-tight">
                                        Your Activity
                                    </h2>
                                </div>

                                <Link
                                    to="/app/activity"
                                    className="inline-flex items-center gap-1 text-[8.5px] font-semibold uppercase tracking-wider text-[var(--color-accent)] hover:text-[var(--color-ink)] transition-colors"
                                >
                                    <span>Full Feed</span>
                                    <ArrowUpRight size={12} />
                                </Link>
                            </div>

                            {activities.length > 0 ? (
                                <div className="space-y-2.5">
                                    {activities.map((act) => (
                                        <div
                                            key={act.id}
                                            onClick={() => navigate(`/app/rentals/${act.rentalId}`)}
                                            className="group flex items-center justify-between gap-4 rounded-xl border border-black/5 bg-white/60 p-3 shadow-xs transition-all duration-300 hover:bg-white hover:border-[var(--color-accent)]/40 hover:-translate-y-0.5 cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white bg-white shadow-xs">
                                                    {getTypeIcon(act.type, act.status)}
                                                </div>

                                                <div className="space-y-0.5 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-[8px] text-[var(--color-muted)]">
                                                            {act.timestamp}
                                                        </span>
                                                        <span className="font-mono text-[8px] text-[var(--color-muted)]">
                                                            • RN-{act.rentalId.slice(0, 8).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs font-medium text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors truncate">
                                                        {act.title}
                                                    </p>
                                                    <p className="text-[11px] text-[var(--color-ink-soft)] truncate">
                                                        {act.description}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 shrink-0">
                                                {act.amount && (
                                                    <span className="font-mono text-xs font-medium text-[var(--color-ink)]">
                                                        ₹{Number(act.amount).toFixed(2)}
                                                    </span>
                                                )}
                                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-ink)] text-white shadow-xs group-hover:bg-[var(--color-accent)] transition-colors">
                                                    <ArrowUpRight size={12} />
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid min-h-[140px] place-items-center">
                                    <div className="text-center">
                                        <div className="relative mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-line)]">
                                            <span className="absolute h-6 w-6 rounded-full border border-[var(--color-line-soft)]" />
                                            <span className="relative h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] shadow-[0_0_10px_rgba(190,85,55,.45)]" />
                                        </div>

                                        <p className="mt-3 text-xs text-[var(--color-ink-soft)]">
                                            Your activity will appear here as your rental thread grows.
                                        </p>

                                        <Link
                                            to="/app/explore"
                                            className="mt-3 inline-flex items-center gap-1.5 text-[8.5px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
                                        >
                                            Start weaving
                                            <Zap size={11} strokeWidth={1.5} />
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </LoomCard>
                </div>

            </section>
        </main>
    );
}


export default UserHome;