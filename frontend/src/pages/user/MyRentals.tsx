import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowUpRight,
    Calendar,
    Package,
    AlertCircle,
    Copy,
    Check,
    MoreHorizontal,
    Compass
} from "lucide-react";
import { getRentals, cancelRental, type RentalDetail } from "../../api/rentals.api";
import LoomCard from "../../components/ui/LoomCard";

function MyRentals() {
    const navigate = useNavigate();
    const [rentals, setRentals] = useState<RentalDetail[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<"all" | "active" | "completed" | "cancelled">("all");
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [bannerHovered, setBannerHovered] = useState(false);

    const [cardMousePos, setCardMousePos] = useState<{ [key: string]: { x: number; y: number } }>({});

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
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
        setCardMousePos((prev) => ({ ...prev, [id]: { x, y } }));
    };

    const handleMouseLeave = (id: string) => {
        setCardMousePos((prev) => ({ ...prev, [id]: { x: 0, y: 0 } }));
        setHoveredCard(null);
    };

    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case "confirmed":
            case "active":
                return {
                    text: "text-emerald-700",
                    label: "• ACTIVE",
                    bg: "bg-emerald-50/80 border-emerald-200"
                };
            case "pending_payment":
                return {
                    text: "text-[var(--color-accent)]",
                    label: "• PENDING PAYMENT",
                    bg: "bg-orange-50/80 border-orange-200"
                };
            case "return_pending":
            case "returned":
            case "completed":
                return {
                    text: "text-blue-700",
                    label: "• COMPLETED",
                    bg: "bg-blue-50/80 border-blue-200"
                };
            case "overdue":
                return {
                    text: "text-rose-700",
                    label: "• OVERDUE",
                    bg: "bg-rose-50/80 border-rose-200"
                };
            case "cancelled":
                return {
                    text: "text-[var(--color-muted)]",
                    label: "• CANCELLED",
                    bg: "bg-stone-100/80 border-stone-200"
                };
            default:
                return {
                    text: "text-[var(--color-muted)]",
                    label: `• ${status.toUpperCase()}`,
                    bg: "bg-stone-100/80 border-stone-200"
                };
        }
    };

    const filteredRentals = rentals.filter((r) => {
        const s = r.status.toLowerCase();
        if (activeTab === "active") return ["confirmed", "ready_for_pickup", "active", "pending_payment"].includes(s);
        if (activeTab === "completed") return ["returned", "completed"].includes(s);
        if (activeTab === "cancelled") return s === "cancelled";
        return true;
    });

    if (isLoading) {
        return (
            <main className="min-h-screen bg-[var(--color-ivory)] px-6 py-12">
                <div className="mx-auto max-w-4xl space-y-4">
                    <div className="h-6 w-40 animate-pulse rounded-lg bg-black/10" />
                    <div className="h-48 w-full animate-pulse rounded-2xl bg-black/5" />
                </div>
            </main>
        );
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-[var(--color-ivory)] px-6 pb-20 pt-28 sm:pt-32 lg:pt-36 text-[var(--color-ink)]">
            {/* 3D Grid Overlay */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute left-[6%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute left-[22%] top-0 h-full w-px bg-[var(--color-line-soft)] opacity-50" />
                <div className="absolute right-[22%] top-0 h-full w-px bg-[var(--color-line-soft)] opacity-50" />
                <div className="absolute right-[6%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                {/* Nodes */}
                <div className="absolute left-[6%] top-[18%] h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                <div className="absolute right-[6%] top-[42%] h-1.5 w-1.5 rounded-full bg-black/20" />

                {/* Studio lighting */}
                <div className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-[var(--color-accent)] opacity-5 blur-[100px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-4xl space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-2 border-b border-[var(--color-line-soft)] pb-4">
                    <p className="text-[8px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
                        Customer Dashboard
                    </p>
                    <h1 className="text-3xl font-medium tracking-[-0.05em] text-[var(--color-ink)] sm:text-4xl">
                        My Rentals
                    </h1>
                    <p className="text-xs leading-5 text-[var(--color-ink-soft)]">
                        Track, manage and explore your rental orders.
                    </p>
                </div>

                {/* macOS Loom Filter Toolbar Card */}
                <LoomCard offset={true}>
                    <div className="flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center sm:justify-between">
                        {/* macOS Window Controls & Status */}
                        <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] border border-black/10 shadow-xs" />
                            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e] border border-black/10 shadow-xs" />
                            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840] border border-black/10 shadow-xs" />
                            <span className="ml-2.5 h-3.5 w-px bg-[var(--color-line-soft)]" />
                            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                                RENTALS ARCHIVE // 0{rentals.length}
                            </span>
                        </div>

                        {/* Animated Segmented Filter Tabs */}
                        <div className="relative flex items-center gap-1 rounded-xl bg-[#e8e4d8]/70 p-1 border border-white/60 shadow-inner">
                            {(["all", "active", "completed", "cancelled"] as const).map((tab) => {
                                const count = rentals.filter((r) => {
                                    const s = r.status.toLowerCase();
                                    if (tab === "active") return ["confirmed", "ready_for_pickup", "active", "pending_payment"].includes(s);
                                    if (tab === "completed") return ["returned", "completed"].includes(s);
                                    if (tab === "cancelled") return s === "cancelled";
                                    return true;
                                }).length;

                                const isActive = activeTab === tab;

                                return (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`relative z-10 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.16em] transition-all duration-300 ease-out active:scale-95 ${isActive
                                                ? "bg-[var(--color-ink)] text-white shadow-[0_4px_12px_rgba(23,23,23,0.18)] scale-[1.02]"
                                                : "text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:scale-105"
                                            }`}
                                    >
                                        <span>{tab}</span>
                                        <span className={`text-[7px] px-1.5 py-0.2 rounded-full font-mono transition-colors duration-300 ${isActive ? "bg-white/20 text-white" : "bg-black/5 text-[var(--color-muted)]"
                                            }`}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </LoomCard>

                {/* DISCOVER COMPACT BANNER CARD */}
                <div
                    onMouseEnter={() => setBannerHovered(true)}
                    onMouseLeave={() => setBannerHovered(false)}
                    className="relative group [perspective:1200px]"
                >
                    {/* Stacked depth layer */}
                    <div
                        className="absolute inset-0 rounded-2xl bg-[var(--color-ivory-soft)] shadow-sm transition-all duration-300"
                        style={{
                            transform: bannerHovered ? "translate(4px, 6px)" : "translate(2px, 4px)",
                        }}
                    />

                    {/* Main Banner Card */}
                    <div
                        className="relative overflow-hidden rounded-2xl border border-white/80 bg-gradient-to-r from-white/60 via-white/40 to-white/20 p-5 sm:p-6 shadow-sm backdrop-blur-xl transition-all duration-300"
                        style={{
                            transform: bannerHovered
                                ? "perspective(1200px) rotateX(-1deg) rotateY(1deg) translateZ(6px)"
                                : "perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
                        }}
                    >
                        {/* Circle Arrow badge */}
                        <Link
                            to="/app/explore"
                            className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-line)] bg-white/60 text-[var(--color-accent)] backdrop-blur-md hover:scale-105 hover:bg-white transition-all"
                        >
                            <ArrowUpRight size={14} />
                        </Link>

                        <div className="grid gap-6 md:grid-cols-[1.3fr_0.7fr] items-center">
                            <div className="space-y-2">
                                <span className="text-[8px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
                                    Discover
                                </span>

                                <h2 className="text-2xl font-medium tracking-[-0.04em] leading-snug">
                                    Find something{" "}
                                    <span className="font-[var(--font-display)] italic font-normal">
                                        worth renting.
                                    </span>
                                </h2>

                                <p className="max-w-md text-xs leading-5 text-[var(--color-ink-soft)]">
                                    From everyday essentials to something you only need for a moment.
                                </p>

                                <Link
                                    to="/app/explore"
                                    className="inline-flex items-center gap-1.5 text-[8px] font-medium uppercase tracking-[0.2em] text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors pt-1"
                                >
                                    Explore collection
                                    <ArrowUpRight size={12} />
                                </Link>
                            </div>

                            {/* Compact Graphic */}
                            <div className="relative hidden md:flex items-center justify-center h-28">
                                <div className="h-20 w-20 rounded-full border border-[var(--color-line-soft)] bg-white/50 p-1 shadow-inner flex items-center justify-center">
                                    <div className="h-16 w-16 rounded-full border border-white bg-white/80 shadow-sm backdrop-blur-md flex flex-col items-center justify-center gap-1">
                                        <Compass size={22} className="text-[var(--color-accent)]" strokeWidth={1.4} />
                                        <span className="text-[7px] uppercase tracking-[0.2em] text-[var(--color-muted)]">Rent</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50/80 p-3.5 text-xs text-red-700">
                        <AlertCircle size={15} />
                        {error}
                    </div>
                )}

                {/* RENTAL ORDER CARDS (COMPACT 3D) */}
                {filteredRentals.length === 0 ? (
                    <div className="rounded-2xl border border-[var(--color-line)] bg-white/30 p-12 text-center backdrop-blur-md">
                        <Package size={32} className="mx-auto text-[var(--color-muted)]" strokeWidth={1.2} />
                        <h3 className="mt-3 text-base font-medium">No rentals found</h3>
                        <p className="mt-1 text-xs text-[var(--color-muted)]">
                            You don't have any {activeTab !== "all" ? activeTab : ""} rentals yet.
                        </p>
                        <Link
                            to="/app/explore"
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--color-ink)] px-5 py-2.5 text-[8px] font-medium uppercase tracking-[0.18em] text-white hover:bg-[var(--color-accent)] transition-colors"
                        >
                            Explore products
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredRentals.map((rental, idx) => {
                            const mainItem = rental.items[0];
                            const canCancel = ["confirmed", "ready_for_pickup", "pending_payment"].includes(
                                rental.status.toLowerCase()
                            );
                            const statusStyle = getStatusStyle(rental.status);
                            const pos = cardMousePos[rental.id] || { x: 0, y: 0 };
                            const isHovered = hoveredCard === rental.id;

                            return (
                                <div
                                    key={rental.id}
                                    onMouseEnter={() => setHoveredCard(rental.id)}
                                    onMouseMove={(e) => handleMouseMove(e, rental.id)}
                                    onMouseLeave={() => handleMouseLeave(rental.id)}
                                    className="relative group [perspective:1400px]"
                                >
                                    {/* 3D Stacked Extrusion Shadow */}
                                    <div
                                        className="absolute inset-0 rounded-[1.75rem] bg-[#e1dcce] border border-black/5 shadow-[0_15px_30px_rgba(23,23,23,0.06)] transition-all duration-300"
                                        style={{
                                            transform: isHovered
                                                ? "translate(6px, 9px)"
                                                : "translate(3px, 5px)",
                                        }}
                                    />

                                    {/* Main macOS Studio Card */}
                                    <div
                                        onClick={() => navigate(`/app/rentals/${rental.id}`)}
                                        className="relative cursor-pointer overflow-hidden rounded-[1.75rem] border border-white/90 bg-gradient-to-b from-[#faf8f3] via-[#f6f3ea] to-[#f0ebdf] shadow-[0_20px_45px_rgba(23,23,23,0.07)] backdrop-blur-xl transition-all duration-300 hover:border-[var(--color-accent)]/40"
                                        style={{
                                            transform: isHovered
                                                ? `perspective(1400px) rotateX(${pos.y}deg) rotateY(${pos.x}deg) translateZ(10px)`
                                                : "perspective(1400px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
                                        }}
                                    >
                                        {/* Light glare shine */}
                                        <div
                                            className={`pointer-events-none absolute -left-1/3 top-0 h-full w-1/3 skew-x-[-20deg] bg-white/40 blur-lg transition-transform duration-1000 ${
                                                isHovered ? "translate-x-[500%]" : "-translate-x-[100%]"
                                            }`}
                                        />

                                        {/* macOS Card Window Header Bar */}
                                        <div className="flex items-center justify-between border-b border-black/[0.06] bg-white/40 px-5 py-2.5 backdrop-blur-md">
                                            <div className="flex items-center gap-1.5">
                                                <span className="h-2 w-2 rounded-full bg-[#ff5f57] border border-black/10" />
                                                <span className="h-2 w-2 rounded-full bg-[#febc2e] border border-black/10" />
                                                <span className="h-2 w-2 rounded-full bg-[#28c840] border border-black/10" />
                                                <span className="ml-2 font-mono text-[7.5px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                                                    ORDER_0{idx + 1}
                                                </span>
                                            </div>

                                            <button
                                                onClick={(e) => e.stopPropagation()}
                                                className="text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
                                            >
                                                <MoreHorizontal size={14} />
                                            </button>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-5 sm:p-6">
                                            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                                                {/* Left: Product Thumbnail & Meta */}
                                                <div className="flex items-center gap-5">
                                                    {/* Studio Thumbnail Box */}
                                                    <div className="relative flex h-18 w-18 shrink-0 items-center justify-center rounded-2xl border border-white bg-gradient-to-b from-[#f5f2e9] to-[#ebe7dc] shadow-[0_8px_18px_rgba(23,23,23,0.08)]">
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 shadow-xs border border-stone-200/60">
                                                            <Package size={24} className="text-stone-700" strokeWidth={1.3} />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1">
                                                        {/* Status Badge */}
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-[8.5px] font-bold tracking-wider ${statusStyle.text}`}>
                                                                {statusStyle.label}
                                                            </span>
                                                        </div>

                                                        {/* Product Title */}
                                                        <h3 className="text-xl font-medium tracking-[-0.04em] text-[var(--color-ink)]">
                                                            {mainItem?.product_name || "Rental Order"}
                                                        </h3>

                                                        {/* SKU Specs */}
                                                        <p className="text-[10px] text-[var(--color-muted)]">
                                                            Variant: <span className="font-medium text-[var(--color-ink)]">{mainItem?.variant_sku || "Standard"}</span> • Qty: <span className="font-medium text-[var(--color-ink)]">{mainItem?.quantity || 1}</span>
                                                        </p>

                                                        {/* Dates */}
                                                        <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-muted)] pt-0.5">
                                                            <Calendar size={11} className="text-[var(--color-accent)]" />
                                                            <span>
                                                                {new Date(rental.start_at).toLocaleDateString()} - {new Date(rental.end_at).toLocaleDateString()}
                                                            </span>
                                                        </div>

                                                        {/* Rental ID Pill */}
                                                        <div className="pt-1.5">
                                                            <button
                                                                onClick={(e) => handleCopyId(e, rental.id)}
                                                                className="inline-flex items-center gap-1.5 rounded-lg border border-white/90 bg-white/60 px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[var(--color-muted)] hover:text-[var(--color-ink)] shadow-xs transition-colors"
                                                            >
                                                                <span>RENTAL ID</span>
                                                                <span className="font-mono text-[var(--color-ink)]">
                                                                    RN-{rental.id.slice(0, 8).toUpperCase()}
                                                                </span>
                                                                {copiedId === rental.id ? (
                                                                    <Check size={10} className="text-emerald-600" />
                                                                ) : (
                                                                    <Copy size={9} className="text-[var(--color-muted)]" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right: Financial & Actions */}
                                                <div className="flex items-center justify-between gap-5 border-t border-black/[0.06] pt-4 md:border-t-0 md:pt-0 md:justify-end">
                                                    <div className="text-left md:text-right">
                                                        <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[var(--color-muted)]">
                                                            TOTAL AMOUNT
                                                        </p>
                                                        <p className="text-2xl font-medium tracking-[-0.04em] text-[var(--color-ink)]">
                                                            ₹{Number(rental.total_amount).toFixed(2)}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-2.5">
                                                        {canCancel && (
                                                            <button
                                                                onClick={(e) => handleCancel(e, rental.id)}
                                                                className="rounded-xl border border-rose-200/90 bg-rose-50/80 px-3.5 py-1.5 text-[8px] font-bold uppercase tracking-wider text-rose-700 hover:bg-rose-100 shadow-xs transition-colors"
                                                            >
                                                                CANCEL
                                                            </button>
                                                        )}

                                                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-ink)] text-white shadow-md group-hover:bg-[var(--color-accent)] transition-colors">
                                                            <ArrowUpRight size={15} />
                                                        </span>
                                                    </div>
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
        </main>
    );
}

export default MyRentals;
