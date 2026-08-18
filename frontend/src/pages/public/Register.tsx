import RegisterForm from "../../components/auth/RegisterForm";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

function Register() {
    return (
        <>
            <Header />

            <main className="relative min-h-screen overflow-hidden bg-[var(--color-ivory)]">
                {/* ═══════════════════════════════
                    BACKGROUND THREAD SYSTEM
                ═══════════════════════════════ */}

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                >
                    <div className="absolute left-[14%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                    <div className="absolute right-[20%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                    <div className="absolute left-0 top-[28%] h-px w-full bg-[var(--color-line-soft)]" />

                    <div className="absolute left-[14%] top-[28%] h-1.5 w-1.5 rounded-full bg-[var(--color-ink)]" />

                    <div className="absolute right-[20%] top-[28%] h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                </div>

                {/* ═══════════════════════════════
                    CONTENT
                ═══════════════════════════════ */}

                <div className="relative z-10 mx-auto flex min-h-screen max-w-[var(--content-width)] items-center justify-center px-[var(--content-padding)] py-16">
                    <div className="w-full max-w-xl">
                        {/* ═══════════════════════════════
                            HEADING
                        ═══════════════════════════════ */}

                        <div className="mb-8 text-center">
                            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--color-accent)]">
                                Begin / 01
                            </p>

                            <h1 className="text-5xl font-medium leading-[0.92] tracking-[-0.055em] sm:text-6xl">
                                Join
                                <br />

                                <span className="font-[var(--font-display)] italic">
                                    Rentify.
                                </span>
                            </h1>

                            <p className="mx-auto mt-5 max-w-sm text-sm leading-6 text-[var(--color-ink-soft)]">
                                Create your account and start your rental
                                journey.
                            </p>
                        </div>

                        {/* ═══════════════════════════════
                            LOOM AUTH CARD
                        ═══════════════════════════════ */}

                        <div className="relative">
                            {/* Physical depth */}

                            <div
                                aria-hidden="true"
                                className="absolute inset-0 translate-x-2 translate-y-2 rounded-[2rem] border border-[var(--color-line-soft)] bg-[var(--color-ivory-soft)]"
                            />

                            {/* Glass card */}

                            <div className="relative rounded-[2rem] border border-white/70 bg-[rgba(250,248,242,0.72)] p-7 shadow-[0_10px_25px_rgba(23,23,23,0.06),0_25px_55px_rgba(23,23,23,0.1),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-xl sm:p-9">
                                {/* Glass reflection */}

                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-[1px] rounded-[2rem] bg-gradient-to-br from-white/40 via-transparent to-transparent"
                                />

                                <div className="relative">
                                    {/* Card header */}

                                    <div className="mb-8 flex items-center justify-between">
                                        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]">
                                            New thread
                                        </span>

                                        <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />

                                            Create
                                        </span>
                                    </div>

                                    <RegisterForm />

                                    {/* Login link */}

                                    <div className="mt-8 text-center">
                                        <a
                                            href="/login"
                                            className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
                                        >
                                            Already have an account? Sign in
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom marker */}

                        <div className="mt-8 flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                            <span className="h-px w-8 bg-[var(--color-line)]" />

                            <span>Begin your thread</span>

                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}

export default Register;