import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    Package,
    ArrowLeft,
    Tag,
    ArrowUpRight,
    Plus,
    Search,
    LayoutGrid,
    List,
    Sparkles,
    CheckCircle2,
    X,
    ExternalLink,
    RefreshCw
} from "lucide-react";
import apiClient from "../../api/client";

interface ProductItem {
    id: string;
    name: string;
    description: string;
    category?: string;
    sku?: string;
    created_at?: string;
}

function VendorProducts() {
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    // Interactive Filters & Layout States
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [sortBy] = useState<"name" | "newest">("name");


    // Quick Inspection Drawer Modal
    const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

    const fetchProducts = async (showRefresh = false) => {
        if (showRefresh) setIsRefreshing(true);
        try {
            const res = await apiClient.get("/products/");
            setProducts(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Failed to load products:", err);
        } finally {
            setIsLoading(false);
            if (showRefresh) {
                setTimeout(() => setIsRefreshing(false), 500);
            }
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Extract Unique Categories Dynamically
    const categories = useMemo(() => {
        const set = new Set<string>();
        products.forEach((p) => {
            if (p.category) set.add(p.category);
        });
        return ["all", ...Array.from(set)];
    }, [products]);

    // Filtered & Sorted Products
    const filteredProducts = useMemo(() => {
        const list = products.filter((p) => {
            const matchesSearch =
                (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.id || "").toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCat =
                selectedCategory === "all" ||
                (p.category || "").toLowerCase() === selectedCategory.toLowerCase();
            return matchesSearch && matchesCat;
        });

        if (sortBy === "name") {
            list.sort((a, b) => a.name.localeCompare(b.name));
        }
        return list;
    }, [products, searchQuery, selectedCategory, sortBy]);

    return (
        <main className="relative min-h-screen overflow-hidden bg-[var(--color-ivory)] px-6 pb-24 pt-28 sm:pt-32 lg:pt-36 text-[var(--color-ink)]">
            {/* Background Tactile Grid Lines & Glow */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute left-[8%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute left-[24%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute right-[8%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute left-1/2 top-[30%] h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-[var(--color-accent)]/[0.035] blur-[140px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-6xl space-y-7">
                {/* Back Navigation */}
                <Link
                    to="/vendor"
                    className="group inline-flex items-center gap-2.5 text-[8.5px] font-bold uppercase tracking-[0.2em] text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
                >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10 bg-white/70 shadow-2xs group-hover:border-[var(--color-accent)] group-hover:bg-white transition-all">
                        <ArrowLeft size={11} />
                    </span>
                    <span>Back to Vendor Console</span>
                </Link>

                {/* SIGNATURE BREADCRUMB & HEADER */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--color-line-soft)] pb-5">
                    <div>
                        <div className="flex items-center gap-2.5 mb-1.5">
                            <span className="h-px w-8 bg-[var(--color-accent)]" />
                            <span className="text-[8.5px] font-semibold uppercase tracking-[0.28em] text-[var(--color-muted)]">
                                VENDOR / PRODUCT CATALOGUE
                            </span>
                        </div>
                        <h1 className="text-3xl font-medium tracking-tight text-[var(--color-ink)] sm:text-4xl">
                            Catalogue Listings
                        </h1>
                        <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
                            Interactive catalog management, live search, category tagging, and product inspection.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => fetchProducts(true)}
                            title="Refresh Catalogue"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-white/70 shadow-2xs hover:bg-white transition-all active:scale-95"
                        >
                            <RefreshCw size={13} className={`text-[var(--color-muted)] ${isRefreshing ? "animate-spin text-[var(--color-accent)]" : ""}`} />
                        </button>

                        <Link
                            to="/vendor/products/new"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-accent)] px-4.5 py-2.5 text-[8.5px] font-extrabold uppercase tracking-wider !text-white shadow-xs hover:bg-[var(--color-ink)] hover:-translate-y-0.5 active:translate-y-0 transition-all shrink-0"
                        >
                            <Plus size={13} />
                            <span>Add New Product</span>
                        </Link>
                    </div>
                </div>

                {/* 1. DYNAMIC CONTROLS & INTERACTIVE SEARCH STRIP */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-3xl border border-white/90 bg-gradient-to-r from-[#fffefc] via-[#fcfaf5] to-[#f6f1e5] p-4 shadow-2xs backdrop-blur-md">
                    {/* Search Input Box */}
                    <div className="relative flex-1 max-w-md">
                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter by product name, description or ID..."
                            className="w-full rounded-xl border border-[#e8e0d0] bg-white/90 py-2.5 pl-9.5 pr-8 text-xs text-[var(--color-ink)] placeholder-[var(--color-muted)] shadow-2xs focus:border-[var(--color-accent)] focus:outline-none font-mono"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                            >
                                <X size={13} />
                            </button>
                        )}
                    </div>

                    {/* Interactive Filter Pills & View Toggles */}
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Category Filter Selector */}
                        <div className="flex items-center gap-1 bg-[#ded8ca]/50 p-1 rounded-xl border border-black/5">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`rounded-lg px-2.5 py-1 text-[7.5px] font-extrabold uppercase tracking-wider transition-all ${
                                        selectedCategory === cat
                                            ? "bg-[var(--color-accent)] text-white shadow-2xs scale-105"
                                            : "text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-white/50"
                                    }`}
                                >
                                    {cat === "all" ? "All Categories" : cat}
                                </button>
                            ))}
                        </div>

                        {/* Grid / List View Toggle */}
                        <div className="flex items-center gap-1 bg-[#ded8ca]/50 p-1 rounded-xl border border-black/5">
                            <button
                                onClick={() => setViewMode("grid")}
                                title="Grid Layout View"
                                className={`rounded-lg p-1 transition-all ${
                                    viewMode === "grid" ? "bg-white text-[var(--color-ink)] shadow-2xs" : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                                }`}
                            >
                                <LayoutGrid size={13} />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                title="List Layout View"
                                className={`rounded-lg p-1 transition-all ${
                                    viewMode === "list" ? "bg-white text-[var(--color-ink)] shadow-2xs" : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                                }`}
                            >
                                <List size={13} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ACTIVE FILTER STATUS STRIP */}
                <div className="flex items-center justify-between text-[8px] font-mono font-bold uppercase tracking-wider text-[var(--color-muted)] px-1">
                    <div className="flex items-center gap-2">
                        <span>Showing:</span>
                        <span className="text-[var(--color-ink)] font-extrabold">{filteredProducts.length} of {products.length} Products</span>
                        {selectedCategory !== "all" && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-[var(--color-accent)]/10 text-[var(--color-accent)] px-2 py-0.5">
                                Category: {selectedCategory}
                                <X size={9} className="cursor-pointer" onClick={() => setSelectedCategory("all")} />
                            </span>
                        )}
                    </div>
                </div>

                {/* 2. DYNAMIC CATALOGUE LISTINGS AREA */}
                {isLoading ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-44 animate-pulse rounded-3xl bg-black/5" />
                        ))}
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="relative group transition-all duration-300">
                        <div className="absolute inset-0 rounded-3xl bg-[#ded8ca] border border-black/5 translate-x-1 translate-y-1.5" />
                        <div className="relative rounded-3xl border border-white/90 bg-gradient-to-b from-[#fffefc] via-[#fcfaf5] to-[#f6f1e5] p-12 text-center shadow-xs backdrop-blur-2xl space-y-4">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fcfaf5] border border-[#e8e0d0] text-[var(--color-muted)] shadow-2xs">
                                <Package size={28} strokeWidth={1.5} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-medium text-[var(--color-ink)]">No catalog listings found</h3>
                                <p className="text-xs text-[var(--color-muted)] max-w-sm mx-auto">
                                    No equipment matching your search filters. Try clearing your search query or add a new listing.
                                </p>
                            </div>
                            <div>
                                <Link
                                    to="/vendor/products/new"
                                    className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-5 py-2.5 text-[8.5px] font-extrabold uppercase tracking-wider !text-white shadow-xs hover:bg-[var(--color-ink)] hover:-translate-y-0.5 transition-all"
                                >
                                    <Plus size={13} />
                                    <span>Add Product Record</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : viewMode === "grid" ? (
                    /* GRID VIEW (3 Columns on Large Screens) */
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredProducts.map((prod) => (
                            <div
                                key={prod.id}
                                onClick={() => setSelectedProduct(prod)}
                                onMouseEnter={() => setHoveredCard(prod.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                                className="relative group cursor-pointer transition-all duration-300 ease-out flex flex-col"
                            >
                                <div
                                    className="absolute inset-0 rounded-3xl bg-[#ded8ca] border border-black/5 transition-all duration-300 ease-out"
                                    style={{
                                        transform: hoveredCard === prod.id ? "translate(3px, 5px)" : "translate(1.5px, 3px)",
                                        opacity: hoveredCard === prod.id ? 0.9 : 0.6
                                    }}
                                />

                                <div
                                    className="relative flex-1 flex flex-col justify-between rounded-3xl border border-white/90 bg-gradient-to-b from-[#fffefc] via-[#fcfaf5] to-[#f6f1e5] p-5 shadow-xs backdrop-blur-2xl transition-all duration-300 space-y-4"
                                    style={{
                                        transform: hoveredCard === prod.id ? "translateY(-3px)" : "translateY(0px)"
                                    }}
                                >
                                    <div className="space-y-2.5">
                                        <div className="flex items-center justify-between">
                                            <span className="inline-flex items-center gap-1 rounded-md bg-[#f5efe4] border border-[#e3d8c4] px-2 py-0.5 text-[7.5px] font-bold uppercase tracking-wider text-[var(--color-ink-soft)]">
                                                <Tag size={9} className="text-[var(--color-accent)]" />
                                                {prod.category || "General Equipment"}
                                            </span>
                                            <span className="font-mono text-[7.5px] text-[var(--color-muted)] font-semibold">
                                                ID: {prod.id.slice(0, 8).toUpperCase()}
                                            </span>
                                        </div>

                                        <h3 className="text-base font-bold tracking-tight text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors">
                                            {prod.name}
                                        </h3>

                                        <p className="text-xs text-[var(--color-muted)] leading-relaxed line-clamp-3">
                                            {prod.description}
                                        </p>
                                    </div>

                                    <div className="pt-3 border-t border-black/[0.05] flex items-center justify-between">
                                        <span className="inline-flex items-center gap-1 text-[7.5px] font-mono font-semibold text-[#2d563f]">
                                            <Sparkles size={9} />
                                            Quick Inspect
                                        </span>

                                        <button
                                            className="inline-flex items-center gap-1 rounded-xl border border-black/10 bg-white px-3 py-1.5 text-[8px] font-bold uppercase tracking-wider text-[var(--color-ink)] group-hover:bg-[var(--color-ink)] group-hover:text-white transition-all shadow-2xs"
                                        >
                                            <span>Details</span>
                                            <ArrowUpRight size={11} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* LIST VIEW */
                    <div className="space-y-3">
                        {filteredProducts.map((prod) => (
                            <div
                                key={prod.id}
                                onClick={() => setSelectedProduct(prod)}
                                onMouseEnter={() => setHoveredCard(prod.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                                className="relative group cursor-pointer transition-all duration-300 ease-out"
                            >
                                <div
                                    className="absolute inset-0 rounded-2xl bg-[#ded8ca] border border-black/5 transition-all duration-300 ease-out"
                                    style={{
                                        transform: hoveredCard === prod.id ? "translate(2px, 4px)" : "translate(1px, 2px)",
                                        opacity: hoveredCard === prod.id ? 0.9 : 0.6
                                    }}
                                />

                                <div
                                    className="relative flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-white/90 bg-gradient-to-b from-[#fffefc] via-[#fcfaf5] to-[#f6f1e5] p-4 shadow-xs backdrop-blur-2xl transition-all duration-300 gap-3"
                                    style={{
                                        transform: hoveredCard === prod.id ? "translateY(-1.5px)" : "translateY(0px)"
                                    }}
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fcfaf5] border border-[#e8e0d0] text-[var(--color-accent)] shadow-2xs">
                                            <Package size={18} />
                                        </div>
                                        <div className="space-y-0.5 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-[7.5px] font-bold text-[var(--color-muted)]">
                                                    ID: {prod.id.slice(0, 8).toUpperCase()}
                                                </span>
                                                <span className="inline-flex items-center gap-1 rounded-md bg-[#f5efe4] border border-[#e3d8c4] px-2 py-0.5 text-[7.5px] font-bold uppercase tracking-wider text-[var(--color-ink-soft)]">
                                                    {prod.category || "General"}
                                                </span>
                                            </div>
                                            <h3 className="text-sm font-bold text-[var(--color-ink)] truncate">{prod.name}</h3>
                                        </div>
                                    </div>

                                    <button
                                        className="inline-flex items-center gap-1 rounded-xl border border-black/10 bg-white px-3 py-1.5 text-[8px] font-bold uppercase tracking-wider text-[var(--color-ink)] group-hover:bg-[var(--color-ink)] group-hover:text-white transition-all shadow-2xs self-start sm:self-center shrink-0"
                                    >
                                        <span>Quick Inspect</span>
                                        <ArrowUpRight size={11} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 3. INTERACTIVE PRODUCT QUICK INSPECT MODAL / DRAWER */}
            {selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div
                        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/90 bg-gradient-to-b from-[#fffefc] via-[#fcfaf5] to-[#f6f1e5] p-6 shadow-2xl backdrop-blur-2xl space-y-5 animate-scale-up"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between border-b border-black/[0.06] pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-accent)] text-white shadow-xs">
                                    <Package size={20} />
                                </div>
                                <div>
                                    <span className="inline-flex items-center gap-1 rounded-md bg-[#f5efe4] border border-[#e3d8c4] px-2 py-0.5 text-[7.5px] font-bold uppercase tracking-wider text-[var(--color-ink-soft)] mb-1">
                                        <Tag size={9} className="text-[var(--color-accent)]" />
                                        {selectedProduct.category || "General Equipment"}
                                    </span>
                                    <h3 className="text-lg font-bold text-[var(--color-ink)] leading-snug">
                                        {selectedProduct.name}
                                    </h3>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white/80 text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-white transition-all"
                            >
                                <X size={14} />
                            </button>
                        </div>

                        {/* Body Details */}
                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-[#fcfaf5] border border-[#e8e0d0] space-y-1.5">
                                <span className="text-[7.5px] font-bold uppercase tracking-wider text-[var(--color-muted)]">Description Specs</span>
                                <p className="text-xs text-[var(--color-ink)] leading-relaxed">
                                    {selectedProduct.description || "No detailed description supplied for this product master record."}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-2xl bg-[#fcfaf5] border border-[#e8e0d0] space-y-1">
                                    <span className="text-[7.5px] font-bold uppercase tracking-wider text-[var(--color-muted)]">Product ID</span>
                                    <p className="text-xs font-mono font-bold text-[var(--color-ink)]">{selectedProduct.id}</p>
                                </div>
                                <div className="p-3 rounded-2xl bg-[#fcfaf5] border border-[#e8e0d0] space-y-1">
                                    <span className="text-[7.5px] font-bold uppercase tracking-wider text-[var(--color-muted)]">Status</span>
                                    <span className="inline-flex items-center gap-1 rounded-md bg-[#eaf3ed] border border-[#b8d9c5] px-2 py-0.5 text-[7.5px] font-bold uppercase tracking-wider text-[#2d563f]">
                                        <CheckCircle2 size={10} />
                                        Active Listing
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Action Controls */}
                        <div className="pt-2 border-t border-black/[0.06] flex items-center justify-between gap-3">
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="px-4 py-2 text-[8px] font-bold uppercase tracking-wider text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
                            >
                                Close Modal
                            </button>

                            <Link
                                to={`/app/products/${selectedProduct.id}`}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-[8.5px] font-extrabold uppercase tracking-wider !text-white shadow-xs hover:bg-[var(--color-ink)] transition-all"
                            >
                                <span>Open Product View</span>
                                <ExternalLink size={12} />
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default VendorProducts;
