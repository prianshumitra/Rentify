import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Boxes, ArrowLeft } from "lucide-react";
import apiClient from "../../api/client";

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

    return (
        <main className="min-h-screen bg-[var(--color-ivory)] px-6 pb-24 pt-28 sm:pt-32 lg:pt-36 text-[var(--color-ink)]">
            <div className="mx-auto max-w-4xl space-y-6">
                <Link to="/vendor" className="inline-flex items-center gap-2 text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors">
                    <ArrowLeft size={14} />
                    Back to Vendor Dashboard
                </Link>

                <div className="flex items-center justify-between border-b border-[var(--color-line-soft)] pb-4">
                    <div>
                        <h1 className="text-3xl font-medium tracking-[-0.04em]">Inventory Management</h1>
                        <p className="text-xs text-[var(--color-ink-soft)]">Track physical inventory items and status.</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="h-40 animate-pulse rounded-2xl bg-black/5" />
                ) : inventory.length === 0 ? (
                    <div className="rounded-2xl border border-[var(--color-line)] bg-white/30 p-12 text-center">
                        <Boxes size={32} className="mx-auto text-[var(--color-muted)]" />
                        <h3 className="mt-3 text-base font-medium">No inventory units</h3>
                        <p className="mt-1 text-xs text-[var(--color-muted)]">No inventory items found for your account.</p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {inventory.map((item, idx) => (
                            <div key={item.id || idx} className="flex items-center justify-between rounded-xl border border-white/90 bg-white/50 p-4 shadow-xs">
                                <div className="space-y-0.5">
                                    <span className="text-[9px] font-mono text-[var(--color-muted)]">UNIT ID: {item.id ? item.id.slice(0, 8) : `#${idx + 1}`}</span>
                                    <p className="text-sm font-medium">Status: <span className="uppercase text-emerald-700 font-bold">{item.status || "Available"}</span></p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default VendorInventory;
