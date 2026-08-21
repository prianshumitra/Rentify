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
    CheckCircle2,
    X,
    RefreshCw,
    DollarSign,
} from "lucide-react";
import apiClient from "../../api/client";
import { useAuth } from "../../context/AuthContext";

interface ProductItem {
    id: string;
    vendor_id?: string;
    name: string;
    description: string;
    category?: any;
    category_id?: string;
    slug?: string;
    daily_rate?: number;
    price_per_day?: number;
    variants?: any[];
    created_at?: string;
}

// ---------------------------------------------------------------------------
// Loom Card Wrapper Component - Charcoal & Slate Grey Palette
// ---------------------------------------------------------------------------

function LoomCard({
    children,
    className = "",
    onClick,
}: {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className={`group relative ${onClick ? "cursor-pointer" : ""} ${className}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={onClick}
        >
            {/* Loom offset accent layer */}
            <div
                className="absolute inset-0 rounded-2xl border border-[#c2b49c] bg-[#ded1ba] transition-all duration-300 shadow-xs"
                style={{
                    transform: hovered
                        ? "translate(4px, 4.5px)"
                        : "translate(2.5px, 3px)",
                }}
            />

            {/* Loom depth layer */}
            <div
                className="absolute inset-0 rounded-2xl border border-[#d8cdb8] bg-[#ebe2cf] transition-all duration-300"
                style={{
                    transform: hovered
                        ? "translate(2px, 2.5px)"
                        : "translate(1.5px, 2px)",
                }}
            />

            {/* Main surface */}
            <div
                className="relative h-full overflow-hidden rounded-2xl border border-[#c4b69d] bg-white transition-all duration-300 ease-out"
                style={{
                    transform: hovered ? "translateY(-3px)" : "translateY(0)",
                    boxShadow: hovered
                        ? "0 18px 40px -12px rgba(39, 39, 42, 0.22), 0 8px 22px -4px rgba(0,0,0,0.08)"
                        : "0 6px 20px -10px rgba(40,30,10,0.14)",
                }}
            >
                {/* Ambient glow accent in charcoal grey */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-zinc-400/10 blur-2xl transition-transform duration-500 group-hover:scale-125"
                />
                {children}
            </div>
        </div>
    );
}

function VendorProducts() {
    const { user } = useAuth();
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Interactive Filters & Layout States
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [sortBy] = useState<"name" | "newest">("name");

    // Quick Inspection Drawer Modal State
    const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

    const fetchProducts = async (showRefresh = false) => {
        if (showRefresh) setIsRefreshing(true);
        try {
            const res = await apiClient.get("/products/?my_products_only=true");
            let items: ProductItem[] = Array.isArray(res.data) ? res.data : [];
            if (user?.id) {
                items = items.filter((p) => !p.vendor_id || p.vendor_id === user.id);
            }
            setProducts(items);
        } catch (err) {
            console.error("Failed to load products:", err);
        } finally {
            setIsLoading(false);
            if (showRefresh) {
                setTimeout(() => setIsRefreshing(false), 400);
            }
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [user?.id]);

    // Extract Unique Categories
    const categories = useMemo(() => {
        const set = new Set<string>();
        products.forEach((p) => {
            const catName = typeof p.category === "object" ? p.category?.name : p.category;
            if (catName) set.add(catName);
        });
        return ["all", ...Array.from(set)];
    }, [products]);

    // Filtered & Sorted Products List
    const filteredProducts = useMemo(() => {
        const list = products.filter((p) => {
            const catName = typeof p.category === "object" ? p.category?.name : p.category;
            const matchesSearch =
                (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.id || "").toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCat =
                selectedCategory === "all" ||
                (catName || "").toLowerCase() === selectedCategory.toLowerCase();
            return matchesSearch && matchesCat;
        });

        if (sortBy === "name") {
            list.sort((a, b) => a.name.localeCompare(b.name));
        }
        return list;
    }, [products, searchQuery, selectedCategory, sortBy]);

    // Overview Statistics
    const stats = useMemo(() => {
        const totalCount = products.length;
        const totalCategories = categories.length - 1;
        const avgPrice =
            totalCount > 0
                ? Math.round(
                    products.reduce(
                        (acc, p) => acc + (Number(p.daily_rate || p.price_per_day) || 1200),
                        0
                    ) / totalCount
                )
                : 0;

        return { totalCount, totalCategories, avgPrice };
    }, [products, categories]);

    return (
        <main className="relative min-h-screen overflow-hidden bg-[var(--color-ivory)] px-4 pb-16 pt-16 sm:px-6 lg:px-8 sm:pt-20 text-[var(--color-ink)]">
            {/* Background Grid Lines & Ambient Lighting */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute left-[4%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute left-[18%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute right-[4%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute left-1/2 top-[25%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-zinc-400/[0.05] blur-[150px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl w-full space-y-4">

                {/* BACK NAVIGATION */}
                <Link
                    to="/vendor"
                    className="group inline-flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.22em] text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
                >
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl border border-[#c4b69d] bg-white shadow-2xs group-hover:border-zinc-800 group-hover:bg-zinc-800 group-hover:text-white transition-all">
                        <ArrowLeft size={12} />
                    </span>
                    <span>Back to Vendor Console</span>
                </Link>

                {/* HEADER BAR & CTAs */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--color-line-soft)] pb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-zinc-700 animate-pulse shadow-[0_0_6px_rgba(39,39,42,0.5)]" />
                            <span className="text-[8px] font-black uppercase tracking-[0.25em] text-zinc-700">
                                VENDOR CONSOLE // EQUIPMENT CATALOGUE
                            </span>
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-3xl">
                            Catalogue Listings
                        </h1>
                        <p className="mt-0.5 text-xs text-[var(--color-ink-soft)] max-w-lg">
                            Manage inventory products, serial codes, daily rental rates, and category tags.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button
                            onClick={() => fetchProducts(true)}
                            title="Refresh Catalogue"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#c4b69d] bg-white shadow-2xs hover:bg-[#faf6ee] hover:border-black/30 hover:text-black transition-all active:scale-95"
                        >
                            <RefreshCw size={13} className={`text-[var(--color-muted)] ${isRefreshing ? "animate-spin text-zinc-800" : ""}`} />
                        </button>

                        <Link
                            to="/vendor/products/new"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-[#c4b69d] px-4.5 py-2.5 text-[8.5px] font-extrabold uppercase tracking-wider text-[var(--color-ink)] shadow-2xs hover:bg-[#faf6ee] hover:border-black/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 shrink-0"
                        >
                            <Plus size={14} strokeWidth={2.5} className="text-zinc-800" />
                            <span>Add New Product</span>
                        </Link>
                    </div>
                </div>

                {/* 1. OVERVIEW KPI TILES ROW (LOOM CARDS) */}
                <div className="grid gap-4 sm:grid-cols-3">

                    <LoomCard>
                        <div className="p-4 sm:p-5 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-700">
                                    Total Catalogue Items
                                </span>
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-800 text-white shadow-2xs">
                                    <Package size={15} strokeWidth={2} />
                                </div>
                            </div>
                            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-[var(--color-ink)]">
                                {stats.totalCount}
                            </p>
                        </div>
                    </LoomCard>

                    <LoomCard>
                        <div className="p-4 sm:p-5 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--color-muted)]">
                                    Active Categories
                                </span>
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black text-white shadow-2xs">
                                    <Tag size={15} strokeWidth={2} />
                                </div>
                            </div>
                            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-[var(--color-ink)]">
                                {stats.totalCategories > 0 ? stats.totalCategories : 1}
                            </p>
                        </div>
                    </LoomCard>

                    <LoomCard>
                        <div className="p-4 sm:p-5 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-700">
                                    Average Daily Rate
                                </span>
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-800 text-white shadow-2xs">
                                    <DollarSign size={15} strokeWidth={2.5} />
                                </div>
                            </div>
                            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-[var(--color-ink)]">
                                ₹{stats.avgPrice.toLocaleString()}
                            </p>
                        </div>
                    </LoomCard>
                </div>

                {/* 2. CONTROLS BAR */}
                <LoomCard>
                    <div className="p-4 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
                        {/* Search Input Box */}
                        <div className="relative flex-1 max-w-md">
                            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products by name, description or ID..."
                                className="w-full rounded-xl border border-[#d8cebc] bg-[#faf6ee] py-2 pl-9.5 pr-8 text-xs text-[var(--color-ink)] placeholder-[var(--color-muted)] focus:border-zinc-800 focus:bg-white focus:outline-none font-mono transition-all"
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

                        {/* Category Filter Pills & View Toggles */}
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-1 bg-black/[0.05] p-1 rounded-xl border border-black/[0.08]">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`rounded-lg px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-wider transition-all duration-300 ${selectedCategory === cat
                                                ? "bg-zinc-900 text-white shadow-2xs scale-105"
                                                : "text-[var(--color-muted)] hover:text-black hover:bg-white/80"
                                            }`}
                                    >
                                        {cat === "all" ? "All Categories" : cat}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-0.5 bg-black/[0.05] p-1 rounded-xl border border-black/[0.08]">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    title="Grid Layout View"
                                    className={`rounded-lg p-1.5 transition-all ${viewMode === "grid" ? "bg-white text-black shadow-2xs" : "text-[var(--color-muted)] hover:text-black"
                                        }`}
                                >
                                    <LayoutGrid size={14} />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    title="List Layout View"
                                    className={`rounded-lg p-1.5 transition-all ${viewMode === "list" ? "bg-white text-black shadow-2xs" : "text-[var(--color-muted)] hover:text-black"
                                        }`}
                                >
                                    <List size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </LoomCard>

                {/* FILTER STATUS STRIP */}
                <div className="flex items-center justify-between text-[8px] font-mono font-bold uppercase tracking-wider text-[var(--color-muted)] px-1">
                    <div className="flex items-center gap-2">
                        <span>Catalogue items:</span>
                        <span className="text-[var(--color-ink)] font-extrabold">{filteredProducts.length} of {products.length} Products</span>
                        {selectedCategory !== "all" && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 text-zinc-900 px-2 py-0.5 border border-zinc-300">
                                Category: {selectedCategory}
                                <X size={9} className="cursor-pointer" onClick={() => setSelectedCategory("all")} />
                            </span>
                        )}
                    </div>
                </div>

                {/* 3. CATALOGUE PRODUCTS GRID / LIST VIEW */}
                {isLoading ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-44 animate-pulse rounded-2xl bg-black/5" />
                        ))}
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <LoomCard>
                        <div className="p-12 text-center space-y-4">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-black/5 border border-black/15 text-zinc-700">
                                <Package size={24} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-base font-bold text-[var(--color-ink)]">No catalogue listings found</h3>
                                <p className="text-xs text-[var(--color-muted)] max-w-sm mx-auto">
                                    No equipment matching your search filters. Try clearing your search query or list a new item.
                                </p>
                            </div>
                            <div>
                                <Link
                                    to="/vendor/products/new"
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-[#c4b69d] px-4.5 py-2 text-[8px] font-extrabold uppercase tracking-wider text-[var(--color-ink)] shadow-2xs hover:bg-[#faf6ee] transition-all"
                                >
                                    <Plus size={13} className="text-zinc-800" />
                                    <span>Add First Product</span>
                                </Link>
                            </div>
                        </div>
                    </LoomCard>
                ) : viewMode === "grid" ? (
                    /* GRID VIEW */
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredProducts.map((prod) => {
                            const catName = typeof prod.category === "object" ? prod.category?.name : prod.category;
                            return (
                                <LoomCard key={prod.id} onClick={() => setSelectedProduct(prod)}>
                                    <div className="p-5 flex flex-col justify-between h-full space-y-4">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="inline-flex items-center gap-1 rounded-md bg-[#faf6ee] border border-[#e2dacb] px-2 py-0.5 text-[7.5px] font-bold uppercase tracking-wider text-zinc-800">
                                                    <Tag size={9} className="text-zinc-600" />
                                                    {catName || "General Gear"}
                                                </span>
                                                <span className="font-mono text-[7.5px] text-[var(--color-muted)] font-bold">
                                                    ID: {prod.id.slice(0, 8).toUpperCase()}
                                                </span>
                                            </div>

                                            <h3 className="text-base font-bold tracking-tight text-[var(--color-ink)] group-hover:text-zinc-900 transition-colors">
                                                {prod.name}
                                            </h3>

                                            <p className="text-xs text-[var(--color-muted)] leading-relaxed line-clamp-3">
                                                {prod.description || "No description provided."}
                                            </p>
                                        </div>

                                        <div className="pt-3 border-t border-black/[0.08] flex items-center justify-between">
                                            <div className="flex items-center gap-1 text-[11px] font-mono font-extrabold text-[var(--color-ink)]">
                                                <span className="text-zinc-900">
                                                    ₹{Number(prod.daily_rate || prod.price_per_day || 1200).toLocaleString()}
                                                </span>
                                                <span className="text-[8px] text-[var(--color-muted)] font-normal">/day</span>
                                            </div>

                                            <button className="inline-flex items-center gap-1 rounded-xl border border-black/15 bg-white px-3 py-1.5 text-[8px] font-bold uppercase tracking-wider text-[var(--color-ink)] group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900 transition-all shadow-2xs">
                                                <span>Inspect</span>
                                                <ArrowUpRight size={11} />
                                            </button>
                                        </div>
                                    </div>
                                </LoomCard>
                            );
                        })}
                    </div>
                ) : (
                    /* LIST VIEW */
                    <div className="space-y-3">
                        {filteredProducts.map((prod) => {
                            const catName = typeof prod.category === "object" ? prod.category?.name : prod.category;
                            return (
                                <LoomCard key={prod.id} onClick={() => setSelectedProduct(prod)}>
                                    <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 text-zinc-800 border border-black/15 shrink-0">
                                                <Package size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="font-mono text-[7.5px] font-bold text-[var(--color-muted)]">
                                                        ID-{prod.id.slice(0, 6).toUpperCase()}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1 rounded-md bg-[#faf6ee] border border-[#e2dacb] px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wider text-zinc-800">
                                                        {catName || "Gear"}
                                                    </span>
                                                </div>
                                                <h3 className="text-sm font-bold text-[var(--color-ink)] group-hover:text-black transition-colors truncate">
                                                    {prod.name}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 shrink-0">
                                            <div className="text-right">
                                                <p className="font-mono text-sm font-extrabold text-[var(--color-ink)]">
                                                    ₹{Number(prod.daily_rate || prod.price_per_day || 1200).toLocaleString()}
                                                </p>
                                                <p className="text-[7.5px] font-mono text-[var(--color-muted)]">Per Day Rate</p>
                                            </div>

                                            <button className="flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-black/15 text-[var(--color-ink)] group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900 transition-all shadow-2xs">
                                                <ArrowUpRight size={13} />
                                            </button>
                                        </div>
                                    </div>
                                </LoomCard>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* INSPECTION MODAL */}
            {selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
                    <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-[#c4b69d] bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-black/[0.08] pb-3.5">
                            <div className="flex items-center gap-2">
                                <Package size={18} className="text-zinc-800" />
                                <h3 className="text-sm font-extrabold uppercase tracking-wider text-[var(--color-ink)]">
                                    Product Inspection
                                </h3>
                            </div>
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/5 text-[var(--color-muted)] hover:text-black hover:bg-black/10"
                            >
                                <X size={14} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <span className="inline-flex items-center gap-1 rounded-md bg-[#faf6ee] border border-[#e2dacb] px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-zinc-800 mb-2">
                                    {typeof selectedProduct.category === "object" ? selectedProduct.category?.name : selectedProduct.category || "Equipment"}
                                </span>
                                <h2 className="text-xl font-bold text-[var(--color-ink)]">
                                    {selectedProduct.name}
                                </h2>
                                <p className="text-xs font-mono text-[var(--color-muted)] mt-0.5">
                                    Product ID: {selectedProduct.id}
                                </p>
                            </div>

                            <div className="rounded-xl border border-[#d8cebc] bg-[#faf6ee] p-3.5 space-y-2 text-xs text-[var(--color-ink-soft)]">
                                <p className="font-bold text-[var(--color-ink)]">Description:</p>
                                <p className="leading-relaxed">
                                    {selectedProduct.description || "No detailed description provided for this product master item."}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                                <div className="rounded-xl border border-black/10 p-3 bg-white space-y-0.5">
                                    <span className="text-[8px] uppercase font-bold text-[var(--color-muted)]">Daily Rate</span>
                                    <p className="font-extrabold text-base text-zinc-900">
                                        ₹{Number(selectedProduct.daily_rate || selectedProduct.price_per_day || 1200).toLocaleString()}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-black/10 p-3 bg-white space-y-0.5">
                                    <span className="text-[8px] uppercase font-bold text-[var(--color-muted)]">Status</span>
                                    <p className="font-extrabold text-base text-emerald-700 flex items-center gap-1">
                                        <CheckCircle2 size={12} /> Active
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-black/[0.08]">
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="rounded-xl border border-black/15 bg-white px-4 py-2 text-[8.5px] font-extrabold uppercase tracking-wider text-[var(--color-ink)] hover:bg-black/5"
                            >
                                Close
                            </button>
                            <Link
                                to={`/app/catalog/${selectedProduct.id}`}
                                className="rounded-xl bg-zinc-900 px-4 py-2 text-[8.5px] font-extrabold uppercase tracking-wider text-white hover:bg-black shadow-xs"
                            >
                                View Store Listing
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default VendorProducts;
