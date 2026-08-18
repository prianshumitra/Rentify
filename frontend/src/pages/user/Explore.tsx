import { ArrowUpRight, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

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
                setError("");

                const data = await getProducts();

                setProducts(data);
            } catch (err) {
                console.error("Failed to load products:", err);

                setError(
                    "Unable to load products right now.",
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
                product.description
                    ?.toLowerCase()
                    .includes(query) ||
                product.slug
                    .toLowerCase()
                    .includes(query)
            );
        });
    }, [products, search]);

    return (
        <main className="relative min-h-screen overflow-hidden bg-[var(--color-ivory)]">
            {/* ═══════════════════════════════
                BACKGROUND THREADS
            ═══════════════════════════════ */}

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
            >
                <div className="absolute left-[14%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                <div className="absolute right-[20%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                <div className="absolute left-0 top-[31%] h-px w-full bg-[var(--color-line-soft)]" />

                <div className="absolute left-[14%] top-[31%] h-1.5 w-1.5 rounded-full bg-[var(--color-ink)]" />

                <div className="absolute right-[20%] top-[31%] h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            </div>

            {/* ═══════════════════════════════
                CONTENT
            ═══════════════════════════════ */}

            <div className="relative z-10 mx-auto max-w-[var(--content-width)] px-[var(--content-padding)] pb-24 pt-28">
                {/* Header */}

                <header className="mb-12">
                    <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                        <div>
                            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--color-accent)]">
                                Thread / 03
                            </p>

                            <h1 className="text-5xl font-medium leading-[0.92] tracking-[-0.055em] sm:text-7xl">
                                Find something
                                <br />

                                <span className="font-[var(--font-display)] italic">
                                    worth renting.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-md text-sm leading-6 text-[var(--color-ink-soft)]">
                                Explore what is available and find the
                                right thing for your next thread.
                            </p>
                        </div>

                        <div className="hidden text-right md:block">
                            <p className="text-4xl font-medium tracking-[-0.05em]">
                                {products.length}
                            </p>

                            <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                                Available threads
                            </p>
                        </div>
                    </div>
                </header>

                {/* ═══════════════════════════════
                    SEARCH
                ═══════════════════════════════ */}

                <div className="relative mb-12">
                    <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-[1.5rem] border border-[var(--color-line-soft)] bg-[var(--color-ivory-soft)]" />

                    <div className="relative flex items-center rounded-[1.5rem] border border-white/70 bg-[rgba(250,248,242,0.72)] px-5 py-4 shadow-[0_10px_25px_rgba(23,23,23,0.06),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-xl">
                        <Search
                            size={17}
                            strokeWidth={1.5}
                            className="mr-4 shrink-0 text-[var(--color-muted)]"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search products..."
                            className="w-full bg-transparent text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-muted)]"
                        />

                        <button
                            type="button"
                            className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-line)] text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-ivory)]"
                        >
                            <SlidersHorizontal
                                size={15}
                                strokeWidth={1.5}
                            />
                        </button>
                    </div>
                </div>

                {/* ═══════════════════════════════
                    STATES
                ═══════════════════════════════ */}

                {isLoading && (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map(
                            (item) => (
                                <div
                                    key={item}
                                    className="h-[280px] animate-pulse rounded-[1.8rem] border border-[var(--color-line-soft)] bg-[var(--color-ivory-soft)]"
                                />
                            ),
                        )}
                    </div>
                )}

                {!isLoading && error && (
                    <div className="rounded-[1.8rem] border border-[var(--color-line)] bg-[var(--color-ivory-soft)] p-10 text-center">
                        <p className="text-sm text-[var(--color-ink-soft)]">
                            {error}
                        </p>
                    </div>
                )}

                {!isLoading &&
                    !error &&
                    filteredProducts.length === 0 && (
                        <div className="rounded-[1.8rem] border border-[var(--color-line)] bg-[var(--color-ivory-soft)] p-16 text-center">
                            <p className="text-2xl font-medium tracking-[-0.04em]">
                                Nothing found.
                            </p>

                            <p className="mt-3 text-sm text-[var(--color-muted)]">
                                Try another search.
                            </p>
                        </div>
                    )}

                {/* ═══════════════════════════════
                    PRODUCT GRID
                ═══════════════════════════════ */}

                {!isLoading &&
                    !error &&
                    filteredProducts.length > 0 && (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredProducts.map(
                                (product, index) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        index={index}
                                    />
                                ),
                            )}
                        </div>
                    )}
            </div>
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
        <Link
            to={`/app/products/${product.id}`}
            className="group relative block"
        >
            {/* Physical depth */}

            <div
                aria-hidden="true"
                className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-[1.8rem] border border-[var(--color-line-soft)] bg-[var(--color-ivory-soft)]"
            />

            {/* Main card */}

            <article
                className={`relative flex min-h-[280px] flex-col overflow-hidden rounded-[1.8rem] border border-[var(--color-line)] bg-[rgba(250,248,242,0.78)] p-6 backdrop-blur-xl transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[var(--color-accent)] group-hover:shadow-[0_18px_35px_rgba(23,23,23,0.1)] ${
                    index % 3 === 1
                        ? "rotate-[0.3deg]"
                        : index % 3 === 2
                          ? "rotate-[-0.3deg]"
                          : ""
                }`}
            >
                {/* Top row */}

                <div className="flex items-start justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-ink)] text-[var(--color-ivory)]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                    </span>

                    <span className="flex items-center gap-2 text-[8px] font-medium uppercase tracking-[0.18em] text-[var(--color-muted)]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                        Available
                    </span>
                </div>

                {/* Product information */}

                <div className="mt-auto">
                    <p className="mb-2 text-[8px] font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]">
                        Thread / {String(index + 1).padStart(2, "0")}
                    </p>

                    <h2 className="text-2xl font-medium leading-tight tracking-[-0.04em]">
                        {product.name}
                    </h2>

                    {product.description && (
                        <p className="mt-3 line-clamp-2 text-xs leading-5 text-[var(--color-ink-soft)]">
                            {product.description}
                        </p>
                    )}

                    <div className="mt-6 flex items-center justify-between border-t border-[var(--color-line-soft)] pt-4">
                        <span className="text-[8px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                            View details
                        </span>

                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-ink)] text-[var(--color-ivory)] transition-colors group-hover:bg-[var(--color-accent)]">
                            <ArrowUpRight
                                size={14}
                                strokeWidth={1.5}
                            />
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}

export default Explore;