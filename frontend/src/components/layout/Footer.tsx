import logo from "../../assets/logo.jpg";

function Footer() {
    return (
        <footer className="border-t border-white/10 bg-[var(--color-ink)] text-[var(--color-ivory)]">
            <div className="mx-auto max-w-[var(--content-width)] px-[var(--content-padding)]">
                <div className="flex flex-col gap-8 py-10 sm:flex-row sm:items-end sm:justify-between">

                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3">
                            <img src={logo} alt="Rentify Logo" className="h-6 w-auto" />

                            <span className="text-sm font-semibold tracking-[0.02em]">
                                RENTIFY
                            </span>
                        </div>

                        <p className="mt-4 max-w-xs text-xs leading-5 text-white/45">
                            A rental experience designed around what you need,
                            when you need it.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap gap-x-8 gap-y-3">
                        <a
                            href="/"
                            className="text-[10px] uppercase tracking-[0.18em] text-white/50 transition-colors hover:text-white"
                        >
                            Explore
                        </a>

                        <a
                            href="/rentals"
                            className="text-[10px] uppercase tracking-[0.18em] text-white/50 transition-colors hover:text-white"
                        >
                            Rentals
                        </a>

                        <a
                            href="/login"
                            className="text-[10px] uppercase tracking-[0.18em] text-white/50 transition-colors hover:text-white"
                        >
                            Account
                        </a>
                    </div>
                </div>

                {/* Bottom line */}
                <div className="flex flex-col gap-3 border-t border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-white/30">
                        The Loom / Rentify
                    </span>

                    <span className="text-[9px] uppercase tracking-[0.16em] text-white/30">
                        © 2026 Rentify
                    </span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;