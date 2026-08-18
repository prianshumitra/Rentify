import { useState, type FormEvent } from "react";
import { ArrowUp } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import { updateRole } from "../../api/auth.api";

function LoginForm() {
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [targetPortal, setTargetPortal] = useState<"user" | "vendor" | "admin">("user");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");
        setIsLoading(true);

        try {
            const loggedInUser = await login(email.trim(), password);

            console.log("Login successful:", loggedInUser);

            if (targetPortal === "admin") {
                await updateRole(false, true);
                window.location.href = "/admin";
            } else if (targetPortal === "vendor") {
                await updateRole(true, false);
                window.location.href = "/vendor";
            } else {
                await updateRole(false, false);
                window.location.href = "/app";
            }
        } catch (err: any) {
            console.error("Login failed:", err);
            console.error("Status:", err?.response?.status);
            console.error("Response:", err?.response?.data);

            const detail = err?.response?.data?.detail;

            if (typeof detail === "string") {
                setError(detail);
            } else if (Array.isArray(detail)) {
                setError(
                    detail
                        .map((item) => item?.msg)
                        .filter(Boolean)
                        .join(", ") || "Unable to sign in.",
                );
            } else if (err?.message) {
                setError(err.message);
            } else {
                setError(
                    "Unable to sign in. Please check your credentials.",
                );
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full">
            {/* Target Portal Selector */}
            <div className="mb-5">
                <label className="mb-1.5 block text-[8px] font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]">
                    Sign In To Portal
                </label>
                <div className="inline-flex items-center gap-0.5 rounded-lg border border-[var(--color-line)] bg-white/40 p-0.5 backdrop-blur-md">
                    {(["user", "vendor", "admin"] as const).map((portal) => (
                        <button
                            key={portal}
                            type="button"
                            onClick={() => setTargetPortal(portal)}
                            className={`rounded-md px-2.5 py-1 text-[7px] font-bold uppercase tracking-[0.14em] transition-all duration-200 ${
                                targetPortal === portal
                                    ? "bg-[var(--color-ink)] text-white shadow-xs"
                                    : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                            }`}
                        >
                            {portal === "user" ? "Customer" : portal}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-8">
                {/* Email */}
                <div className="group border-b border-[var(--color-line)] pb-3 transition-colors duration-300 focus-within:border-[var(--color-accent)]">
                    <label
                        htmlFor="email"
                        className="mb-3 block text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]"
                    >
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                        className="w-full bg-transparent text-base leading-7 text-[var(--color-ink)] outline-none placeholder:text-[var(--color-muted)]"
                    />
                </div>

                {/* Password */}
                <div className="group border-b border-[var(--color-line)] pb-3 transition-colors duration-300 focus-within:border-[var(--color-accent)]">
                    <label
                        htmlFor="password"
                        className="mb-3 block text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]"
                    >
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        required
                        className="w-full bg-transparent text-base leading-7 text-[var(--color-ink)] outline-none placeholder:text-[var(--color-muted)]"
                    />
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="mt-6 border-l-2 border-[var(--color-accent)] pl-4">
                    <p className="text-xs leading-5 text-[var(--color-ink-soft)]">
                        {error}
                    </p>
                </div>
            )}

            {/* Submit */}
            <button
                type="submit"
                disabled={isLoading}
                className="group mt-10 flex w-full items-center justify-between border-b border-[var(--color-ink)] pb-4 text-left transition-colors duration-300 hover:border-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50"
            >
                <span className="text-[10px] font-medium uppercase tracking-[0.2em]">
                    {isLoading ? "Signing in..." : "Sign in"}
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-ink)] text-[var(--color-ivory)] transition-all duration-300 group-hover:bg-[var(--color-accent)]">
                    <ArrowUp
                        size={16}
                        strokeWidth={1.8}
                        className="transition-transform duration-300 group-hover:-translate-y-0.5"
                    />
                </span>
            </button>
        </form>
    );
}

export default LoginForm;