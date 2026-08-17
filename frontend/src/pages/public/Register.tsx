import AppLayout from "../../components/layout/AppLayout";
import RegisterForm from "../../components/auth/RegisterForm";

function Register() {
    return (
        <AppLayout>
            <section className="relative min-h-[calc(100vh-9rem)] overflow-hidden">
                {/* Background thread system */}
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

                <div className="relative z-10 mx-auto flex min-h-[calc(100vh-9rem)] max-w-[var(--content-width)] items-center justify-center px-[var(--content-padding)] py-16">
                    <div className="w-full max-w-xl">
                        {/* Heading */}
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
                                Create your account and start your rental journey.
                            </p>
                        </div>

                        {/* 3D card */}
                        <div className="relative">
                            {/* Depth layer */}
                            <div
                                aria-hidden="true"
                                className="absolute inset-0 translate-x-2 translate-y-2 rounded-[2rem] border border-[var(--color-line-soft)] bg-[var(--color-ivory-soft)]"
                            />

                            {/* Main card */}
                            <div className="relative rounded-[2rem] border border-[var(--color-line)] bg-[var(--color-ivory-soft)] p-7 shadow-[0_18px_45px_rgba(23,23,23,0.08)] sm:p-9">
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
                </div>
            </section>
        </AppLayout>
    );
}

export default Register;