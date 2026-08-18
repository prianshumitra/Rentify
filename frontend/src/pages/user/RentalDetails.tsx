import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Package, AlertCircle } from "lucide-react";
import { getRentalById, cancelRental, returnRental, getLateFee, type RentalDetail } from "../../api/rentals.api";

function RentalDetails() {
    const { rentalId } = useParams<{ rentalId: string }>();
    const navigate = useNavigate();

    const [rental, setRental] = useState<RentalDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [lateFee, setLateFee] = useState<number | null>(null);

    const fetchDetail = async () => {
        if (!rentalId) return;
        setIsLoading(true);
        setError("");
        try {
            const data = await getRentalById(rentalId);
            setRental(data);
            if (data.status.toLowerCase() === "overdue") {
                try {
                    const feeData = await getLateFee(rentalId);
                    setLateFee(feeData.late_fee);
                } catch {
                    // ignore late fee error if not calculated
                }
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to load rental details.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, [rentalId]);

    const handleCancel = async () => {
        if (!rentalId || !window.confirm("Confirm cancellation of this rental?")) return;
        setActionLoading(true);
        try {
            await cancelRental(rentalId);
            fetchDetail();
        } catch (err: any) {
            alert(err.response?.data?.detail || "Failed to cancel rental.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleReturn = async () => {
        if (!rentalId || !window.confirm("Confirm return request for this rental item?")) return;
        setActionLoading(true);
        try {
            await returnRental(rentalId);
            fetchDetail();
        } catch (err: any) {
            alert(err.response?.data?.detail || "Failed to initiate return.");
        } finally {
            setActionLoading(false);
        }
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-[var(--color-ivory)] px-6 py-16">
                <div className="mx-auto max-w-4xl space-y-6">
                    <div className="h-6 w-32 animate-pulse rounded-lg bg-black/10" />
                    <div className="h-96 w-full animate-pulse rounded-3xl bg-black/5" />
                </div>
            </main>
        );
    }

    if (error || !rental) {
        return (
            <main className="min-h-screen bg-[var(--color-ivory)] px-6 py-24 text-center">
                <div className="mx-auto max-w-md space-y-4">
                    <AlertCircle size={40} className="mx-auto text-rose-500" />
                    <h2 className="text-xl font-medium">{error || "Rental not found."}</h2>
                    <Link
                        to="/app/rentals"
                        className="inline-flex items-center gap-2 rounded-2xl bg-[var(--color-ink)] px-6 py-3 text-xs font-medium uppercase tracking-wider text-white"
                    >
                        Back to My Rentals
                    </Link>
                </div>
            </main>
        );
    }

    const item = rental.items[0];
    const status = rental.status.toLowerCase();
    const canCancel = ["confirmed", "ready_for_pickup", "pending_payment"].includes(status);
    const canReturn = status === "active" || status === "return_pending";

    return (
        <main className="relative min-h-screen bg-[var(--color-ivory)] px-6 pb-24 pt-28 sm:pt-32">
            <div className="relative z-10 mx-auto max-w-4xl space-y-10">
                <button
                    onClick={() => navigate("/app/rentals")}
                    className="group flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]"
                >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-line)] group-hover:border-[var(--color-accent)] transition-colors">
                        <ArrowLeft size={12} />
                    </span>
                    Back to rentals
                </button>

                {/* Main Card */}
                <div className="rounded-[2.5rem] border border-white/80 bg-white/40 p-8 shadow-sm backdrop-blur-xl space-y-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--color-line-soft)] pb-6">
                        <div>
                            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                                Rental Details
                            </p>
                            <h1 className="mt-1 text-2xl font-medium tracking-tight">
                                Order #{rental.id.slice(0, 8)}
                            </h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                                {rental.status.replace("_", " ")}
                            </span>
                        </div>
                    </div>

                    {/* Product Summary */}
                    {item && (
                        <div className="flex items-start gap-6 rounded-3xl border border-[var(--color-line)] bg-white/60 p-6">
                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-ivory-soft)] border border-[var(--color-line-soft)]">
                                <Package size={32} className="text-[var(--color-muted)]" strokeWidth={1} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-medium">{item.product_name}</h3>
                                <p className="text-xs text-[var(--color-muted)]">
                                    Variant SKU: {item.variant_sku} {item.variant_brand ? `• ${item.variant_brand}` : ""}
                                </p>
                                <div className="flex items-center gap-4 text-xs font-medium text-[var(--color-ink)] pt-2">
                                    <span>Quantity: {item.quantity}</span>
                                    <span>Rate: ₹{Number(item.unit_price).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Timeline */}
                    <div className="grid gap-6 sm:grid-cols-2 rounded-3xl border border-[var(--color-line-soft)] bg-white/30 p-6">
                        <div>
                            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)] block mb-1">
                                Start Date & Time
                            </span>
                            <p className="text-sm font-medium">{new Date(rental.start_at).toLocaleString()}</p>
                        </div>
                        <div>
                            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)] block mb-1">
                                Return Date & Time
                            </span>
                            <p className="text-sm font-medium">{new Date(rental.end_at).toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Financial breakdown */}
                    <div className="space-y-3 border-t border-[var(--color-line-soft)] pt-6">
                        <div className="flex justify-between text-xs">
                            <span className="text-[var(--color-muted)]">Rental Amount</span>
                            <span className="font-medium">₹{Number(rental.rental_amount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-[var(--color-muted)]">Security Deposit</span>
                            <span className="font-medium">₹{Number(rental.deposit_amount).toFixed(2)}</span>
                        </div>
                        {lateFee !== null && (
                            <div className="flex justify-between text-xs text-rose-600 font-medium">
                                <span>Late Fee Assessed</span>
                                <span>+ ₹{Number(lateFee).toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between border-t border-[var(--color-line)] pt-3 text-base font-medium">
                            <span>Total Amount</span>
                            <span className="text-xl">₹{Number(rental.total_amount + (lateFee || 0)).toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-4 pt-4 border-t border-[var(--color-line-soft)]">
                        {canCancel && (
                            <button
                                onClick={handleCancel}
                                disabled={actionLoading}
                                className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-3 text-[10px] font-semibold uppercase tracking-wider text-rose-700 hover:bg-rose-100 transition-colors disabled:opacity-50"
                            >
                                {actionLoading ? "Cancelling..." : "Cancel Rental"}
                            </button>
                        )}
                        {canReturn && (
                            <button
                                onClick={handleReturn}
                                disabled={actionLoading || status === "return_pending"}
                                className="rounded-2xl bg-[var(--color-ink)] px-6 py-3 text-[10px] font-semibold uppercase tracking-wider text-white hover:bg-[var(--color-accent)] transition-colors disabled:opacity-50"
                            >
                                {status === "return_pending" ? "Return Pending Approval" : "Request Return"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default RentalDetails;
