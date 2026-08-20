import { useState, type ReactNode } from "react";

interface LoomCardProps {
    children: ReactNode;
    className?: string;
    offset?: boolean;
}

function LoomCard({
    children,
    className = "",
    offset = true,
}: LoomCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative group transition-all duration-300 ease-out ${className}`}
        >
            {offset && (
                <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-[1.75rem] border border-[var(--color-line-soft)] bg-[#dfd9cb] border-black/5 transition-all duration-300 ease-out"
                    style={{
                        transform: isHovered ? "translate(6px, 9px)" : "translate(4px, 6px)",
                        opacity: isHovered ? 0.9 : 0.6
                    }}
                />
            )}

            <div
                className="relative rounded-[1.75rem] border border-[var(--color-line)] bg-[var(--color-ivory-soft)] shadow-[0_14px_40px_rgba(23,23,23,0.06)] transition-all duration-300 ease-out hover:border-[var(--color-accent)]/50"
                style={{
                    transform: isHovered ? "translateY(-4px)" : "translateY(0px)",
                    boxShadow: isHovered
                        ? "0 25px 50px -10px rgba(23, 23, 23, 0.12)"
                        : "0 14px 40px -15px rgba(23, 23, 23, 0.06)"
                }}
            >
                {children}
            </div>
        </div>
    );
}

export default LoomCard;