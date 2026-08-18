import { useEffect, useState } from "react";
import logo from "../../assets/logo.jpg";

import {
    ArrowDown,
    ArrowUpRight,
    Camera,
    Headphones,
    Projector,
} from "lucide-react";

import { Link } from "react-router-dom";

interface Point {
    x: number;
    y: number;
}

/* ═══════════════════════════════════════════════════════════════
   SPLASH SCREEN
═══════════════════════════════════════════════════════════════ */

function SplashScreen({
    onComplete,
}: {
    onComplete: () => void;
}) {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const timers = [
            window.setTimeout(() => setPhase(1), 250),
            window.setTimeout(() => setPhase(2), 750),
            window.setTimeout(() => setPhase(3), 1250),
            window.setTimeout(() => setPhase(4), 1800),
            window.setTimeout(() => onComplete(), 2450),
        ];

        return () => {
            timers.forEach((timer) =>
                window.clearTimeout(timer),
            );
        };
    }, [onComplete]);

    return (
        <main className="fixed inset-0 z-[999] overflow-hidden bg-[var(--color-ivory)]">
            <div className="pointer-events-none absolute inset-0">
                {Array.from({ length: 10 }).map(
                    (_, index) => (
                        <span
                            key={`horizontal-${index}`}
                            className="absolute left-0 h-px w-full origin-left bg-[var(--color-line)] transition-transform duration-[1500ms] ease-[cubic-bezier(.22,1,.36,1)]"
                            style={{
                                top: `${10 + index * 9}%`,
                                transform:
                                    phase >= 1
                                        ? "scaleX(1)"
                                        : "scaleX(0)",
                                opacity: 0.1,
                            }}
                        />
                    ),
                )}

                {Array.from({ length: 10 }).map(
                    (_, index) => (
                        <span
                            key={`vertical-${index}`}
                            className="absolute top-0 h-full w-px origin-top bg-[var(--color-line)] transition-transform duration-[1500ms] ease-[cubic-bezier(.22,1,.36,1)]"
                            style={{
                                left: `${10 + index * 9}%`,
                                transform:
                                    phase >= 2
                                        ? "scaleY(1)"
                                        : "scaleY(0)",
                                opacity: 0.1,
                            }}
                        />
                    ),
                )}

                <span
                    className="absolute left-0 top-1/2 h-px w-full origin-left bg-[var(--color-accent)] transition-transform duration-[1800ms]"
                    style={{
                        transform:
                            phase >= 2
                                ? "scaleX(1)"
                                : "scaleX(0)",
                    }}
                />
            </div>

            <div
                className="absolute left-1/2 top-1/2 flex h-48 w-48 -translate-x-1/2 -translate-y-1/2 items-center justify-center transition-all duration-[1100ms]"
                style={{
                    transform:
                        phase >= 3
                            ? "translate(-50%,-50%) rotate(0deg) scale(1)"
                            : "translate(-50%,-50%) rotate(45deg) scale(.2)",
                    opacity: phase >= 2 ? 1 : 0,
                }}
            >
                <div className="absolute inset-0 border border-[var(--color-ink)]" />

                <div className="absolute inset-8 border border-[var(--color-accent)]" />

                <div className="absolute inset-16 border border-[var(--color-ink)]" />

                <div className="h-4 w-4 rounded-full bg-[var(--color-accent)] shadow-[0_0_35px_rgba(190,85,55,.55)]" />
            </div>

            <div
                className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center transition-all duration-1000"
                style={{
                    opacity: phase >= 3 ? 1 : 0,
                    transform:
                        phase >= 3
                            ? "translate(-50%,-50%) scale(1)"
                            : "translate(-50%,-50%) scale(.8)",
                }}
            >
                <h1 className="text-3xl font-medium tracking-[.38em]">
                    RENTIFY
                </h1>

                <p className="mt-4 text-[8px] uppercase tracking-[.4em] text-[var(--color-muted)]">
                    Find your thread
                </p>
            </div>

            <p
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[8px] uppercase tracking-[.3em] text-[var(--color-muted)] transition-opacity duration-500"
                style={{
                    opacity: phase >= 4 ? 0 : 1,
                }}
            >
                Weaving your experience
            </p>
        </main>
    );
}

/* ═══════════════════════════════════════════════════════════════
   RENTAL OBJECT
═══════════════════════════════════════════════════════════════ */

function RentalObject({
    mouse,
}: {
    mouse: Point;
}) {
    return (
        <div
            className="relative h-[430px] w-[330px] transition-transform duration-700 ease-out sm:h-[500px] sm:w-[390px]"
            style={{
                transform: `
                    perspective(1200px)
                    rotateX(${mouse.y * -5}deg)
                    rotateY(${mouse.x * 8}deg)
                `,
            }}
        >
            {/* Back shadow */}

            <div className="absolute inset-5 translate-x-6 translate-y-8 rounded-[3rem] border border-black/10 bg-black/10 blur-[1px]" />

            {/* Physical depth */}

            <div className="absolute inset-3 translate-x-3 translate-y-4 rounded-[3rem] border border-white/70 bg-[var(--color-ivory-soft)] shadow-[15px_25px_60px_rgba(23,23,23,.12)]" />

            {/* Main glass card */}

            <div className="absolute inset-0 overflow-hidden rounded-[3rem] border border-white/80 bg-[rgba(250,248,242,.58)] shadow-[0_40px_100px_rgba(23,23,23,.18),inset_0_1px_0_rgba(255,255,255,.95)] backdrop-blur-2xl">

                {/* Reflection */}

                <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-transparent to-transparent" />

                {/* Threads */}

                <div className="absolute left-[25%] top-0 h-full w-px bg-[var(--color-ink)]/10" />

                <div className="absolute right-[20%] top-0 h-full w-px bg-[var(--color-accent)]/20" />

                <div className="absolute left-0 top-[30%] h-px w-full bg-[var(--color-ink)]/10" />

                {/* Top */}

                <div className="absolute left-8 right-8 top-8 flex items-center justify-between">
                    <div>
                        <p className="text-[8px] uppercase tracking-[.28em] text-[var(--color-muted)]">
                            Featured thread
                        </p>

                        <p className="mt-2 text-xs font-medium">
                            SONY / A7
                        </p>
                    </div>

                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-line)] bg-white/40">
                        <Camera
                            size={15}
                            strokeWidth={1.4}
                        />
                    </span>
                </div>

                {/* Camera */}

                <div
                    className="absolute left-1/2 top-[52%] h-40 w-52 -translate-x-1/2 -translate-y-1/2 rounded-[2rem] bg-[var(--color-ink)] shadow-[20px_30px_55px_rgba(23,23,23,.28)] transition-transform duration-700"
                    style={{
                        transform: `
                            translate(-50%,-50%)
                            rotateX(${mouse.y * -3}deg)
                            rotateY(${mouse.x * 5}deg)
                        `,
                    }}
                >
                    <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-[6px] border-white/10 bg-black shadow-[inset_0_0_30px_rgba(255,255,255,.08),0_15px_30px_rgba(0,0,0,.4)]">
                        <div className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)] opacity-70 blur-[1px]" />
                    </div>

                    <div className="absolute left-5 top-5 h-2 w-7 rounded-full bg-white/20" />

                    <div className="absolute right-5 top-5 h-3 w-3 rounded-full bg-[var(--color-accent)] shadow-[0_0_15px_rgba(190,85,55,.7)]" />
                </div>

                {/* Bottom */}

                <div className="absolute bottom-8 left-8 right-8">
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-3xl font-medium tracking-[-.06em]">
                                Camera
                            </p>

                            <p className="mt-1 font-[var(--font-display)] text-lg italic text-[var(--color-muted)]">
                                Capture the moment.
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-[8px] uppercase tracking-[.2em] text-[var(--color-muted)]">
                                From
                            </p>

                            <p className="mt-1 text-sm font-medium">
                                ₹499/day
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Availability */}

            <div className="absolute -right-10 top-20 hidden w-36 rounded-2xl border border-white/80 bg-white/65 p-4 shadow-[0_20px_45px_rgba(23,23,23,.12)] backdrop-blur-xl sm:block">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[var(--color-accent)] shadow-[0_0_12px_rgba(190,85,55,.6)]" />

                    <span className="text-[8px] uppercase tracking-[.18em] text-[var(--color-muted)]">
                        Available
                    </span>
                </div>

                <p className="mt-3 text-xs font-medium">
                    Ready for your thread
                </p>
            </div>

            {/* Counter */}

            <div className="absolute -bottom-5 -left-10 hidden h-20 w-20 items-center justify-center rounded-full border border-[var(--color-line)] bg-[var(--color-ivory)] shadow-[0_15px_35px_rgba(23,23,23,.1)] sm:flex">
                <span className="text-[9px] uppercase tracking-[.15em]">
                    01 / 05
                </span>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   CATEGORY CHIP
═══════════════════════════════════════════════════════════════ */

function CategoryChip({
    icon: Icon,
    title,
    active,
}: {
    icon: typeof Camera;
    title: string;
    active?: boolean;
}) {
    return (
        <button
            className={`group flex items-center gap-3 rounded-full border px-4 py-3 text-left transition-all duration-500 ${
                active
                    ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-ivory)] shadow-[0_15px_30px_rgba(23,23,23,.12)]"
                    : "border-[var(--color-line)] bg-white/40 text-[var(--color-muted)] hover:-translate-y-1 hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
            }`}
        >
            <Icon
                size={14}
                strokeWidth={1.4}
                className="transition-transform duration-500 group-hover:scale-110"
            />

            <span className="text-[8px] uppercase tracking-[.18em]">
                {title}
            </span>
        </button>
    );
}

/* ═══════════════════════════════════════════════════════════════
   LANDING PAGE
═══════════════════════════════════════════════════════════════ */

function LandingPage() {
    const [mouse, setMouse] = useState<Point>({
        x: 0,
        y: 0,
    });

    useEffect(() => {
        const handleMouseMove = (
            event: globalThis.MouseEvent,
        ) => {
            setMouse({
                x:
                    (event.clientX /
                        window.innerWidth -
                        0.5) *
                    2,

                y:
                    (event.clientY /
                        window.innerHeight -
                        0.5) *
                    2,
            });
        };

        window.addEventListener(
            "mousemove",
            handleMouseMove,
        );

        return () => {
            window.removeEventListener(
                "mousemove",
                handleMouseMove,
            );
        };
    }, []);

    return (
        <main className="min-h-screen overflow-x-hidden bg-[var(--color-ivory)] text-[var(--color-ink)]">

            {/* ═══════════════════════════════════════════════
                HEADER
            ═══════════════════════════════════════════════ */}

            <header className="relative z-50 flex items-center justify-between border-b border-white/10 bg-[var(--color-ink)] px-6 py-6 text-[var(--color-ivory)] sm:px-10 lg:px-14">

                <Link
                    to="/"
                    className="group flex items-center gap-3"
                >
                    <img src={logo} alt="Rentify Logo" className="h-8 w-auto transition-transform duration-300 group-hover:scale-105" />

                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[.25em]">
                            Rentify
                        </p>

                        <p className="mt-1 text-[7px] uppercase tracking-[.22em] text-white/45">
                            Rent / Reuse / Return
                        </p>
                    </div>
                </Link>

                <div className="flex items-center gap-5 sm:gap-8">

                    <span className="hidden text-[8px] uppercase tracking-[.25em] text-white/45 md:block">
                        01 — 05
                    </span>

                    <Link
                        to="/login"
                        className="text-[9px] uppercase tracking-[.2em] text-white/60 transition-colors hover:text-white"
                    >
                        Sign in
                    </Link>

                    <Link
                        to="/register"
                        className="group flex items-center gap-2 text-[9px] font-medium uppercase tracking-[.2em] text-white"
                    >
                        Create account

                        <ArrowUpRight
                            size={14}
                            strokeWidth={1.4}
                            className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                        />
                    </Link>

                </div>
            </header>

            {/* ═══════════════════════════════════════════════
                HERO
            ═══════════════════════════════════════════════ */}

            <section className="relative min-h-[calc(100vh-88px)] overflow-hidden">

                {/* Loom grid */}

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                >
                    <div className="absolute left-[12%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                    <div className="absolute left-1/2 top-0 h-full w-px bg-[var(--color-line-soft)]" />

                    <div className="absolute right-[12%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                    <div className="absolute left-0 top-1/2 h-px w-full bg-[var(--color-line-soft)]" />

                    <div
                        className="absolute left-[12%] top-1/2 h-1.5 w-1.5 rounded-full bg-[var(--color-ink)] transition-transform duration-500"
                        style={{
                            transform: `translate(
                                ${mouse.x * 5}px,
                                ${mouse.y * 5}px
                            )`,
                        }}
                    />

                    <div
                        className="absolute right-[12%] top-1/2 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] transition-transform duration-500"
                        style={{
                            transform: `translate(
                                ${mouse.x * -5}px,
                                ${mouse.y * -5}px
                            )`,
                        }}
                    />
                </div>

                {/* Hero content */}

                <div className="relative z-10 mx-auto grid min-h-[calc(100vh-88px)] max-w-[1450px] items-center gap-16 px-6 py-20 sm:px-10 lg:grid-cols-[1fr_.8fr] lg:px-14 lg:py-16">

                    {/* Left */}

                    <div className="relative z-20">

                        {/* Label */}

                        <div className="mb-8 flex items-center gap-4">

                            <span className="h-px w-10 bg-[var(--color-accent)]" />

                            <span className="text-[8px] uppercase tracking-[.3em] text-[var(--color-muted)]">
                                A rental ecosystem
                            </span>

                        </div>

                        {/* Heading */}

                        <h1 className="max-w-[800px] text-[clamp(4rem,8vw,8rem)] font-medium leading-[.78] tracking-[-.085em]">

                            Why own
                            <br />

                            what you
                            <br />

                            only{" "}

                            <span className="font-[var(--font-display)] italic text-[var(--color-accent)]">
                                need?
                            </span>

                        </h1>

                        {/* Description */}

                        <p className="mt-10 max-w-[390px] text-sm leading-7 text-[var(--color-ink-soft)]">
                            Things have a life beyond
                            ownership. Discover them,
                            use them, and let them move
                            to their next thread.
                        </p>

                        {/* Buttons */}

                        <div className="mt-9 flex flex-wrap gap-3">

                            {/* Find your product */}

                            <Link
                                to="/register"
                                className="group flex items-center gap-4 rounded-full bg-[#7a4a3b] px-6 py-4 text-[9px] uppercase tracking-[.2em] !text-[#f7f3ea] shadow-[0_18px_35px_rgba(122,74,59,.20)] transition-all duration-500 hover:-translate-y-1 hover:bg-[var(--color-accent)]"
                            >
                                <span className="!text-[#f7f3ea]">
                                    Find your product
                                </span>

                                <ArrowUpRight
                                    size={14}
                                    strokeWidth={1.5}
                                    className="!text-[#f7f3ea] transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"
                                />
                            </Link>

                            {/* Explore */}

                            <a
                                href="#discover"
                                className="flex items-center gap-3 rounded-full border border-[var(--color-line)] px-6 py-4 text-[9px] uppercase tracking-[.2em] text-[var(--color-ink)] transition-all duration-300 hover:border-[var(--color-ink)] hover:bg-white/40"
                            >
                                Explore

                                <ArrowDown
                                    size={13}
                                    strokeWidth={1.4}
                                />
                            </a>

                        </div>

                        {/* Categories */}

                        <div className="mt-12 flex flex-wrap gap-2">

                            <CategoryChip
                                icon={Camera}
                                title="Camera"
                                active
                            />

                            <CategoryChip
                                icon={Projector}
                                title="Projector"
                            />

                            <CategoryChip
                                icon={Headphones}
                                title="Audio"
                            />

                        </div>

                    </div>

                    {/* Right */}

                    <div className="relative flex items-center justify-center lg:justify-end">

                        <RentalObject
                            mouse={mouse}
                        />

                        <div className="pointer-events-none absolute right-[10%] top-1/2 -z-10 h-[350px] w-[350px] -translate-y-1/2 rounded-full bg-[var(--color-accent)]/10 blur-[100px]" />

                    </div>

                </div>
            </section>

            {/* ═══════════════════════════════════════════════
                FOOTER
            ═══════════════════════════════════════════════ */}

            <footer className="border-t border-white/10 bg-[var(--color-ink)] text-[var(--color-ivory)]">
                <div className="mx-auto max-w-[1450px] px-6 py-12 sm:px-10 lg:px-14">
                    <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <img src={logo} alt="Rentify Logo" className="h-6 w-auto" />
                                <span className="text-sm font-semibold tracking-[0.02em]">RENTIFY</span>
                            </div>
                            <p className="mt-4 max-w-xs text-[10px] leading-5 text-white/45 uppercase tracking-wider">
                                A rental ecosystem designed for the modern world.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-x-10 gap-y-4">
                            <Link to="/login" className="text-[9px] uppercase tracking-[.2em] text-white/50 transition-colors hover:text-white">Explore</Link>
                            <Link to="/register" className="text-[9px] uppercase tracking-[.2em] text-white/50 transition-colors hover:text-white">Join</Link>
                            <a href="#" className="text-[9px] uppercase tracking-[.2em] text-white/50 transition-colors hover:text-white">Terms</a>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-[8px] uppercase tracking-[.3em] text-white/30">
                            The Loom / Rentify
                        </span>
                        <span className="text-[8px] uppercase tracking-[.2em] text-white/30">
                            © 2026 Rentify
                        </span>
                    </div>
                </div>
            </footer>
        </main>
    );
}

/* ═══════════════════════════════════════════════════════════════
   LOOM ENTRY
═══════════════════════════════════════════════════════════════ */

function Loom() {
    const [showLanding, setShowLanding] =
        useState(false);

    useEffect(() => {
        const splashSeen =
            sessionStorage.getItem(
                "rentify_splash_seen",
            );

        if (splashSeen) {
            setShowLanding(true);
        }
    }, []);

    if (!showLanding) {
        return (
            <SplashScreen
                onComplete={() => {
                    sessionStorage.setItem(
                        "rentify_splash_seen",
                        "true",
                    );

                    setShowLanding(true);
                }}
            />
        );
    }

    return <LandingPage />;
}

export default Loom;