import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { getRentals, type RentalDetail } from "../../api/rentals.api";

function AdminRentals() {
    const [rentals, setRentals] = useState<RentalDetail[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchRentals() {
            try {
                const data = await getRentals();
                setRentals(data);
            } catch (err) {
                console.error("Failed to load admin rentals:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchRentals();
    }, []);

    return (
        <main className="min-h-screen bg-[var(--color-ivory)] px-6 pb-24 pt-28 sm:pt-32 lg:pt-36 text-[var(--color-ink)]">
            <div className="mx-auto max-w-4xl space-y-6">
                <Link to="/admin" className="inline-flex items-center gap-2 text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors">
                    <ArrowLeft size={14} />
                    Back to Admin Dashboard
                </Link>

                <div className="flex items-center justify-between border-b border-[var(--color-line-soft)] pb-4">
                    <div>
                        <h1 className="text-3xl font-medium tracking-[-0.04em]">Global Rental Orders</h1>
                        <p className="text-xs text-[var(--color-ink-soft)]">Platform-wide rental lifecycle monitoring.</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="h-40 animate-pulse rounded-2xl bg-black/5" />
                ) : rentals.length === 0 ? (
                    <div className="rounded-2xl border border-[var(--color-line)] bg-white/30 p-12 text-center">
                        <ShoppingBag size={32} className="mx-auto text-[var(--color-muted)]" />
                        <h3 className="mt-3 text-base font-medium">No rentals recorded</h3>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {rentals.map((r) => (
                            <div key={r.id} className="flex items-center justify-between rounded-2xl border border-white/90 bg-white/50 p-5 shadow-xs">
                                <div>
                                    <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-700">{r.status}</span>
                                    <h3 className="text-base font-medium text-[var(--color-ink)]">Order #RN-{r.id.slice(0, 8).toUpperCase()}</h3>
                                    <p className="text-xs text-[var(--color-muted)]">Amount: ₹{Number(r.total_amount).toFixed(2)}</p>
                                </div>
                                <Link to={`/app/rentals/${r.id}`} className="rounded-xl border border-[var(--color-line)] bg-white px-3.5 py-1.5 text-[8px] font-bold uppercase tracking-wider text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-white transition-colors">
                                    View
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default AdminRentals;
