import { Link } from "react-router-dom";
import { CreditCard, ArrowLeft } from "lucide-react";

function AdminPayments() {
    return (
        <main className="min-h-screen bg-[var(--color-ivory)] px-6 pb-24 pt-28 sm:pt-32 lg:pt-36 text-[var(--color-ink)]">
            <div className="mx-auto max-w-4xl space-y-6">
                <Link to="/admin" className="inline-flex items-center gap-2 text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors">
                    <ArrowLeft size={14} />
                    Back to Admin Dashboard
                </Link>

                <div className="flex items-center justify-between border-b border-[var(--color-line-soft)] pb-4">
                    <div>
                        <h1 className="text-3xl font-medium tracking-[-0.04em]">Financial Transactions & Payments</h1>
                        <p className="text-xs text-[var(--color-ink-soft)]">Platform payment processing and audit trail.</p>
                    </div>
                </div>

                <div className="rounded-2xl border border-[var(--color-line)] bg-white/30 p-12 text-center">
                    <CreditCard size={32} className="mx-auto text-[var(--color-muted)]" />
                    <h3 className="mt-3 text-base font-medium">Stripe Payment Gateway Integrated</h3>
                    <p className="mt-1 text-xs text-[var(--color-muted)]">Live transaction events are automatically synced with rental order payments.</p>
                </div>
            </div>
        </main>
    );
}

export default AdminPayments;
