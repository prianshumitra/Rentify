import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    ArrowUpRight,
    Compass,
    Package,
    Sparkles,
    Zap,
} from "lucide-react";

import LoomCard from "../../components/ui/LoomCard";
import HomeFooter from "../../components/layout/HomeFooter";
import { useAuth } from "../../context/AuthContext";

import { getRentals, type RentalDetail } from "../../api/rentals.api";

interface MousePosition {
    x: number;
    y: number;
}

function UserHome() {
    const { user } = useAuth();
    const [rentals, setRentals] = useState<RentalDetail[]>([]);

    const firstName = user?.first_name || "there";

    const [mouse, setMouse] =
        useState<MousePosition>({
            x: 0,
            y: 0,
        });

    useEffect(() => {
        async function fetchUserRentals() {
            try {
                const data = await getRentals();
                setRentals(data);
            } catch (err) {
                console.error("Failed to fetch user rentals:", err);
            }
        }
        fetchUserRentals();
    }, []);

    useEffect(() => {
        const handleMouseMove = (
            event: MouseEvent,
        ) => {
            const x =
                (event.clientX /
                    window.innerWidth -
                    0.5) *
                2;

            const y =
                (event.clientY /
                    window.innerHeight -
                    0.5) *
                2;

            setMouse({ x, y });
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
        <main className="relative min-h-screen overflow-hidden bg-[var(--color-ivory)]">

            {/* ═══════════════════════════════════════════
                BACKGROUND RENTAL GRID
            ═══════════════════════════════════════════ */}

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
            >
                <div className="absolute left-[8%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                <div className="absolute left-[24%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                <div className="absolute left-1/2 top-0 h-full w-px bg-[var(--color-line-soft)]" />

                <div className="absolute right-[24%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                <div className="absolute right-[8%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                <div className="absolute left-0 top-[22%] h-px w-full bg-[var(--color-line-soft)]" />

                <div className="absolute left-0 top-1/2 h-px w-full bg-[var(--color-line-soft)]" />

                <div className="absolute left-0 top-[78%] h-px w-full bg-[var(--color-line-soft)]" />

                <div
                    className="absolute left-[24%] top-[22%] h-1.5 w-1.5 rounded-full bg-[var(--color-ink)] transition-transform duration-500"
                    style={{
                        transform: `translate(
                            ${mouse.x * 10}px,
                            ${mouse.y * 10}px
                        )`,
                    }}
                />

                <div
                    className="absolute right-[24%] top-1/2 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] transition-transform duration-500"
                    style={{
                        transform: `translate(
                            ${mouse.x * -10}px,
                            ${mouse.y * -10}px
                        )`,
                    }}
                />

                <div
                    className="absolute left-1/2 top-[38%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[var(--color-accent)]/[0.055] blur-[130px]"
                    style={{
                        transform: `translate(
                            calc(-50% + ${mouse.x * 30}px),
                            ${mouse.y * 25}px
                        )`,
                    }}
                />
            </div>

            {/* ═══════════════════════════════════════════
                MAIN CONTENT
            ═══════════════════════════════════════════ */}

            <section className="relative z-10 mx-auto max-w-[var(--content-width)] px-[var(--content-padding)] pb-24 pt-20">

                {/* TOP BAR */}

                <div className="mb-8 flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        <span className="h-px w-8 bg-[var(--color-accent)]" />

                        <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-[var(--color-muted)]">
                            Rental / Home
                        </span>

                    </div>

                    <span className="hidden text-[9px] uppercase tracking-[0.24em] text-[var(--color-muted)] sm:block">
                        01 / 04
                    </span>

                </div>

                {/* ═══════════════════════════════════════
                    HERO
                ═══════════════════════════════════════ */}

                <div className="relative mx-auto max-w-6xl">

                    <LoomCard>

                        <div className="relative overflow-hidden p-8 sm:p-12 lg:p-16">

                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rotate-45 border border-[var(--color-accent)]/[0.08]"
                            />

                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rotate-45 border border-[var(--color-accent)]/[0.07]"
                            />

                            <div
                                className="absolute right-8 top-8 hidden h-16 w-16 items-center justify-center rounded-full border border-[var(--color-line)] bg-[var(--color-ivory)]/70 shadow-[0_15px_35px_rgba(23,23,23,.08)] backdrop-blur-md sm:flex"
                                style={{
                                    transform: `
                                        translate(
                                            ${mouse.x * 8}px,
                                            ${mouse.y * 8}px
                                        )
                                    `,
                                }}
                            >
                                <div className="text-center">
                                    <p className="text-[10px] font-medium">
                                        01
                                    </p>

                                    <p className="mt-1 text-[6px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                                        Home
                                    </p>
                                </div>
                            </div>

                            <div className="relative z-10 flex flex-col justify-between gap-14 lg:flex-row">

                                <div className="max-w-3xl">

                                    <div className="mb-6 flex items-center gap-3">

                                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-ivory)]">

                                            <Sparkles
                                                size={12}
                                                strokeWidth={1.5}
                                            />

                                        </span>

                                        <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-[var(--color-accent)]">
                                            Your rental space
                                        </p>

                                    </div>

                                    <h1 className="max-w-4xl text-[clamp(3.5rem,8vw,7rem)] font-medium leading-[0.84] tracking-[-0.07em]">

                                        Good to see
                                        <br />

                                        <span className="font-[var(--font-display)] italic">
                                            you, {firstName}.
                                        </span>

                                    </h1>

                                    <p className="mt-8 max-w-lg text-sm leading-7 text-[var(--color-ink-soft)] sm:text-base">
                                        Your rental world is waiting.
                                        Discover something useful,
                                        unexpected, or simply worth
                                        having for a while.
                                    </p>

                                    <div className="mt-10 flex flex-wrap gap-3">

                                        <Link
                                            to="/app/explore"
                                            className="group flex items-center gap-4 rounded-full bg-[var(--color-ink)] px-6 py-4 text-[9px] font-medium uppercase tracking-[0.2em] !text-white shadow-[0_18px_35px_rgba(23,23,23,.14)] transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--color-accent)]"
                                        >

                                            <Compass
                                                size={14}
                                                strokeWidth={1.5}
                                            />

                                            Explore rentals

                                            <ArrowUpRight
                                                size={14}
                                                strokeWidth={1.5}
                                                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                            />

                                        </Link>

                                    </div>

                                </div>

                                <div
                                    className="hidden w-44 shrink-0 self-end lg:block"
                                    style={{
                                        transform: `
                                            translate(
                                                ${mouse.x * -12}px,
                                                ${mouse.y * -12}px
                                            )
                                            rotate(${mouse.x * -2}deg)
                                        `,
                                    }}
                                >

                                    <div className="rounded-2xl border border-[var(--color-line)] bg-white/45 p-5 shadow-[0_20px_45px_rgba(23,23,23,.08)] backdrop-blur-xl">

                                        <div className="flex items-center justify-between">

                                            <span className="text-[7px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
                                                Status
                                            </span>

                                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] shadow-[0_0_10px_rgba(190,85,55,.4)]" />

                                        </div>

                                        <p className="mt-7 text-3xl font-medium tracking-[-0.05em]">
                                            Ready.
                                        </p>

                                        <p className="mt-2 text-[9px] leading-5 text-[var(--color-muted)]">
                                            Your rental journey starts
                                            here.
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </LoomCard>

                </div>

                {/* ═══════════════════════════════════════
                    QUICK DISCOVERY
                ═══════════════════════════════════════ */}

                <div className="mx-auto mt-8 grid max-w-6xl gap-6 md:grid-cols-[1.15fr_.85fr]">

                    <LoomCard>

                        <div className="min-h-[280px] p-7 sm:p-9">

                            <div className="flex items-center justify-between">

                                <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-[var(--color-muted)]">
                                    Discover
                                </span>

                                <Compass
                                    size={17}
                                    strokeWidth={1.4}
                                    className="text-[var(--color-accent)]"
                                />

                            </div>

                            <div className="mt-14">

                                <h2 className="text-4xl font-medium leading-[0.9] tracking-[-0.055em]">

                                    Find something
                                    <br />

                                    <span className="font-[var(--font-display)] italic">
                                        worth renting.
                                    </span>

                                </h2>

                                <p className="mt-5 max-w-md text-sm leading-6 text-[var(--color-muted)]">
                                    From everyday essentials to
                                    something you only need for
                                    a moment.
                                </p>

                            </div>

                            <Link
                                to="/app/explore"
                                className="group mt-8 flex w-fit items-center gap-2 text-[9px] font-medium uppercase tracking-[0.2em] text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
                            >

                                Explore collection

                                <ArrowUpRight
                                    size={13}
                                    strokeWidth={1.5}
                                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                />

                            </Link>

                        </div>

                    </LoomCard>

                    <LoomCard offset={false}>

                        <div className="relative min-h-[280px] overflow-hidden rounded-[1.75rem] bg-[var(--color-ink)] p-7 text-[var(--color-ivory)] sm:p-9">

                            <div
                                aria-hidden="true"
                                className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/[0.06]"
                            />

                            <div
                                aria-hidden="true"
                                className="absolute -right-12 -top-12 h-48 w-48 rounded-full border border-white/[0.05]"
                            />

                            <div className="relative z-10">

                                <div className="flex items-center justify-between">

                                    <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-white/45">
                                        Your rental
                                    </span>

                                    <Package
                                        size={17}
                                        strokeWidth={1.4}
                                        className="text-[var(--color-accent)]"
                                    />

                                </div>

                                <div className="mt-14">

                                    <p className="text-[8px] uppercase tracking-[0.2em] text-white/40">
                                        Active rentals
                                    </p>

                                    <p className="mt-2 text-6xl font-medium tracking-[-0.07em]">
                                        {String(rentals.length).padStart(2, "0")}
                                    </p>

                                    <p className="mt-4 max-w-xs text-sm leading-6 text-white/50">
                                        {rentals.length > 0
                                            ? `${rentals.length} active rental item(s) in your space.`
                                            : "Nothing is currently woven into your rental space."}
                                    </p>

                                </div>

                                <Link
                                    to="/app/rentals"
                                    className="group mt-7 flex w-fit items-center gap-2 text-[9px] uppercase tracking-[0.18em] !text-white/70 transition-colors hover:!text-white"
                                >

                                    View my rentals

                                    <ArrowUpRight
                                        size={13}
                                        strokeWidth={1.5}
                                        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                    />

                                </Link>

                            </div>

                        </div>

                    </LoomCard>

                </div>

                {/* ═══════════════════════════════════════
                    CATEGORY STRIP
                ═══════════════════════════════════════ */}

                <div className="mx-auto mt-8 max-w-6xl">

                    <div className="mb-5 flex items-center justify-between">

                        <div>

                            <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-[var(--color-muted)]">
                                Browse by feeling
                            </p>

                            <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em]">
                                What are you looking for?
                            </h2>

                        </div>

                        <span className="hidden text-[8px] uppercase tracking-[0.2em] text-[var(--color-muted)] sm:block">
                            02 / 04
                        </span>

                    </div>

                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">

                        {[
                            {
                                title: "For work",
                                subtitle: "Tools & gear",
                            },
                            {
                                title: "For travel",
                                subtitle: "Go further",
                            },
                            {
                                title: "For moments",
                                subtitle: "Events & more",
                            },
                            {
                                title: "Just because",
                                subtitle: "Discover",
                            },
                        ].map(
                            (
                                category,
                                index,
                            ) => (
                                <Link
                                    key={category.title}
                                    to="/app/explore"
                                    className="group relative overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white/35 p-5 shadow-[0_12px_30px_rgba(23,23,23,.04)] backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:bg-white/60 hover:shadow-[0_20px_40px_rgba(23,23,23,.08)]"
                                >

                                    <span className="text-[8px] text-[var(--color-muted)]">
                                        0{index + 1}
                                    </span>

                                    <div className="mt-10">

                                        <p className="text-sm font-medium">
                                            {category.title}
                                        </p>

                                        <p className="mt-1 text-[9px] text-[var(--color-muted)]">
                                            {category.subtitle}
                                        </p>

                                    </div>

                                    <ArrowUpRight
                                        size={14}
                                        strokeWidth={1.4}
                                        className="absolute bottom-5 right-5 text-[var(--color-muted)] transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[var(--color-accent)]"
                                    />

                                </Link>
                            ),
                        )}

                    </div>

                </div>

                {/* ═══════════════════════════════════════
                    ACTIVITY
                ═══════════════════════════════════════ */}

                <div className="mx-auto mt-8 max-w-6xl">

                    <LoomCard>

                        <div className="p-7 sm:p-9">

                            <div className="flex items-center justify-between border-b border-[var(--color-line-soft)] pb-5">

                                <div>

                                    <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-[var(--color-muted)]">
                                        Current rental thread
                                    </p>

                                    <h2 className="mt-2 text-xl font-medium tracking-[-0.03em]">
                                        Your activity
                                    </h2>

                                </div>

                                <span className="text-[8px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                                    03 / 04
                                </span>

                            </div>

                            <div className="grid min-h-[190px] place-items-center">

                                <div className="text-center">

                                    <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-line)]">

                                        <span className="absolute h-8 w-8 rounded-full border border-[var(--color-line-soft)]" />

                                        <span className="relative h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] shadow-[0_0_12px_rgba(190,85,55,.45)]" />

                                    </div>

                                    <p className="mt-5 text-sm text-[var(--color-ink-soft)]">
                                        Your activity will appear
                                        here as your rental thread
                                        grows.
                                    </p>

                                    <Link
                                        to="/app/explore"
                                        className="mt-5 inline-flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.18em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
                                    >

                                        Start weaving

                                        <Zap
                                            size={12}
                                            strokeWidth={1.5}
                                        />

                                    </Link>

                                </div>

                            </div>

                        </div>

                    </LoomCard>

                </div>

            </section>

            <HomeFooter />

        </main>
    );
}

export default UserHome;