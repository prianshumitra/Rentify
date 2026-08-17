import { useState, type FormEvent } from "react";
import { ArrowUp } from "lucide-react";

import { login } from "../../api/auth.api";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");
        setIsLoading(true);

        try {
            const response = await login(email, password);

            localStorage.setItem("access_token", response.access_token);

            console.log("Login successful");
        } catch (err) {
            console.error(err);
            setError("Unable to sign in. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full">
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
                        onChange={(event) => setEmail(event.target.value)}
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
                        onChange={(event) => setPassword(event.target.value)}
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