import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Boxes, ArrowLeft, CheckCircle2, Wrench } from "lucide-react";

import apiClient from "../../api/client";

function VendorInventory() {
    const [inventory, setInventory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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
                <span className="inline-flex items-center gap-1 rounded-md bg-[#f0f5fa] border border-[#cee0f2] px-2.5 py-0.5 text-[7.5px] font-bold uppercase tracking-wider text-[#2c4a6f]">
                    <Boxes size={10} className="text-[#2c4a6f]" />
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
                                VENDOR / INVENTORY STOCK
                            </span>
                        </div>
                        <h1 className="text-3xl font-medium tracking-tight text-[var(--color-ink)] sm:text-4xl">
                            Stock Units
                        </h1>
                        <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
                            Track physical equipment serial units, availability, and active rental status.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#cee0f2] bg-[#f0f5fa] px-3.5 py-1.5 text-[8px] font-bold uppercase tracking-wider text-[#2c4a6f] shadow-2xs">
                            <Boxes size={11} className="text-[#2c4a6f]" />
                            {inventory.length} Units Managed
                        </span>
                    </div>
                </div>

                {isLoading ? (
                    <div className="h-48 animate-pulse rounded-3xl bg-black/5" />
                ) : inventory.length === 0 ? (
                    <div className="relative group transition-all duration-300">
                        <div className="absolute inset-0 rounded-3xl bg-[#ded8ca] border border-black/5 translate-x-1 translate-y-1.5" />
                        <div className="relative rounded-3xl border border-white/90 bg-gradient-to-b from-[#fffefc] via-[#fcfaf5] to-[#f6f1e5] p-12 text-center shadow-xs backdrop-blur-2xl space-y-3">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fcfaf5] border border-[#e8e0d0] text-[var(--color-muted)] shadow-2xs">
                                <Boxes size={28} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-lg font-medium text-[var(--color-ink)]">No inventory units found</h3>
                            <p className="text-xs text-[var(--color-muted)] max-w-sm mx-auto">
                                Physical inventory units will appear here once registered under your product catalog.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {inventory.map((item, idx) => {
                            const itemId = item.id || `inv-${idx}`;
                            return (
                                <div
                                    key={itemId}
                                    onMouseEnter={() => setHoveredCard(itemId)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    className="relative group transition-all duration-300 ease-out"
                                >
                                    <div
                                        className="absolute inset-0 rounded-2xl bg-[#ded8ca] border border-black/5 transition-all duration-300 ease-out"
                                        style={{
                                            transform: hoveredCard === itemId ? "translate(2px, 4px)" : "translate(1px, 2px)",
                                            opacity: hoveredCard === itemId ? 0.9 : 0.5
                                        }}
                                    />

                                    <div
                                        className="relative flex items-center justify-between rounded-2xl border border-white/90 bg-gradient-to-b from-[#fffefc] via-[#fcfaf5] to-[#f6f1e5] p-4 shadow-xs backdrop-blur-2xl transition-all duration-300"
                                        style={{
                                            transform: hoveredCard === itemId ? "translateY(-1.5px)" : "translateY(0px)"
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fcfaf5] border border-[#e8e0d0] text-[var(--color-ink)] shadow-2xs shrink-0">
                                                <Boxes size={16} />
                                            </div>
                                            <div className="space-y-0.5">
                                                <span className="font-mono text-[8px] font-bold text-[var(--color-muted)] uppercase tracking-wider">
                                                    UNIT ID: {item.id ? item.id.slice(0, 8).toUpperCase() : `#${idx + 1}`}
                                                </span>
                                                <p className="text-xs font-bold text-[var(--color-ink)]">
                                                    {item.product_name || item.name || "Equipment Unit"}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            {getStatusBadge(item.status)}
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

export default VendorInventory;
