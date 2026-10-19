// ──────────────────────────────────────────────
// Utility helpers
// ──────────────────────────────────────────────

export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(" ");
}

export function formatNumber(n: number): string {
    return new Intl.NumberFormat("en-GB").format(n);
}

export function slugify(str: string): string {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}
