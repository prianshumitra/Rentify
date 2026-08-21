import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Boxes, ArrowLeft, CheckCircle2, Wrench, Plus } from "lucide-react";
import apiClient from "../../api/client";

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

function VendorInventory() {
    const [inventory, setInventory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchInventory() {
            try {
                const res = await apiClient.get("/inventory/");
                setInventory(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Failed to load inventory:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchInventory();
    }, []);

    const getStatusBadge = (status: string) => {
        const s = (status || "available").toLowerCase();
        if (s === "available" || s === "ready") {
            return (
                <span className="inline-flex items-center gap-1 rounded-md bg-[#eaf3ed] border border-[#b8d9c5] px-2.5 py-0.5 text-[7.5px] font-bold uppercase tracking-wider text-[#2d563f]">
                    <CheckCircle2 size={10} className="text-emerald-600" />
                    Available
                </span>
            );
        }
        if (s === "rented" || s === "in_use") {
            return (
                <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 border border-zinc-300 px-2.5 py-0.5 text-[7.5px] font-bold uppercase tracking-wider text-zinc-800">
                    <Boxes size={10} className="text-zinc-700" />
                    In Use
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[7.5px] font-bold uppercase tracking-wider text-amber-800">
                <Wrench size={10} className="text-amber-600" />
                {status || "Maintenance"}
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
                                VENDOR / INVENTORY MANAGEMENT
                            </span>
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-3xl">
                            Serial Stock Inventory
                        </h1>
                        <p className="mt-0.5 text-xs text-[var(--color-ink-soft)] max-w-lg">
                            Track asset identification numbers, barcode serials, and operational statuses.
                        </p>
                    </div>

                    <Link
                        to="/vendor/products/new"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-[#c4b69d] px-4 py-2 text-[8.5px] font-extrabold uppercase tracking-wider text-[var(--color-ink)] shadow-2xs hover:bg-[#faf6ee] hover:border-black/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 shrink-0"
                    >
                        <Plus size={13} strokeWidth={2.5} className="text-zinc-800" />
                        <span>Add Stock Unit</span>
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-32 animate-pulse rounded-2xl bg-black/5" />
                        ))}
                    </div>
                ) : inventory.length === 0 ? (
                    <LoomCard>
                        <div className="p-10 text-center space-y-3">
                            <Boxes size={28} className="mx-auto text-[var(--color-muted)]" />
                            <p className="text-xs text-[var(--color-muted)] font-medium">No inventory units currently registered.</p>
                            <Link to="/vendor/products/new" className="inline-block text-[8px] font-bold text-zinc-800 uppercase hover:underline">
                                + Add First Inventory Item
                            </Link>
                        </div>
                    </LoomCard>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {inventory.map((item) => (
                            <LoomCard key={item.id}>
                                <div className="p-5 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-[8px] font-bold text-zinc-800">
                                            {item.asset_code}
                                        </span>
                                        {getStatusBadge(item.status)}
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-[var(--color-ink)] truncate">
                                            {item.variant?.product?.name || "Equipment Unit"}
                                        </h3>
                                        <p className="text-[10px] font-mono text-[var(--color-muted)] mt-0.5">
                                            Serial: {item.serial_number || "N/A"}
                                        </p>
                                    </div>

                                    <div className="pt-2 border-t border-black/[0.08] flex items-center justify-between text-[8px] font-mono text-[var(--color-muted)]">
                                        <span>Unit Status:</span>
                                        <span className="font-bold text-[var(--color-ink)] uppercase">{item.status || "Available"}</span>
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

export default VendorInventory;
