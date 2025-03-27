import { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
}

export function Card({ children, className = "" }: CardProps) {
    return (
        <div className={`bg-white shadow-lg rounded-2xl p-4 ${className}`}>
            {children}
        </div>
    );
}

export function CardContent({ children }: { children: ReactNode }) {
    return <div className="p-4">{children}</div>;
}
