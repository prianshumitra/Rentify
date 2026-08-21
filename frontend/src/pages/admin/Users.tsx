import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "../../api/auth.api";
import type { User } from "../../types/auth";

function AdminUsers() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            try {
                const user = await getCurrentUser();
                setCurrentUser(user);
            } catch (err) {
                console.error("Failed to load user:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchUser();
    }, []);

    return (
        <main className="min-h-screen bg-[var(--color-ivory)] px-4 pb-20 pt-16 sm:px-6 lg:px-8 sm:pt-20 text-[var(--color-ink)]">
            <div className="mx-auto max-w-7xl w-full space-y-6">
                <Link to="/admin" className="inline-flex items-center gap-2 text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors">
                    <ArrowLeft size={14} />
                    Back to Admin Dashboard
                </Link>

                <div className="flex items-center justify-between border-b border-[var(--color-line-soft)] pb-4">
                    <div>
                        <h1 className="text-3xl font-medium tracking-[-0.04em]">User & Role Management</h1>
                        <p className="text-xs text-[var(--color-ink-soft)]">Platform user directory, permissions, and status.</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="h-40 animate-pulse rounded-2xl bg-black/5" />
                ) : currentUser && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-2xl border border-white/90 bg-white/50 p-5 shadow-xs">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-ink)] text-white font-medium">
                                    {currentUser.first_name?.[0] || "U"}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                            {currentUser.is_admin ? "ADMIN SUPERUSER" : currentUser.is_vendor ? "VENDOR" : "CUSTOMER"}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-medium text-[var(--color-ink)]">{currentUser.first_name} {currentUser.last_name}</h3>
                                    <p className="text-xs font-mono text-[var(--color-muted)]">{currentUser.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

export default AdminUsers;
