import {
    ArrowUpRight,
    Package,
    Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { getProducts } from "../../api/product.api";
import type { Product } from "../../types/product";

function Explore() {
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadProducts() {
            try {
                setIsLoading(true);
                setError("");

                const data = await getProducts();

                setProducts(data);
            } catch (err) {
                console.error(
                    "Failed to load products:",
                    err,
                );

                setError(
                    "Unable to load the collection right now.",
                );
            } finally {
                setIsLoading(false);
            }
        }

        loadProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return products;
        }

        return products.filter((product) => {
            return (
                product.name
                    .toLowerCase()
                    .includes(query) ||
                product.slug
                    .toLowerCase()
                    .includes(query) ||
                product.description
                    ?.toLowerCase()
                    .includes(query)
            );
        });
    }, [products, search]);

    return (
        <main className="relative min-h-screen overflow-hidden">
            {/* ─────────────────────────────
                THREAD SYSTEM
            ───────────────────────────── */}

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
            >
                <div className="absolute left-[12%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                <div className="absolute right-[14%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                <div className="absolute left-0 top-[28%] h-px w-full bg-[var(--color-line-soft)]" />

                <div className="absolute left-[12%] top-[28%] h-1.5 w-1.5 rounded-full bg-[var(--color-ink)]" />

                <div className="absolute right-[14%] top-[28%] h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            </div>

            <section className="relative z-10 mx-auto max-w-[var(--content-width)] px-[var(--content-padding)] pb-24 pt-20">
                {/* ─────────────────────────
                    HEADER
                ───────────────────────── */}

                <div className="grid grid-cols-1 lg:grid-cols-[12%_1fr_25%]">
                    <div className="hidden border-r border-[var(--color-line-soft)] pt-2 lg:block">
                        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--color-muted)]">
                            Thread / 02
                        </p>

                        <div className="mt-8 flex items-center gap-3 text-xs text-[var(--color-muted)]">
                            <span className="h-px w-5 bg-[var(--color-muted)]" />
                            <span>Explore</span>
                        </div>
                    </div>

                    <div className="px-0 lg:px-[6vw]">
                        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--color-accent)]">
                            The collection / 02
                        </p>

                        <h1 className="mt-7 max-w-4xl text-[clamp(3.5rem,7vw,7rem)] font-medium leading-[0.88] tracking-[-0.065em]">
                            Find
                            <br />
                            <span className="font-[var(--font-display)] italic">
                                something.
                            </span>
                        </h1>

                        <p className="mt-8 max-w-lg text-base leading-7 text-[var(--color-ink-soft)] sm:text-lg">
                            Explore what people are making available to
                            rent.
                        </p>
                    </div>

                    <div className="mt-12 border-l border-[var(--color-line-soft)] pl-7 lg:mt-0">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                            Collection
                        </p>

                        <p className="mt-4 text-3xl font-medium tracking-[-0.05em]">
                            {products.length.toString().padStart(2, "0")}
                        </p>

                        <p className="mt-2 text-xs leading-5 text-[var(--color-muted)]">
                            active products available in the current
                            collection
                        </p>
                    </div>
                </div>

                {/* ─────────────────────────
                    SEARCH
                ───────────────────────── */}

                <div className="mt-20 border-b border-[var(--color-ink)] pb-4">
                    <div className="flex items-center gap-4">
                        <Search
                            size={17}
                            strokeWidth={1.5}
                            className="text-[var(--color-muted)]"
                        />

                        <input
                            type="search"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search the collection..."
                            className="w-full bg-transparent text-base outline-none placeholder:text-[var(--color-muted)]"
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* ─────────────────────────
                    PRODUCTS
                ───────────────────────── */}

                <div className="mt-12">
                    {isLoading && (
                        <div className="flex min-h-[300px] items-center justify-center">
                            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--color-muted)]">
                                Weaving collection...
                            </p>
                        </div>
                    )}

                    {!isLoading && error && (
                        <div className="border-l-2 border-[var(--color-accent)] pl-5">
                            <p className="text-sm text-[var(--color-ink-soft)]">
                                {error}
                            </p>
                        </div>
                    )}

                    {!isLoading &&
                        !error &&
                        filteredProducts.length === 0 && (
                            <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                                <Package
                                    size={28}
                                    strokeWidth={1.2}
                                    className="text-[var(--color-muted)]"
                                />

                                <p className="mt-5 text-lg font-medium">
                                    Nothing found.
                                </p>

                                <p className="mt-2 text-sm text-[var(--color-muted)]">
                                    Try a different search.
                                </p>
                            </div>
                        )}

                    {!isLoading &&
                        !error &&
                        filteredProducts.length > 0 && (
                            <div className="grid grid-cols-1 border-l border-t border-[var(--color-line-soft)] sm:grid-cols-2 lg:grid-cols-3">
                                {filteredProducts.map(
                                    (product, index) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            index={index + 1}
                                        />
                                    ),
                                )}
                            </div>
                        )}
                </div>
            </section>
        </main>
    );
}

interface ProductCardProps {
    product: Product;
    index: number;
}

function ProductCard({
    product,
    index,
}: ProductCardProps) {
    return (
        <article className="group relative min-h-[320px] border-b border-r border-[var(--color-line-soft)] p-7 transition-colors duration-300 hover:bg-[var(--color-accent-soft)] sm:p-8">
            <div className="flex items-start justify-between">
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]">
                    {String(index).padStart(2, "0")}
                </span>

                <span
                    className={`text-[9px] font-medium uppercase tracking-[0.16em] ${
                        product.is_active
                            ? "text-[var(--color-accent)]"
                            : "text-[var(--color-muted)]"
                    }`}
                >
                    {product.is_active
                        ? "Active"
                        : "Unavailable"}
                </span>
            </div>

            <div className="mt-20">
                <p className="text-[9px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    Product
                </p>

                <h2 className="mt-3 text-2xl font-medium tracking-[-0.04em]">
                    {product.name}
                </h2>

                {product.description && (
                    <p className="mt-3 line-clamp-3 max-w-sm text-sm leading-6 text-[var(--color-ink-soft)]">
                        {product.description}
                    </p>
                )}
            </div>

            <div className="absolute bottom-7 left-7 right-7 flex items-center justify-between sm:left-8 sm:right-8">
                <span className="text-[9px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
                    {product.slug}
                </span>

                <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-ink)] text-[var(--color-ivory)] transition-all duration-300 group-hover:bg-[var(--color-accent)]"
                    aria-label={`View ${product.name}`}
                >
                    <ArrowUpRight
                        size={15}
                        strokeWidth={1.6}
                    />
                </button>
            </div>
        </article>
    );
}

export default Explore;