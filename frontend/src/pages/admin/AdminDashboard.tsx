import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ShieldCheck,
    Users,
    Package,
    Boxes,
    CreditCard,
    ShoppingBag,
    ArrowUpRight
} from "lucide-react";
import LoomCard from "../../components/ui/LoomCard";
import apiClient from "../../api/client";

function AdminDashboard() {
    const navigate = useNavigate();
    const [usersCount, setUsersCount] = useState(0);
    const [productsCount, setProductsCount] = useState(0);
    const [rentalsCount, setRentalsCount] = useState(0);
    const [inventoryCount, setInventoryCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchAdminStats() {
            setIsLoading(true);
            try {
                // Fetch products count
                const prodRes = await apiClient.get("/products/");
                setProductsCount(Array.isArray(prodRes.data) ? prodRes.data.length : 0);

                // Fetch inventory count
                const invRes = await apiClient.get("/inventory/");
                setInventoryCount(Array.isArray(invRes.data) ? invRes.data.length : 0);

                // Fetch rentals count
                const rentRes = await apiClient.get("/rentals/");
                setRentalsCount(Array.isArray(rentRes.data) ? rentRes.data.length : 0);

                setUsersCount(1); // Active session
            } catch (err) {
                console.error("Error loading admin stats:", err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchAdminStats();
    }, []);

    if (isLoading) {
        return (
            <main className="min-h-screen bg-[var(--color-ivory)] px-6 py-24">
                <div className="mx-auto max-w-5xl space-y-6">
                    <div className="h-8 w-48 animate-pulse rounded-lg bg-black/10" />
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-32 animate-pulse rounded-2xl bg-black/5" />
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-[var(--color-ivory)] px-6 pb-24 pt-28 sm:pt-32 lg:pt-36 text-[var(--color-ink)]">
            {/* Background 3D Grid & Lighting */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute left-[6%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute right-[6%] top-0 h-full w-px bg-[var(--color-line-soft)]" />
                <div className="absolute left-[6%] top-[18%] h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                <div className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-[var(--color-accent)] opacity-5 blur-[100px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-5xl space-y-8">
                {/* Header Bar */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--color-line-soft)] pb-5">
                    <div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={16} className="text-[var(--color-accent)]" />
                            <p className="text-[8px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
                                System Control Center
                            </p>
                        </div>
                        <h1 className="mt-1 text-3xl font-medium tracking-[-0.05em] text-[var(--color-ink)] sm:text-4xl">
                            Admin Dashboard
                        </h1>
                        <p className="mt-1 text-xs leading-5 text-[var(--color-ink-soft)]">
                            Full platform control: users, products, rentals, inventory & payment oversight.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            to="/admin/users"
                            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-ink)] px-4 py-2 text-[8px] font-bold uppercase tracking-[0.18em] text-white shadow-sm hover:bg-[var(--color-accent)] transition-all active:scale-95"
                        >
                            <Users size={13} />
                            Manage Users
                        </Link>
                    </div>
                </div>

                {/* macOS Toolbar Card */}
                <LoomCard offset={true} className="w-fit">
                    <div className="flex items-center gap-2 px-3.5 py-2.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] border border-black/10" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e] border border-black/10" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840] border border-black/10" />
                        <span className="ml-2.5 h-3.5 w-px bg-[var(--color-line-soft)]" />
                        <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                            ADMIN SUPERUSER ACCESS // ACTIVE
                        </span>
                    </div>
                </LoomCard>

                {/* KPI Metrics Cards */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Users */}
                    <div
                        onClick={() => navigate("/admin/users")}
                        className="group cursor-pointer rounded-[1.5rem] border border-white/90 bg-gradient-to-b from-[#faf8f3] via-[#f6f3ea] to-[#f0ebdf] p-5 shadow-[0_12px_30px_rgba(23,23,23,0.06)] backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-[var(--color-accent)]/40"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[var(--color-muted)]">
                                Users
                            </span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/80 text-[var(--color-ink)] shadow-xs">
                                <Users size={16} />
                            </div>
                        </div>
                        <p className="mt-3 text-3xl font-medium tracking-[-0.04em] text-[var(--color-ink)]">
                            {usersCount}
                        </p>
                        <p className="mt-1 text-[10px] text-[var(--color-muted)]">Registered accounts</p>
                    </div>
                    <div
                        onClick={() => navigate("/admin/products")}
                        className="group cursor-pointer rounded-[1.5rem] border border-white/90 bg-gradient-to-b from-[#faf8f3] via-[#f6f3ea] to-[#f0ebdf] p-5 shadow-[0_12px_30px_rgba(23,23,23,0.06)] backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-[var(--color-accent)]/40"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[var(--color-muted)]">
                                Products
                            </span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/80 text-[var(--color-ink)] shadow-xs">
                                <Package size={16} />
                            </div>
                        </div>
                        <p className="mt-3 text-3xl font-medium tracking-[-0.04em] text-[var(--color-ink)]">
                            {productsCount}
                        </p>
                        <p className="mt-1 text-[10px] text-[var(--color-muted)]">Global catalog items</p>
                    </div>

                    {/* Inventory */}
                    <div
                        onClick={() => navigate("/admin/inventory")}
                        className="group cursor-pointer rounded-[1.5rem] border border-white/90 bg-gradient-to-b from-[#faf8f3] via-[#f6f3ea] to-[#f0ebdf] p-5 shadow-[0_12px_30px_rgba(23,23,23,0.06)] backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-[var(--color-accent)]/40"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[var(--color-muted)]">
                                Inventory
                            </span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/80 text-[var(--color-ink)] shadow-xs">
                                <Boxes size={16} />
                            </div>
                        </div>
                        <p className="mt-3 text-3xl font-medium tracking-[-0.04em] text-[var(--color-ink)]">
                            {inventoryCount}
                        </p>
                        <p className="mt-1 text-[10px] text-[var(--color-muted)]">Total stock units</p>
                    </div>

                    {/* Rentals */}
                    <div
                        onClick={() => navigate("/admin/rentals")}
                        className="group cursor-pointer rounded-[1.5rem] border border-white/90 bg-gradient-to-b from-[#faf8f3] via-[#f6f3ea] to-[#f0ebdf] p-5 shadow-[0_12px_30px_rgba(23,23,23,0.06)] backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-[var(--color-accent)]/40"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[var(--color-muted)]">
                                All Rentals
                            </span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/80 text-[var(--color-ink)] shadow-xs">
                                <ShoppingBag size={16} />
                            </div>
                        </div>
                        <p className="mt-3 text-3xl font-medium tracking-[-0.04em] text-[var(--color-ink)]">
                            {rentalsCount}
                        </p>
                        <p className="mt-1 text-[10px] text-[var(--color-muted)]">Platform orders</p>
                    </div>

                    {/* Payments */}
                    <div
                        onClick={() => navigate("/admin/payments")}
                        className="group cursor-pointer rounded-[1.5rem] border border-white/90 bg-gradient-to-b from-[#faf8f3] via-[#f6f3ea] to-[#f0ebdf] p-5 shadow-[0_12px_30px_rgba(23,23,23,0.06)] backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-[var(--color-accent)]/40"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[var(--color-muted)]">
                                Payments
                            </span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 shadow-xs border border-emerald-100">
                                <CreditCard size={16} />
                            </div>
                        </div>
                        <p className="mt-3 text-3xl font-medium tracking-[-0.04em] text-[var(--color-ink)]">
                            Active
                        </p>
                        <p className="mt-1 text-[10px] text-[var(--color-muted)]">Transactions & Stripe</p>
                    </div>
                </div>

                {/* System Control Grid */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Link
                        to="/admin/users"
                        className="group flex flex-col justify-between rounded-2xl border border-white/80 bg-white/50 p-6 backdrop-blur-md shadow-xs hover:border-[var(--color-accent)] hover:shadow-md transition-all"
                    >
                        <div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-ink)] text-white group-hover:bg-[var(--color-accent)] transition-colors">
                                <Users size={20} />
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-[var(--color-ink)]">Users & Roles</h3>
                            <p className="mt-1 text-xs text-[var(--color-ink-soft)] leading-5">
                                Audit accounts, permissions, and vendor authorizations.
                            </p>
                        </div>
                        <div className="mt-6 flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                            <span>Manage Users</span>
                            <ArrowUpRight size={13} />
                        </div>
                    </Link>

                    <Link
                        to="/admin/products"
                        className="group flex flex-col justify-between rounded-2xl border border-white/80 bg-white/50 p-6 backdrop-blur-md shadow-xs hover:border-[var(--color-accent)] hover:shadow-md transition-all"
                    >
                        <div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-ink)] text-white group-hover:bg-[var(--color-accent)] transition-colors">
                                <Package size={20} />
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-[var(--color-ink)]">Global Products</h3>
                            <p className="mt-1 text-xs text-[var(--color-ink-soft)] leading-5">
                                Inspect platform products, pricing, and variants.
                            </p>
                        </div>
                        <div className="mt-6 flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                            <span>Inspect Catalog</span>
                            <ArrowUpRight size={13} />
                        </div>
                    </Link>

                    <Link
                        to="/admin/rentals"
                        className="group flex flex-col justify-between rounded-2xl border border-white/80 bg-white/50 p-6 backdrop-blur-md shadow-xs hover:border-[var(--color-accent)] hover:shadow-md transition-all"
                    >
                        <div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-ink)] text-white group-hover:bg-[var(--color-accent)] transition-colors">
                                <ShoppingBag size={20} />
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-[var(--color-ink)]">All Rentals</h3>
                            <p className="mt-1 text-xs text-[var(--color-ink-soft)] leading-5">
                                Track platform-wide rental lifecycles, returns, and damages.
                            </p>
                        </div>
                        <div className="mt-6 flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                            <span>View All Rentals</span>
                            <ArrowUpRight size={13} />
                        </div>
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default AdminDashboard;
