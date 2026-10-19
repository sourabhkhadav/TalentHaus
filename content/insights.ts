// ──────────────────────────────────────────────
// INSIGHTS / BLOG CONTENT
// PLACEHOLDER: Replace with real articles and authors
// ──────────────────────────────────────────────

export interface Insight {
  slug: string;
  title: string;
  excerpt: string;
  body?: string; // full MDX or HTML — PLACEHOLDER
  category: string;
  author: string;
  authorImage: string;
  coverImage: string;
  publishedAt: string;
  readTime: string;
  featured: boolean;
}

export const insights: Insight[] = [
  {
    slug: "creator-economy-evolution",
    title: "The Creator Economy: From Vanity Metrics to Commercial Infrastructure",
    excerpt:
      "Why follower counts are no longer the primary determinant of brand value, and how creator businesses are establishing durable equity.",
    category: "Creator Economy",
    author: "TalentHaus Editorial",
    authorImage: "/images/team/sourabh.jpg",
    coverImage: "/images/insights/creator-economy.jpg",
    publishedAt: "2026-02-15",
    readTime: "6 min read",
    featured: true,
  },
  {
    slug: "brand-creator-partnerships",
    title: "Structuring Brand–Creator Partnerships Built for Long-Term Value",
    excerpt:
      "Moving beyond transactional one-off sponsorships toward multi-quarter partnerships that protect creator authenticity and build genuine brand equity.",
    category: "Brand Partnerships",
    author: "TalentHaus Editorial",
    authorImage: "/images/team/navneet.jpg",
    coverImage: "/images/insights/partnerships.jpg",
    publishedAt: "2026-03-01",
    readTime: "5 min read",
    featured: true,
  },
  {
    slug: "influencer-marketing-clarity",
    title: "Influencer Marketing: Why Audience Alignment Outweighs Follower Counts",
    excerpt:
      "A strategic analysis of how targeted niche authority consistently outperforms generic reach in modern influencer campaigns.",
    category: "Influencer Marketing",
    author: "TalentHaus Editorial",
    authorImage: "/images/team/atharv.jpg",
    coverImage: "/images/insights/influencer-marketing.jpg",
    publishedAt: "2026-03-12",
    readTime: "5 min read",
    featured: false,
  },
  {
    slug: "creator-career-growth",
    title: "Career Architecture for Digital Creators: Transitioning into Enduring Media Brands",
    excerpt:
      "The roadmap from short-form content producer to sustainable business founder, including intellectual property governance and revenue diversification.",
    category: "Creator Growth",
    author: "TalentHaus Editorial",
    authorImage: "/images/team/sourabh.jpg",
    coverImage: "/images/insights/career-growth.jpg",
    publishedAt: "2026-03-20",
    readTime: "7 min read",
    featured: false,
  },
  {
    slug: "social-media-trends-analysis",
    title: "Navigating Social Platform Shifts: Algorithm Independence and Community Ownership",
    excerpt:
      "How forward-thinking creators protect their cultural capital against algorithmic volatility by building direct community relationships.",
    category: "Social Trends",
    author: "TalentHaus Editorial",
    authorImage: "/images/team/atharv.jpg",
    coverImage: "/images/insights/social-trends.jpg",
    publishedAt: "2026-04-02",
    readTime: "5 min read",
    featured: false,
  },
  {
    slug: "talent-management-imperative",
    title: "The Role of Modern Talent Management in an Evolving Digital Landscape",
    excerpt:
      "Why holistic creator representation requires contract precision, commercial deal vetting, and executive oversight.",
    category: "Talent Management",
    author: "TalentHaus Editorial",
    authorImage: "/images/team/navneet.jpg",
    coverImage: "/images/insights/talent-management.jpg",
    publishedAt: "2026-04-10",
    readTime: "6 min read",
    featured: true,
  },
];

export const insightCategories = [
  "All",
  "Creator Economy",
  "Brand Partnerships",
  "Influencer Marketing",
  "Creator Growth",
  "Social Trends",
  "Talent Management",
];

