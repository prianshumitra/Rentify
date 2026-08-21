import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Package,
    Boxes,
    DollarSign,
    ShoppingBag,
    ArrowUpRight,
    Plus,
    TrendingUp,
    CheckCircle2,
    Clock,
    Activity,
    RefreshCw,
    PieChart,
    ArrowRight,
    TrendingDown,
    Wallet,
    Star,
    ShieldCheck,
    Award,
    Zap,
    QrCode,
    Truck,
    CreditCard,
} from "lucide-react";
import apiClient from "../../api/client";
import { getRentals, type RentalDetail } from "../../api/rentals.api";

// ---------------------------------------------------------------------------
// Loom Card Wrapper Component - Premium Slate & Charcoal Grey Palette
// ---------------------------------------------------------------------------

function LoomCard({
    children,
    className = "",
    onClick,
}: {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className={`group relative ${onClick ? "cursor-pointer" : ""} ${className}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={onClick}
        >
            {/* Loom offset accent layer */}
            <div
                className="absolute inset-0 rounded-2xl border border-[#c2b49c] bg-[#ded1ba] transition-all duration-300 shadow-xs"
                style={{
                    transform: hovered
                        ? "translate(4px, 4.5px)"
                        : "translate(2.5px, 3px)",
                }}
            />

            {/* Loom depth layer */}
            <div
                className="absolute inset-0 rounded-2xl border border-[#d8cdb8] bg-[#ebe2cf] transition-all duration-300"
                style={{
                    transform: hovered
                        ? "translate(2px, 2.5px)"
                        : "translate(1.5px, 2px)",
                }}
            />

            {/* Main surface */}
            <div
                className="relative h-full overflow-hidden rounded-2xl border border-[#c4b69d] bg-white transition-all duration-300 ease-out"
                style={{
                    transform: hovered ? "translateY(-2.5px)" : "translateY(0)",
                    boxShadow: hovered
                        ? "0 16px 35px -12px rgba(39, 39, 42, 0.22), 0 6px 18px -4px rgba(0,0,0,0.1)"
                        : "0 6px 20px -10px rgba(40,30,10,0.12)",
                }}
            >
                {/* Ambient glow accent in soft neutral grey */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-zinc-400/10 blur-2xl transition-transform duration-500 group-hover:scale-125"
                />
                {children}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Smooth Bezier Curve SVG Generator
// ---------------------------------------------------------------------------

function generateSmoothPath(pts: { x: number; y: number }[]) {
    if (pts.length === 0) return "";
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
        const curr = pts[i];
        const next = pts[i + 1];
        const cp1x = curr.x + (next.x - curr.x) / 2;
        const cp1y = curr.y;
        const cp2x = curr.x + (next.x - curr.x) / 2;
        const cp2y = next.y;
        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    }
    return d;
}

function VendorDashboard() {
    const navigate = useNavigate();
    const [productsCount, setProductsCount] = useState(0);
    const [inventoryCount, setInventoryCount] = useState(0);
    const [rentalsCount, setRentalsCount] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [recentRentals, setRecentRentals] = useState<RentalDetail[]>([]);
    const [allRentals, setAllRentals] = useState<RentalDetail[]>([]);
    const [inventoryItems, setInventoryItems] = useState<any[]>([]);
    const [vendorProducts, setVendorProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Interactive State: Active Chart Metric & Time Period
    const [chartMetric, setChartMetric] = useState<"revenue" | "orders" | "occupancy">("revenue");
    const [timeFrame, setTimeFrame] = useState<"7d" | "30d" | "ytd">("30d");
    const [activePointIndex, setActivePointIndex] = useState<number | null>(null);

    const fetchVendorData = async (showRefresh = false) => {
        if (showRefresh) setIsRefreshing(true);
        try {
            const prodRes = await apiClient.get("/products/?my_products_only=true");
            const myProducts = Array.isArray(prodRes.data) ? prodRes.data : [];
            setVendorProducts(myProducts);
            setProductsCount(myProducts.length);
            const myProductIds = new Set(myProducts.map((p: any) => p.id));

            const invRes = await apiClient.get("/inventory/");
            const invList = Array.isArray(invRes.data) ? invRes.data : [];
            setInventoryItems(invList);
            setInventoryCount(invList.length);

            const rentalsData = await getRentals();
            const vendorRentals = rentalsData.filter((rental) => {
                if (!rental.items || rental.items.length === 0) return true;
                return rental.items.some((item) => item.product_id && myProductIds.has(item.product_id));
            });

            setAllRentals(vendorRentals);
            setRentalsCount(vendorRentals.length);
            setRecentRentals(vendorRentals.slice(0, 5));

            const revenue = vendorRentals.reduce((acc, r) => acc + (Number(r.total_amount) || 0), 0);
            setTotalRevenue(revenue);
        } catch (err) {
            console.error("Error loading vendor statistics:", err);
        } finally {
            setIsLoading(false);
            if (showRefresh) {
                setTimeout(() => setIsRefreshing(false), 400);
            }
        }
    };

    useEffect(() => {
        fetchVendorData();
    }, []);

    // Asset Utilization Breakdown
    const inventoryStats = useMemo(() => {
        const total = inventoryItems.length;
        if (total === 0) {
            return { activeCount: 0, activePct: 0, readyCount: 0, readyPct: 0, maintenanceCount: 0, maintenancePct: 0, efficiency: 0 };
        }

        let activeCount = 0;
        let readyCount = 0;
        let maintenanceCount = 0;

        inventoryItems.forEach((item) => {
            const st = (item.status || "").toLowerCase();
            if (st === "rented" || st === "reserved") {
                activeCount++;
            } else if (st === "available") {
                readyCount++;
            } else if (st === "maintenance" || st === "lost" || st === "retired") {
                maintenanceCount++;
            } else {
                readyCount++;
            }
        });

        const activePct = Math.round((activeCount / total) * 100);
        const readyPct = Math.round((readyCount / total) * 100);
        const maintenancePct = Math.round((maintenanceCount / total) * 100);
        const efficiency = total > 0 ? Math.round(((activeCount + readyCount) / total) * 100) : 0;

        return { activeCount, activePct, readyCount, readyPct, maintenanceCount, maintenancePct, efficiency };
    }, [inventoryItems]);

    // Analytics Engine
    const chartData = useMemo(() => {
        const dayNames = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
        const fullDayNames = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

        const aggregatedDays = dayNames.map((dayLabel, dayIndex) => {
            const matchingRentals = allRentals.filter((r) => {
                const dateStr = r.start_at || (r as any).created_at;
                if (!dateStr) return false;
                const d = new Date(dateStr);
                const jsDay = d.getDay();
                const normDay = jsDay === 0 ? 6 : jsDay - 1;
                return normDay === dayIndex;
            });

            const dayRev = matchingRentals.reduce((sum, r) => sum + (Number(r.total_amount) || 0), 0);
            const dayOrdersCount = matchingRentals.length;
            const totalStock = inventoryItems.length > 0 ? inventoryItems.length : 1;
            const activeOnDay = matchingRentals.filter((r) =>
                ["active", "confirmed", "ready_for_pickup"].includes((r.status || "").toLowerCase())
            ).length;
            const dayOccupancyPct = Math.min(100, Math.round((activeOnDay / totalStock) * 100));

            return {
                label: dayLabel,
                revenue: dayRev,
                orders: dayOrdersCount,
                occupancy: dayOccupancyPct,
            };
        });

        const points = aggregatedDays.map((stat) => ({
            label: stat.label,
            revenue: stat.revenue,
            orders: stat.orders,
            occupancy: stat.occupancy,
        }));

        let peakIdx = 0;
        let maxValFound = 0;
        points.forEach((p, idx) => {
            const val = chartMetric === "revenue" ? p.revenue : chartMetric === "orders" ? p.orders : p.occupancy;
            if (val >= maxValFound) {
                maxValFound = val;
                peakIdx = idx;
            }
        });

        const getMetricVal = (p: typeof points[0]) =>
            chartMetric === "revenue" ? p.revenue : chartMetric === "orders" ? p.orders : p.occupancy;

        const maxVal = Math.max(...points.map(getMetricVal), 1);
        const peakDayName = fullDayNames[peakIdx];

        const firstHalf = points.slice(0, 3).reduce((a, b) => a + getMetricVal(b), 0);
        const secondHalf = points.slice(4, 7).reduce((a, b) => a + getMetricVal(b), 0);
        const trendPct = firstHalf > 0 ? Math.round(((secondHalf - firstHalf) / firstHalf) * 100) : secondHalf > 0 ? 100 : 0;

        return { points, maxVal, peakIdx, peakDayName, trendPct };
    }, [allRentals, inventoryItems, chartMetric]);

    // Top Rentables
    const topRentables = useMemo(() => {
        if (vendorProducts.length === 0) return [];

        return vendorProducts.map((prod) => {
            const matchingRentals = allRentals.filter((r) =>
                r.items && r.items.some((item) => item.product_id === prod.id)
            );
            const rentalCount = matchingRentals.length;
            const revenue = matchingRentals.reduce((sum, r) => sum + (Number(r.total_amount) || 0), 0);
            const price = prod.daily_rate || prod.price_per_day || (prod.variants && prod.variants[0]?.unit_price) || 0;

            return {
                id: prod.id,
                title: prod.name || prod.title || "Catalog Product",
                category: prod.category?.name || "Equipment",
                price: Number(price),
                rentalsCount: rentalCount,
                revenue: Number(revenue),
            };
        }).sort((a, b) => b.revenue - a.revenue || b.rentalsCount - a.rentalsCount).slice(0, 4);
    }, [vendorProducts, allRentals]);

    // SVG Line Coordinates
    const svgCoordinates = useMemo(() => {
        const svgW = 640;
        const svgH = 150;
        const padX = 35;
        const padTop = 25;
        const padBottom = 20;
        const widthUsable = svgW - 2 * padX;
        const heightUsable = svgH - padTop - padBottom;

        const coords = chartData.points.map((pt, idx) => {
            const val = chartMetric === "revenue" ? pt.revenue : chartMetric === "orders" ? pt.orders : pt.occupancy;
            const x = padX + (idx / (chartData.points.length - 1)) * widthUsable;
            const y = svgH - padBottom - (val / chartData.maxVal) * heightUsable;
            return { x, y, val, label: pt.label };
        });

        const linePath = generateSmoothPath(coords);
        const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${svgH - padBottom} L ${coords[0].x} ${svgH - padBottom} Z`;

        return { coords, linePath, areaPath, svgW, svgH };
    }, [chartData, chartMetric]);

    const getStatusBadge = (status: string) => {
        const s = (status || "").toLowerCase();
        if (s.includes("active") || s.includes("confirm")) {
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 border border-zinc-300 px-2 py-0.5 text-[7.5px] font-bold uppercase tracking-wider text-zinc-800">
                    <CheckCircle2 size={9} className="text-zinc-700" />
                    Active
                </span>
            );
        }
        if (s.includes("pending") || s.includes("return_pending")) {
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-black/5 border border-black/15 px-2 py-0.5 text-[7.5px] font-bold uppercase tracking-wider text-zinc-800">
                    <Clock size={9} className="text-zinc-600" />
                    Pending
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-black/5 border border-black/15 px-2 py-0.5 text-[7.5px] font-bold uppercase tracking-wider text-zinc-700">
                {status.replace("_", " ")}
            </span>
        );
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-[var(--color-ivory)] px-4 py-20 text-[var(--color-ink)]">
                <div className="mx-auto max-w-6xl space-y-5">
                    <div className="h-7 w-40 animate-pulse rounded-lg bg-black/10" />
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-32 animate-pulse rounded-2xl bg-black/5" />
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-[var(--color-ivory)] px-4 pb-16 pt-16 sm:px-6 lg:px-8 sm:pt-20 text-[var(--color-ink)]">
            {/* Ambient Lighting & Grid Lines */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute left-[4%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute left-[18%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute right-[4%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute left-1/2 top-[20%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-zinc-400/[0.05] blur-[150px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl w-full space-y-4">

                {/* 1. HEADER BAR */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--color-line-soft)] pb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-zinc-700 animate-pulse shadow-[0_0_6px_rgba(39,39,42,0.5)]" />
                            <span className="text-[8px] font-black uppercase tracking-[0.25em] text-zinc-700">
                                VENDOR CONSOLE // OPERATIONAL INTELLIGENCE
                            </span>
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-3xl">
                            Vendor Console
                        </h1>
                        <p className="mt-0.5 text-xs text-[var(--color-ink-soft)] max-w-lg">
                            Real-time sales trend line, payout settlements, equipment utilization, and order dispatch queues.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button
                            onClick={() => fetchVendorData(true)}
                            title="Refresh Console Data"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#c4b69d] bg-white shadow-2xs hover:bg-[#faf6ee] hover:border-black/30 hover:text-black transition-all active:scale-95"
                        >
                            <RefreshCw size={13} className={`text-[var(--color-muted)] ${isRefreshing ? "animate-spin text-zinc-800" : ""}`} />
                        </button>

                        <Link
                            to="/vendor/products/new"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-[#c4b69d] px-4 py-2 text-[8.5px] font-extrabold uppercase tracking-wider text-[var(--color-ink)] shadow-2xs hover:bg-[#faf6ee] hover:border-black/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 shrink-0"
                        >
                            <Plus size={13} strokeWidth={2.5} className="text-zinc-800" />
                            <span>Add Product</span>
                        </Link>
                    </div>
                </div>

                {/* 2. TOP KPI ROW - CHARCOAL & SLATE GREY ACCENTS */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    {/* KPI 1 */}
                    <LoomCard onClick={() => navigate("/vendor/products")}>
                        <div className="p-4 sm:p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-700">
                                    Catalog Products
                                </span>
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-800 text-white shadow-2xs group-hover:scale-110 transition-transform">
                                    <Package size={15} strokeWidth={2} />
                                </div>
                            </div>
                            <div>
                                <p className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-[var(--color-ink)]">
                                    {productsCount}
                                </p>
                                <p className="mt-1.5 text-[8.5px] text-zinc-800 font-mono font-bold flex items-center gap-1 bg-zinc-100 border border-zinc-300 px-2 py-0.5 rounded-full w-fit">
                                    <span className="h-1 w-1 rounded-full bg-zinc-700 animate-pulse" />
                                    Active store items
                                </p>
                            </div>
                        </div>
                    </LoomCard>

                    {/* KPI 2 */}
                    <LoomCard onClick={() => navigate("/vendor/inventory")}>
                        <div className="p-4 sm:p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--color-muted)]">
                                    Serial Inventory
                                </span>
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black text-white shadow-2xs group-hover:scale-110 group-hover:bg-zinc-800 transition-all">
                                    <Boxes size={15} strokeWidth={2} />
                                </div>
                            </div>
                            <div>
                                <p className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-[var(--color-ink)]">
                                    {inventoryCount}
                                </p>
                                <p className="mt-1.5 text-[8.5px] text-zinc-800 font-mono font-bold flex items-center gap-1 bg-black/5 border border-black/15 px-2 py-0.5 rounded-full w-fit">
                                    <span className="h-1 w-1 rounded-full bg-zinc-700 animate-pulse" />
                                    Serial equipment units
                                </p>
                            </div>
                        </div>
                    </LoomCard>

                    {/* KPI 3 */}
                    <LoomCard onClick={() => navigate("/vendor/rentals")}>
                        <div className="p-4 sm:p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--color-muted)]">
                                    Rental Orders
                                </span>
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black text-white shadow-2xs group-hover:scale-110 group-hover:bg-zinc-800 transition-all">
                                    <ShoppingBag size={15} strokeWidth={2} />
                                </div>
                            </div>
                            <div>
                                <p className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-[var(--color-ink)]">
                                    {rentalsCount}
                                </p>
                                <p className="mt-1.5 text-[8.5px] text-zinc-800 font-mono font-bold flex items-center gap-1 bg-black/5 border border-black/15 px-2 py-0.5 rounded-full w-fit">
                                    <span className="h-1 w-1 rounded-full bg-zinc-700 animate-pulse" />
                                    Fulfillment queue
                                </p>
                            </div>
                        </div>
                    </LoomCard>

                    {/* KPI 4 */}
                    <LoomCard>
                        <div className="p-4 sm:p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-700">
                                    Sales Revenue
                                </span>
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-800 text-white shadow-2xs group-hover:scale-110 transition-transform">
                                    <DollarSign size={15} strokeWidth={2.5} />
                                </div>
                            </div>
                            <div>
                                <p className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-[var(--color-ink)] truncate">
                                    ₹{totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
                                </p>
                                <p className="mt-1.5 text-[8.5px] text-zinc-800 font-mono font-bold flex items-center gap-1 bg-zinc-100 border border-zinc-300 px-2 py-0.5 rounded-full w-fit">
                                    {chartData.trendPct >= 0 ? (
                                        <TrendingUp size={10} className="text-zinc-700" />
                                    ) : (
                                        <TrendingDown size={10} className="text-rose-500" />
                                    )}
                                    {chartData.trendPct >= 0 ? `+${chartData.trendPct}%` : `${chartData.trendPct}%`} Growth
                                </p>
                            </div>
                        </div>
                    </LoomCard>
                </div>

                {/* 3. MAIN DASHBOARD GRID */}
                <div className="grid gap-6 lg:grid-cols-3">

                    {/* LEFT COLUMN: LINE GRAPH & LIVE OPERATIONS */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* CHARCOAL/GREY SALES TREND LINE GRAPH */}
                        <LoomCard>
                            <div className="p-5 space-y-5">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-black/[0.08] pb-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black text-white shadow-2xs">
                                            <TrendingUp size={15} strokeWidth={2} />
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-ink)]">
                                                Vendor Sales Trend Line
                                            </h3>
                                            <p className="text-[9.5px] text-[var(--color-muted)] font-mono">
                                                Isolated sales curve for your products
                                            </p>
                                        </div>
                                    </div>

                                    {/* Metric & Time Switchers */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="flex items-center gap-1 bg-black/[0.05] p-1 rounded-xl border border-black/[0.08]">
                                            <button
                                                onClick={() => setChartMetric("revenue")}
                                                className={`rounded-lg px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-wider transition-all duration-300 ${chartMetric === "revenue"
                                                        ? "bg-zinc-900 text-white shadow-2xs scale-105"
                                                        : "text-[var(--color-muted)] hover:text-black hover:bg-white/80"
                                                    }`}
                                            >
                                                Sales (₹)
                                            </button>
                                            <button
                                                onClick={() => setChartMetric("orders")}
                                                className={`rounded-lg px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-wider transition-all duration-300 ${chartMetric === "orders"
                                                        ? "bg-zinc-900 text-white shadow-2xs scale-105"
                                                        : "text-[var(--color-muted)] hover:text-black hover:bg-white/80"
                                                    }`}
                                            >
                                                Orders
                                            </button>
                                            <button
                                                onClick={() => setChartMetric("occupancy")}
                                                className={`rounded-lg px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-wider transition-all duration-300 ${chartMetric === "occupancy"
                                                        ? "bg-zinc-900 text-white shadow-2xs scale-105"
                                                        : "text-[var(--color-muted)] hover:text-black hover:bg-white/80"
                                                    }`}
                                            >
                                                Utilization
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-0.5 bg-black/[0.05] p-1 rounded-xl border border-black/[0.08]">
                                            <button
                                                onClick={() => setTimeFrame("7d")}
                                                className={`rounded-lg px-2 py-0.5 text-[8px] font-extrabold uppercase transition-all ${timeFrame === "7d" ? "bg-white text-black shadow-2xs" : "text-[var(--color-muted)]"
                                                    }`}
                                            >
                                                7D
                                            </button>
                                            <button
                                                onClick={() => setTimeFrame("30d")}
                                                className={`rounded-lg px-2 py-0.5 text-[8px] font-extrabold uppercase transition-all ${timeFrame === "30d" ? "bg-white text-black shadow-2xs" : "text-[var(--color-muted)]"
                                                    }`}
                                            >
                                                30D
                                            </button>
                                            <button
                                                onClick={() => setTimeFrame("ytd")}
                                                className={`rounded-lg px-2 py-0.5 text-[8px] font-extrabold uppercase transition-all ${timeFrame === "ytd" ? "bg-white text-black shadow-2xs" : "text-[var(--color-muted)]"
                                                    }`}
                                            >
                                                YTD
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* SVG CANVAS */}
                                <div className="relative rounded-2xl border border-[#d8cebc] bg-[#f4efe4] p-4 shadow-inner space-y-3.5">
                                    <div className="flex flex-wrap items-center justify-between text-[8px] font-mono font-extrabold uppercase tracking-wider text-[var(--color-muted)] border-b border-[#dfd5c4] pb-2.5 px-1">
                                        <div className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-zinc-800 animate-pulse shadow-[0_0_6px_rgba(24,24,27,0.4)]" />
                                            <span>Real Vendor Revenue Total:</span>
                                            <span className="font-extrabold text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white text-zinc-900 border border-zinc-300 shadow-2xs">
                                                {chartMetric === "revenue"
                                                    ? `₹${chartData.points.reduce((a, b) => a + b.revenue, 0).toLocaleString()}`
                                                    : chartMetric === "orders"
                                                        ? `${chartData.points.reduce((a, b) => a + b.orders, 0)} Rentals`
                                                        : `${Math.round(chartData.points.reduce((a, b) => a + b.occupancy, 0) / chartData.points.length)}% Occupancy`}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span>Peak Day: <strong className="text-[var(--color-ink)] font-black">{chartData.peakDayName}</strong></span>
                                            <span>•</span>
                                            <span>Growth Index: <strong className="text-zinc-900 font-black">+{chartData.trendPct}%</strong></span>
                                        </div>
                                    </div>

                                    <div className="relative pt-2 pb-1 px-1">
                                        <svg
                                            viewBox={`0 0 ${svgCoordinates.svgW} ${svgCoordinates.svgH}`}
                                            className="w-full h-36 sm:h-44 overflow-visible"
                                        >
                                            <defs>
                                                {/* Premium Slate & Charcoal Gradient */}
                                                <linearGradient id="vendorLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#18181b" />
                                                    <stop offset="50%" stopColor="#3f3f46" />
                                                    <stop offset="100%" stopColor="#27272a" />
                                                </linearGradient>

                                                <linearGradient id="vendorAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                                    <stop offset="0%" stopColor="#27272a" stopOpacity="0.25" />
                                                    <stop offset="70%" stopColor="#52525b" stopOpacity="0.05" />
                                                    <stop offset="100%" stopColor="#27272a" stopOpacity="0" />
                                                </linearGradient>
                                            </defs>

                                            <line x1="25" y1="20" x2="615" y2="20" stroke="rgba(0,0,0,0.07)" strokeDasharray="3 3" />
                                            <line x1="25" y1="70" x2="615" y2="70" stroke="rgba(0,0,0,0.07)" strokeDasharray="3 3" />
                                            <line x1="25" y1="120" x2="615" y2="120" stroke="rgba(0,0,0,0.07)" strokeDasharray="3 3" />

                                            <path d={svgCoordinates.areaPath} fill="url(#vendorAreaGrad)" className="transition-all duration-700 ease-out" />
                                            <path d={svgCoordinates.linePath} fill="none" stroke="url(#vendorLineGrad)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-700 ease-out filter drop-shadow-[0_3px_8px_rgba(24,24,27,0.3)]" />

                                            {svgCoordinates.coords.map((pt, idx) => {
                                                const isHovered = activePointIndex === idx;
                                                const isPeak = idx === chartData.peakIdx;
                                                const formattedVal = chartMetric === "revenue"
                                                    ? pt.val >= 1000 ? `₹${(pt.val / 1000).toFixed(1)}k` : `₹${pt.val}`
                                                    : chartMetric === "orders" ? `${pt.val}` : `${pt.val}%`;

                                                return (
                                                    <g key={pt.label} className="cursor-pointer">
                                                        {isHovered && <line x1={pt.x} y1="10" x2={pt.x} y2="135" stroke="#27272a" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.6" />}
                                                        <circle cx={pt.x} cy={pt.y} r={isHovered ? 9 : isPeak ? 7 : 5} className={`transition-all duration-300 ${isHovered ? "fill-zinc-800/20 stroke-zinc-900 stroke-2 animate-ping" : isPeak ? "fill-zinc-700/20 stroke-zinc-900 stroke-2" : "fill-zinc-800/10 stroke-zinc-700/50 stroke-1"}`} />
                                                        <circle cx={pt.x} cy={pt.y} r={isHovered ? 5 : isPeak ? 4 : 3.5} onMouseEnter={() => setActivePointIndex(idx)} onMouseLeave={() => setActivePointIndex(null)} className={`transition-all duration-300 ${isHovered ? "fill-black stroke-white stroke-2 shadow-md" : isPeak ? "fill-zinc-900 stroke-white stroke-2" : "fill-zinc-800 stroke-white stroke-2"}`} />
                                                        <foreignObject x={pt.x - 24} y={pt.y - 26} width="48" height="22" className="overflow-visible pointer-events-none">
                                                            <div className={`text-center transition-transform duration-200 ${isHovered ? "-translate-y-1 scale-110" : ""}`}>
                                                                <span className={`inline-block rounded-md px-1.5 py-0.5 font-mono text-[7.5px] font-extrabold shadow-2xs ${isHovered ? "bg-black text-white" : isPeak ? "bg-zinc-900 text-white font-black" : "bg-white text-[var(--color-ink)] border border-black/15"}`}>
                                                                    {formattedVal}
                                                                </span>
                                                            </div>
                                                        </foreignObject>
                                                    </g>
                                                );
                                            })}
                                        </svg>
                                    </div>

                                    {/* DEDICATED WEEKDAY FOOTER ROW */}
                                    <div className="flex items-center justify-between border-t border-[#dfd5c4] pt-2.5 px-6">
                                        {chartData.points.map((pt, idx) => {
                                            const isHovered = activePointIndex === idx;
                                            const isPeak = idx === chartData.peakIdx;
                                            return (
                                                <div key={pt.label} className="text-center cursor-pointer" onMouseEnter={() => setActivePointIndex(idx)} onMouseLeave={() => setActivePointIndex(null)}>
                                                    <span className={`font-mono text-[8.5px] font-black uppercase tracking-wider transition-all ${isHovered
                                                            ? "text-black scale-110"
                                                            : isPeak
                                                                ? "text-zinc-900"
                                                                : "text-zinc-600"
                                                        }`}>
                                                        {pt.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </LoomCard>

                        {/* LIVE OPERATIONS STREAM CARD */}
                        <LoomCard>
                            <div className="p-5 space-y-4">
                                <div className="flex items-center justify-between border-b border-black/[0.08] pb-3">
                                    <div className="flex items-center gap-2">
                                        <Activity size={15} className="text-zinc-800" />
                                        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-ink)]">
                                            Live Operations Stream
                                        </h3>
                                    </div>
                                    <Link
                                        to="/vendor/rentals"
                                        className="text-[8px] font-extrabold uppercase tracking-wider text-zinc-700 hover:text-black hover:underline flex items-center gap-1 transition-colors"
                                    >
                                        <span>Fulfill All Orders</span>
                                        <ArrowRight size={10} />
                                    </Link>
                                </div>

                                {recentRentals.length === 0 ? (
                                    <div className="p-6 text-center space-y-1.5">
                                        <ShoppingBag size={24} className="mx-auto text-[var(--color-muted)]" />
                                        <p className="text-xs text-[var(--color-muted)] font-medium">No active vendor orders found.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {recentRentals.map((r) => (
                                            <div
                                                key={r.id}
                                                className="flex items-center justify-between rounded-xl bg-[#faf6ee] border border-[#e2dacb] p-3 shadow-2xs hover:border-zinc-400 hover:bg-white hover:shadow-md transition-all duration-200"
                                            >
                                                <div className="space-y-0.5 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-[8px] font-black text-[var(--color-muted)]">
                                                            RN-{r.id.slice(0, 8).toUpperCase()}
                                                        </span>
                                                        {getStatusBadge(r.status)}
                                                    </div>
                                                    <p className="text-xs font-bold text-[var(--color-ink)] truncate">
                                                        Order Manifest #{r.id.slice(0, 6).toUpperCase()}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <span className="font-mono text-xs font-black text-[var(--color-ink)]">
                                                        ₹{Number(r.total_amount).toFixed(2)}
                                                    </span>
                                                    <Link
                                                        to={`/app/rentals/${r.id}`}
                                                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-white border border-black/15 text-[var(--color-ink)] hover:bg-black hover:text-white hover:border-black transition-all shadow-2xs active:scale-95"
                                                    >
                                                        <ArrowUpRight size={12} strokeWidth={2} />
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </LoomCard>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-6">

                        {/* PAYOUT CARD */}
                        <LoomCard>
                            <div className="p-5 space-y-4">
                                <div className="flex items-center justify-between border-b border-black/[0.08] pb-3">
                                    <div className="flex items-center gap-2">
                                        <Wallet size={15} className="text-zinc-800" />
                                        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-ink)]">
                                            Payout & Balance
                                        </h3>
                                    </div>
                                    <span className="text-[7.5px] font-mono font-bold text-zinc-800 bg-zinc-100 border border-zinc-300 px-2 py-0.5 rounded-full">
                                        Calculated Settlement
                                    </span>
                                </div>

                                <div className="rounded-xl border border-[#d8cebc] bg-[#faf6ee] p-3.5 space-y-3">
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-wider text-[var(--color-muted)]">
                                            Available for Withdrawal
                                        </p>
                                        <p className="text-2xl font-extrabold font-mono text-[var(--color-ink)] mt-0.5">
                                            ₹{(totalRevenue * 0.85).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-[#e2dacb] text-[8.5px] font-mono">
                                        <span className="text-[var(--color-muted)]">Pending Escrow (15%):</span>
                                        <span className="font-bold text-[var(--color-ink)]">
                                            ₹{(totalRevenue * 0.15).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-[8.5px] font-mono">
                                        <span className="text-[var(--color-muted)]">Next Auto Payout:</span>
                                        <span className="font-bold text-zinc-900">Daily Settlement</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => alert("Payout settlement request initiated.")}
                                    disabled={totalRevenue === 0}
                                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-[8.5px] font-extrabold uppercase tracking-wider text-white shadow-xs hover:bg-black transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <CreditCard size={13} />
                                    <span>Withdraw Funds Now</span>
                                </button>
                            </div>
                        </LoomCard>

                        {/* TOP RENTABLES CARD */}
                        <LoomCard>
                            <div className="p-5 space-y-4">
                                <div className="flex items-center justify-between border-b border-black/[0.08] pb-3">
                                    <div className="flex items-center gap-2">
                                        <Award size={15} className="text-zinc-800" />
                                        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-ink)]">
                                            Top Catalog Gear
                                        </h3>
                                    </div>
                                    <span className="text-[7.5px] font-mono font-bold text-zinc-700 bg-black/5 px-2 py-0.5 rounded-full">
                                        Backend Products
                                    </span>
                                </div>

                                {topRentables.length === 0 ? (
                                    <div className="p-6 text-center space-y-2">
                                        <Package size={24} className="mx-auto text-[var(--color-muted)]" />
                                        <p className="text-xs text-[var(--color-muted)] font-medium">No products listed in catalog yet.</p>
                                        <Link to="/vendor/products/new" className="inline-block text-[8.5px] font-bold text-zinc-800 hover:underline uppercase">
                                            + Add First Product
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-2.5">
                                        {topRentables.map((item, idx) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between rounded-xl bg-[#faf6ee] border border-[#e2dacb] p-2.5 shadow-2xs hover:border-zinc-400 hover:bg-white transition-all"
                                            >
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-200 border border-zinc-300 font-mono text-[9px] font-extrabold text-zinc-800 shrink-0">
                                                        #{idx + 1}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[11px] font-bold text-[var(--color-ink)] truncate">
                                                            {item.title}
                                                        </p>
                                                        <p className="text-[8px] font-mono text-[var(--color-muted)]">
                                                            {item.rentalsCount} Rentals {item.price > 0 ? `• ₹${item.price}` : ""}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="font-mono text-[10.5px] font-extrabold text-zinc-900 shrink-0">
                                                    ₹{item.revenue.toLocaleString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </LoomCard>

                        {/* VENDOR RATING CARD */}
                        <LoomCard>
                            <div className="p-5 space-y-3.5">
                                <div className="flex items-center justify-between border-b border-black/[0.08] pb-3">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck size={15} className="text-zinc-800" />
                                        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-ink)]">
                                            Vendor Health Rating
                                        </h3>
                                    </div>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 border border-zinc-300 px-2 py-0.5 text-[7.5px] font-extrabold uppercase tracking-wider text-zinc-800">
                                        Verified Vendor
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2.5 pt-0.5">
                                    <div className="rounded-xl bg-[#faf6ee] border border-[#e2dacb] p-3 text-center space-y-0.5">
                                        <div className="flex items-center justify-center gap-1 text-zinc-800">
                                            <Star size={13} fill="currentColor" />
                                            <span className="font-mono text-base font-extrabold text-[var(--color-ink)]">5.0</span>
                                        </div>
                                        <p className="text-[7.5px] font-mono uppercase font-bold text-[var(--color-muted)]">Vendor Rating</p>
                                    </div>

                                    <div className="rounded-xl bg-[#faf6ee] border border-[#e2dacb] p-3 text-center space-y-0.5">
                                        <span className="font-mono text-base font-extrabold text-zinc-900">100%</span>
                                        <p className="text-[7.5px] font-mono uppercase font-bold text-[var(--color-muted)]">Fulfillment Rate</p>
                                    </div>
                                </div>
                            </div>
                        </LoomCard>

                    </div>
                </div>

                {/* 4. BOTTOM CONTROLS */}
                <div className="grid gap-6 lg:grid-cols-2">

                    <LoomCard>
                        <div className="p-5 space-y-4">
                            <div className="flex items-center justify-between border-b border-black/[0.08] pb-3">
                                <div className="flex items-center gap-2">
                                    <PieChart size={15} className="text-zinc-800" />
                                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-ink)]">
                                        Asset Utilization & Inventory Health
                                    </h3>
                                </div>
                                <span className="text-[7.5px] font-mono font-extrabold text-zinc-800 bg-zinc-100 border border-zinc-300 px-2 py-0.5 rounded-full">
                                    {inventoryStats.efficiency}% Efficiency
                                </span>
                            </div>

                            <div className="space-y-3 pt-0.5">
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between text-[8px] font-extrabold uppercase tracking-wider text-[var(--color-muted)]">
                                        <span>Active Rentals Out ({inventoryStats.activeCount} Units)</span>
                                        <span className="text-[var(--color-ink)] font-mono font-black">{inventoryStats.activePct}%</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-black/5 overflow-hidden p-0.5 border border-black/10">
                                        <div
                                            className="h-full bg-[#3f3f46] rounded-full transition-all duration-700 shadow-2xs"
                                            style={{ width: `${inventoryStats.activePct}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center justify-between text-[8px] font-extrabold uppercase tracking-wider text-[var(--color-muted)]">
                                        <span>Ready Stock Reserves ({inventoryStats.readyCount} Units)</span>
                                        <span className="text-[var(--color-ink)] font-mono font-black">{inventoryStats.readyPct}%</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-black/5 overflow-hidden p-0.5 border border-black/10">
                                        <div
                                            className="h-full bg-zinc-500 rounded-full transition-all duration-700 shadow-2xs"
                                            style={{ width: `${inventoryStats.readyPct}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center justify-between text-[8px] font-extrabold uppercase tracking-wider text-[var(--color-muted)]">
                                        <span>Inspection / Maintenance ({inventoryStats.maintenanceCount} Units)</span>
                                        <span className="text-[var(--color-ink)] font-mono font-black">{inventoryStats.maintenancePct}%</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-black/5 overflow-hidden p-0.5 border border-black/10">
                                        <div
                                            className="h-full bg-zinc-300 rounded-full transition-all duration-700 shadow-2xs"
                                            style={{ width: `${inventoryStats.maintenancePct}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </LoomCard>

                    <LoomCard>
                        <div className="p-5 space-y-4">
                            <div className="flex items-center justify-between border-b border-black/[0.08] pb-3">
                                <div className="flex items-center gap-2">
                                    <Zap size={15} className="text-zinc-800" />
                                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-ink)]">
                                        Quick Operational Actions
                                    </h3>
                                </div>
                                <span className="text-[7.5px] font-mono font-bold text-[var(--color-muted)]">
                                    Rapid Controls
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2.5">
                                <Link
                                    to="/vendor/products/new"
                                    className="flex items-center gap-2.5 rounded-xl bg-[#faf6ee] border border-[#e2dacb] p-3 shadow-2xs hover:border-zinc-400 hover:bg-white transition-all group"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-200 text-zinc-800 group-hover:bg-black group-hover:text-white transition-colors">
                                        <Plus size={15} />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold text-[var(--color-ink)]">List Equipment</p>
                                        <p className="text-[8px] text-[var(--color-muted)]">Add new rentable</p>
                                    </div>
                                </Link>

                                <Link
                                    to="/vendor/inventory"
                                    className="flex items-center gap-2.5 rounded-xl bg-[#faf6ee] border border-[#e2dacb] p-3 shadow-2xs hover:border-zinc-400 hover:bg-white transition-all group"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/5 text-zinc-700 group-hover:bg-black group-hover:text-white transition-colors">
                                        <QrCode size={15} />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold text-[var(--color-ink)]">Serial Check</p>
                                        <p className="text-[8px] text-[var(--color-muted)]">Verify stock QR</p>
                                    </div>
                                </Link>

                                <Link
                                    to="/vendor/rentals"
                                    className="flex items-center gap-2.5 rounded-xl bg-[#faf6ee] border border-[#e2dacb] p-3 shadow-2xs hover:border-zinc-400 hover:bg-white transition-all group"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/5 text-zinc-700 group-hover:bg-black group-hover:text-white transition-colors">
                                        <Truck size={15} />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold text-[var(--color-ink)]">Order Dispatch</p>
                                        <p className="text-[8px] text-[var(--color-muted)]">Process pickups</p>
                                    </div>
                                </Link>

                                <button
                                    onClick={() => alert("Vendor Banking & Payout Settings details...")}
                                    className="flex items-center gap-2.5 rounded-xl bg-[#faf6ee] border border-[#e2dacb] p-3 shadow-2xs hover:border-zinc-400 hover:bg-white transition-all text-left group"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-200 text-zinc-800 group-hover:bg-black group-hover:text-white transition-colors">
                                        <CreditCard size={15} />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold text-[var(--color-ink)]">Bank & Payouts</p>
                                        <p className="text-[8px] text-[var(--color-muted)]">Manage accounts</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </LoomCard>

                </div>
            </div>
        </main>
    );
}

export default VendorDashboard;
