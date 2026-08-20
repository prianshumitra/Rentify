import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { X, CreditCard, ShieldCheck, Check, AlertCircle, Loader2 } from "lucide-react";
import { createPayment, payLateFee, verifyPayment } from "../../api/payments.api";

const stripePromise = loadStripe(
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_51PqL1m2N1234567890abcdefghijklmnopqrstuvwxyz"
);

interface PaymentFormProps {
    rentalId: string;
    amount: number;
    paymentType?: string;
    existingPaymentId?: string;
    onSuccess: () => void;
    onClose: () => void;
}

const CheckoutForm: React.FC<PaymentFormProps> = ({
    rentalId,
    amount,
    paymentType = "rental",
    existingPaymentId,
    onSuccess,
    onClose,
}) => {
    const stripe = useStripe();
    const elements = useElements();

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [cardHolderName, setCardHolderName] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsProcessing(true);

        try {
            let paymentRes;
            if (paymentType === "late_fee" && existingPaymentId) {
                paymentRes = await payLateFee(existingPaymentId);
            } else {
                paymentRes = await createPayment(rentalId, amount, paymentType);
            }

            const clientSecret = paymentRes.client_secret;

            if (stripe && elements && clientSecret) {
                const cardElement = elements.getElement(CardElement);
                if (cardElement) {
                    const result = await stripe.confirmCardPayment(clientSecret, {
                        payment_method: {
                            card: cardElement,
                            billing_details: {
                                name: cardHolderName || "Rentify Customer",
                            },
                        },
                    });

                    if (result.error) {
                        setError(result.error.message || "Payment confirmation failed.");
                        setIsProcessing(false);
                        return;
                    }
                }
            }

            // Verify payment status with backend
            const verifyRes = await verifyPayment(rentalId, paymentRes.id);
            if (verifyRes.status.toLowerCase() === "paid" || verifyRes.status.toLowerCase() === "pending") {
                setIsSuccess(true);
                setTimeout(() => {
                    onSuccess();
                    onClose();
                }, 1800);
            } else {
                setError("Payment status verification pending. Please check details.");
            }
        } catch (err: any) {
            setError(
                err.response?.data?.detail || err.message || "Payment processing failed."
            );
        } finally {
            setIsProcessing(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="py-8 text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 animate-fade-in">
                    <Check size={32} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-medium tracking-tight">Payment Successful</h3>
                <p className="text-xs text-[var(--color-muted)]">
                    Your payment of ₹{amount.toFixed(2)} has been confirmed.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-2xl border border-[var(--color-line-soft)] bg-white/60 p-5 space-y-4 shadow-sm">
                <div>
                    <label className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)] mb-1.5">
                        Cardholder Name
                    </label>
                    <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={cardHolderName}
                        onChange={(e) => setCardHolderName(e.target.value)}
                        className="w-full rounded-xl border border-[var(--color-line)] bg-white px-3.5 py-2.5 text-xs font-medium outline-none focus:border-[var(--color-accent)] transition-all"
                    />
                </div>

                <div>
                    <label className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)] mb-1.5">
                        Card Details
                    </label>
                    <div className="rounded-xl border border-[var(--color-line)] bg-white p-3.5 transition-all focus-within:border-[var(--color-accent)]">
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: "14px",
                                        color: "#171717",
                                        fontFamily: "Inter, sans-serif",
                                        "::placeholder": {
                                            color: "#77736b",
                                        },
                                    },
                                    invalid: {
                                        color: "#e11d48",
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs text-rose-700">
                        <AlertCircle size={16} className="shrink-0 text-rose-500" />
                        <div className="space-y-1">
                            <p className="font-semibold">{error}</p>
                            {error.includes("API Key") && (
                                <p className="text-[10px] text-rose-600">
                                    Your backend secret key (<code className="font-mono bg-rose-100 px-1 py-0.5 rounded">sk_test_51U4hl...</code>) requires the matching publishable key (<code className="font-mono bg-rose-100 px-1 py-0.5 rounded">pk_test_51U4hl...</code>) in <code className="font-mono bg-rose-100 px-1 py-0.5 rounded">frontend/.env</code>.
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={async () => {
                            setIsProcessing(true);
                            setError(null);
                            try {
                                let paymentRes;
                                if (paymentType === "late_fee" && existingPaymentId) {
                                    paymentRes = await payLateFee(existingPaymentId);
                                } else {
                                    paymentRes = await createPayment(rentalId, amount, paymentType);
                                }
                                await verifyPayment(rentalId, paymentRes.id);
                                setIsSuccess(true);
                                setTimeout(() => {
                                    onSuccess();
                                    onClose();
                                }, 1500);
                            } catch (err: any) {
                                setError(err.response?.data?.detail || "Simulation failed.");
                            } finally {
                                setIsProcessing(false);
                            }
                        }}
                        className="w-full rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition-colors shadow-xs"
                    >
                        ⚡ Simulate Test Payment Success (Dev Mode)
                    </button>
                </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-[var(--color-line-soft)]">
                <div className="flex items-center gap-1.5 text-[9px] text-[var(--color-muted)] uppercase tracking-wider">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>256-bit SSL Encrypted</span>
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isProcessing}
                        className="rounded-xl border border-[var(--color-line)] px-4 py-2.5 text-xs font-medium hover:bg-black/5 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isProcessing || !stripe}
                        className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-ink)] px-6 py-2.5 text-xs font-medium text-white hover:bg-[var(--color-accent)] transition-all disabled:opacity-50 shadow-md"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <CreditCard size={14} />
                                <span>Pay ₹{amount.toFixed(2)}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};


export interface StripePaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    rentalId: string;
    amount: number;
    paymentType?: string;
    existingPaymentId?: string;
    onSuccess: () => void;
}

export const StripePaymentModal: React.FC<StripePaymentModalProps> = ({
    isOpen,
    onClose,
    rentalId,
    amount,
    paymentType = "rental",
    existingPaymentId,
    onSuccess,
}) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-lg rounded-3xl border border-white/80 bg-[var(--color-ivory-soft)] p-8 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-[var(--color-line-soft)] pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-ink)] text-white shadow-md">
                            <CreditCard size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-medium tracking-tight">Stripe Checkout</h2>
                            <p className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider">
                                {paymentType === "late_fee" ? "Late Fee Settlement" : "Rental Order Payment"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-[var(--color-muted)] hover:bg-black/5 hover:text-[var(--color-ink)] transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="rounded-2xl border border-[var(--color-line-soft)] bg-white/40 p-4 flex items-center justify-between">
                    <div>
                        <span className="text-[9px] uppercase tracking-wider text-[var(--color-muted)] font-medium">
                            Total Payable
                        </span>
                        <p className="text-xl font-semibold tracking-tight">₹{amount.toFixed(2)}</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-700">
                        {paymentType.replace("_", " ")}
                    </span>
                </div>

                <Elements stripe={stripePromise}>
                    <CheckoutForm
                        rentalId={rentalId}
                        amount={amount}
                        paymentType={paymentType}
                        existingPaymentId={existingPaymentId}
                        onSuccess={onSuccess}
                        onClose={onClose}
                    />
                </Elements>
            </div>
        </div>
    );
};

export default StripePaymentModal;
