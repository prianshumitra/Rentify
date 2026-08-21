import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, AlertCircle } from "lucide-react";
import apiClient from "../../api/client";

interface CategoryOption {
    id: string;
    name: string;
    slug: string;
}

function LoomCard({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className={`group relative ${className}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div
                className="absolute inset-0 rounded-2xl border border-[#c2b49c] bg-[#ded1ba] transition-all duration-300 shadow-xs"
                style={{
                    transform: hovered
                        ? "translate(4px, 4.5px)"
                        : "translate(2.5px, 3px)",
                }}
            />
            <div
                className="absolute inset-0 rounded-2xl border border-[#d8cdb8] bg-[#ebe2cf] transition-all duration-300"
                style={{
                    transform: hovered
                        ? "translate(2px, 2.5px)"
                        : "translate(1.5px, 2px)",
                }}
            />
            <div
                className="relative h-full overflow-hidden rounded-2xl border border-[#c4b69d] bg-white transition-all duration-300 ease-out"
                style={{
                    transform: hovered ? "translateY(-2.5px)" : "translateY(0)",
                    boxShadow: hovered
                        ? "0 16px 35px -12px rgba(39, 39, 42, 0.22), 0 6px 18px -4px rgba(0,0,0,0.1)"
                        : "0 6px 20px -10px rgba(40,30,10,0.12)",
                }}
            >
                <div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-zinc-400/10 blur-2xl transition-transform duration-500 group-hover:scale-125"
                />
                {children}
            </div>
        </div>
    );
}

function AddProduct() {
    const navigate = useNavigate();

    // Form Loading State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<CategoryOption[]>([]);

    // Step 1: Product Master Fields
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");

    // Step 2: Product Variant Fields
    const [sku, setSku] = useState("");
    const [brand, setBrand] = useState("");
    const [color, setColor] = useState("");
    const [unitPrice, setUnitPrice] = useState("");

    // Step 3: Inventory Unit Fields
    const [assetCode, setAssetCode] = useState("");
    const [serialNumber, setSerialNumber] = useState("");

    // Auto-generate slug & SKU recommendation
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
                let list: CategoryOption[] = Array.isArray(res.data) ? res.data : [];
                
                if (list.length === 0) {
                    try {
                        const newCat = await apiClient.post("/categories", {
                            name: "Cameras & Cinema Equipment",
                            slug: "cameras-cinema-equipment",
                            description: "DSLR, Mirrorless, Cinema cameras and accessories"
                        });
                        if (newCat.data) list = [newCat.data];
                    } catch (e) {
                        console.error("Auto-create category error:", e);
                    }
                }

                if (list.length > 0) {
                    setCategories(list);
                    setCategoryId(list[0].id);
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
                color: color.trim() || undefined,
                unit_price: priceNum,
            });

            const newVariant = variantRes.data;

            // 3. Create Initial Physical Inventory Stock Unit
            await apiClient.post(`/variants/${newVariant.id}/inventory`, {
                asset_code: assetCode.trim() || `AST-${Date.now().toString().slice(-6)}`,
                serial_number: serialNumber.trim() || undefined,
            });

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
        <main className="relative min-h-screen overflow-hidden bg-[var(--color-ivory)] px-4 pb-16 pt-16 sm:px-6 lg:px-8 sm:pt-20 text-[var(--color-ink)]">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute left-[4%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute left-[18%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute right-[4%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute left-1/2 top-[25%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-zinc-400/[0.05] blur-[150px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-5xl w-full space-y-4">
                <Link
                    to="/vendor/products"
                    className="group inline-flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.22em] text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
                >
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl border border-[#c4b69d] bg-white shadow-2xs group-hover:border-zinc-800 group-hover:bg-zinc-800 group-hover:text-white transition-all">
                        <ArrowLeft size={12} />
                    </span>
                    <span>Back to Catalog Listings</span>
                </Link>

                <div className="border-b border-[var(--color-line-soft)] pb-4">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-zinc-700 animate-pulse shadow-[0_0_6px_rgba(39,39,42,0.5)]" />
                        <span className="text-[8px] font-black uppercase tracking-[0.25em] text-zinc-700">
                            VENDOR / CREATE PRODUCT PIPELINE
                        </span>
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-3xl">
                        Add New Product
                    </h1>
                    <p className="mt-0.5 text-xs text-[var(--color-ink-soft)] max-w-lg">
                        Register a new equipment listing, configure pricing variants, and initialize stock inventory units.
                    </p>
                </div>

                {error && (
                    <div className="flex items-center gap-2.5 rounded-2xl border border-rose-300 bg-rose-50/90 p-4 text-xs text-rose-800 shadow-sm">
                        <AlertCircle size={16} className="text-rose-600 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* SECTION 1: PRODUCT MASTER INFO */}
                    <LoomCard>
                        <div className="p-6 space-y-5">
                            <div className="flex items-center justify-between border-b border-black/[0.08] pb-3">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-800 text-white text-[10px] font-bold font-mono">
                                        01
                                    </div>
                                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-ink)]">
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
                                        className="w-full rounded-xl border border-[#d8cebc] bg-[#faf6ee] px-4 py-2.5 text-xs font-medium text-[var(--color-ink)] outline-none focus:border-zinc-800 focus:bg-white shadow-2xs transition-all"
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
                                        className="w-full rounded-xl border border-[#d8cebc] bg-[#faf6ee] px-4 py-2.5 text-xs font-mono text-[var(--color-ink)] outline-none focus:border-zinc-800 focus:bg-white shadow-2xs transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                        Product Category *
                                    </label>
                                    <select
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                        className="w-full rounded-xl border border-[#d8cebc] bg-[#faf6ee] px-4 py-2.5 text-xs font-medium text-[var(--color-ink)] outline-none focus:border-zinc-800 focus:bg-white shadow-2xs transition-all"
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
                                        placeholder="Full-frame mirrorless camera for professional 4K video recording..."
                                        className="w-full rounded-xl border border-[#d8cebc] bg-[#faf6ee] px-4 py-2.5 text-xs font-medium text-[var(--color-ink)] outline-none focus:border-zinc-800 focus:bg-white shadow-2xs transition-all leading-relaxed"
                                    />
                                </div>
                            </div>
                        </div>
                    </LoomCard>

                    {/* SECTION 2: PRODUCT VARIANT & RENTAL PRICE */}
                    <LoomCard>
                        <div className="p-6 space-y-5">
                            <div className="flex items-center justify-between border-b border-black/[0.08] pb-3">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-800 text-white text-[10px] font-bold font-mono">
                                        02
                                    </div>
                                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-ink)]">
                                        Variant & Daily Rental Pricing
                                    </h2>
                                </div>
                                <span className="text-[7.5px] font-mono font-bold uppercase tracking-wider text-zinc-700 bg-zinc-100 border border-zinc-300 px-2 py-0.5 rounded-full">
                                    Required Rates
                                </span>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                        SKU Identifier *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={sku}
                                        onChange={(e) => setSku(e.target.value)}
                                        placeholder="SONY-A7IV-STD"
                                        className="w-full rounded-xl border border-[#d8cebc] bg-[#faf6ee] px-4 py-2.5 text-xs font-mono text-[var(--color-ink)] outline-none focus:border-zinc-800 focus:bg-white shadow-2xs transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                        Daily Unit Price (₹ / Day) *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={unitPrice}
                                        onChange={(e) => setUnitPrice(e.target.value)}
                                        placeholder="1500.00"
                                        className="w-full rounded-xl border border-[#d8cebc] bg-[#faf6ee] px-4 py-2.5 text-xs font-mono font-bold text-zinc-900 outline-none focus:border-zinc-800 focus:bg-white shadow-2xs transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                        Brand / Manufacturer
                                    </label>
                                    <input
                                        type="text"
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                        placeholder="e.g. Sony"
                                        className="w-full rounded-xl border border-[#d8cebc] bg-[#faf6ee] px-4 py-2.5 text-xs font-medium text-[var(--color-ink)] outline-none focus:border-zinc-800 focus:bg-white shadow-2xs transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                        Color / Finish
                                    </label>
                                    <input
                                        type="text"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        placeholder="e.g. Matte Black"
                                        className="w-full rounded-xl border border-[#d8cebc] bg-[#faf6ee] px-4 py-2.5 text-xs font-medium text-[var(--color-ink)] outline-none focus:border-zinc-800 focus:bg-white shadow-2xs transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </LoomCard>

                    {/* SECTION 3: PHYSICAL INVENTORY STOCK */}
                    <LoomCard>
                        <div className="p-6 space-y-5">
                            <div className="flex items-center justify-between border-b border-black/[0.08] pb-3">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-black text-white text-[10px] font-bold font-mono">
                                        03
                                    </div>
                                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-ink)]">
                                        Physical Stock Initialization
                                    </h2>
                                </div>
                                <span className="text-[7.5px] font-mono font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                    Initial Serial Unit
                                </span>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                                        Asset Tracking Code
                                    </label>
                                    <input
                                        type="text"
                                        value={assetCode}
                                        onChange={(e) => setAssetCode(e.target.value)}
                                        placeholder="e.g. AST-SONY-001"
                                        className="w-full rounded-xl border border-[#d8cebc] bg-[#faf6ee] px-4 py-2.5 text-xs font-mono text-[var(--color-ink)] outline-none focus:border-zinc-800 focus:bg-white shadow-2xs transition-all"
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
                                        className="w-full rounded-xl border border-[#d8cebc] bg-[#faf6ee] px-4 py-2.5 text-xs font-mono text-[var(--color-ink)] outline-none focus:border-zinc-800 focus:bg-white shadow-2xs transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </LoomCard>

                    {/* SUBMIT CONTROL BAR */}
                    <div className="flex items-center justify-between pt-2">
                        <Link
                            to="/vendor/products"
                            className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
                        >
                            Cancel & Return
                        </Link>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 rounded-xl bg-white border border-[#c4b69d] px-6 py-2.5 text-[8.5px] font-extrabold uppercase tracking-wider text-[var(--color-ink)] shadow-2xs hover:bg-[#faf6ee] hover:border-black/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <span>Registering Product...</span>
                            ) : (
                                <>
                                    <Plus size={14} className="text-zinc-800" />
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
