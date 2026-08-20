import {
    ArrowLeft,
    ArrowUpRight,
    Check,
    Heart,
    Minus,
    Plus,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    getProductById,
    getProductVariants,
    getProducts,
} from "../../api/product.api";

import type {
    Product,
    ProductVariant,
} from "../../types/product";

interface MousePosition {
    x: number;
    y: number;
}

function ProductDetails() {
    const { id } = useParams<{
        id: string;
    }>();

    const navigate = useNavigate();

    const [product, setProduct] =
        useState<Product | null>(null);

    const [variants, setVariants] =
        useState<ProductVariant[]>([]);

    const [selectedVariant, setSelectedVariant] =
        useState<ProductVariant | null>(null);

    const [quantity, setQuantity] =
        useState(1);

    const [isLoading, setIsLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [variantError, setVariantError] =
        useState(false);

    const [isLiked, setIsLiked] =
        useState(false);

    const [mouse, setMouse] =
        useState<MousePosition>({
            x: 0,
            y: 0,
        });

    /* ═══════════════════════════════
       MOUSE DEPTH
    ═══════════════════════════════ */

    useEffect(() => {
        function handleMouseMove(
            event: MouseEvent,
        ) {
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
        }

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

    /* ═══════════════════════════════
       LOAD PRODUCT
    ═══════════════════════════════ */

    useEffect(() => {
        async function loadProduct() {
            if (!id) {
                setError(
                    "No product ID was provided.",
                );

                setIsLoading(false);

                return;
            }

            try {
                setIsLoading(true);
                setError("");

                console.log(
                    "ProductDetails URL ID:",
                    id,
                );

                /*
                 * Product request
                 */

                let currentProduct: Product | null = null;
                try {
                    currentProduct = await getProductById(id);
                } catch {
                    const products = await getProducts();
                    currentProduct = products.find(
                        (item) => String(item.id) === String(id)
                    ) || null;
                }

                if (!currentProduct) {
                    setError(
                        "This product is no longer available.",
                    );

                    return;
                }

                /*
                 * IMPORTANT:
                 *
                 * Set the product immediately.
                 * Variant loading should not prevent
                 * the product page from appearing.
                 */

                setProduct(
                    currentProduct,
                );

                /*
                 * Variant request
                 *
                 * This is intentionally separated from
                 * the main product request.
                 */

                try {
                    const productVariants =
                        await getProductVariants(
                            currentProduct.id,
                        );

                    console.log(
                        "Product variants:",
                        productVariants,
                    );

                    setVariants(
                        productVariants,
                    );

                    const activeVariants =
                        productVariants.filter(
                            (variant) =>
                                variant.is_active,
                        );

                    if (
                        activeVariants.length >
                        0
                    ) {
                        setSelectedVariant(
                            activeVariants[0],
                        );
                    }
                } catch (variantErr) {
                    console.error(
                        "Failed to load product variants:",
                        variantErr,
                    );

                    /*
                     * The product itself is still valid.
                     * We simply let the UI know that
                     * variants could not be loaded.
                     */

                    setVariantError(true);
                    setVariants([]);
                }
            } catch (err) {
                console.error(
                    "Failed to load product:",
                    err,
                );

                setError(
                    "Unable to load this product right now.",
                );
            } finally {
                setIsLoading(false);
            }
        }

        loadProduct();
    }, [id]);

    const activeVariants =
        variants.filter(
            (variant) =>
                variant.is_active,
        );

    /* ═══════════════════════════════
       LOADING
    ═══════════════════════════════ */

    if (isLoading) {
        return (
            <main className="relative min-h-screen overflow-hidden bg-[var(--color-ivory)]">

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                >
                    <div className="absolute left-[14%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                    <div className="absolute right-[20%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                    <div className="absolute left-0 top-[40%] h-px w-full bg-[var(--color-line-soft)]" />
                </div>

                <div className="relative z-10 mx-auto max-w-[var(--content-width)] px-[var(--content-padding)] pb-24 pt-24">

                    <div className="mb-10 h-3 w-28 animate-pulse rounded-full bg-[var(--color-line-soft)]" />

                    <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr]">

                        <div className="h-[540px] animate-pulse rounded-[2.3rem] border border-[var(--color-line-soft)] bg-[var(--color-ivory-soft)]" />

                        <div className="space-y-7">

                            <div className="h-3 w-24 animate-pulse rounded-full bg-[var(--color-line-soft)]" />

                            <div className="h-24 w-full animate-pulse rounded-2xl bg-[var(--color-line-soft)]" />

                            <div className="h-16 w-4/5 animate-pulse rounded-2xl bg-[var(--color-line-soft)]" />

                            <div className="h-28 w-full animate-pulse rounded-2xl bg-[var(--color-line-soft)]" />

                        </div>

                    </div>

                </div>
            </main>
        );
    }

    /* ═══════════════════════════════
       PRODUCT ERROR
    ═══════════════════════════════ */

    if (error || !product) {
        return (
            <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-ivory)] px-6">

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                >
                    <div className="absolute left-[14%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                    <div className="absolute right-[20%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                    <div className="absolute left-0 top-1/2 h-px w-full bg-[var(--color-line-soft)]" />
                </div>

                <div className="relative z-10 max-w-md text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[var(--color-line)] bg-white/40 shadow-[0_20px_40px_rgba(23,23,23,.06)] backdrop-blur-xl">

                        <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />

                    </div>

                    <p className="mt-7 text-[9px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
                        Rental / 404
                    </p>

                    <h1 className="mt-4 text-4xl font-medium tracking-[-0.05em]">
                        Product unavailable.
                    </h1>

                    <p className="mt-4 text-sm leading-6 text-[var(--color-muted)]">
                        {error}
                    </p>

                    <Link
                        to="/app/explore"
                        className="mt-8 inline-flex items-center gap-3 rounded-full bg-[var(--color-ink)] px-6 py-4 text-[9px] font-medium uppercase tracking-[0.2em] !text-white shadow-[0_18px_35px_rgba(23,23,23,.14)] transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--color-accent)]"
                    >
                        <ArrowLeft
                            size={14}
                            strokeWidth={1.5}
                        />

                        Back to explore
                    </Link>

                </div>
            </main>
        );
    }

    /* ═══════════════════════════════
       MAIN PAGE
    ═══════════════════════════════ */

    return (
        <main className="relative min-h-screen overflow-hidden bg-[var(--color-ivory)]">

            {/* ═══════════════════════════════
                BACKGROUND SYSTEM
            ═══════════════════════════════ */}

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
            >

                <div className="absolute left-[8%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                <div className="absolute left-[24%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                <div className="absolute left-1/2 top-0 h-full w-px bg-[var(--color-line-soft)]" />

                <div className="absolute right-[24%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                <div className="absolute right-[8%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                <div className="absolute left-0 top-[30%] h-px w-full bg-[var(--color-line-soft)]" />

                <div className="absolute left-0 top-[72%] h-px w-full bg-[var(--color-line-soft)]" />

                <div
                    className="absolute left-[24%] top-[30%] h-1.5 w-1.5 rounded-full bg-[var(--color-ink)] transition-transform duration-500"
                    style={{
                        transform: `translate(
                            ${mouse.x * 12}px,
                            ${mouse.y * 12}px
                        )`,
                    }}
                />

                <div
                    className="absolute right-[24%] top-[72%] h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] transition-transform duration-500"
                    style={{
                        transform: `translate(
                            ${mouse.x * -12}px,
                            ${mouse.y * -12}px
                        )`,
                    }}
                />

                <div
                    className="absolute left-1/2 top-[38%] h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-[var(--color-accent)]/[0.045] blur-[140px]"
                    style={{
                        transform: `translate(
                            calc(-50% + ${mouse.x * 35}px),
                            ${mouse.y * 30}px
                        )`,
                    }}
                />

            </div>

            <div className="relative z-10 mx-auto max-w-[var(--content-width)] px-[var(--content-padding)] pb-28 pt-20">

                {/* ═══════════════════════════════
                    BACK
                ═══════════════════════════════ */}

                <div className="mb-10 flex items-center justify-between">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(-1)
                        }
                        className="group flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.2em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
                    >

                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-line)] transition-all duration-300 group-hover:-translate-x-1 group-hover:border-[var(--color-accent)]">

                            <ArrowLeft
                                size={13}
                                strokeWidth={1.5}
                            />

                        </span>

                        Back to explore

                    </button>

                    <div className="flex items-center gap-2.5">
                        <span className="h-px w-6 bg-[var(--color-accent)]" />
                        <span className="text-[8.5px] font-semibold uppercase tracking-[0.28em] text-[var(--color-muted)]">
                            RENTAL / PRODUCT SPECS
                        </span>
                    </div>


                </div>

                {/* ═══════════════════════════════
                    PRODUCT COMPOSITION
                ═══════════════════════════════ */}

                <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr]">

                    {/* ═══════════════════════════════
                        PRODUCT VISUAL
                    ═══════════════════════════════ */}

                    <div className="relative">

                        <div
                            aria-hidden="true"
                            className="absolute inset-0 translate-x-3 translate-y-3 rounded-[2.3rem] border border-[var(--color-line-soft)] bg-[var(--color-ivory-soft)]"
                        />

                        <div
                            className="relative min-h-[540px] overflow-hidden rounded-[2.3rem] border border-white/80 bg-[rgba(250,248,242,0.72)] p-7 shadow-[0_25px_60px_rgba(23,23,23,.09),inset_0_1px_0_rgba(255,255,255,.9)] backdrop-blur-xl transition-transform duration-500 sm:p-10"
                            style={{
                                transform: `
                                    perspective(1200px)
                                    rotateX(${mouse.y * -0.7}deg)
                                    rotateY(${mouse.x * 0.7}deg)
                                `,
                            }}
                        >

                            <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-[var(--color-line-soft)]" />

                            <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full border border-[var(--color-line-soft)]" />

                            <div className="absolute bottom-[-100px] left-[-100px] h-72 w-72 rounded-full bg-[var(--color-accent)]/[0.035] blur-3xl" />

                            {/* Card header */}

                            <div className="relative z-10 flex items-center justify-between">

                                <div className="flex items-center gap-3">

                                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-ink)] !text-white shadow-[0_12px_25px_rgba(23,23,23,.12)]">

                                        <Sparkles
                                            size={14}
                                            strokeWidth={1.5}
                                        />

                                    </span>

                                    <div>

                                        <p className="text-[8px] font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]">
                                            Rental item
                                        </p>

                                        <div className="mt-1 flex items-center gap-2">

                                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />

                                            <p className="text-[8px] uppercase tracking-[0.16em] text-[var(--color-accent)]">
                                                {product.is_active
                                                    ? "Available"
                                                    : "Unavailable"}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsLiked(
                                            (
                                                current,
                                            ) =>
                                                !current,
                                        )
                                    }
                                    aria-label={
                                        isLiked
                                            ? "Remove from favorites"
                                            : "Add to favorites"
                                    }
                                    className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${
                                        isLiked
                                            ? "border-[var(--color-accent)] bg-[var(--color-accent)] !text-white"
                                            : "border-[var(--color-line)] bg-white/30 text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                                    }`}
                                >

                                    <Heart
                                        size={15}
                                        strokeWidth={1.5}
                                        fill={
                                            isLiked
                                                ? "currentColor"
                                                : "none"
                                        }
                                    />

                                </button>

                            </div>

                            {/* Product centerpiece */}

                            <div className="relative z-10 flex min-h-[370px] items-center justify-center">

                                <div
                                    className="relative flex h-64 w-64 items-center justify-center rounded-[3rem] border border-[var(--color-line)] bg-white/30 shadow-[0_35px_70px_rgba(23,23,23,.09)] backdrop-blur-md transition-transform duration-500"
                                    style={{
                                        transform: `
                                            translate(
                                                ${mouse.x * 8}px,
                                                ${mouse.y * 8}px
                                            )
                                            rotateX(${mouse.y * -2}deg)
                                            rotateY(${mouse.x * 2}deg)
                                        `,
                                    }}
                                >

                                    <div className="absolute inset-5 rounded-[2.4rem] border border-[var(--color-line-soft)]" />

                                    <div className="absolute inset-10 rounded-[2rem] border border-[var(--color-line-soft)]" />

                                    <div className="relative max-w-[175px] text-center">

                                        <p className="text-[8px] uppercase tracking-[0.25em] text-[var(--color-muted)]">
                                            Product
                                        </p>

                                        <h2 className="mt-3 text-3xl font-medium leading-[0.9] tracking-[-0.06em]">
                                            {product.name}
                                        </h2>

                                        <div className="mx-auto mt-5 h-px w-10 bg-[var(--color-accent)]" />

                                    </div>

                                </div>

                            </div>

                            {/* Bottom metadata */}

                            <div className="absolute bottom-8 left-8">

                                <p className="text-[8px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                                    Rentify
                                </p>

                                <p className="mt-1 text-[8px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
                                    Product /{" "}
                                    {product.slug}
                                </p>

                            </div>

                            <div className="absolute bottom-8 right-8 text-[8px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                                01 / 01
                            </div>

                        </div>

                    </div>

                    {/* ═══════════════════════════════
                        PRODUCT INFORMATION
                    ═══════════════════════════════ */}

                    <div className="flex flex-col">

                        <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-[var(--color-accent)]">
                            Discover / Product
                        </p>

                        <h1 className="mt-5 text-5xl font-medium leading-[0.86] tracking-[-0.065em] sm:text-6xl lg:text-7xl">
                            {product.name}
                        </h1>

                        <p className="mt-6 max-w-xl text-sm leading-7 text-[var(--color-ink-soft)]">
                            {product.description ||
                                "A carefully selected rental item, available when you need it."}
                        </p>

                        {/* Product metadata */}

                        <div className="mt-9 grid grid-cols-2 gap-3">

                            <div className="rounded-2xl border border-[var(--color-line)] bg-white/30 p-5 backdrop-blur-md">

                                <p className="text-[7px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                                    Category
                                </p>

                                <p className="mt-3 truncate text-sm font-medium">
                                    {product.category_id}
                                </p>

                            </div>

                            <div className="rounded-2xl border border-[var(--color-line)] bg-white/30 p-5 backdrop-blur-md">

                                <p className="text-[7px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                                    Status
                                </p>

                                <div className="mt-3 flex items-center gap-2">

                                    <span
                                        className={`h-1.5 w-1.5 rounded-full ${
                                            product.is_active
                                                ? "bg-[var(--color-accent)]"
                                                : "bg-[var(--color-muted)]"
                                        }`}
                                    />

                                    <p className="text-sm font-medium">
                                        {product.is_active
                                            ? "Available"
                                            : "Unavailable"}
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* ═══════════════════════════════
                            VARIANTS
                        ═══════════════════════════════ */}

                        <div className="mt-9">

                            <div className="mb-4 flex items-center justify-between">

                                <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]">
                                    Choose variant
                                </p>

                                <span className="text-[8px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
                                    {variantError
                                        ? "Unavailable"
                                        : `${activeVariants.length} available`}
                                </span>

                            </div>

                            {variantError ? (
                                <div className="rounded-2xl border border-[var(--color-line)] bg-white/25 p-5">

                                    <div className="flex items-center gap-3">

                                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />

                                        <p className="text-xs text-[var(--color-muted)]">
                                            Variant information is
                                            temporarily unavailable.
                                        </p>

                                    </div>

                                </div>
                            ) : activeVariants.length ===
                              0 ? (
                                <div className="rounded-2xl border border-[var(--color-line)] bg-white/25 p-5">

                                    <p className="text-xs text-[var(--color-muted)]">
                                        No active variants are
                                        currently available.
                                    </p>

                                </div>
                            ) : (
                                <div className="space-y-2">

                                    {activeVariants.map(
                                        (
                                            variant,
                                        ) => {

                                            const isSelected =
                                                selectedVariant?.id ===
                                                variant.id;

                                            return (
                                                <button
                                                    key={
                                                        variant.id
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedVariant(
                                                            variant,
                                                        )
                                                    }
                                                    className={`group flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-all duration-300 ${
                                                        isSelected
                                                            ? "border-[var(--color-accent)] bg-white/60 shadow-[0_12px_25px_rgba(23,23,23,.06)]"
                                                            : "border-[var(--color-line)] bg-white/25 hover:border-[var(--color-accent)]/50 hover:bg-white/45"
                                                    }`}
                                                >

                                                    <div className="flex min-w-0 items-center gap-4">

                                                        <span
                                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                                                                isSelected
                                                                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] !text-white"
                                                                    : "border-[var(--color-line)] text-[var(--color-muted)]"
                                                            }`}
                                                        >

                                                            {isSelected ? (
                                                                <Check
                                                                    size={
                                                                        14
                                                                    }
                                                                    strokeWidth={
                                                                        1.8
                                                                    }
                                                                />
                                                            ) : (
                                                                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-muted)]" />
                                                            )}

                                                        </span>

                                                        <div className="min-w-0">

                                                            <p className="truncate text-sm font-medium">
                                                                {variant.brand ||
                                                                    variant.manufacturer ||
                                                                    "Standard variant"}
                                                            </p>

                                                            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[8px] uppercase tracking-[0.14em] text-[var(--color-muted)]">

                                                                {variant.color && (
                                                                    <span>
                                                                        Color:{" "}
                                                                        {
                                                                            variant.color
                                                                        }
                                                                    </span>
                                                                )}

                                                                {variant.size && (
                                                                    <span>
                                                                        Size:{" "}
                                                                        {
                                                                            variant.size
                                                                        }
                                                                    </span>
                                                                )}

                                                                <span>
                                                                    SKU:{" "}
                                                                    {
                                                                        variant.sku
                                                                    }
                                                                </span>

                                                            </div>

                                                        </div>

                                                    </div>

                                                    <ArrowUpRight
                                                        size={14}
                                                        strokeWidth={1.5}
                                                        className="ml-4 shrink-0 text-[var(--color-muted)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                                    />

                                                </button>
                                            );
                                        },
                                    )}

                                </div>
                            )}

                        </div>

                        {/* Quantity */}

                        <div className="mt-8 flex items-center justify-between rounded-2xl border border-[var(--color-line)] bg-white/25 p-4">

                            <div>

                                <p className="text-[8px] font-medium uppercase tracking-[0.18em] text-[var(--color-muted)]">
                                    Quantity
                                </p>

                                <p className="mt-1 text-[9px] text-[var(--color-muted)]">
                                    How many do you need?
                                </p>

                            </div>

                            <div className="flex items-center gap-3">

                                <button
                                    type="button"
                                    disabled={
                                        quantity <=
                                        1
                                    }
                                    onClick={() =>
                                        setQuantity(
                                            (
                                                current,
                                            ) =>
                                                Math.max(
                                                    1,
                                                    current -
                                                        1,
                                                ),
                                        )
                                    }
                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-line)] text-[var(--color-ink)] transition-all hover:border-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-30"
                                >

                                    <Minus
                                        size={13}
                                        strokeWidth={1.5}
                                    />

                                </button>

                                <span className="w-5 text-center text-sm font-medium">
                                    {quantity}
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setQuantity(
                                            (
                                                current,
                                            ) =>
                                                current +
                                                1,
                                        )
                                    }
                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-line)] text-[var(--color-ink)] transition-all hover:border-[var(--color-accent)]"
                                >

                                    <Plus
                                        size={13}
                                        strokeWidth={1.5}
                                    />

                                </button>

                            </div>

                        </div>

                        {/* Price summary hint if variant selected */}
                        {selectedVariant && (
                            <div className="mt-4 flex items-center justify-between px-2">
                                <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-[var(--color-ink-soft)]">
                                    Rental Price
                                </span>
                                <span className="text-sm font-medium">
                                    ₹{Number(selectedVariant.unit_price).toFixed(2)} / ea
                                </span>
                            </div>
                        )}

                        {/* Rental CTA */}

                        <button
                            type="button"
                            disabled={
                                !product.is_active || !selectedVariant
                            }
                            onClick={() => {
                                if (selectedVariant) {
                                    navigate(`/app/products/${product.id}/rent`, {
                                        state: {
                                            product,
                                            variant: selectedVariant,
                                            quantity
                                        }
                                    });
                                }
                            }}
                            className="group mt-8 flex w-full items-center justify-between rounded-2xl bg-[var(--color-ink)] px-6 py-5 text-left shadow-[0_20px_40px_rgba(23,23,23,.14)] transition-all duration-500 hover:-translate-y-1 hover:bg-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-40"
                        >

                            <div>

                                <p className="text-[9px] font-medium uppercase tracking-[0.2em] !text-white">
                                    Start rental
                                </p>

                                <p className="mt-1 text-[8px] !text-white/50">
                                    Choose your dates next
                                </p>

                            </div>

                            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 !text-white transition-transform duration-300 group-hover:translate-x-1">

                                <ArrowUpRight
                                    size={17}
                                    strokeWidth={1.5}
                                />

                            </span>

                        </button>

                        {/* Trust */}

                        <div className="mt-7 grid grid-cols-2 gap-3">

                            <div className="flex items-center gap-3 rounded-xl border border-[var(--color-line-soft)] p-3">

                                <ShieldCheck
                                    size={15}
                                    strokeWidth={1.4}
                                    className="shrink-0 text-[var(--color-accent)]"
                                />

                                <span className="text-[8px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
                                    Secure rental
                                </span>

                            </div>

                            <div className="flex items-center gap-3 rounded-xl border border-[var(--color-line-soft)] p-3">

                                <Check
                                    size={15}
                                    strokeWidth={1.4}
                                    className="shrink-0 text-[var(--color-accent)]"
                                />

                                <span className="text-[8px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
                                    Verified item
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

                {/* ═══════════════════════════════
                    HOW RENTING WORKS
                ═══════════════════════════════ */}

                <section className="mt-14">

                    <div className="mb-6">

                        <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
                            Simple by design
                        </p>

                        <h2 className="mt-3 text-3xl font-medium tracking-[-0.05em]">
                            How renting works.
                        </h2>

                    </div>

                    <div className="grid gap-5 md:grid-cols-3">

                        <InfoCard
                            number="01"
                            title="Choose"
                            description="Pick the product and variant that fits what you need."
                        />

                        <InfoCard
                            number="02"
                            title="Reserve"
                            description="Select your rental period and confirm the request."
                        />

                        <InfoCard
                            number="03"
                            title="Enjoy"
                            description="Use it for as long as you need, then return it."
                        />

                    </div>

                </section>

            </div>

        </main>
    );
}

interface InfoCardProps {
    number: string;
    title: string;
    description: string;
}

function InfoCard({
    number,
    title,
    description,
}: InfoCardProps) {
    return (
        <div className="group rounded-[1.7rem] border border-[var(--color-line)] bg-white/25 p-6 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:bg-white/45 hover:shadow-[0_20px_40px_rgba(23,23,23,.06)]">

            <div className="flex items-center justify-between">

                <span className="text-[8px] font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]">
                    {number}
                </span>

                <span className="h-px w-8 bg-[var(--color-line)] transition-all duration-500 group-hover:w-12 group-hover:bg-[var(--color-accent)]" />

            </div>

            <h3 className="mt-10 text-xl font-medium tracking-[-0.035em]">
                {title}
            </h3>

            <p className="mt-3 text-xs leading-6 text-[var(--color-muted)]">
                {description}
            </p>

        </div>
    );
}

export default ProductDetails;