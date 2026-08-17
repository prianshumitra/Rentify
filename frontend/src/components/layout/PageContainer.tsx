import type { ReactNode } from "react";

interface PageContainerProps {
    children: ReactNode;
    className?: string;
}

function PageContainer({
                           children,
                           className = "",
                       }: PageContainerProps) {
    return (
        <div
            className={`mx-auto w-full max-w-[var(--content-width)] px-[var(--content-padding)] ${className}`}
        >
            {children}
        </div>
    );
}

export default PageContainer;