// ──────────────────────────────────────────────
// SERVICES CONTENT
// PLACEHOLDER: Refine descriptions with real service details
// ──────────────────────────────────────────────

export interface Service {
  number: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
}

export const services: Service[] = [
  {
    number: "01",
    slug: "talent-management",
    title: "Talent Management",
    tagline: "End-to-end career architecture and commercial representation.",
    description:
      "We provide holistic representation for visionary digital creators — negotiating brand contracts, safeguarding intellectual property, structuring career roadmaps, and managing day-to-day business operations.",
    deliverables: [
      "Dedicated talent management and representation",
      "Contract negotiation and commercial deal vetting",
      "Career roadmapping and brand positioning",
      "Calendar and deliverable schedule management",
      "Inbound brand inquiry filtering and protection",
      "Long-term revenue diversification guidance",
    ],
  },
  {
    number: "02",
    slug: "influencer-marketing",
    title: "Influencer Marketing",
    tagline: "Strategic creator matching with measurable commercial impact.",
    description:
      "We connect brands with resonant creators through authentic campaign architecture. From product launches to recurring brand activations, we manage the entire campaign lifecycle with transparent reporting.",
    deliverables: [
      "Audience-aligned creator strategy and matchmaking",
      "Campaign creative briefing and angle development",
      "Deliverable quality review and compliance",
      "End-to-end timeline and publication coordination",
      "Real-time campaign status monitoring",
      "Post-campaign performance and reach reporting",
    ],
  },
  {
    number: "03",
    slug: "brand-partnerships",
    title: "Brand Partnerships",
    tagline: "High-value commercial relationships built for enduring brand equity.",
    description:
      "We structure strategic partnerships between industry-leading brands and culture-defining talent. Multi-quarter ambassadorships, exclusive sponsorship deals, and collaborative creator campaigns.",
    deliverables: [
      "Long-term brand ambassadorship structuring",
      "Commercial terms and usage rights negotiation",
      "Exclusivity parameters and category protection",
      "Cross-platform activation roadmap",
      "Ongoing relationship management and liaison",
      "Milestone-based deliverable fulfillment",
    ],
  },
];

