"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant = "solid" | "outlined";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
    icon?: boolean;
    children: React.ReactNode;
}

type ButtonAsButton = ButtonBaseProps &
    React.ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button"; href?: never };

type ButtonAsLink = ButtonBaseProps & { as: "link"; href: string } & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "href"
>;

type ButtonProps = ButtonAsButton | ButtonAsLink;

const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-4 py-2 text-sm min-h-[44px]",
    md: "px-6 py-3 text-sm min-h-[44px]",
    lg: "px-8 py-4 text-base min-h-[48px]",
};

const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded font-body font-medium tracking-wide transition-all duration-200 select-none outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian";

const variantClasses: Record<ButtonVariant, string> = {
    solid:
        "bg-gold text-obsidian hover:bg-gold/90 active:scale-[0.98]",
    outlined:
        "border border-gold/40 text-ivory hover:border-gold hover:text-gold active:scale-[0.98]",
};

export function Button({ variant = "solid", size = "md", icon = false, className, children, ...rest }: ButtonProps) {
    const classes = cn(baseClasses, sizeClasses[size], variantClasses[variant], className);

    const inner = (
        <>
            {children}
            {icon && (
                <ArrowUpRight
                    size={size === "lg" ? 16 : 14}
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
            )}
        </>
    );

    if ("as" in rest && rest.as === "link") {
        const { as: _as, href, ...linkRest } = rest as ButtonAsLink;
        return (
            <Link href={href} className={cn(classes, "group")} {...(linkRest as Record<string, unknown>)}>
                {inner}
            </Link>
        );
    }

    const { as: _as, ...buttonRest } = rest as ButtonAsButton;
    return (
        <button type="button" className={cn(classes, "group")} {...buttonRest}>
            {inner}
        </button>
    );
}
