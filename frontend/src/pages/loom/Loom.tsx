import { ArrowUp, Menu, Plus } from "lucide-react";
import { useState } from "react";

function Loom() {
    const [message, setMessage] = useState("");

    return (
        <main className="relative min-h-screen overflow-hidden bg-[var(--color-ivory)] text-[var(--color-ink)]">
            {/* Subtle underlying thread system */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
            >
                <div className="absolute left-[14%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                <div className="absolute right-[19%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                <div className="absolute left-0 top-[28%] h-px w-full bg-[var(--color-line-soft)]" />

                <div className="absolute left-[14%] top-[28%] h-1.5 w-1.5 rounded-full bg-[var(--color-ink)]" />

                <div className="absolute right-[19%] top-[28%] h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            </div>

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-[var(--content-padding)] py-7">
                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />

                    <span className="text-sm font-semibold tracking-[-0.01em]">
                        RENTIFY
                    </span>
                </div>

                <div className="flex items-center gap-8">
                    <span className="hidden text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--color-muted)] sm:block">
                        The Loom
                    </span>

                    <button
                        type="button"
                        aria-label="Open menu"
                        className="flex h-9 w-9 items-center justify-center transition-transform duration-200 hover:scale-105"
                    >
                        <Menu size={18} strokeWidth={1.5} />
                    </button>
                </div>
            </header>

            {/* Main editorial composition */}
            <section className="relative z-10 mx-auto flex min-h-[calc(100vh-88px)] max-w-[var(--content-width)] flex-col px-[var(--content-padding)]">
                <div className="grid flex-1 grid-cols-1 lg:grid-cols-[14%_1fr_19%]">
                    {/* Index */}
                    <div className="hidden border-r border-[var(--color-line-soft)] pt-16 lg:block">
                        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--color-muted)]">
                            Thread / 01
                        </p>

                        <div className="mt-8 flex items-center gap-3 text-xs text-[var(--color-muted)]">
                            <span className="h-px w-5 bg-[var(--color-muted)]" />
                            <span>Beginning</span>
                        </div>
                    </div>

                    {/* Hero */}
                    <div className="flex flex-col justify-center px-0 py-20 lg:px-[7vw]">
                        <p className="mb-8 text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--color-accent)]">
                            Intelligence / 01
                        </p>

                        <h1 className="max-w-4xl text-[clamp(3.75rem,9vw,8rem)] font-medium leading-[0.88] tracking-[-0.065em]">
                            Think
                            <br />
                            <span className="font-[var(--font-display)] font-medium italic">
                                differently.
                            </span>
                        </h1>

                        <p className="mt-10 max-w-md text-base leading-7 text-[var(--color-ink-soft)] sm:text-lg">
                            Weave ideas, information and context into something meaningful.
                        </p>

                        {/* Input */}
                        <form
                            className="mt-16 max-w-2xl"
                            onSubmit={(event) => {
                                event.preventDefault();
                            }}
                        >
                            <div className="group relative border-b border-[var(--color-ink)] pb-3 transition-colors duration-300 focus-within:border-[var(--color-accent)]">
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]">
                                        Start a thread
                                    </span>

                                    <span className="text-[10px] text-[var(--color-muted)]">
                                        {message.length > 0 ? `${message.length}` : "01"}
                                    </span>
                                </div>

                                <div className="flex items-end gap-4">
                                    <textarea
                                        value={message}
                                        onChange={(event) =>
                                            setMessage(event.target.value)
                                        }
                                        rows={1}
                                        placeholder="Bring a thought..."
                                        aria-label="Start a conversation"
                                        className="min-h-12 flex-1 resize-none bg-transparent text-lg leading-7 outline-none placeholder:text-[var(--color-muted)]"
                                    />

                                    <button
                                        type="submit"
                                        aria-label="Send message"
                                        disabled={!message.trim()}
                                        className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink)] text-[var(--color-ivory)] transition-all duration-200 hover:bg-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                        <ArrowUp size={16} strokeWidth={1.8} />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <button
                                    type="button"
                                    className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
                                >
                                    <Plus size={13} strokeWidth={1.5} />
                                    Add context
                                </button>

                                <span className="text-[10px] text-[var(--color-muted)]">
                                    Enter to weave
                                </span>
                            </div>
                        </form>
                    </div>

                    {/* Right thread column */}
                    <div className="hidden border-l border-[var(--color-line-soft)] lg:block">
                        <div className="flex h-full flex-col justify-end pb-16 pl-8">
                            <div className="space-y-5">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                                        Connected
                                    </p>

                                    <p className="mt-2 max-w-[150px] text-sm leading-6 text-[var(--color-ink-soft)]">
                                        Ideas become clearer when they connect.
                                    </p>
                                </div>

                                <div className="h-px w-12 bg-[var(--color-accent)]" />

                                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                                    Ready / 01
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Loom;