import {
    ArrowUpRight,
    Search,
    Sparkles,
    X,
    LayoutGrid,
    List,
    ArrowUpDown,
    CheckCircle2,
    PackageCheck,
    Zap
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { getProducts } from "../../api/product.api";
import type { Product } from "../../types/product";

interface MousePosition {
    x: number;
    y: number;
}

const CATEGORY_TAGS = [
    { label: "Tools & Work", query: "work" },
    { label: "Travel & Outdoor", query: "travel" },
    { label: "Events & Moments", query: "moment" },
    { label: "Gear & Tech", query: "tech" },
];

function Explore() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get("q") || "";

    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState(initialQuery);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [sortBy, setSortBy] = useState<"default" | "name" | "newest">("default");
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [mouse, setMouse] = useState<MousePosition>({
        x: 0,
        y: 0,
    });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setMouse({
                x: (event.clientX / window.innerWidth - 0.5) * 2,
                y: (event.clientY / window.innerHeight - 0.5) * 2,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    useEffect(() => {
        async function loadProducts() {
            try {
                setError("");
                const data = await getProducts();
                setProducts(data);
            } catch (err) {
                console.error("Failed to load products:", err);
                setError("Unable to load products right now.");
            } finally {
                setIsLoading(false);
            }
        }
        loadProducts();
    }, []);

    // Sync search state with URL query parameter
    const handleSearchChange = (value: string) => {
        setSearch(value);
        if (value) {
            setSearchParams({ q: value });
        } else {
            setSearchParams({});
        }
    };

    const handleTagClick = (query: string) => {
        if (search.toLowerCase() === query.toLowerCase()) {
            handleSearchChange("");
        } else {
            handleSearchChange(query);
        }
    };

    // Robust multi-field search filter & sort
    const filteredProducts = useMemo(() => {
        let result = [...products];

        const query = search.trim().toLowerCase();
        if (query) {
            result = result.filter((product) => {
                const nameMatch = product.name ? product.name.toLowerCase().includes(query) : false;
                const descMatch = product.description ? product.description.toLowerCase().includes(query) : false;
                const slugMatch = product.slug ? product.slug.toLowerCase().includes(query) : false;
                const categoryMatch = product.category_id ? product.category_id.toLowerCase().includes(query) : false;

                return nameMatch || descMatch || slugMatch || categoryMatch;
            });
        }

        if (sortBy === "name") {
            result.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "newest") {
            result.reverse();
        }

        return result;
    }, [products, search, sortBy]);

    const featuredProduct = products[0] || null;

    return (
        <main className="relative min-h-screen overflow-hidden bg-[var(--color-ivory)]">

            {/* AMBIENT RENTAL GRID */}
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
                        transform: `translate(${mouse.x * 12}px, ${mouse.y * 12}px)`,
                    }}
                />

                <div
                    className="absolute right-[24%] top-[62%] h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] transition-transform duration-500"
                    style={{
                        transform: `translate(${mouse.x * -12}px, ${mouse.y * -12}px)`,
                    }}
                />

                <div
                    className="absolute left-1/2 top-[35%] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[var(--color-accent)]/[0.045] blur-[120px]"
                    style={{
                        transform: `translate(calc(-50% + ${mouse.x * 35}px), ${mouse.y * 30}px)`,
                    }}
                />
            </div>

            {/* CONTENT (COMPACT SCALED LAYOUT) */}
            <div className="relative z-10 mx-auto max-w-[var(--content-width)] px-[var(--content-padding)] pb-14 pt-16">

                {/* EDITORIAL HEADER */}
                <header className="mb-4">
                    <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <span className="h-px w-6 bg-[var(--color-accent)]" />
                            <span className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[var(--color-muted)]">
                                Rental / Explore
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/90 border border-emerald-300 px-2.5 py-0.5 text-[7.5px] font-semibold text-emerald-900 shadow-xs">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                {products.length} Items Live
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
                        <div>
                            <div className="mb-1.5 flex items-center gap-2">
                                <span className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-ivory)]">
                                    <Sparkles size={10} strokeWidth={1.5} />
                                </span>
                                <span className="text-[7.5px] font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                                    Discover Catalog
                                </span>
                            </div>

                            <h1 className="text-2xl font-medium leading-[0.9] tracking-[-0.04em] sm:text-3xl lg:text-4xl">
                                Find something
                                <br />
                                <span className="font-[var(--font-display)] italic">
                                    worth renting.
                                </span>
                            </h1>
                        </div>

                        <p className="max-w-md text-[11px] leading-4 text-[var(--color-ink-soft)]">
                            Explore items available for flexible rental terms without long-term commitment.
                        </p>
                    </div>
                </header>

                {/* SPOTLIGHT HERO FEATURED CARD */}
                {featuredProduct && !search && (
                    <div
                        onMouseEnter={() => setHoveredCard("spotlight")}
                        onMouseLeave={() => setHoveredCard(null)}
                        className="relative group transition-all duration-300 ease-out mb-4"
                    >

                        <div
                            className="absolute inset-0 rounded-3xl bg-[#ded8ca] border border-black/5 transition-all duration-300 ease-out"
                            style={{
                                transform: hoveredCard === "spotlight" ? "translate(4px, 6px)" : "translate(2px, 3px)",
                                opacity: hoveredCard === "spotlight" ? 0.9 : 0.6
                            }}
                        />

                        <div
                            className="relative overflow-hidden rounded-3xl border border-white/90 bg-gradient-to-r from-[#fffefc] via-[#fcfaf5] to-[#f6f1e5] p-5 backdrop-blur-2xl transition-all duration-300 ease-out shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            style={{
                                transform: hoveredCard === "spotlight" ? "translateY(-3px)" : "translateY(0px)",
                                boxShadow: hoveredCard === "spotlight"
                                    ? "0 18px 36px -10px rgba(23, 23, 23, 0.12)"
                                    : "0 8px 18px -8px rgba(23, 23, 23, 0.04)"
                            }}
                        >

                            <div className="space-y-1.5 min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-accent)] px-2.5 py-0.5 text-[7px] font-semibold uppercase tracking-wider text-white shadow-xs">
                                        <Zap size={9} />
                                        Featured Item
                                    </span>
                                    <span className="font-mono text-[8px] text-[var(--color-muted)]">
                                        Ready For Pickup
                                    </span>
                                </div>

                                <h2 className="text-xl font-medium tracking-tight text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors truncate">
                                    {featuredProduct.name}
                                </h2>

                                <p className="text-xs text-[var(--color-ink-soft)] line-clamp-1 max-w-xl">
                                    {featuredProduct.description || "Premium quality item ready for your next project or adventure."}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                <button
                                    onClick={() => navigate(`/app/products/${featuredProduct.id}/rent`)}
                                    className="inline-flex items-center gap-1 rounded-xl bg-[var(--color-accent)] px-3.5 py-2 text-[8px] font-semibold uppercase tracking-wider !text-white hover:bg-[var(--color-ink)] active:scale-95 shadow-xs transition-all"
                                >
                                    <span>Rent Now</span>
                                    <Zap size={11} />
                                </button>
                                <button
                                    onClick={() => navigate(`/app/products/${featuredProduct.id}`)}
                                    className="inline-flex items-center gap-1 rounded-xl bg-[var(--color-ink)] px-3.5 py-2 text-[8px] font-semibold uppercase tracking-wider text-white hover:bg-[var(--color-accent)] active:scale-95 shadow-xs transition-all"
                                >
                                    <span>View Specs</span>
                                    <ArrowUpRight size={11} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* SEARCH / FILTER DOCK BAR */}
                <div className="mb-4 space-y-2.5">
                    <div className="flex flex-col gap-2.5 rounded-2xl border border-white/90 bg-gradient-to-r from-[#fffefc] via-[#fcfaf5] to-[#f6f1e5] p-2.5 shadow-sm backdrop-blur-xl sm:flex-row sm:items-center">


                        <div className="flex min-w-0 flex-1 items-center px-2">
                            <Search
                                size={15}
                                strokeWidth={1.5}
                                className="mr-3 shrink-0 text-[var(--color-muted)]"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                placeholder="Search by name, description, category, gear..."
                                className="w-full bg-transparent py-1.5 text-xs text-[var(--color-ink)] outline-none placeholder:text-[var(--color-muted)]"
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={() => handleSearchChange("")}
                                    className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-black/10 text-[var(--color-muted)] hover:bg-black/20 hover:text-[var(--color-ink)] transition-colors"
                                >
                                    <X size={11} />
                                </button>
                            )}
                        </div>

                        {/* VIEW MODE & SORTING INTERACTIVE CONTROLS */}
                        <div className="flex items-center gap-2 border-t border-[var(--color-line-soft)] pt-2 sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">
                            {/* Sort Dropdown */}
                            <div className="flex items-center gap-1 rounded-xl bg-stone-200/50 p-1 border border-stone-300/40">
                                <ArrowUpDown size={11} className="text-[var(--color-muted)] ml-1" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="bg-transparent text-[8px] font-semibold uppercase tracking-wider text-[var(--color-ink)] outline-none cursor-pointer pr-1"
                                >
                                    <option value="default">Sort: Default</option>
                                    <option value="name">Sort: A-Z</option>
                                    <option value="newest">Sort: Newest</option>
                                </select>
                            </div>

                            {/* View Switcher Buttons */}
                            <div className="flex items-center rounded-xl bg-stone-200/50 p-0.5 border border-stone-300/40">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-1.5 rounded-lg transition-all ${
                                        viewMode === "grid" ? "bg-white text-[var(--color-ink)] shadow-xs" : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                                    }`}
                                    title="Grid View"
                                >
                                    <LayoutGrid size={13} />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-1.5 rounded-lg transition-all ${
                                        viewMode === "list" ? "bg-white text-[var(--color-ink)] shadow-xs" : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                                    }`}
                                    title="List View"
                                >
                                    <List size={13} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* QUICK CATEGORY TAG PILLS */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5">
                        {CATEGORY_TAGS.map((tag) => {
                            const isActive = search.toLowerCase().includes(tag.query.toLowerCase()) && search !== "";
                            return (
                                <button
                                    key={tag.label}
                                    onClick={() => handleTagClick(tag.query)}
                                    className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[7.5px] font-semibold uppercase tracking-wider transition-all shadow-xs ${
                                        isActive
                                            ? "bg-[var(--color-accent)] border-[var(--color-accent)] !text-white shadow-sm scale-[1.02]"
                                            : "border-black/10 bg-white/60 text-[var(--color-muted)] hover:bg-white hover:text-[var(--color-ink)]"
                                    }`}
                                >
                                    <span>{tag.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* LOADING */}
                {isLoading && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div
                                key={item}
                                className="relative h-[260px] overflow-hidden rounded-2xl border border-[var(--color-line-soft)] bg-[var(--color-ivory-soft)]"
                            >
                                <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-transparent via-white/40 to-transparent" />
                                <div className="absolute left-4 top-4 h-8 w-8 rounded-full bg-[var(--color-line-soft)]" />
                                <div className="absolute bottom-6 left-4 right-4 space-y-2">
                                    <div className="h-2 w-16 rounded-full bg-[var(--color-line-soft)]" />
                                    <div className="h-5 w-3/4 rounded-full bg-[var(--color-line-soft)]" />
                                    <div className="h-2 w-full rounded-full bg-[var(--color-line-soft)]" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ERROR */}
                {!isLoading && error && (
                    <div className="relative overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-ivory-soft)] p-10 text-center shadow-xs">
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-line)]">
                            <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                        </div>
                        <p className="mt-4 text-lg font-medium tracking-tight">The collection is unavailable.</p>
                        <p className="mt-2 text-xs text-[var(--color-muted)]">{error}</p>
                    </div>
                )}

                {/* EMPTY SEARCH RESULTS */}
                {!isLoading && !error && filteredProducts.length === 0 && (
                    <div className="relative overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-ivory-soft)] p-10 text-center space-y-3">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-line)] bg-white/70">
                            <Search size={18} strokeWidth={1.4} className="text-[var(--color-muted)]" />
                        </div>
                        <h3 className="text-xl font-medium tracking-tight">No products match "{search}"</h3>
                        <p className="text-xs text-[var(--color-muted)]">Try another search term or click clear to explore all available items.</p>
                        <button
                            type="button"
                            onClick={() => handleSearchChange("")}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-ink)] px-4 py-2 text-[8px] font-semibold uppercase tracking-wider !text-white hover:bg-[var(--color-accent)] transition-all shadow-xs"
                        >
                            <span>Clear Search Filters</span>
                        </button>
                    </div>
                )}

                {/* PRODUCT GRID / LIST VIEW */}
                {!isLoading && !error && filteredProducts.length > 0 && (
                    <div className={viewMode === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "space-y-3"}>
                        {filteredProducts.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                index={index}
                                viewMode={viewMode}
                            />
                        ))}
                    </div>
                )}

            </div>
        </main>
    );
}

interface ProductCardProps {
    product: Product;
    index: number;
    viewMode: "grid" | "list";
}

function ProductCard({ product, index, viewMode }: ProductCardProps) {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    if (viewMode === "list") {
        return (
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative group transition-all duration-300 ease-out"
            >
                <div
                    className="absolute inset-0 rounded-2xl bg-[#ded8ca] border border-black/5 transition-all duration-300 ease-out"
                    style={{
                        transform: isHovered ? "translate(3px, 5px)" : "translate(1.5px, 3px)",
                        opacity: isHovered ? 0.9 : 0.6
                    }}
                />

                <div
                    onClick={() => navigate(`/app/products/${product.id}`)}
                    className="relative cursor-pointer overflow-hidden rounded-2xl border border-white/90 bg-gradient-to-r from-[#faf8f3] via-[#f6f3ea] to-[#efeade] p-3.5 sm:p-4 backdrop-blur-xl transition-all duration-300 ease-out hover:border-[var(--color-accent)]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                    style={{
                        transform: isHovered ? "translateX(4px)" : "translateX(0px)",
                        boxShadow: isHovered
                            ? "0 12px 24px -8px rgba(23, 23, 23, 0.1)"
                            : "0 6px 12px -6px rgba(23, 23, 23, 0.04)"
                    }}
                >
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white bg-white/90 shadow-xs text-[var(--color-ink)]">
                            <PackageCheck size={16} />
                        </div>

                        <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-1.5 py-0.2 text-[7px] font-semibold text-emerald-700">
                                    <CheckCircle2 size={9} />
                                    Available
                                </span>
                                <span className="font-mono text-[8px] text-[var(--color-muted)]">
                                    SKU-{product.slug.slice(0, 8).toUpperCase()}
                                </span>
                            </div>

                            <h3 className="text-sm font-medium tracking-tight text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors truncate">
                                {product.name}
                            </h3>

                            <p className="text-[11px] text-[var(--color-ink-soft)] leading-tight truncate">
                                {product.description || "Available for flexible rental terms."}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-black/[0.06] shrink-0">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/app/products/${product.id}/rent`);
                            }}
                            className="inline-flex items-center gap-1 rounded-xl bg-[var(--color-accent)] px-3 py-1.5 text-[7.5px] font-semibold uppercase tracking-wider !text-white hover:bg-[var(--color-ink)] active:scale-95 shadow-xs transition-all"
                        >
                            <span>Quick Rent</span>
                            <Zap size={10} />
                        </button>

                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-ink)] text-white shadow-xs group-hover:bg-[var(--color-accent)] transition-all">
                            <ArrowUpRight size={13} />
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Link
            to={`/app/products/${product.id}`}
            className="group relative block"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Physical depth */}
            <div
                aria-hidden="true"
                className="absolute inset-0 rounded-2xl border border-black/5 bg-[#ded8ca] transition-all duration-300 ease-out"
                style={{
                    transform: isHovered ? "translate(3px, 5px)" : "translate(1.5px, 3px)",
                    opacity: isHovered ? 0.9 : 0.6
                }}
            />

            {/* Main card */}
            <article
                className="relative flex min-h-[260px] flex-col overflow-hidden rounded-2xl border border-white/90 bg-gradient-to-b from-[#fffefc] via-[#fcfaf5] to-[#f6f1e5] p-4 backdrop-blur-xl transition-all duration-300 ease-out shadow-xs flex-1 justify-between"
                style={{
                    transform: isHovered ? "translateY(-4px)" : "translateY(0px)",
                    boxShadow: isHovered
                        ? "0 18px 36px -10px rgba(23, 23, 23, 0.12)"
                        : "0 6px 14px -6px rgba(23, 23, 23, 0.04)"
                }}
            >

                {/* Top row */}
                <div className="relative z-10 flex items-start justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-ink)] text-[var(--color-ivory)] shadow-xs transition-transform duration-300 group-hover:scale-105">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                    </div>

                    <div className="flex items-center gap-1.5 rounded-full border border-black/5 bg-white/50 px-2.5 py-1 backdrop-blur-md">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[6.5px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                            Available
                        </span>
                    </div>
                </div>

                {/* Product information */}
                <div className="relative z-10 mt-6 flex-1 flex flex-col justify-between">
                    <div>
                        <p className="mb-1 text-[7.5px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                            Rental / {String(index + 1).padStart(2, "0")}
                        </p>

                        <h2 className="line-clamp-2 text-lg font-medium leading-tight tracking-tight text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors">
                            {product.name}
                        </h2>

                        {product.description && (
                            <p className="mt-2 line-clamp-2 text-[11px] leading-4 text-[var(--color-ink-soft)]">
                                {product.description}
                            </p>
                        )}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-black/[0.06] pt-3">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigate(`/app/products/${product.id}/rent`);
                            }}
                            className="inline-flex items-center gap-1 rounded-lg bg-[var(--color-accent)]/10 px-2 py-1 text-[7px] font-semibold uppercase tracking-wider text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:!text-white transition-all"
                        >
                            <Zap size={9} />
                            <span>Quick Rent</span>
                        </button>

                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-ink)] text-white shadow-xs transition-all duration-300 group-hover:bg-[var(--color-accent)] group-hover:translate-x-0.5">
                            <ArrowUpRight size={13} strokeWidth={1.5} />
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}

export default Explore;