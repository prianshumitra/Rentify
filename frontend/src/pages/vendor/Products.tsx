import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ArrowLeft, Tag } from "lucide-react";
import apiClient from "../../api/client";

interface ProductItem {
    id: string;
    name: string;
    description: string;
    category: string;
}

function VendorProducts() {
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await apiClient.get("/products/");
                setProducts(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Failed to load products:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchProducts();
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
                        <h1 className="text-3xl font-medium tracking-[-0.04em]">Vendor Products</h1>
                        <p className="text-xs text-[var(--color-ink-soft)]">Manage your product catalog and listings.</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="h-40 animate-pulse rounded-2xl bg-black/5" />
                ) : products.length === 0 ? (
                    <div className="rounded-2xl border border-[var(--color-line)] bg-white/30 p-12 text-center">
                        <Package size={32} className="mx-auto text-[var(--color-muted)]" />
                        <h3 className="mt-3 text-base font-medium">No products listed</h3>
                        <p className="mt-1 text-xs text-[var(--color-muted)]">Get started by creating your first product listing.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {products.map((prod) => (
                            <div key={prod.id} className="flex items-center justify-between rounded-2xl border border-white/90 bg-white/50 p-5 shadow-xs">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Tag size={12} className="text-[var(--color-accent)]" />
                                        <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--color-muted)]">{prod.category || "General"}</span>
                                    </div>
                                    <h3 className="text-lg font-medium text-[var(--color-ink)]">{prod.name}</h3>
                                    <p className="text-xs text-[var(--color-ink-soft)]">{prod.description}</p>
                                </div>
                                <Link to={`/app/products/${prod.id}`} className="rounded-xl border border-[var(--color-line)] bg-white px-3.5 py-1.5 text-[8px] font-bold uppercase tracking-wider text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-white transition-colors">
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

export default VendorProducts;
