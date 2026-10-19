// ──────────────────────────────────────────────
// CAMPAIGNS / CASE STUDIES CONTENT
// PLACEHOLDER: Replace all entries with real campaign data
// ──────────────────────────────────────────────

export interface Campaign {
  slug: string;
  brand: string;
  brandLogo: string; // PLACEHOLDER path
  category: string;
  industry: string;
  headline: string;
  brief: string;
  execution: string;
  heroMetric: string;
  heroMetricLabel: string;
  results: { metric: string; value: string }[];
  heroImage: string; // path in /public/images/campaigns/
  talent: string[]; // talent slugs
  year: string;
  featured: boolean;
}

export const campaigns: Campaign[] = [
  {
    slug: "creator-led-product-launch",
    brand: "Product Launch Framework",
    brandLogo: "/images/clients/framework-launch.svg",
    category: "Launch Strategy",
    industry: "Consumer & Lifestyle",
    headline: "A phased campaign model engineered for organic creator momentum and genuine conversion.",
    brief:
      "Designed for consumer enterprises and D2C brands introducing new product lines to digitally native audiences without relying exclusively on traditional paid advertising.",
    execution:
      "Staggered three-phase rollout: initial unboxing previews to seed curiosity, followed by authentic editorial reviews, concluding with targeted community conversion calls-to-action.",
    heroMetric: "Phase 1–3",
    heroMetricLabel: "Deployment Architecture",
    results: [
      { metric: "Brief to Launch", value: "Structured 14-Day Cycle" },
      { metric: "Content Compliance", value: "100% Pre-Screened" },
      { metric: "Deliverable Format", value: "Multi-Platform 4K" },
      { metric: "Reporting", value: "Milestone Verified" },
    ],
    heroImage: "/images/campaigns/framework-launch.jpg",
    talent: ["rishi-agrawal", "ayuxiety"],
    year: "2026",
    featured: true,
  },
  {
    slug: "integrated-brand-ambassadorship",
    brand: "Brand Ambassadorship Model",
    brandLogo: "/images/clients/framework-ambassador.svg",
    category: "Long-Term Partnerships",
    industry: "Fashion & Lifestyle",
    headline: "Transforming transactional one-off posts into enduring brand equity and affinity.",
    brief:
      "Architected for enterprises seeking ongoing creator affinity, category exclusivity, and deeper storytelling across multiple business quarters.",
    execution:
      "Strategic alignment of brand values with creator content calendars. Includes recurring episodic integrations, seasonal activations, and collaborative digital storytelling.",
    heroMetric: "Multi-Quarter",
    heroMetricLabel: "Partnership Framework",
    results: [
      { metric: "Exclusivity Protocol", value: "Category Secured" },
      { metric: "Contract Longevity", value: "3–12 Months" },
      { metric: "Touchpoint Cadence", value: "Bi-Weekly Storytelling" },
      { metric: "Strategic Governance", value: "Executive Desk Oversight" },
    ],
    heroImage: "/images/campaigns/framework-ambassador.jpg",
    talent: ["ayuxiety"],
    year: "2026",
    featured: true,
  },
  {
    slug: "high-conversion-influencer-activation",
    brand: "Targeted Campaign Activation",
    brandLogo: "/images/clients/framework-activation.svg",
    category: "Influencer Marketing",
    industry: "Digital & Commerce",
    headline: "Curated creator matching built around clear commercial objectives and audience resonance.",
    brief:
      "Structured for promotional campaigns, seasonal activations, and high-engagement social storytelling with accountable delivery.",
    execution:
      "Audience matching, creative angle alignment, full usage-rights licensing, and coordinated publishing schedules managed directly from our Indore headquarters.",
    heroMetric: "End-to-End",
    heroMetricLabel: "Campaign Management",
    results: [
      { metric: "Creator Matching", value: "Audience-Aligned" },
      { metric: "Usage Rights", value: "Full Digital Clearance" },
      { metric: "Coordination", value: "Centralized HQ Management" },
      { metric: "Post-Campaign Review", value: "Complete Data Audit" },
    ],
    heroImage: "/images/campaigns/framework-activation.jpg",
    talent: ["rishi-agrawal"],
    year: "2026",
    featured: false,
  },
];

export const industries = ["All", "Consumer & Lifestyle", "Fashion & Lifestyle", "Digital & Commerce"];

