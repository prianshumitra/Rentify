import { ArrowLeft, Calendar, Check, Minus, Package, Plus, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getProductVariants, getProducts } from "../../api/product.api";
import { createRental } from "../../api/rentals.api";
import type { Product, ProductVariant } from "../../types/product";

import StripePaymentModal from "../../components/payment/StripePaymentModal";

function RentalRequest() {
    const { productId } = useParams<{ productId: string }>();
    const location = useLocation();
    const navigate = useNavigate();

    const [product, setProduct] = useState<Product | null>(location.state?.product || null);
    const [variant, setVariant] = useState<ProductVariant | null>(location.state?.variant || null);
    const [quantity, setQuantity] = useState<number>(location.state?.quantity || 1);

    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("10:00");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("10:00");

    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [successData, setSuccessData] = useState<any>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    useEffect(() => {
        async function loadMissingData() {
            if (!product || !variant) {
                setIsLoading(true);
                try {
                    const products = await getProducts();
                    const currentProduct = products.find(p => String(p.id) === String(productId));
                    if (!currentProduct) {
                        setError("Product not found.");
                        return;
                    }
                    setProduct(currentProduct);

                    const variants = await getProductVariants(currentProduct.id);
                    // If variant was passed in state, try to find it in fresh data to ensure latest price
                    const stateVariantId = location.state?.variant?.id;
                    const currentVariant = stateVariantId 
                        ? variants.find(v => v.id === stateVariantId)
                        : variants.find(v => v.is_active);
                    
                    if (!currentVariant) {
                        setError("No active variants available for this product.");
                        return;
                    }
                    setVariant(currentVariant);
                } catch (err) {
                    setError("Failed to load product details.");
                } finally {
                    setIsLoading(false);
                }
            }
        }
        loadMissingData();
    }, [productId, product, variant, location.state]);

    const handleCreateRental = async () => {
        if (!variant || !startDate || !endDate) {
            setError("Please select both start and end dates.");
            return;
        }

        const start_at = new Date(`${startDate}T${startTime}:00`).toISOString();
        const end_at = new Date(`${endDate}T${endTime}:00`).toISOString();

        if (new Date(start_at) >= new Date(end_at)) {
            setError("End time must be after start time.");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const result = await createRental({
                variant_id: variant.id,
                start_at,
                end_at,
                quantity
            });
            setSuccessData(result);
            setIsPaymentModalOpen(true);
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to create rental. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePaymentSuccess = () => {
        setSuccessData((prev: any) => ({
            ...prev,
            status: "confirmed",
        }));
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-[var(--color-ivory)] flex items-center justify-center">
                <div className="animate-pulse text-[9px] uppercase tracking-[0.2em] text-[var(--color-muted)]">Loading details...</div>
            </main>
        );
    }

    if (successData) {
        const isPaid = successData.status.toLowerCase() === "confirmed";
        return (
            <main className="relative min-h-screen overflow-hidden bg-[var(--color-ivory)]">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                    <div className="absolute left-[14%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                    <div className="absolute right-[20%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                </div>

                <div className="relative z-10 mx-auto max-w-xl px-6 py-24 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-accent)] !text-white shadow-[0_20px_40px_rgba(23,23,23,.1)]">
                        <Check size={32} strokeWidth={1.5} />
                    </div>
                    
                    <h1 className="mt-10 text-4xl font-medium tracking-[-0.05em]">
                        {isPaid ? "Rental confirmed!" : "Rental requested."}
                    </h1>
                    <p className="mt-4 text-sm text-[var(--color-muted)]">
                        {isPaid
                            ? "Your Stripe payment was completed successfully and your rental is confirmed."
                            : "Your rental has been created and is pending payment."}
                    </p>

                    <div className="mt-12 rounded-3xl border border-[var(--color-line)] bg-white/40 p-8 text-left backdrop-blur-xl">
                        <div className="space-y-6">
                            <div className="flex justify-between border-b border-[var(--color-line-soft)] pb-4">
                                <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted)]">Rental ID</span>
                                <span className="text-xs font-mono">{successData.id.split('-')[0]}...</span>
                            </div>
                            <div className="flex justify-between border-b border-[var(--color-line-soft)] pb-4">
                                <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted)]">Status</span>
                                <span className="text-xs font-medium text-[var(--color-accent)] uppercase tracking-tighter">{successData.status.replace('_', ' ')}</span>
                            </div>
                            <div className="flex justify-between border-b border-[var(--color-line-soft)] pb-4">
                                <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted)]">Period</span>
                                <div className="text-right">
                                    <p className="text-xs">{new Date(successData.start_at).toLocaleDateString()}</p>
                                    <p className="text-[10px] text-[var(--color-muted)]">to {new Date(successData.end_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                             <div className="flex justify-between pt-2">
                                <span className="text-[10px] uppercase tracking-wider text-[var(--color-ink)] font-bold">Total Amount</span>
                                <span className="text-lg font-medium">₹{Number(successData.total_amount).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col gap-4">
                        {!isPaid && (
                            <button
                                onClick={() => setIsPaymentModalOpen(true)}
                                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[var(--color-accent)] px-8 py-5 text-[10px] font-medium uppercase tracking-[0.2em] !text-white shadow-lg hover:bg-[var(--color-ink)] transition-all"
                            >
                                Pay with Stripe (₹{Number(successData.total_amount).toFixed(2)})
                            </button>
                        )}
                        <Link 
                            to="/app/explore"
                            className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[var(--color-ink)] px-8 py-5 text-[10px] font-medium uppercase tracking-[0.2em] !text-white shadow-lg hover:bg-[var(--color-accent)] transition-all"
                        >
                            Back to explore
                        </Link>
                    </div>
                </div>

                {successData && (
                    <StripePaymentModal
                        isOpen={isPaymentModalOpen}
                        onClose={() => setIsPaymentModalOpen(false)}
                        rentalId={successData.id}
                        amount={Number(successData.total_amount)}
                        onSuccess={handlePaymentSuccess}
                    />
                )}
            </main>
        );
    }


    const subtotal = variant ? Number(variant.unit_price) * quantity : 0;

    return (
        <main className="relative min-h-screen overflow-hidden bg-[var(--color-ivory)]">
            {/* Design Grid */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute left-[8%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute right-[8%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute left-0 top-[20%] h-px w-full bg-[var(--color-line-soft)]" />
            </div>

            <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-10 pb-24 pt-16">
                <button
                    onClick={() => navigate(-1)}
                    className="group mb-12 flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]"
                >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-line)] group-hover:border-[var(--color-accent)] transition-colors">
                        <ArrowLeft size={12} />
                    </span>
                    Back
                </button>

                <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
                    <div className="space-y-10">
                        <section>
                            <div className="flex items-center gap-2.5 mb-2">
                                <span className="h-px w-8 bg-[var(--color-accent)]" />
                                <span className="text-[8.5px] font-semibold uppercase tracking-[0.28em] text-[var(--color-muted)]">
                                    RENTAL / CHECKOUT RESERVATION
                                </span>
                            </div>
                            <h1 className="mt-2 text-4xl font-medium tracking-tight">Rental Request</h1>

                            
                            {product && variant && (
                                <div className="mt-8 flex items-start gap-6 rounded-3xl border border-[var(--color-line)] bg-white/30 p-6 backdrop-blur-md">
                                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-ivory-soft)] border border-[var(--color-line-soft)]">
                                        <Package size={32} className="text-[var(--color-muted)]" strokeWidth={1} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium leading-tight">{product.name}</h3>
                                        <p className="mt-1 text-xs text-[var(--color-muted)]">{variant.brand} {variant.sku}</p>
                                        <div className="mt-3 flex flex-wrap gap-3">
                                            {variant.color && <span className="inline-flex items-center rounded-full border border-[var(--color-line-soft)] px-2 py-0.5 text-[8px] uppercase tracking-wider text-[var(--color-muted)]">{variant.color}</span>}
                                            {variant.size && <span className="inline-flex items-center rounded-full border border-[var(--color-line-soft)] px-2 py-0.5 text-[8px] uppercase tracking-wider text-[var(--color-muted)]">{variant.size}</span>}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>

                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Calendar size={18} className="text-[var(--color-accent)]" />
                                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-ink)]">Rental Period</h2>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-4 rounded-3xl border border-[var(--color-line)] bg-white/40 p-6 backdrop-blur-md shadow-sm">
                                    <div className="flex items-center justify-between border-b border-[var(--color-line-soft)] pb-3">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">Pickup / Start</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[9px] font-medium uppercase tracking-[0.18em] text-[var(--color-muted)] mb-1.5">Start Date</label>
                                            <input 
                                                type="date" 
                                                value={startDate} 
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="w-full rounded-2xl border border-[var(--color-line)] bg-white/80 px-4 py-3 text-sm font-medium outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-medium uppercase tracking-[0.18em] text-[var(--color-muted)] mb-1.5">Start Time</label>
                                            <input 
                                                type="time" 
                                                value={startTime} 
                                                onChange={(e) => setStartTime(e.target.value)}
                                                className="w-full rounded-2xl border border-[var(--color-line)] bg-white/80 px-4 py-3 text-sm font-medium outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 rounded-3xl border border-[var(--color-line)] bg-white/40 p-6 backdrop-blur-md shadow-sm">
                                    <div className="flex items-center justify-between border-b border-[var(--color-line-soft)] pb-3">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">Return / End</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[9px] font-medium uppercase tracking-[0.18em] text-[var(--color-muted)] mb-1.5">End Date</label>
                                            <input 
                                                type="date" 
                                                value={endDate} 
                                                onChange={(e) => setEndDate(e.target.value)}
                                                className="w-full rounded-2xl border border-[var(--color-line)] bg-white/80 px-4 py-3 text-sm font-medium outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-medium uppercase tracking-[0.18em] text-[var(--color-muted)] mb-1.5">End Time</label>
                                            <input 
                                                type="time" 
                                                value={endTime} 
                                                onChange={(e) => setEndTime(e.target.value)}
                                                className="w-full rounded-2xl border border-[var(--color-line)] bg-white/80 px-4 py-3 text-sm font-medium outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6">
                             <div className="flex items-center gap-3">
                                <Tag size={16} className="text-[var(--color-accent)]" />
                                <h2 className="text-xs font-medium uppercase tracking-widest text-[var(--color-ink)]">Quantity</h2>
                            </div>
                            
                            <div className="flex items-center gap-6 rounded-2xl border border-[var(--color-line)] bg-white/20 p-4 w-fit">
                                <button 
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-line)] hover:border-[var(--color-accent)] transition-colors disabled:opacity-20"
                                    disabled={quantity <= 1}
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="text-lg font-medium w-6 text-center">{quantity}</span>
                                <button 
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-line)] hover:border-[var(--color-accent)] transition-colors"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </section>
                    </div>

                    <aside>
                        <div className="sticky top-24 rounded-[2.5rem] border border-white/80 bg-white/40 p-8 shadow-[0_30px_60px_rgba(23,23,23,0.08)] backdrop-blur-2xl">
                            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]">Summary</h2>
                            
                            <div className="mt-8 space-y-5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[var(--color-muted)]">Unit Price</span>
                                    <span>₹{variant ? Number(variant.unit_price).toFixed(2) : "0.00"}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[var(--color-muted)]">Quantity</span>
                                    <span>x {quantity}</span>
                                </div>
                                <div className="h-px bg-[var(--color-line-soft)]" />
                                <div className="flex justify-between text-sm">
                                    <span className="text-[var(--color-muted)]">Rental Amount</span>
                                    <span>₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[var(--color-muted)]">Security Deposit</span>
                                    <span>₹0.00</span>
                                </div>
                                <div className="mt-4 flex justify-between pt-4 border-t border-[var(--color-line)]">
                                    <span className="text-sm font-medium uppercase tracking-tighter">Total</span>
                                    <span className="text-2xl font-medium tracking-tight">₹{subtotal.toFixed(2)}</span>
                                </div>
                            </div>

                            {error && (
                                <div className="mt-6 rounded-xl bg-red-50 p-4 text-[10px] uppercase tracking-wider text-red-500 border border-red-100">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleCreateRental}
                                disabled={isSubmitting || !variant}
                                className="group mt-8 flex w-full items-center justify-center rounded-[1.4rem] bg-[var(--color-ink)] px-6 py-5 shadow-xl hover:bg-[var(--color-accent)] transition-all duration-500 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <span className="text-[10px] font-medium uppercase tracking-[0.2em] !text-white">
                                    {isSubmitting ? "Processing..." : "Start rental"}
                                </span>
                            </button>
                            
                            <p className="mt-6 text-center text-[8px] uppercase tracking-[0.15em] text-[var(--color-muted)]">
                                Tax and fees calculated at checkout
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}

export default RentalRequest;
