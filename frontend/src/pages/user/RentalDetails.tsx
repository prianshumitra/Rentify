import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Package, AlertCircle, CreditCard, Calendar, ShieldCheck, CheckCircle2 } from "lucide-react";
import { getRentalById, cancelRental, returnRental, getLateFee, type RentalDetail } from "../../api/rentals.api";
import StripePaymentModal from "../../components/payment/StripePaymentModal";

function RentalDetails() {
    const { rentalId } = useParams<{ rentalId: string }>();
    const navigate = useNavigate();

    const [rental, setRental] = useState<RentalDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [lateFee, setLateFee] = useState<number | null>(null);

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentModalType, setPaymentModalType] = useState<string>("rental");
    const [paymentModalAmount, setPaymentModalAmount] = useState<number>(0);

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

    const handleOpenPayment = (type: "rental" | "late_fee", amt: number) => {
        setPaymentModalType(type);
        setPaymentModalAmount(amt);
        setIsPaymentModalOpen(true);
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-[var(--color-ivory)] px-6 py-20">
                <div className="mx-auto max-w-2xl space-y-4">
                    <div className="h-6 w-32 animate-pulse rounded-lg bg-black/10" />
                    <div className="h-80 w-full animate-pulse rounded-3xl bg-black/5" />
                </div>
            </main>
        );
    }

    if (error || !rental) {
        return (
            <main className="min-h-screen bg-[var(--color-ivory)] px-6 py-20 text-center">
                <div className="mx-auto max-w-md space-y-4">
                    <AlertCircle size={36} className="mx-auto text-rose-500" />
                    <h2 className="text-lg font-medium">{error || "Rental not found."}</h2>
                    <Link
                        to="/app/rentals"
                        className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-ink)] px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-white"
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
    const isPendingPayment = status === "pending_payment";

    return (
        <main className="relative min-h-screen overflow-hidden bg-[var(--color-ivory)] px-5 pb-20 pt-24 text-[var(--color-ink)]">
            {/* Background Loom threads */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute left-[10%] top-0 h-full w-px bg-[var(--color-line-soft)] opacity-40" />
                <div className="absolute right-[10%] top-0 h-full w-px bg-[var(--color-line-soft)] opacity-40" />
            </div>

            <div className="relative z-10 mx-auto max-w-2xl space-y-5">
                {/* Back Link Button */}
                <button
                    onClick={() => navigate("/app/rentals")}
                    className="group inline-flex items-center gap-2.5 text-[8.5px] font-bold uppercase tracking-[0.2em] text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
                >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10 bg-white/70 shadow-xs group-hover:border-[var(--color-accent)] group-hover:bg-white transition-all">
                        <ArrowLeft size={11} />
                    </span>
                    <span>Back to Rentals Workspace</span>
                </button>

                {/* ═════════════════════════════════════════════════════════
                    COMPACT HAND-STITCHED CRAFT CARD
                ═════════════════════════════════════════════════════════ */}
                <div className="relative group">
                    {/* Shadow Layer */}
                    <div className="absolute inset-0 rounded-3xl bg-[#dfd8c8] border border-black/5 shadow-xl translate-x-1.5 translate-y-2" />

                    {/* Stitched Card Body */}
                    <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-[var(--color-accent)]/50 bg-gradient-to-b from-[#fffefc] via-[#fcfaf5] to-[#f6f1e5] p-5 sm:p-6 shadow-md backdrop-blur-2xl space-y-5 outline outline-2 outline-dashed outline-stone-400/30 outline-offset-[-6px]">
                        
                        {/* Stitched Corner Rivets Accent Marks */}
                        <span className="absolute top-2 left-2 text-[9px] text-[var(--color-accent)]/60 font-mono font-bold">+</span>
                        <span className="absolute top-2 right-2 text-[9px] text-[var(--color-accent)]/60 font-mono font-bold">+</span>
                        <span className="absolute bottom-2 left-2 text-[9px] text-[var(--color-accent)]/60 font-mono font-bold">+</span>
                        <span className="absolute bottom-2 right-2 text-[9px] text-[var(--color-accent)]/60 font-mono font-bold">+</span>

                        {/* Card Window Header */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b-2 border-dashed border-stone-300/80 pb-4 -mx-1">
                            <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="h-px w-6 bg-[var(--color-accent)]" />
                                    <span className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[var(--color-muted)]">
                                        RENTAL / ORDER MANIFEST
                                    </span>
                                </div>

                                <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">
                                    Order #{rental.id.slice(0, 8).toUpperCase()}
                                </h1>
                            </div>


                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/90 px-3 py-1 text-[8px] font-bold uppercase tracking-wider text-emerald-800 shadow-xs">
                                    <CheckCircle2 size={11} className="text-emerald-600" />
                                    {rental.status.replace("_", " ")}
                                </span>
                            </div>
                        </div>


                        {/* Compact Stitched Product Summary Box */}
                        {item && (
                            <div className="relative rounded-2xl border-2 border-dashed border-[#e8e0d0] bg-[#fcfaf5] p-4 shadow-inner space-y-3">

                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-[var(--color-accent)]/40 bg-gradient-to-b from-[#f7f4ea] to-[#e4ded0] shadow-xs">
                                        <Package size={26} className="text-stone-700" strokeWidth={1.2} />
                                    </div>

                                    <div className="space-y-0.5 min-w-0">
                                        <span className="inline-block text-[7.5px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                                            Rented Object
                                        </span>
                                        <h3 className="text-lg font-medium tracking-tight text-[var(--color-ink)] truncate">
                                            {item.product_name}
                                        </h3>
                                        <p className="text-[11px] text-[var(--color-muted)] truncate">
                                            SKU: <span className="font-mono text-[var(--color-ink)]">{item.variant_sku}</span> {item.variant_brand ? `• ${item.variant_brand}` : ""}
                                        </p>

                                        <div className="flex items-center gap-3 text-xs font-medium text-[var(--color-ink)] pt-1">
                                            <span className="rounded-md bg-stone-100 px-2 py-0.5 border border-stone-200 text-[10px]">Qty: {item.quantity}</span>
                                            <span className="rounded-md bg-stone-100 px-2 py-0.5 border border-stone-200 text-[10px]">Daily Rate: ₹{Number(item.unit_price).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Compact Stitched Duration Timeline */}
                        <div className="relative rounded-2xl border-2 border-dashed border-amber-300/70 bg-amber-50/50 p-4 space-y-3">
                            <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.2em] text-amber-900 border-b border-dashed border-amber-200 pb-1.5">
                                <Calendar size={12} className="text-[var(--color-accent)]" />
                                <span>Rental Duration Schedule</span>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <span className="text-[7.5px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)] block mb-0.5">
                                        Start Date & Time
                                    </span>
                                    <p className="text-xs font-medium text-[var(--color-ink)] font-mono">
                                        {new Date(rental.start_at).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-[7.5px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)] block mb-0.5">
                                        Return Date & Time
                                    </span>
                                    <p className="text-xs font-medium text-[var(--color-ink)] font-mono">
                                        {new Date(rental.end_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Compact Stitched Financial Receipt Breakdown Slip */}
                        <div className="relative rounded-2xl border-2 border-dashed border-stone-300 bg-white/70 p-4 space-y-2.5 shadow-xs">
                            <div className="flex items-center justify-between border-b border-dashed border-stone-300 pb-2">
                                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[var(--color-muted)]">
                                    Financial Manifest
                                </span>
                                <ShieldCheck size={13} className="text-emerald-600" />
                            </div>

                            <div className="flex justify-between text-xs">
                                <span className="text-[var(--color-muted)]">Rental Rate Amount</span>
                                <span className="font-mono font-medium">₹{Number(rental.rental_amount).toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between text-xs">
                                <span className="text-[var(--color-muted)]">Security Deposit</span>
                                <span className="font-mono font-medium">₹{Number(rental.deposit_amount).toFixed(2)}</span>
                            </div>

                            {lateFee !== null && (
                                <div className="flex justify-between text-xs text-rose-600 font-medium">
                                    <span>Overdue Late Fee Assessed</span>
                                    <span className="font-mono">+ ₹{Number(lateFee).toFixed(2)}</span>
                                </div>
                            )}

                            <div className="flex justify-between border-t-2 border-dashed border-stone-400/80 pt-3 text-sm font-medium">
                                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink)]">Grand Total Value</span>
                                <span className="text-xl font-bold tracking-tight text-[var(--color-ink)] font-mono">
                                    ₹{Number(rental.total_amount + (lateFee || 0)).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* Stitched Action Controls */}
                        <div className="flex flex-wrap items-center gap-3 pt-3 border-t-2 border-dashed border-stone-300/80">
                            {isPendingPayment && (
                                <button
                                    onClick={() => handleOpenPayment("rental", Number(rental.total_amount))}
                                    className="inline-flex items-center gap-1.5 rounded-xl border-2 border-dashed border-orange-400 bg-[var(--color-accent)] px-5 py-2.5 text-[9px] font-bold uppercase tracking-wider !text-white hover:bg-[var(--color-ink)] hover:-translate-y-0.5 active:translate-y-0 shadow-xs transition-all"
                                >
                                    <CreditCard size={13} />
                                    <span>Pay Now with Stripe (₹{Number(rental.total_amount).toFixed(2)})</span>
                                </button>
                            )}

                            {lateFee !== null && lateFee > 0 && (
                                <button
                                    onClick={() => handleOpenPayment("late_fee", Number(lateFee))}
                                    className="inline-flex items-center gap-1.5 rounded-xl border-2 border-dashed border-amber-400 bg-amber-600 px-5 py-2.5 text-[9px] font-bold uppercase tracking-wider !text-white hover:bg-amber-700 hover:-translate-y-0.5 active:translate-y-0 shadow-xs transition-all"
                                >
                                    <CreditCard size={13} />
                                    <span>Pay Late Fee (₹{Number(lateFee).toFixed(2)})</span>
                                </button>
                            )}

                            {canCancel && (
                                <button
                                    onClick={handleCancel}
                                    disabled={actionLoading}
                                    className="rounded-xl border-2 border-dashed border-rose-300 bg-rose-50 px-4 py-2.5 text-[9px] font-bold uppercase tracking-wider text-rose-700 hover:bg-rose-100 hover:-translate-y-0.5 active:translate-y-0 shadow-xs transition-all disabled:opacity-50"
                                >
                                    {actionLoading ? "Cancelling..." : "Cancel Rental Order"}
                                </button>
                            )}

                            {canReturn && (
                                <button
                                    onClick={handleReturn}
                                    disabled={actionLoading || status === "return_pending"}
                                    className="rounded-xl border-2 border-dashed border-stone-800 bg-[var(--color-ink)] px-5 py-2.5 text-[9px] font-bold uppercase tracking-wider text-white hover:bg-[var(--color-accent)] hover:-translate-y-0.5 active:translate-y-0 shadow-xs transition-all disabled:opacity-50"
                                >
                                    {status === "return_pending" ? "Return Pending Approval" : "Request Item Return"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {rental && (
                <StripePaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    rentalId={rental.id}
                    amount={paymentModalAmount}
                    paymentType={paymentModalType}
                    onSuccess={fetchDetail}
                />
            )}
        </main>
    );
}

export default RentalDetails;
