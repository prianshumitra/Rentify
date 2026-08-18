import {
    ArrowUpRight,
    Search,
    SlidersHorizontal,
    Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getProducts } from "../../api/product.api";
import type { Product } from "../../types/product";

interface MousePosition {
    x: number;
    y: number;
}

function Explore() {
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [mouse, setMouse] =
        useState<MousePosition>({
            x: 0,
            y: 0,
        });

    useEffect(() => {
        const handleMouseMove = (
            event: MouseEvent,
        ) => {
            setMouse({
                x:
                    (event.clientX /
                        window.innerWidth -
                        0.5) *
                    2,
                y:
                    (event.clientY /
                        window.innerHeight -
                        0.5) *
                    2,
            });
        };

        window.addEventListener(
            "mousemove",
            handleMouseMove,
        );

        return () => {
            window.removeEventListener(
                "mousemove",
                handleMouseMove,
            );
        };
    }, []);

    useEffect(() => {
        async function loadProducts() {
            try {
                setError("");

                const data = await getProducts();

                setProducts(data);
            } catch (err) {
                console.error(
                    "Failed to load products:",
                    err,
                );

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

            {/* ═══════════════════════════════════════
                AMBIENT RENTAL GRID
            ═══════════════════════════════════════ */}

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
            >
                <div className="absolute left-[8%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                <div className="absolute left-[24%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                <div className="absolute left-1/2 top-0 h-full w-px bg-[var(--color-line-soft)]" />

                <div className="absolute right-[24%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                <div className="absolute right-[8%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                <div className="absolute left-0 top-[28%] h-px w-full bg-[var(--color-line-soft)]" />

                <div className="absolute left-0 top-[62%] h-px w-full bg-[var(--color-line-soft)]" />

                <div
                    className="absolute left-[24%] top-[28%] h-1.5 w-1.5 rounded-full bg-[var(--color-ink)] transition-transform duration-500"
                    style={{
                        transform: `translate(
                            ${mouse.x * 12}px,
                            ${mouse.y * 12}px
                        )`,
                    }}
                />

                <div
                    className="absolute right-[24%] top-[62%] h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] transition-transform duration-500"
                    style={{
                        transform: `translate(
                            ${mouse.x * -12}px,
                            ${mouse.y * -12}px
                        )`,
                    }}
                />

                <div
                    className="absolute left-1/2 top-[35%] h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-[var(--color-accent)]/[0.045] blur-[130px]"
                    style={{
                        transform: `translate(
                            calc(-50% + ${mouse.x * 35}px),
                            ${mouse.y * 30}px
                        )`,
                    }}
                />
            </div>

            {/* ═══════════════════════════════════════
                CONTENT
            ═══════════════════════════════════════ */}

            <div className="relative z-10 mx-auto max-w-[var(--content-width)] px-[var(--content-padding)] pb-28 pt-24">

                {/* ═══════════════════════════════════════
                    EDITORIAL HEADER
                ═══════════════════════════════════════ */}

                <header className="mb-12">

                    <div className="mb-8 flex items-center justify-between">

                        <div className="flex items-center gap-3">

                            <span className="h-px w-8 bg-[var(--color-accent)]" />

                            <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-[var(--color-muted)]">
                                Rental / Explore
                            </span>

                        </div>

                        <span className="hidden text-[9px] uppercase tracking-[0.24em] text-[var(--color-muted)] md:block">
                            03 / 04
                        </span>

                    </div>

                    <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">

                        <div>

                            <div className="mb-5 flex items-center gap-2">

                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-ivory)]">
                                    <Sparkles
                                        size={12}
                                        strokeWidth={1.5}
                                    />
                                </span>

                                <span className="text-[9px] font-medium uppercase tracking-[0.24em] text-[var(--color-accent)]">
                                    Discover
                                </span>

                            </div>

                            <h1 className="text-5xl font-medium leading-[0.86] tracking-[-0.065em] sm:text-7xl lg:text-8xl">

                                Find something
                                <br />

                                <span className="font-[var(--font-display)] italic">
                                    worth renting.
                                </span>

                            </h1>

                            <p className="mt-7 max-w-lg text-sm leading-7 text-[var(--color-ink-soft)]">
                                Explore the collection and find
                                something that fits the moment,
                                without needing to own it.
                            </p>

                        </div>


                    </div>

                </header>

                {/* ═══════════════════════════════════════
                    SEARCH / FILTER
                ═══════════════════════════════════════ */}

                <div className="relative mb-14">

                    <div
                        aria-hidden="true"
                        className="absolute inset-0 translate-x-2 translate-y-2 rounded-[1.7rem] border border-[var(--color-line-soft)] bg-[var(--color-ivory-soft)]"
                    />

                    <div className="relative flex flex-col gap-4 rounded-[1.7rem] border border-white/80 bg-[rgba(250,248,242,0.72)] p-4 shadow-[0_15px_40px_rgba(23,23,23,.07),inset_0_1px_0_rgba(255,255,255,.9)] backdrop-blur-xl sm:flex-row sm:items-center">

                        <div className="flex min-w-0 flex-1 items-center px-2">

                            <Search
                                size={18}
                                strokeWidth={1.5}
                                className="mr-4 shrink-0 text-[var(--color-muted)]"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value,
                                    )
                                }
                                placeholder="Search products, categories, anything..."
                                className="w-full bg-transparent py-3 text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-muted)]"
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSearch("")
                                    }
                                    className="mr-2 text-[8px] uppercase tracking-[0.18em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
                                >
                                    Clear
                                </button>
                            )}

                        </div>

                        <div className="flex items-center gap-3 border-t border-[var(--color-line-soft)] pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">

                            <span className="hidden text-[8px] uppercase tracking-[0.18em] text-[var(--color-muted)] md:block">
                                {filteredProducts.length} found
                            </span>

                            <button
                                type="button"
                                className="flex h-10 items-center gap-2 rounded-full border border-[var(--color-line)] px-4 text-[8px] font-medium uppercase tracking-[0.18em] text-[var(--color-ink)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:bg-[var(--color-ink)] hover:!text-white"
                            >
                                <SlidersHorizontal
                                    size={14}
                                    strokeWidth={1.5}
                                />

                                Filter
                            </button>

                        </div>

                    </div>

                </div>

                {/* ═══════════════════════════════════════
                    LOADING
                ═══════════════════════════════════════ */}

                {isLoading && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                        {[1, 2, 3, 4, 5, 6].map(
                            (item) => (
                                <div
                                    key={item}
                                    className="relative h-[330px] overflow-hidden rounded-[1.9rem] border border-[var(--color-line-soft)] bg-[var(--color-ivory-soft)]"
                                >
                                    <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-transparent via-white/40 to-transparent" />

                                    <div className="absolute left-6 top-6 h-9 w-9 rounded-full bg-[var(--color-line-soft)]" />

                                    <div className="absolute bottom-8 left-6 right-6 space-y-3">

                                        <div className="h-2 w-20 rounded-full bg-[var(--color-line-soft)]" />

                                        <div className="h-7 w-3/4 rounded-full bg-[var(--color-line-soft)]" />

                                        <div className="h-2 w-full rounded-full bg-[var(--color-line-soft)]" />

                                    </div>
                                </div>
                            ),
                        )}

                    </div>
                )}

                {/* ═══════════════════════════════════════
                    ERROR
                ═══════════════════════════════════════ */}

                {!isLoading && error && (
                    <div className="relative overflow-hidden rounded-[2rem] border border-[var(--color-line)] bg-[var(--color-ivory-soft)] p-16 text-center shadow-[0_20px_45px_rgba(23,23,23,.05)]">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-line)]">

                            <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />

                        </div>

                        <p className="mt-6 text-xl font-medium tracking-[-0.03em]">
                            The collection is unavailable.
                        </p>

                        <p className="mt-3 text-sm text-[var(--color-muted)]">
                            {error}
                        </p>

                    </div>
                )}

                {/* ═══════════════════════════════════════
                    EMPTY
                ═══════════════════════════════════════ */}

                {!isLoading &&
                    !error &&
                    filteredProducts.length === 0 && (
                        <div className="relative overflow-hidden rounded-[2rem] border border-[var(--color-line)] bg-[var(--color-ivory-soft)] p-16 text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[var(--color-line)]">

                                <Search
                                    size={19}
                                    strokeWidth={1.4}
                                    className="text-[var(--color-muted)]"
                                />

                            </div>

                            <p className="mt-7 text-2xl font-medium tracking-[-0.04em]">
                                Nothing found.
                            </p>

                            <p className="mt-3 text-sm text-[var(--color-muted)]">
                                Try another search or explore
                                something different.
                            </p>

                            {search && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSearch("")
                                    }
                                    className="mt-7 rounded-full bg-[var(--color-ink)] px-5 py-3 text-[9px] font-medium uppercase tracking-[0.18em] !text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--color-accent)]"
                                >
                                    Clear search
                                </button>
                            )}

                        </div>
                    )}

                {/* ═══════════════════════════════════════
                    PRODUCT GRID
                ═══════════════════════════════════════ */}

                {!isLoading &&
                    !error &&
                    filteredProducts.length > 0 && (
                        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

                            {filteredProducts.map(
                                (
                                    product,
                                    index,
                                ) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        index={index}
                                        mouse={mouse}
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
    mouse: MousePosition;
}

function ProductCard({
    product,
    index,
    mouse,
}: ProductCardProps) {
    const [isHovered, setIsHovered] =
        useState(false);

    const rotation =
        index % 3 === 1
            ? "rotate-[0.45deg]"
            : index % 3 === 2
              ? "rotate-[-0.45deg]"
              : "";

    return (
        <Link
            to={`/app/products/${product.id}`}
            className={`group relative block ${rotation}`}
            onMouseEnter={() =>
                setIsHovered(true)
            }
            onMouseLeave={() =>
                setIsHovered(false)
            }
        >

            {/* Physical depth */}

            <div
                aria-hidden="true"
                className="absolute inset-0 translate-x-2 translate-y-2 rounded-[1.9rem] border border-[var(--color-line-soft)] bg-[var(--color-ivory-soft)] transition-transform duration-500 group-hover:translate-x-3 group-hover:translate-y-3"
            />

            {/* Main card */}

            <article
                className="relative flex min-h-[340px] flex-col overflow-hidden rounded-[1.9rem] border border-white/80 bg-[rgba(250,248,242,0.76)] p-6 shadow-[0_15px_35px_rgba(23,23,23,.055),inset_0_1px_0_rgba(255,255,255,.85)] backdrop-blur-xl transition-all duration-500 group-hover:-translate-y-2 group-hover:border-[var(--color-accent)]/40 group-hover:shadow-[0_28px_55px_rgba(23,23,23,.13)]"
                style={{
                    transform: isHovered
                        ? `
                            perspective(900px)
                            rotateX(${mouse.y * -1.5}deg)
                            rotateY(${mouse.x * 1.5}deg)
                            translateY(-8px)
                        `
                        : undefined,
                }}
            >

                {/* Ambient card glow */}

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[var(--color-accent)]/[0.045] blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:bg-[var(--color-accent)]/[0.08]"
                />

                {/* Decorative orbital rings */}

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute right-[-35px] top-[35px] h-28 w-28 rounded-full border border-[var(--color-line-soft)] transition-transform duration-700 group-hover:rotate-45 group-hover:scale-110"
                />

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute right-[-20px] top-[50px] h-20 w-20 rounded-full border border-[var(--color-line-soft)]"
                />

                {/* Top row */}

                <div className="relative z-10 flex items-start justify-between">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-ink)] text-[var(--color-ivory)] shadow-[0_10px_20px_rgba(23,23,23,.12)] transition-transform duration-500 group-hover:rotate-12 group-hover:scale-105">

                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] shadow-[0_0_10px_rgba(190,85,55,.5)]" />

                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-[var(--color-line-soft)] bg-white/35 px-3 py-1.5 backdrop-blur-md">

                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] shadow-[0_0_8px_rgba(190,85,55,.4)]" />

                        <span className="text-[7px] font-medium uppercase tracking-[0.18em] text-[var(--color-muted)]">
                            Available
                        </span>

                    </div>

                </div>

                {/* Product information */}

                <div className="relative z-10 mt-auto">

                    <p className="mb-2 text-[8px] font-medium uppercase tracking-[0.2em] text-[var(--color-accent)]">
                        Rental /{" "}
                        {String(
                            index + 1,
                        ).padStart(2, "0")}
                    </p>

                    <h2 className="line-clamp-2 text-2xl font-medium leading-[0.95] tracking-[-0.045em]">
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

                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-ink)] !text-white shadow-[0_10px_20px_rgba(23,23,23,.12)] transition-all duration-300 group-hover:bg-[var(--color-accent)] group-hover:shadow-[0_10px_25px_rgba(190,85,55,.2)]">

                            <ArrowUpRight
                                size={15}
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