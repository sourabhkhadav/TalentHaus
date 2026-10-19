// ──────────────────────────────────────────────
// CAREERS CONTENT
// PLACEHOLDER: Replace with real open positions
// ──────────────────────────────────────────────

export interface CareerPosition {
    id: string;
    title: string;
    department: string;
    location: string;
    type: "Full-time" | "Part-time" | "Contract" | "Freelance";
    description: string;
    responsibilities: string[];
    requirements: string[];
}

export const positions: CareerPosition[] = [];


export const departments = ["All", "Talent", "Brand Partnerships", "Creative", "Operations", "Technology"];
