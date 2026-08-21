import { useState, type FormEvent } from "react";
import { ArrowUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { register } from "../../api/auth.api";

function RegisterForm() {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [accountRole, setAccountRole] = useState<"user" | "vendor">("user");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");
        setIsLoading(true);

        const cleanEmail = email.trim().toLowerCase();

        try {
            await register({
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                email: cleanEmail,
                password,
                is_vendor: accountRole === "vendor",
                is_admin: false,
            });

            // Route to login page upon successful registration
            navigate("/login");
        } catch (err: any) {
            console.error("REGISTRATION ERROR:", err);
            console.error("STATUS:", err?.response?.status);
            console.error("DATA:", err?.response?.data);
            console.error("MESSAGE:", err?.message);

            const detail = err?.response?.data?.detail;

            if (err?.code === "ERR_NETWORK" || err?.message === "Network Error") {
                setError("Unable to connect to the backend API server. Please make sure the Python FastAPI backend is running on port 8000.");
            } else if (typeof detail === "string") {
                setError(detail);
            } else if (Array.isArray(detail)) {
                setError(
                    detail
                        .map((item) => item?.msg)
                        .filter(Boolean)
                        .join(", ") || "Invalid registration details.",
                );
            } else if (err?.message) {
                setError(err.message);
            } else {
                setError(
                    "Unable to create your account. Please try again.",
                );
            }

        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full">
            {/* Account Role Selector */}
            <div className="mb-5">
                <label className="mb-1.5 block text-[8px] font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]">
                    Register As
                </label>
                <div className="inline-flex items-center gap-0.5 rounded-lg border border-[var(--color-line)] bg-white/40 p-0.5 backdrop-blur-md">
                    {(["user", "vendor"] as const).map((roleOption) => (
                        <button
                            key={roleOption}
                            type="button"
                            onClick={() => setAccountRole(roleOption)}
                            className={`rounded-md px-2.5 py-1 text-[7px] font-bold uppercase tracking-[0.14em] transition-all duration-200 ${
                                accountRole === roleOption
                                    ? "bg-[var(--color-ink)] text-white shadow-xs"
                                    : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                            }`}
                        >
                            {roleOption === "user" ? "Customer" : roleOption}
                        </button>
                    ))}
                </div>
            </div>


            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
                <div className="group border-b border-[var(--color-line)] pb-3 transition-colors duration-300 focus-within:border-[var(--color-accent)]">
                    <label
                        htmlFor="first-name"
                        className="mb-3 block text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]"
                    >
                        First name
                    </label>

                    <input
                        id="first-name"
                        type="text"
                        value={firstName}
                        onChange={(event) =>
                            setFirstName(event.target.value)
                        }
                        autoComplete="given-name"
                        required
                        className="w-full bg-transparent text-base leading-7 outline-none placeholder:text-[var(--color-muted)]"
                        placeholder="First name"
                    />
                </div>

                <div className="group border-b border-[var(--color-line)] pb-3 transition-colors duration-300 focus-within:border-[var(--color-accent)]">
                    <label
                        htmlFor="last-name"
                        className="mb-3 block text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]"
                    >
                        Last name
                    </label>

                    <input
                        id="last-name"
                        type="text"
                        value={lastName}
                        onChange={(event) =>
                            setLastName(event.target.value)
                        }
                        autoComplete="family-name"
                        required
                        className="w-full bg-transparent text-base leading-7 outline-none placeholder:text-[var(--color-muted)]"
                        placeholder="Last name"
                    />
                </div>
            </div>

            <div className="mt-7 space-y-7">
                <div className="group border-b border-[var(--color-line)] pb-3 transition-colors duration-300 focus-within:border-[var(--color-accent)]">
                    <label
                        htmlFor="register-email"
                        className="mb-3 block text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]"
                    >
                        Email
                    </label>

                    <input
                        id="register-email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        autoComplete="email"
                        required
                        className="w-full bg-transparent text-base leading-7 outline-none placeholder:text-[var(--color-muted)]"
                        placeholder="you@example.com"
                    />
                </div>

                <div className="group border-b border-[var(--color-line)] pb-3 transition-colors duration-300 focus-within:border-[var(--color-accent)]">
                    <label
                        htmlFor="register-password"
                        className="mb-3 block text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]"
                    >
                        Password
                    </label>

                    <input
                        id="register-password"
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        autoComplete="new-password"
                        required
                        className="w-full bg-transparent text-base leading-7 outline-none placeholder:text-[var(--color-muted)]"
                        placeholder="Create a password"
                    />
                </div>
            </div>

            {error && (
                <div className="mt-6 border-l-2 border-[var(--color-accent)] pl-4">
                    <p className="text-xs leading-5 text-[var(--color-ink-soft)]">
                        {error}
                    </p>
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className="group mt-10 flex w-full items-center justify-between border-b border-[var(--color-ink)] pb-4 text-left transition-colors duration-300 hover:border-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50"
            >
                <span className="text-[10px] font-medium uppercase tracking-[0.2em]">
                    {isLoading ? "Creating..." : "Create account"}
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-ink)] text-[var(--color-ivory)] transition-all duration-300 group-hover:bg-[var(--color-accent)]">
                    <ArrowUp size={16} strokeWidth={1.8} />
                </span>
            </button>
        </form>
    );
}

export default RegisterForm;