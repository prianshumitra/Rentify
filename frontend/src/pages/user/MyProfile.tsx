import { useAuth } from "../../context/AuthContext";
import { Mail, Shield, Package } from "lucide-react";
import { Link } from "react-router-dom";

function MyProfile() {
    const { user, role } = useAuth();

    if (!user) return null;

    return (
        <main className="relative min-h-screen bg-[var(--color-ivory)] px-6 pb-24 pt-28 sm:pt-32">
            <div className="relative z-10 mx-auto max-w-3xl space-y-10">
                <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                        Account Settings
                    </p>
                    <h1 className="mt-2 text-4xl font-medium tracking-tight text-[var(--color-ink)]">
                        My Profile
                    </h1>
                </div>

                <div className="rounded-[2.5rem] border border-white/80 bg-white/40 p-8 shadow-sm backdrop-blur-xl space-y-8">
                    <div className="flex items-center gap-6 border-b border-[var(--color-line-soft)] pb-8">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-ink)] text-white text-2xl font-medium">
                            {user.first_name?.[0]}{user.last_name?.[0]}
                        </div>

                        <div>
                            <h2 className="text-xl font-medium text-[var(--color-ink)]">
                                {user.first_name} {user.last_name}
                            </h2>
                            <p className="text-xs text-[var(--color-muted)]">{user.email}</p>
                            <span className="mt-2 inline-flex items-center rounded-full border border-[var(--color-accent-soft)] bg-[var(--color-accent-soft)]/20 px-3 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[var(--color-accent)]">
                                Role: {role || "Customer"}
                            </span>
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="rounded-2xl border border-[var(--color-line-soft)] bg-white/50 p-5 space-y-2">
                            <div className="flex items-center gap-2 text-[var(--color-muted)]">
                                <Mail size={14} />
                                <span className="text-[9px] uppercase tracking-wider font-semibold">Email Address</span>
                            </div>
                            <p className="text-sm font-medium">{user.email}</p>
                        </div>

                        <div className="rounded-2xl border border-[var(--color-line-soft)] bg-white/50 p-5 space-y-2">
                            <div className="flex items-center gap-2 text-[var(--color-muted)]">
                                <Shield size={14} />
                                <span className="text-[9px] uppercase tracking-wider font-semibold">Account Status</span>
                            </div>
                            <p className="text-sm font-medium text-emerald-600">Active & Verified</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-[var(--color-line-soft)] flex flex-wrap gap-4">
                        <Link
                            to="/app/rentals"
                            className="inline-flex items-center gap-2 rounded-2xl bg-[var(--color-ink)] px-6 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-white hover:bg-[var(--color-accent)] transition-colors"
                        >
                            <Package size={14} />
                            View My Rentals
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default MyProfile;
