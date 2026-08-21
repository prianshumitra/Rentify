import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowLeft, ArrowUpRight, CheckCircle2, Clock, RotateCcw } from "lucide-react";
import { getRentals, type RentalDetail } from "../../api/rentals.api";

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
                        ? "0 16px 35px -12px rgba(39, 39, 42, 0.22), 0 6px 18px -4px rgba(0,0,0,0.08)"
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

function VendorRentals() {
    const [rentals, setRentals] = useState<RentalDetail[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
                <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 border border-zinc-300 px-2.5 py-0.5 text-[7.5px] font-bold uppercase tracking-wider text-zinc-800">
                    <CheckCircle2 size={10} className="text-zinc-700" />
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
        <main className="relative min-h-screen overflow-hidden bg-[var(--color-ivory)] px-4 pb-16 pt-16 sm:px-6 lg:px-8 sm:pt-20 text-[var(--color-ink)]">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute left-[4%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute left-[18%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute right-[4%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute left-1/2 top-[25%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-zinc-400/[0.05] blur-[150px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl w-full space-y-4">
                <Link
                    to="/vendor"
                    className="group inline-flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.22em] text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
                >
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl border border-[#c4b69d] bg-white shadow-2xs group-hover:border-zinc-800 group-hover:bg-zinc-800 group-hover:text-white transition-all">
                        <ArrowLeft size={12} />
                    </span>
                    <span>Back to Vendor Console</span>
                </Link>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--color-line-soft)] pb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-zinc-700 animate-pulse shadow-[0_0_6px_rgba(39,39,42,0.5)]" />
                            <span className="text-[8px] font-black uppercase tracking-[0.25em] text-zinc-700">
                                VENDOR / RENTAL ORDERS QUEUE
                            </span>
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-3xl">
                            Fulfillment Queue
                        </h1>
                        <p className="mt-0.5 text-xs text-[var(--color-ink-soft)] max-w-lg">
                            Monitor customer pickup reservations, Active leases out, and Equipment Returns.
                        </p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-24 animate-pulse rounded-2xl bg-black/5" />
                        ))}
                    </div>
                ) : rentals.length === 0 ? (
                    <LoomCard>
                        <div className="p-10 text-center space-y-3">
                            <ShoppingBag size={28} className="mx-auto text-[var(--color-muted)]" />
                            <p className="text-xs text-[var(--color-muted)] font-medium">No rental orders placed yet.</p>
                        </div>
                    </LoomCard>
                ) : (
                    <div className="space-y-3">
                        {rentals.map((r) => (
                            <LoomCard key={r.id}>
                                <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="space-y-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-[8px] font-black text-[var(--color-muted)]">
                                                RN-{r.id.slice(0, 8).toUpperCase()}
                                            </span>
                                            {getStatusBadge(r.status)}
                                        </div>
                                        <h3 className="text-sm font-bold text-[var(--color-ink)] truncate">
                                            Rental Manifest #{r.id.slice(0, 6).toUpperCase()}
                                        </h3>
                                        <p className="text-[10px] text-[var(--color-muted)] font-mono">
                                            Created: {r.created_at ? new Date(r.created_at).toLocaleDateString() : "Recent"}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4 shrink-0">
                                        <div className="text-right">
                                            <p className="font-mono text-sm font-extrabold text-[var(--color-ink)]">
                                                ₹{Number(r.total_amount).toFixed(2)}
                                            </p>
                                            <p className="text-[7.5px] font-mono text-[var(--color-muted)]">Order Total</p>
                                        </div>

                                        <Link
                                            to={`/app/rentals/${r.id}`}
                                            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-black/15 text-[var(--color-ink)] hover:bg-black hover:text-white hover:border-black transition-all shadow-2xs"
                                        >
                                            <ArrowUpRight size={13} strokeWidth={2} />
                                        </Link>
                                    </div>
                                </div>
                            </LoomCard>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default VendorRentals;
