import type { ReactNode } from "react";

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
    return (
        <div className={`relative ${className}`}>
            {offset && (
                <div
                    aria-hidden="true"
                    className="absolute inset-0 translate-x-2 translate-y-2 rounded-[1.75rem] border border-[var(--color-line-soft)] bg-[var(--color-ivory-soft)]"
                />
            )}

            <div className="relative rounded-[1.75rem] border border-[var(--color-line)] bg-[var(--color-ivory-soft)] shadow-[0_14px_40px_rgba(23,23,23,0.06)]">
                {children}
            </div>
        </div>
    );
}

export default LoomCard;