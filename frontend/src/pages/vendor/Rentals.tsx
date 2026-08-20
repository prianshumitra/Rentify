import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowLeft, ArrowUpRight, CheckCircle2, Clock, RotateCcw } from "lucide-react";
import { getRentals, type RentalDetail } from "../../api/rentals.api";

function VendorRentals() {
    const [rentals, setRentals] = useState<RentalDetail[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    useEffect(() => {
        async function fetchRentals() {
            try {
                const data = await getRentals();
                setRentals(data);
            } catch (err) {
                console.error("Failed to load vendor rentals:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchRentals();
    }, []);

    const getStatusBadge = (status: string) => {
        const s = (status || "").toLowerCase();
        if (s.includes("active") || s.includes("confirm")) {
            return (
                <span className="inline-flex items-center gap-1 rounded-md bg-[#eaf3ed] border border-[#b8d9c5] px-2.5 py-0.5 text-[7.5px] font-bold uppercase tracking-wider text-[#2d563f]">
                    <CheckCircle2 size={10} className="text-emerald-600" />
                    {status.replace("_", " ")}
                </span>
            );
        }
        if (s.includes("pending") || s.includes("return_pending")) {
            return (
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[7.5px] font-bold uppercase tracking-wider text-amber-800">
                    <Clock size={10} className="text-amber-600" />
                    {status.replace("_", " ")}
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 rounded-md bg-[#f0f5fa] border border-[#cee0f2] px-2.5 py-0.5 text-[7.5px] font-bold uppercase tracking-wider text-[#2c4a6f]">
                <RotateCcw size={10} className="text-[#2c4a6f]" />
                {status.replace("_", " ")}
            </span>
        );
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-[var(--color-ivory)] px-6 pb-24 pt-28 sm:pt-32 lg:pt-36 text-[var(--color-ink)]">
            {/* Background Tactile Texture & Grid Lines */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute left-[8%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute left-[24%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute right-[8%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute left-1/2 top-[30%] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[var(--color-accent)]/[0.04] blur-[140px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-5xl space-y-6">
                {/* Back Link Button */}
                <Link
                    to="/vendor"
                    className="group inline-flex items-center gap-2.5 text-[8.5px] font-bold uppercase tracking-[0.2em] text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
                >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10 bg-white/70 shadow-2xs group-hover:border-[var(--color-accent)] group-hover:bg-white transition-all">
                        <ArrowLeft size={11} />
                    </span>
                    <span>Back to Vendor Console</span>
                </Link>

                {/* Signature Terracotta Breadcrumb Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--color-line-soft)] pb-5">
                    <div>
                        <div className="flex items-center gap-2.5 mb-1.5">
                            <span className="h-px w-8 bg-[var(--color-accent)]" />
                            <span className="text-[8.5px] font-semibold uppercase tracking-[0.28em] text-[var(--color-muted)]">
                                VENDOR / RENTAL ORDERS
                            </span>
                        </div>
                        <h1 className="text-3xl font-medium tracking-tight text-[var(--color-ink)] sm:text-4xl">
                            Customer Orders
                        </h1>
                        <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
                            Monitor customer fulfillment requests, active rentals, and return inspections.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#cee0f2] bg-[#f0f5fa] px-3.5 py-1.5 text-[8px] font-bold uppercase tracking-wider text-[#2c4a6f] shadow-2xs">
                            <ShoppingBag size={11} className="text-[#2c4a6f]" />
                            {rentals.length} Orders Total
                        </span>
                    </div>
                </div>

                {isLoading ? (
                    <div className="h-48 animate-pulse rounded-3xl bg-black/5" />
                ) : rentals.length === 0 ? (
                    <div className="relative group transition-all duration-300">
                        <div className="absolute inset-0 rounded-3xl bg-[#ded8ca] border border-black/5 translate-x-1 translate-y-1.5" />
                        <div className="relative rounded-3xl border border-white/90 bg-gradient-to-b from-[#fffefc] via-[#fcfaf5] to-[#f6f1e5] p-12 text-center shadow-xs backdrop-blur-2xl space-y-3">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fcfaf5] border border-[#e8e0d0] text-[var(--color-muted)] shadow-2xs">
                                <ShoppingBag size={28} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-lg font-medium text-[var(--color-ink)]">No rental orders found</h3>
                            <p className="text-xs text-[var(--color-muted)] max-w-sm mx-auto">
                                Customer orders for your rental items will appear here when placed.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {rentals.map((r) => (
                            <div
                                key={r.id}
                                onMouseEnter={() => setHoveredCard(r.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                                className="relative group transition-all duration-300 ease-out"
                            >
                                <div
                                    className="absolute inset-0 rounded-3xl bg-[#ded8ca] border border-black/5 transition-all duration-300 ease-out"
                                    style={{
                                        transform: hoveredCard === r.id ? "translate(3px, 5px)" : "translate(1.5px, 3px)",
                                        opacity: hoveredCard === r.id ? 0.9 : 0.6
                                    }}
                                />

                                <div
                                    className="relative flex flex-col sm:flex-row sm:items-center justify-between rounded-3xl border border-white/90 bg-gradient-to-b from-[#fffefc] via-[#fcfaf5] to-[#f6f1e5] p-5 shadow-xs backdrop-blur-2xl transition-all duration-300 gap-4"
                                    style={{
                                        transform: hoveredCard === r.id ? "translateY(-2px)" : "translateY(0px)"
                                    }}
                                >
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(r.status)}
                                            <span className="font-mono text-[8px] text-[var(--color-muted)] font-bold">
                                                ID: RN-{r.id.slice(0, 8).toUpperCase()}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-medium text-[var(--color-ink)]">
                                            Order #{r.id.slice(0, 8).toUpperCase()}
                                        </h3>
                                        <p className="text-xs font-mono text-[var(--color-ink-soft)] font-semibold">
                                            Total Amount: <span className="text-[var(--color-ink)] font-extrabold">₹{Number(r.total_amount).toFixed(2)}</span>
                                        </p>
                                    </div>

                                    <Link
                                        to={`/app/rentals/${r.id}`}
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 bg-[#fcfaf5] px-4 py-2 text-[8px] font-bold uppercase tracking-wider text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-white transition-all shadow-2xs self-start sm:self-center shrink-0"
                                    >
                                        <span>View Manifest</span>
                                        <ArrowUpRight size={12} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default VendorRentals;
