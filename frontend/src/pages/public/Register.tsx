import { useEffect, useState } from "react";

import {
    ArrowUp,
    ArrowUpRight,
    Check,
    Sparkles,
    UserPlus,
} from "lucide-react";

import RegisterForm from "../../components/auth/RegisterForm";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

interface MousePosition {
    x: number;
    y: number;
}

function Register() {
    const [mouse, setMouse] =
        useState<MousePosition>({
            x: 0,
            y: 0,
        });

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
        <>
            <Header />

            <main className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-[var(--color-ivory)] text-[var(--color-ink)]">

                {/* ═══════════════════════════════════════════
                    AMBIENT BACKGROUND
                ═══════════════════════════════════════════ */}

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 overflow-hidden"
                >
                    {/* Vertical rental lines */}

                    <div className="absolute left-[8%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                    <div className="absolute left-[25%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                    <div className="absolute left-1/2 top-0 h-full w-px bg-[var(--color-line-soft)]" />

                    <div className="absolute right-[25%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                    <div className="absolute right-[8%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                    {/* Horizontal rental lines */}

                    <div className="absolute left-0 top-[22%] h-px w-full bg-[var(--color-line-soft)]" />

                    <div className="absolute left-0 top-1/2 h-px w-full bg-[var(--color-line-soft)]" />

                    <div className="absolute left-0 top-[78%] h-px w-full bg-[var(--color-line-soft)]" />

                    {/* Accent node */}

                    <div
                        className="absolute left-[25%] top-1/2 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] transition-transform duration-500"
                        style={{
                            transform: `translate(
                                ${mouse.x * 8}px,
                                ${mouse.y * 8}px
                            )`,
                        }}
                    />

                    {/* Dark node */}

                    <div
                        className="absolute right-[25%] top-[22%] h-1.5 w-1.5 rounded-full bg-[var(--color-ink)] transition-transform duration-500"
                        style={{
                            transform: `translate(
                                ${mouse.x * -8}px,
                                ${mouse.y * -8}px
                            )`,
                        }}
                    />

                    {/* Ambient glow */}

                    <div
                        className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)]/8 blur-[140px]"
                        style={{
                            transform: `translate(
                                calc(-50% + ${mouse.x * 25}px),
                                calc(-50% + ${mouse.y * 25}px)
                            )`,
                        }}
                    />
                </div>

                {/* ═══════════════════════════════════════════
                    PAGE CONTENT
                ═══════════════════════════════════════════ */}

                <div className="relative z-10 mx-auto min-h-[calc(100vh-80px)] max-w-[1450px] px-6 py-14 sm:px-10 lg:px-14">

                    {/* ═══════════════════════════════════════
                        TOP EDITORIAL MARKER
                    ═══════════════════════════════════════ */}

                    <div className="flex items-center justify-between">

                        <div className="flex items-center gap-4">

                            <span className="h-px w-10 bg-[var(--color-accent)]" />

                            <span className="text-[8px] uppercase tracking-[.3em] text-[var(--color-muted)]">
                                Rental / 01
                            </span>

                        </div>

                        <span className="text-[8px] uppercase tracking-[.3em] text-[var(--color-muted)]">
                            Begin / 01
                        </span>

                    </div>

                    {/* ═══════════════════════════════════════
                        MAIN COMPOSITION
                    ═══════════════════════════════════════ */}

                    <div className="grid min-h-[calc(100vh-190px)] items-center gap-20 lg:grid-cols-[.85fr_1.15fr]">

                        {/* ═══════════════════════════════════
                            LEFT EDITORIAL SIDE
                        ═══════════════════════════════════ */}

                        <div className="relative z-20 max-w-xl">

                            {/* Label */}

                            <div className="mb-7 flex items-center gap-3">

                                <span className="rounded-full border border-[var(--color-line)] bg-white/40 px-3 py-1.5 text-[7px] uppercase tracking-[.25em] text-[var(--color-muted)] backdrop-blur-md">
                                    Start your rental
                                </span>

                            </div>

                            {/* Heading */}

                            <h1 className="text-[clamp(4.5rem,7vw,7.5rem)] font-medium leading-[.78] tracking-[-.085em]">

                                Join
                                <br />

                                <span className="font-[var(--font-display)] italic text-[var(--color-accent)]">
                                    Rentify.
                                </span>

                            </h1>

                            {/* Description */}

                            <p className="mt-10 max-w-md text-sm leading-7 text-[var(--color-ink-soft)]">
                                Create your space, discover
                                what you need, and let every
                                rental become part of your
                                journey.
                            </p>

                            {/* Editorial cards */}

                            <div className="mt-12 grid max-w-sm grid-cols-2 gap-3">

                                {/* Create */}

                                <div className="rounded-2xl border border-[var(--color-line)] bg-white/35 p-5 shadow-[0_15px_35px_rgba(23,23,23,.05)] backdrop-blur-md">

                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-ivory)]">

                                        <UserPlus
                                            size={13}
                                            strokeWidth={1.4}
                                        />

                                    </span>

                                    <p className="mt-5 text-[8px] uppercase tracking-[.2em] text-[var(--color-muted)]">
                                        Step one
                                    </p>

                                    <p className="mt-2 text-xs font-medium">
                                        Create your space
                                    </p>

                                </div>

                                {/* Explore */}

                                <div className="rounded-2xl border border-[var(--color-line)] bg-white/35 p-5 shadow-[0_15px_35px_rgba(23,23,23,.05)] backdrop-blur-md">

                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-ink)] text-[var(--color-ivory)]">

                                        <Sparkles
                                            size={13}
                                            strokeWidth={1.4}
                                        />

                                    </span>

                                    <p className="mt-5 text-[8px] uppercase tracking-[.2em] text-[var(--color-muted)]">
                                        Step two
                                    </p>

                                    <p className="mt-2 text-xs font-medium">
                                        Start exploring
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* ═══════════════════════════════════
                            RIGHT 3D REGISTER COMPOSITION
                        ═══════════════════════════════════ */}

                        <div className="relative flex min-h-[650px] items-center justify-center">

                            {/* BACK 3D FRAME */}

                            <div
                                className="absolute h-[560px] w-[510px] rounded-[3rem] border border-[var(--color-line-soft)] bg-white/20 transition-transform duration-700 ease-out"
                                style={{
                                    transform: `
                                        perspective(1200px)
                                        rotateX(${mouse.y * -3}deg)
                                        rotateY(${mouse.x * 4}deg)
                                        translate(
                                            ${mouse.x * -10}px,
                                            ${mouse.y * -10}px
                                        )
                                    `,
                                }}
                            />

                            {/* SECOND DEPTH LAYER */}

                            <div
                                className="absolute h-[550px] w-[500px] translate-x-4 translate-y-5 rounded-[3rem] border border-[var(--color-line-soft)] bg-[var(--color-ivory-soft)] shadow-[18px_28px_60px_rgba(23,23,23,0.14)] transition-transform duration-700 ease-out"
                                style={{
                                    transform: `
                                        perspective(1200px)
                                        rotateX(${mouse.y * -4}deg)
                                        rotateY(${mouse.x * 5}deg)
                                        translate(
                                            ${mouse.x * -6}px,
                                            ${mouse.y * -6}px
                                        )
                                        translate(16px,20px)
                                    `,
                                }}
                            />

                            {/* ═══════════════════════════════
                                MACOS REGISTER WINDOW
                            ═══════════════════════════════ */}

                            <div
                                className="relative z-20 w-full max-w-[500px] overflow-hidden rounded-[2rem] border border-white/90 bg-[rgba(235,228,214,0.88)] shadow-[0_18px_35px_rgba(23,23,23,0.10),0_40px_100px_rgba(23,23,23,0.20),0_8px_20px_rgba(122,74,59,0.10),inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(23,23,23,0.06)] backdrop-blur-2xl transition-transform duration-700 ease-out"
                                style={{
                                    transform: `
                                        perspective(1200px)
                                        rotateX(${mouse.y * -5}deg)
                                        rotateY(${mouse.x * 7}deg)
                                    `,
                                }}
                            >

                                {/* Glass reflection */}

                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-transparent"
                                />

                                {/* ═══════════════════════════════
                                    MACOS WINDOW HEADER
                                ═══════════════════════════════ */}

                                <div className="relative flex h-14 items-center border-b border-black/[0.07] bg-white/25 px-5">

                                    {/* Traffic lights */}

                                    <div className="flex items-center gap-2">

                                        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] shadow-[inset_0_0_0_1px_rgba(0,0,0,.08)]" />

                                        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e] shadow-[inset_0_0_0_1px_rgba(0,0,0,.08)]" />

                                        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840] shadow-[inset_0_0_0_1px_rgba(0,0,0,.08)]" />

                                    </div>

                                    {/* Center title */}

                                    <div className="pointer-events-none absolute left-1/2 flex -translate-x-1/2 items-center gap-2">

                                        <span className="text-[9px] font-medium tracking-[.08em] text-[var(--color-ink)]/70">
                                            Rentify
                                        </span>

                                        <span className="text-[8px] text-[var(--color-muted)]">
                                            —
                                        </span>

                                        <span className="text-[8px] uppercase tracking-[.2em] text-[var(--color-muted)]">
                                            Create account
                                        </span>

                                    </div>

                                    {/* Create status */}

                                    <div className="ml-auto flex items-center gap-2">

                                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] shadow-[0_0_10px_rgba(190,85,55,.45)]" />

                                        <span className="hidden text-[7px] uppercase tracking-[.2em] text-[var(--color-muted)] sm:block">
                                            New
                                        </span>

                                    </div>

                                </div>

                                {/* ═══════════════════════════════
                                    WINDOW BODY
                                ═══════════════════════════════ */}

                                <div className="relative bg-[rgba(248,244,235,0.48)] p-7 sm:p-9">

                                    {/* Internal rental grid */}

                                    <div
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-0 overflow-hidden"
                                    >

                                        <div className="absolute left-[24%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                                        <div className="absolute right-[24%] top-0 h-full w-px bg-[var(--color-line-soft)]" />

                                        <div className="absolute left-0 top-[25%] h-px w-full bg-[var(--color-line-soft)]" />

                                        <div className="absolute left-0 top-[75%] h-px w-full bg-[var(--color-line-soft)]" />

                                        {/* Diagonal weave */}

                                        <div className="absolute -right-24 -top-24 h-64 w-64 rotate-45 border border-[var(--color-accent)]/[0.07]" />

                                        <div className="absolute -right-16 -top-16 h-52 w-52 rotate-45 border border-[var(--color-accent)]/[0.06]" />

                                    </div>

                                    {/* Body content */}

                                    <div className="relative">

                                        {/* Section header */}

                                        <div className="mb-8 flex items-start justify-between">

                                            <div>

                                                <div className="flex items-center gap-2">

                                                    <UserPlus
                                                        size={13}
                                                        strokeWidth={1.4}
                                                        className="text-[var(--color-accent)]"
                                                    />

                                                    <span className="text-[8px] uppercase tracking-[.25em] text-[var(--color-muted)]">
                                                        New rental
                                                    </span>

                                                </div>

                                                <p className="mt-3 text-[10px] font-medium uppercase tracking-[.15em]">
                                                    Create your space
                                                </p>

                                            </div>

                                            {/* Register progress */}

                                            <div className="flex items-center gap-1 pt-1">

                                                <span className="h-1.5 w-8 rounded-full bg-[var(--color-accent)]" />

                                                <span className="h-1.5 w-3 rounded-full bg-[var(--color-line)]" />

                                                <span className="h-1.5 w-3 rounded-full bg-[var(--color-line)]" />

                                            </div>

                                        </div>

                                        {/* Register form */}

                                        <RegisterForm />

                                        {/* Login */}

                                        <div className="mt-8 flex items-center justify-center">

                                            <a
                                                href="/login"
                                                className="group flex items-center gap-2 text-[9px] font-medium uppercase tracking-[.18em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
                                            >
                                                Already have an account?
                                                Sign in

                                                <ArrowUpRight
                                                    size={12}
                                                    strokeWidth={1.4}
                                                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                                />
                                            </a>

                                        </div>

                                    </div>

                                </div>

                                {/* ═══════════════════════════════
                                    MACOS STATUS BAR
                                ═══════════════════════════════ */}

                                <div className="relative flex h-9 items-center justify-between border-t border-black/[0.06] bg-white/20 px-5">

                                    <span className="text-[7px] uppercase tracking-[.2em] text-[var(--color-muted)]">
                                        Rental / 01
                                    </span>

                                    <span className="flex items-center gap-2 text-[7px] uppercase tracking-[.2em] text-[var(--color-muted)]">

                                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />

                                        Ready

                                    </span>

                                </div>

                            </div>

                            {/* ═══════════════════════════════
                                FLOATING CREATE CARD
                            ═══════════════════════════════ */}

                            <div
                                className="absolute -left-5 top-[10%] z-30 hidden w-40 rounded-2xl border border-white/80 bg-white/65 p-4 shadow-[0_20px_45px_rgba(23,23,23,.12)] backdrop-blur-xl transition-transform duration-700 sm:block"
                                style={{
                                    transform: `
                                        translate(
                                            ${mouse.x * -15}px,
                                            ${mouse.y * -10}px
                                        )
                                        rotate(${mouse.x * -2}deg)
                                    `,
                                }}
                            >

                                <div className="flex items-center gap-2">

                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-ivory)]">

                                        <Check
                                            size={10}
                                            strokeWidth={2}
                                        />

                                    </span>

                                    <span className="text-[7px] uppercase tracking-[.2em] text-[var(--color-muted)]">
                                        Create
                                    </span>

                                </div>

                                <p className="mt-3 text-xs font-medium leading-5">
                                    Your rental space starts
                                    here.
                                </p>

                            </div>

                            {/* ═══════════════════════════════
                                FLOATING DISCOVER CARD
                            ═══════════════════════════════ */}

                            <div
                                className="absolute -right-5 bottom-[13%] z-30 hidden w-40 rounded-2xl border border-[var(--color-line)] bg-[var(--color-ivory)]/80 p-4 shadow-[0_20px_45px_rgba(23,23,23,.10)] backdrop-blur-xl sm:block"
                                style={{
                                    transform: `
                                        translate(
                                            ${mouse.x * 12}px,
                                            ${mouse.y * 8}px
                                        )
                                        rotate(${mouse.x * 2}deg)
                                    `,
                                }}
                            >

                                <div className="flex items-center justify-between">

                                    <span className="text-[7px] uppercase tracking-[.2em] text-[var(--color-muted)]">
                                        Rental
                                    </span>

                                    <span className="text-[7px] text-[var(--color-accent)]">
                                        01
                                    </span>

                                </div>

                                <div className="mt-4 flex items-center gap-2">

                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-ink)] text-[var(--color-ivory)]">

                                        <Sparkles
                                            size={11}
                                            strokeWidth={1.4}
                                        />

                                    </div>

                                    <div>

                                        <p className="text-[8px] font-medium">
                                            Discover
                                        </p>

                                        <p className="text-[7px] text-[var(--color-muted)]">
                                            What's next
                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* ═══════════════════════════════
                                FLOATING NUMBER
                            ═══════════════════════════════ */}

                            <div
                                className="absolute -bottom-2 left-[10%] z-30 hidden h-20 w-20 items-center justify-center rounded-full border border-[var(--color-line)] bg-[var(--color-ivory)] shadow-[0_20px_40px_rgba(23,23,23,.10)] sm:flex"
                                style={{
                                    transform: `
                                        translate(
                                            ${mouse.x * -8}px,
                                            ${mouse.y * -6}px
                                        )
                                    `,
                                }}
                            >

                                <div className="text-center">

                                    <p className="text-[10px] font-medium">
                                        01
                                    </p>

                                    <p className="mt-1 text-[6px] uppercase tracking-[.2em] text-[var(--color-muted)]">
                                        Rental
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* ═══════════════════════════════════════
                        BOTTOM MARKER
                    ═══════════════════════════════════════ */}

                    <div className="flex items-center justify-between border-t border-[var(--color-line)] pt-5">

                        <div className="flex items-center gap-3 text-[8px] uppercase tracking-[.22em] text-[var(--color-muted)]">

                            <span className="h-px w-7 bg-[var(--color-line)]" />

                            <span>
                                Begin your rental
                            </span>

                        </div>

                        <div className="flex items-center gap-2 text-[8px] uppercase tracking-[.22em] text-[var(--color-muted)]">

                            <span>
                                Create to continue
                            </span>

                            <ArrowUp
                                size={11}
                                strokeWidth={1.4}
                            />

                        </div>

                    </div>

                </div>
            </main>

            <Footer />
        </>
    );
}

export default Register;