import { ArrowUp } from "lucide-react";

import AppLayout from "../../components/layout/AppLayout";
import LoginForm from "../../components/auth/LoginForm";

function Login() {
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

                    <div className="absolute left-0 top-[32%] h-px w-full bg-[var(--color-line-soft)]" />

                    <div className="absolute left-[14%] top-[32%] h-1.5 w-1.5 rounded-full bg-[var(--color-ink)]" />

                    <div className="absolute right-[20%] top-[32%] h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                </div>

                <div className="relative z-10 mx-auto flex min-h-[calc(100vh-9rem)] max-w-[var(--content-width)] items-center justify-center px-[var(--content-padding)] py-16">
                    {/* Editorial label */}
                    <div className="absolute left-[var(--content-padding)] top-16 hidden lg:block">
                        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--color-muted)]">
                            Thread / 02
                        </p>

                        <div className="mt-8 flex items-center gap-3 text-xs text-[var(--color-muted)]">
                            <span className="h-px w-5 bg-[var(--color-muted)]" />
                            <span>Return</span>
                        </div>
                    </div>

                    {/* Login composition */}
                    <div className="flex w-full max-w-md flex-col items-center">
                        <div className="mb-8 text-center">
                            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--color-accent)]">
                                Continue / 02
                            </p>

                            <h1 className="text-5xl font-medium leading-[0.92] tracking-[-0.055em] sm:text-6xl">
                                Welcome
                                <br />
                                <span className="font-[var(--font-display)] italic">
                                    back.
                                </span>
                            </h1>

                            <p className="mx-auto mt-5 max-w-xs text-sm leading-6 text-[var(--color-ink-soft)]">
                                Continue where you left off with Rentify.
                            </p>
                        </div>

                        {/* 3D Card */}
                        <div className="relative w-full">
                            {/* Back layer — creates physical depth */}
                            <div
                                aria-hidden="true"
                                className="absolute inset-0 translate-x-2 translate-y-2 rounded-[2rem] border border-[var(--color-line-soft)] bg-[var(--color-ivory-soft)]"
                            />

                            {/* Card */}
                            <div className="relative rounded-[2rem] border border-[var(--color-line)] bg-[var(--color-ivory-soft)] p-7 shadow-[0_18px_45px_rgba(23,23,23,0.08)] sm:p-9">
                                <div className="mb-8 flex items-center justify-between">
                                    <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]">
                                        Rentify
                                    </span>

                                    <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                                        Secure
                                    </span>
                                </div>

                                <LoginForm />

                                <div className="mt-8 flex items-center justify-center">
                                    <a
                                        href="/register"
                                        className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
                                    >
                                        Create an account
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                            <span className="h-px w-8 bg-[var(--color-line)]" />
                            <span>Enter to continue</span>
                            <ArrowUp
                                size={11}
                                strokeWidth={1.5}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}

export default Login;