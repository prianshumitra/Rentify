import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, AlertCircle } from "lucide-react";

import apiClient from "../../api/client";

interface CategoryOption {
    id: string;
    name: string;
    slug: string;
}

function AddProduct() {
    const navigate = useNavigate();

    // Form Loading State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<CategoryOption[]>([]);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    // Step 1: Product Master Fields
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");

    // Step 2: Product Variant Fields
    const [sku, setSku] = useState("");
    const [brand, setBrand] = useState("");
    const [manufacturer, setManufacturer] = useState("");
    const [color, setColor] = useState("");
    const [size, setSize] = useState("");
    const [unitPrice, setUnitPrice] = useState("");

    // Step 3: Inventory Unit Fields
    const [assetCode, setAssetCode] = useState("");
    const [serialNumber, setSerialNumber] = useState("");

    // Auto-generate slug & SKU recommendation as name changes
    const handleNameChange = (val: string) => {
        setName(val);
        const generatedSlug = val
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-");
        setSlug(generatedSlug);

        if (!sku) {
            const cleanSku = val
                .toUpperCase()
                .trim()
                .replace(/[^A-Z0-9]/g, "-")
                .slice(0, 14);
            if (cleanSku) setSku(`${cleanSku}-STD`);
        }
    };

    // Load available categories
    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await apiClient.get("/categories");
                if (Array.isArray(res.data) && res.data.length > 0) {
                    setCategories(res.data);
                    setCategoryId(res.data[0].id);
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        }
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError("Product name is required.");
            return;
        }

        if (!categoryId) {
            setError("Please select a product category.");
            return;
        }

        const priceNum = parseFloat(unitPrice);
        if (isNaN(priceNum) || priceNum <= 0) {
            setError("Please enter a valid daily rental unit price greater than 0.");
            return;
        }

        setIsSubmitting(true);
        try {
            // 1. Create Product Master
            const productRes = await apiClient.post("/products", {
                name: name.trim(),
                slug: slug.trim() || name.toLowerCase().replace(/\s+/g, "-"),
                description: description.trim() || undefined,
                category_id: categoryId,
            });

            const newProduct = productRes.data;

            // 2. Create Product Variant
            const variantRes = await apiClient.post(`/products/${newProduct.id}/variants`, {
                sku: sku.trim() || `SKU-${Date.now().toString().slice(-6)}`,
                brand: brand.trim() || undefined,
                manufacturer: manufacturer.trim() || undefined,
                color: color.trim() || undefined,
                size: size.trim() || undefined,
                unit_price: priceNum,
            });

            const newVariant = variantRes.data;

            // 3. Create Initial Physical Inventory Stock Unit
            await apiClient.post(`/variants/${newVariant.id}/inventory`, {
                asset_code: assetCode.trim() || `AST-${Date.now().toString().slice(-6)}`,
                serial_number: serialNumber.trim() || undefined,
            });

            // Redirect back to products catalog
            navigate("/vendor/products");
        } catch (err: any) {
            console.error("Failed to create product pipeline:", err);
            const msg = err.response?.data?.detail || "Failed to create product. Please check fields and try again.";
            setError(typeof msg === "string" ? msg : JSON.stringify(msg));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-[var(--color-ivory)] px-6 pb-24 pt-28 sm:pt-32 lg:pt-36 text-[var(--color-ink)]">
            {/* Background Tactile Texture & Grid Lines */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute left-[8%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute left-[24%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute right-[8%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute left-1/2 top-[30%] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[var(--color-accent)]/[0.04] blur-[140px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-4xl space-y-7">
                {/* Back Link Button */}
                <Link
                    to="/vendor/products"
                    className="group inline-flex items-center gap-2.5 text-[8.5px] font-bold uppercase tracking-[0.2em] text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
                >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10 bg-white/70 shadow-2xs group-hover:border-[var(--color-accent)] group-hover:bg-white transition-all">
                        <ArrowLeft size={11} />
                    </span>
                    <span>Back to Catalog Listings</span>
                </Link>

                {/* Signature Terracotta Breadcrumb Header */}
                <div className="border-b border-[var(--color-line-soft)] pb-5">
                    <div>
                        <div className="flex items-center gap-2.5 mb-1.5">
                            <span className="h-px w-8 bg-[var(--color-accent)]" />
                            <span className="text-[8.5px] font-semibold uppercase tracking-[0.28em] text-[var(--color-muted)]">
                                VENDOR / CREATE PRODUCT PIPELINE
                            </span>
                        </div>
                        <h1 className="text-3xl font-medium tracking-tight text-[var(--color-ink)] sm:text-4xl">
                            Add New Product
                        </h1>
                        <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
                            Register a new equipment listing, configure pricing variants, and initialize stock inventory units.
                        </p>
                    </div>
                </div>


                {error && (
                    <div className="flex items-center gap-2.5 rounded-2xl border border-rose-300 bg-rose-50/90 p-4 text-xs text-rose-800 shadow-sm">
                        <AlertCircle size={16} className="text-rose-600 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-7">
                    
                    {/* SECTION 1: PRODUCT MASTER INFO */}
                    <div
                        onMouseEnter={() => setHoveredCard("sec-master")}
                        onMouseLeave={() => setHoveredCard(null)}
                        className="relative group transition-all duration-300 ease-out"
                    >
                        <div
                            className="absolute inset-0 rounded-3xl bg-[#ded8ca] border border-black/5 transition-all duration-300 ease-out"
                            style={{
                                transform: hoveredCard === "sec-master" ? "translate(3px, 5px)" : "translate(1.5px, 3px)"
                            }}
                        />

                        <div
                            className="relative overflow-hidden rounded-3xl border border-white/90 bg-gradient-to-b from-[#fffefc] via-[#fcfaf5] to-[#f6f1e5] p-6 backdrop-blur-2xl transition-all duration-300 space-y-5 shadow-xs"
                            style={{
                                transform: hoveredCard === "sec-master" ? "translateY(-2px)" : "translateY(0px)"
                            }}
                        >
                            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--color-ink)] text-white text-[10px] font-bold font-mono">
                                        01
                                    </div>
                                    <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-ink)]">
                                        Product Master Specifications
                                    </h2>
                                </div>
                                <span className="text-[7.5px] font-mono font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                    Master Catalog Entry
                                </span>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5 sm:col-span-2">
                                    <label className="text-[8px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => handleNameChange(e.target.value)}
                                        placeholder="e.g. Sony Alpha A7 IV Camera"
                                        className="w-full rounded-2xl border border-[#e8e0d0] bg-[#fcfaf5] px-4 py-2.5 text-xs font-medium text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)] focus:bg-white shadow-2xs transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                        URL Slug
                                    </label>
                                    <input
                                        type="text"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        placeholder="sony-alpha-a7-iv"
                                        className="w-full rounded-2xl border border-[#e8e0d0] bg-[#fcfaf5] px-4 py-2.5 text-xs font-mono text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)] focus:bg-white shadow-2xs transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                        Product Category *
                                    </label>
                                    <select
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                        className="w-full rounded-2xl border border-[#e8e0d0] bg-[#fcfaf5] px-4 py-2.5 text-xs font-medium text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)] focus:bg-white shadow-2xs transition-all"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5 sm:col-span-2">
                                    <label className="text-[8px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                        Description & Features
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Full-frame mirrorless camera for professional 4K video recording and high-speed photography..."
                                        className="w-full rounded-2xl border border-[#e8e0d0] bg-[#fcfaf5] px-4 py-2.5 text-xs font-medium text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)] focus:bg-white shadow-2xs transition-all leading-relaxed"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: PRODUCT VARIANT & RENTAL PRICE */}
                    <div
                        onMouseEnter={() => setHoveredCard("sec-variant")}
                        onMouseLeave={() => setHoveredCard(null)}
                        className="relative group transition-all duration-300 ease-out"
                    >
                        <div
                            className="absolute inset-0 rounded-3xl bg-[#ded8ca] border border-black/5 transition-all duration-300 ease-out"
                            style={{
                                transform: hoveredCard === "sec-variant" ? "translate(3px, 5px)" : "translate(1.5px, 3px)"
                            }}
                        />

                        <div
                            className="relative overflow-hidden rounded-3xl border border-white/90 bg-gradient-to-b from-[#fffefc] via-[#fcfaf5] to-[#f6f1e5] p-6 backdrop-blur-2xl transition-all duration-300 space-y-5 shadow-xs"
                            style={{
                                transform: hoveredCard === "sec-variant" ? "translateY(-2px)" : "translateY(0px)"
                            }}
                        >
                            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--color-accent)] text-white text-[10px] font-bold font-mono">
                                        02
                                    </div>
                                    <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-ink)]">
                                        Variant & Rental Pricing Tiers
                                    </h2>
                                </div>
                                <span className="text-[7.5px] font-mono font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                    Pricing & Spec Option
                                </span>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-1.5 sm:col-span-2">
                                    <label className="text-[8px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                        SKU Code *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={sku}
                                        onChange={(e) => setSku(e.target.value)}
                                        placeholder="e.g. SONY-A7IV-STD"
                                        className="w-full rounded-2xl border border-[#e8e0d0] bg-[#fcfaf5] px-4 py-2.5 text-xs font-mono font-bold text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)] focus:bg-white shadow-2xs transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-bold uppercase tracking-wider text-emerald-800 font-extrabold">
                                        Daily Unit Price (₹/day) *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-[var(--color-muted)]">₹</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={unitPrice}
                                            onChange={(e) => setUnitPrice(e.target.value)}
                                            placeholder="150.00"
                                            className="w-full rounded-2xl border-2 border-emerald-300 bg-white pl-8 pr-4 py-2 text-xs font-mono font-bold text-[var(--color-ink)] outline-none focus:border-emerald-500 shadow-2xs transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                        Brand Name
                                    </label>
                                    <input
                                        type="text"
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                        placeholder="e.g. Sony"
                                        className="w-full rounded-2xl border border-[#e8e0d0] bg-[#fcfaf5] px-4 py-2 text-xs font-medium text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)] focus:bg-white shadow-2xs transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                        Manufacturer
                                    </label>
                                    <input
                                        type="text"
                                        value={manufacturer}
                                        onChange={(e) => setManufacturer(e.target.value)}
                                        placeholder="e.g. Sony Corporation"
                                        className="w-full rounded-2xl border border-[#e8e0d0] bg-[#fcfaf5] px-4 py-2 text-xs font-medium text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)] focus:bg-white shadow-2xs transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                        Color Option
                                    </label>
                                    <input
                                        type="text"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        placeholder="e.g. Black"
                                        className="w-full rounded-2xl border border-[#e8e0d0] bg-[#fcfaf5] px-4 py-2 text-xs font-medium text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)] focus:bg-white shadow-2xs transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5 sm:col-span-3">
                                    <label className="text-[8px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                        Size / Technical Spec
                                    </label>
                                    <input
                                        type="text"
                                        value={size}
                                        onChange={(e) => setSize(e.target.value)}
                                        placeholder="e.g. Full Frame 33MP"
                                        className="w-full rounded-2xl border border-[#e8e0d0] bg-[#fcfaf5] px-4 py-2 text-xs font-medium text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)] focus:bg-white shadow-2xs transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: PHYSICAL INVENTORY STOCK INITIALIZATION */}
                    <div
                        onMouseEnter={() => setHoveredCard("sec-stock")}
                        onMouseLeave={() => setHoveredCard(null)}
                        className="relative group transition-all duration-300 ease-out"
                    >
                        <div
                            className="absolute inset-0 rounded-3xl bg-[#ded8ca] border border-black/5 transition-all duration-300 ease-out"
                            style={{
                                transform: hoveredCard === "sec-stock" ? "translate(3px, 5px)" : "translate(1.5px, 3px)"
                            }}
                        />

                        <div
                            className="relative overflow-hidden rounded-3xl border border-white/90 bg-gradient-to-b from-[#fffefc] via-[#fcfaf5] to-[#f6f1e5] p-6 backdrop-blur-2xl transition-all duration-300 space-y-5 shadow-xs"
                            style={{
                                transform: hoveredCard === "sec-stock" ? "translateY(-2px)" : "translateY(0px)"
                            }}
                        >
                            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#2c4a6f] text-white text-[10px] font-bold font-mono">
                                        03
                                    </div>
                                    <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-ink)]">
                                        Initial Physical Inventory Unit
                                    </h2>
                                </div>
                                <span className="text-[7.5px] font-mono font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                    Physical Serial Asset
                                </span>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                        Asset Tag Code
                                    </label>
                                    <input
                                        type="text"
                                        value={assetCode}
                                        onChange={(e) => setAssetCode(e.target.value)}
                                        placeholder="e.g. AST-SONY-001"
                                        className="w-full rounded-2xl border border-[#e8e0d0] bg-[#fcfaf5] px-4 py-2.5 text-xs font-mono text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)] focus:bg-white shadow-2xs transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                        Serial Number
                                    </label>
                                    <input
                                        type="text"
                                        value={serialNumber}
                                        onChange={(e) => setSerialNumber(e.target.value)}
                                        placeholder="e.g. SN-88392019"
                                        className="w-full rounded-2xl border border-[#e8e0d0] bg-[#fcfaf5] px-4 py-2.5 text-xs font-mono text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)] focus:bg-white shadow-2xs transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SUBMIT CONTROL BAR */}
                    <div className="flex items-center justify-between border-t border-[var(--color-line-soft)] pt-5">
                        <Link
                            to="/vendor/products"
                            className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
                        >
                            Cancel & Return
                        </Link>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 py-3 text-[9px] font-extrabold uppercase tracking-wider !text-white shadow-xs hover:bg-[var(--color-ink)] hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <span>Registering Product Pipeline...</span>
                            ) : (
                                <>
                                    <Plus size={14} />
                                    <span>Create & List Product</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}

export default AddProduct;
