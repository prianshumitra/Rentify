function HomeFooter() {
    return (
        <footer className="relative bg-[var(--color-ink)] text-[var(--color-ivory)]">
            <div className="mx-auto max-w-[var(--content-width)] px-[var(--content-padding)] py-14">
                <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1fr_auto] lg:items-end">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />

                            <span className="text-sm font-semibold tracking-[-0.01em]">
                                RENTIFY
                            </span>
                        </div>

                        <p className="mt-5 max-w-sm text-sm leading-6 text-[rgba(245,241,232,0.55)]">
                            Rent less permanently.
                            <br />
                            Experience more temporarily.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap gap-x-8 gap-y-4 text-[10px] font-medium uppercase tracking-[0.18em] text-[rgba(245,241,232,0.55)]">
                        <button
                            type="button"
                            className="transition-colors hover:text-[var(--color-accent)]"
                        >
                            About
                        </button>

                        <button
                            type="button"
                            className="transition-colors hover:text-[var(--color-accent)]"
                        >
                            Support
                        </button>

                        <button
                            type="button"
                            className="transition-colors hover:text-[var(--color-accent)]"
                        >
                            Terms
                        </button>

                        <button
                            type="button"
                            className="transition-colors hover:text-[var(--color-accent)]"
                        >
                            Privacy
                        </button>
                    </div>
                </div>

                {/* Bottom line */}
                <div className="mt-12 flex flex-col gap-4 border-t border-[rgba(245,241,232,0.12)] pt-6 text-[9px] uppercase tracking-[0.18em] text-[rgba(245,241,232,0.4)] sm:flex-row sm:items-center sm:justify-between">
                    <span>
                        Thread / Rentify
                    </span>

                    <div className="flex items-center gap-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />

                        <span>
                            © {new Date().getFullYear()} Rentify
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default HomeFooter;