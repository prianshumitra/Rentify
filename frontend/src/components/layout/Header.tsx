import { Menu } from "lucide-react";
import logo from "../../assets/logo.jpg";

function Header() {
    return (
        <header className="relative z-50 border-b border-black/10 bg-[var(--color-ink)] text-[var(--color-ivory)]">
            <div className="mx-auto flex h-[76px] max-w-[var(--content-width)] items-center justify-between px-[var(--content-padding)]">

                {/* Brand */}
                <a
                    href="/"
                    aria-label="Rentify home"
                    className="group flex items-center gap-3"
                >
                    <img src={logo} alt="Rentify Logo" className="h-8 w-auto transition-transform duration-300 group-hover:scale-105" />

                    <span className="text-sm font-semibold tracking-[0.02em]">
                        RENTIFY
                    </span>
                </a>

                {/* Navigation */}
                <nav className="hidden items-center gap-10 md:flex">
                    <a
                        href="/"
                        className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/60 transition-colors duration-200 hover:text-white"
                    >
                        Explore
                    </a>

                    <a
                        href="/rentals"
                        className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/60 transition-colors duration-200 hover:text-white"
                    >
                        Rentals
                    </a>

                    <a
                        href="/login"
                        className="group flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.2em]"
                    >
                        <span className="text-white/60 transition-colors group-hover:text-white">
                            Sign in
                        </span>

                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] transition-transform duration-200 group-hover:scale-125" />
                    </a>
                </nav>

                {/* Mobile menu */}
                <button
                    type="button"
                    aria-label="Open navigation menu"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition-all duration-300 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] md:hidden"
                >
                    <Menu size={17} strokeWidth={1.5} />
                </button>
            </div>
        </header>
    );
}

export default Header;