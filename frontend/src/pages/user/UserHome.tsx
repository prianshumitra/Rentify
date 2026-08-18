import { ArrowUpRight, Clock3, MapPin, Package } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

function UserHome() {
    const { user } = useAuth();

    const firstName = user?.first_name || "there";

    return (
        <main className="relative min-h-screen overflow-hidden">
            {/* ─────────────────────────────
                THREAD SYSTEM
            ───────────────────────────── */}

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
            >
                <div className="absolute left-[12%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                <div className="absolute left-[70%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                <div className="absolute left-0 top-[31%] h-px w-full bg-[var(--color-line-soft)]" />

                <div className="absolute left-[12%] top-[31%] h-1.5 w-1.5 rounded-full bg-[var(--color-ink)]" />

                <div className="absolute left-[70%] top-[31%] h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            </div>

            <section className="relative z-10 mx-auto max-w-[var(--content-width)] px-[var(--content-padding)] pb-24 pt-20">
                {/* ─────────────────────────
                    INTRO
                ───────────────────────── */}

                <div className="grid grid-cols-1 lg:grid-cols-[12%_1fr_30%]">
                    <div className="hidden border-r border-[var(--color-line-soft)] pt-2 lg:block">
                        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--color-muted)]">
                            Thread / 01
                        </p>

                        <div className="mt-8 flex items-center gap-3 text-xs text-[var(--color-muted)]">
                            <span className="h-px w-5 bg-[var(--color-muted)]" />
                            <span>Home</span>
                        </div>
                    </div>

                    <div className="px-0 lg:px-[6vw]">
                        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--color-accent)]">
                            Your space / 01
                        </p>

                        <h1 className="mt-7 max-w-3xl text-[clamp(3.5rem,7vw,7rem)] font-medium leading-[0.88] tracking-[-0.065em]">
                            Good to see
                            <br />
                            <span className="font-[var(--font-display)] italic">
                                you, {firstName}.
                            </span>
                        </h1>

                        <p className="mt-8 max-w-lg text-base leading-7 text-[var(--color-ink-soft)] sm:text-lg">
                            Find something worth taking with you.
                        </p>
                    </div>

                    {/* Status */}
                    <div className="mt-12 border-l border-[var(--color-line-soft)] pl-7 lg:mt-0">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                            Rental pulse
                        </p>

                        <div className="mt-5 flex items-center gap-3">
                            <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />

                            <span className="text-sm text-[var(--color-ink-soft)]">
                                Everything is quiet.
                            </span>
                        </div>

                        <p className="mt-4 max-w-[220px] text-xs leading-5 text-[var(--color-muted)]">
                            No active rentals need your attention right now.
                        </p>
                    </div>
                </div>

                {/* ─────────────────────────
                    DISCOVERY
                ───────────────────────── */}

                <div className="mt-28">
                    <div className="flex items-end justify-between border-b border-[var(--color-line)] pb-4">
                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--color-muted)]">
                                Discover / 02
                            </p>

                            <h2 className="mt-3 text-2xl font-medium tracking-[-0.035em]">
                                Things worth renting.
                            </h2>
                        </div>

                        <button
                            type="button"
                            className="group hidden items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)] sm:flex"
                        >
                            Explore all
                            <ArrowUpRight
                                size={13}
                                strokeWidth={1.5}
                                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 divide-y divide-[var(--color-line-soft)] md:grid-cols-3 md:divide-x md:divide-y-0">
                        <RentalPlaceholder
                            index="01"
                            title="Camera systems"
                            description="Capture something worth remembering."
                            meta="Photography"
                        />

                        <RentalPlaceholder
                            index="02"
                            title="Travel gear"
                            description="Pack less. Experience more."
                            meta="Travel"
                        />

                        <RentalPlaceholder
                            index="03"
                            title="Everyday equipment"
                            description="Use what you need, when you need it."
                            meta="Lifestyle"
                        />
                    </div>
                </div>

                {/* ─────────────────────────
                    CURRENT THREAD
                ───────────────────────── */}

                <div className="mt-28">
                    <div className="grid grid-cols-1 lg:grid-cols-[30%_1fr]">
                        <div className="border-r border-[var(--color-line-soft)] pr-8">
                            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--color-muted)]">
                                Current thread / 03
                            </p>

                            <p className="mt-5 max-w-xs text-sm leading-6 text-[var(--color-ink-soft)]">
                                Your rentals, returns and saved items will appear here as they become part of your thread.
                            </p>
                        </div>

                        <div className="space-y-5 pt-8 lg:pl-10 lg:pt-0">
                            <ThreadRow
                                icon={Package}
                                label="Active rentals"
                                value="Nothing active"
                            />

                            <ThreadRow
                                icon={Clock3}
                                label="Upcoming returns"
                                value="Nothing scheduled"
                            />

                            <ThreadRow
                                icon={MapPin}
                                label="Saved locations"
                                value="No saved locations"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

interface RentalPlaceholderProps {
    index: string;
    title: string;
    description: string;
    meta: string;
}

function RentalPlaceholder({
    index,
    title,
    description,
    meta,
}: RentalPlaceholderProps) {
    return (
        <button
            type="button"
            className="group relative min-h-[260px] p-7 text-left transition-colors duration-300 hover:bg-[var(--color-accent-soft)] lg:p-10"
        >
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]">
                    {index}
                </span>

                <ArrowUpRight
                    size={15}
                    strokeWidth={1.5}
                    className="text-[var(--color-muted)] transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[var(--color-accent)]"
                />
            </div>

            <div className="mt-20">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
                    {meta}
                </p>

                <h3 className="mt-3 text-xl font-medium tracking-[-0.035em]">
                    {title}
                </h3>

                <p className="mt-3 max-w-xs text-sm leading-6 text-[var(--color-ink-soft)]">
                    {description}
                </p>
            </div>
        </button>
    );
}

interface ThreadRowProps {
    icon: typeof Package;
    label: string;
    value: string;
}

function ThreadRow({
    icon: Icon,
    label,
    value,
}: ThreadRowProps) {
    return (
        <div className="flex items-center justify-between border-b border-[var(--color-line-soft)] pb-5">
            <div className="flex items-center gap-4">
                <Icon
                    size={17}
                    strokeWidth={1.5}
                    className="text-[var(--color-muted)]"
                />

                <span className="text-xs font-medium uppercase tracking-[0.14em]">
                    {label}
                </span>
            </div>

            <span className="text-xs text-[var(--color-muted)]">
                {value}
            </span>
        </div>
    );
}

export default UserHome;