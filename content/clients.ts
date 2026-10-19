// ──────────────────────────────────────────────
// CLIENTS CONTENT
// PLACEHOLDER: Replace with real client names and logos
// ──────────────────────────────────────────────

export interface Client {
  name: string;
  logo: string;
  category?: string;
}

export const clients: Client[] = [
  { name: "Consumer Tech", logo: "/images/clients/tech.svg", category: "Technology" },
  { name: "Fashion & Apparel", logo: "/images/clients/fashion.svg", category: "Fashion" },
  { name: "Lifestyle & Wellness", logo: "/images/clients/wellness.svg", category: "Wellness" },
  { name: "Beauty & Cosmetics", logo: "/images/clients/beauty.svg", category: "Beauty" },
  { name: "D2C Enterprises", logo: "/images/clients/d2c.svg", category: "Commerce" },
  { name: "Digital Media", logo: "/images/clients/media.svg", category: "Media" },
  { name: "Creator Commerce", logo: "/images/clients/commerce.svg", category: "Creator Economy" },
];

