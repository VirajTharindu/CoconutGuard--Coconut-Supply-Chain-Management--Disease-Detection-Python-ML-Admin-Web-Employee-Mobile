import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export function Card({ children, className = '' }: CardProps) {
    return (
        <div className={`bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 p-6 transition-all duration-300 hover:shadow-xl hover:border-emerald-200 ${className}`}>
            {children}
        </div>
    );
}
