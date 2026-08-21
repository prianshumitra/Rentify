import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ArrowLeft } from "lucide-react";
import apiClient from "../../api/client";

function AdminProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await apiClient.get("/products/");
                setProducts(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Failed to load admin products:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchProducts();
    }, []);

    return (
        <main className="min-h-screen bg-[var(--color-ivory)] px-4 pb-20 pt-16 sm:px-6 lg:px-8 sm:pt-20 text-[var(--color-ink)]">
            <div className="mx-auto max-w-7xl w-full space-y-6">
                <Link to="/admin" className="inline-flex items-center gap-2 text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors">
                    <ArrowLeft size={14} />
                    Back to Admin Dashboard
                </Link>

                <div className="flex items-center justify-between border-b border-[var(--color-line-soft)] pb-4">
                    <div>
                        <h1 className="text-3xl font-medium tracking-[-0.04em]">Global Product Audit</h1>
                        <p className="text-xs text-[var(--color-ink-soft)]">Platform-wide product listings and catalog oversight.</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="h-40 animate-pulse rounded-2xl bg-black/5" />
                ) : products.length === 0 ? (
                    <div className="rounded-2xl border border-[var(--color-line)] bg-white/30 p-12 text-center">
                        <Package size={32} className="mx-auto text-[var(--color-muted)]" />
                        <h3 className="mt-3 text-base font-medium">No products in catalog</h3>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {products.map((prod) => (
                            <div key={prod.id} className="flex items-center justify-between rounded-2xl border border-white/90 bg-white/50 p-5 shadow-xs">
                                <div>
                                    <h3 className="text-lg font-medium text-[var(--color-ink)]">{prod.name}</h3>
                                    <p className="text-xs text-[var(--color-ink-soft)]">{prod.description}</p>
                                </div>
                                <Link to={`/app/products/${prod.id}`} className="rounded-xl border border-[var(--color-line)] bg-white px-3.5 py-1.5 text-[8px] font-bold uppercase tracking-wider text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-white transition-colors">
                                    Inspect
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default AdminProducts;
