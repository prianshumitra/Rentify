import {
    ArrowUpRight,
    Compass,
    Package,
} from "lucide-react";

import LoomCard from "../../components/ui/LoomCard";
import HomeFooter from "../../components/layout/HomeFooter";
import { useAuth } from "../../context/AuthContext";

function UserHome() {
    const { user } = useAuth();

    const firstName = user?.first_name || "there";

    return (
        <main className="relative min-h-screen overflow-hidden bg-[var(--color-ivory)]">
            {/* ═══════════════════════════════
                LOOM THREAD SYSTEM
            ═══════════════════════════════ */}

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
            >
                <div className="absolute left-[12%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                <div className="absolute right-[14%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                <div className="absolute left-0 top-[30%] h-px w-full bg-[var(--color-line-soft)]" />

                <div className="absolute left-[12%] top-[30%] h-1.5 w-1.5 rounded-full bg-[var(--color-ink)]" />

                <div className="absolute right-[14%] top-[30%] h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            </div>

            <section className="relative z-10 mx-auto max-w-[var(--content-width)] px-[var(--content-padding)] pb-24 pt-28">
                {/* ═══════════════════════════════
                    WELCOME CARD
                ═══════════════════════════════ */}

                <div className="mx-auto max-w-5xl">
                    <LoomCard>
                        <div className="p-8 sm:p-12 lg:p-16">
                            <div className="flex items-start justify-between gap-6">
                                <div>
                                    <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--color-accent)]">
                                        Your Loom / 01
                                    </p>

                                    <h1 className="mt-7 max-w-3xl text-[clamp(3.5rem,8vw,7rem)] font-medium leading-[0.88] tracking-[-0.065em]">
                                        Good to see
                                        <br />
                                        <span className="font-[var(--font-display)] italic">
                                            you, {firstName}.
                                        </span>
                                    </h1>

                                    <p className="mt-8 max-w-lg text-base leading-7 text-[var(--color-ink-soft)] sm:text-lg">
                                        Your rental world is waiting.
                                        Discover something useful,
                                        unexpected, or simply worth
                                        having for a while.
                                    </p>
                                </div>

                                <span className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--color-muted)] sm:block">
                                    01 / 04
                                </span>
                            </div>

                            <div className="mt-12 flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    className="group flex items-center gap-4 rounded-full bg-[var(--color-ink)] px-5 py-3 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--color-ivory)] transition-colors hover:bg-[var(--color-accent)]"
                                >
                                    <Compass
                                        size={14}
                                        strokeWidth={1.5}
                                    />

                                    Explore collection

                                    <ArrowUpRight
                                        size={14}
                                        strokeWidth={1.5}
                                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                    />
                                </button>
                            </div>
                        </div>
                    </LoomCard>
                </div>

                {/* ═══════════════════════════════
                    STICKER CARDS
                ═══════════════════════════════ */}

                <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
                    <LoomCard>
                        <div className="min-h-[230px] p-7 sm:p-9">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]">
                                    Discover
                                </span>

                                <Compass
                                    size={17}
                                    strokeWidth={1.4}
                                    className="text-[var(--color-accent)]"
                                />
                            </div>

                            <div className="mt-16">
                                <h2 className="text-3xl font-medium tracking-[-0.05em]">
                                    Find something
                                    <br />
                                    <span className="font-[var(--font-display)] italic">
                                        worth renting.
                                    </span>
                                </h2>

                                <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--color-muted)]">
                                    Browse the collection and find
                                    something that fits the moment.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="mt-7 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
                            >
                                Explore
                                <ArrowUpRight
                                    size={13}
                                    strokeWidth={1.5}
                                />
                            </button>
                        </div>
                    </LoomCard>

                    <LoomCard offset={false}>
                        <div className="min-h-[230px] rounded-[1.75rem] bg-[var(--color-ink)] p-7 text-[var(--color-ivory)] sm:p-9">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[rgba(245,241,232,0.5)]">
                                    Your thread
                                </span>

                                <Package
                                    size={17}
                                    strokeWidth={1.4}
                                    className="text-[var(--color-accent)]"
                                />
                            </div>

                            <div className="mt-16">
                                <p className="text-[10px] uppercase tracking-[0.18em] text-[rgba(245,241,232,0.45)]">
                                    Active rentals
                                </p>

                                <p className="mt-2 text-5xl font-medium tracking-[-0.06em]">
                                    00
                                </p>

                                <p className="mt-3 max-w-sm text-sm leading-6 text-[rgba(245,241,232,0.55)]">
                                    Nothing is currently woven into
                                    your rental thread.
                                </p>
                            </div>
                        </div>
                    </LoomCard>
                </div>

                {/* ═══════════════════════════════
                    THREAD CARD
                ═══════════════════════════════ */}

                <div className="mx-auto mt-12 max-w-5xl">
                    <LoomCard>
                        <div className="p-7 sm:p-9">
                            <div className="flex items-center justify-between border-b border-[var(--color-line-soft)] pb-5">
                                <div>
                                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]">
                                        Current thread
                                    </p>

                                    <h2 className="mt-2 text-xl font-medium tracking-[-0.03em]">
                                        Your activity
                                    </h2>
                                </div>

                                <span className="text-[9px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                                    03 / 04
                                </span>
                            </div>

                            <div className="flex min-h-[160px] items-center justify-center">
                                <div className="text-center">
                                    <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-line)]">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                                    </span>

                                    <p className="mt-5 text-sm text-[var(--color-ink-soft)]">
                                        Your activity will appear here
                                        as your thread grows.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </LoomCard>
                </div>
            </section>

            <HomeFooter />
        </main>
    );
}

export default UserHome;