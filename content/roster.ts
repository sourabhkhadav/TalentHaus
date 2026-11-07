// ──────────────────────────────────────────────
// ROSTER CONTENT — Talent Management Data
// ──────────────────────────────────────────────

export type Platform = "Instagram" | "YouTube" | "TikTok" | "Twitter" | "LinkedIn" | "Podcast";
export type Niche = "Fashion" | "Beauty" | "Lifestyle" | "Tech" | "Finance" | "Fitness" | "Food" | "Travel" | "Gaming" | "Music" | "Comedy" | "Business" | "Entertainment";

export interface TalentProfile {
  id?: string;
  slug: string;
  name: string;
  niche: Niche[];
  platforms: Platform[];
  location: string;
  bio: string;
  shortBio: string;
  audienceSize: string;
  engagementRate: string;
  image: string; // path in /public/images/roster/ or Cloudinary secure URL
  coverImage: string;
  cloudinaryPublicId?: string;
  coverCloudinaryPublicId?: string;
  featured: boolean;
  status?: "published" | "draft" | "archived";
  instagramHandle?: string;
  instagramFollowers?: string;
  youtubeHandle?: string;
  youtubeSubscribers?: string;
  tiktokHandle?: string;
  selectedWork?: { brand: string; description: string }[];
}

export const roster: TalentProfile[] = [
  {
    slug: "najim-pathan",
    name: "Najim Pathan",
    niche: ["Entertainment", "Fashion"],
    platforms: ["Instagram", "YouTube"],
    location: "Maharashtra, India",
    bio: "Najim Pathan is represented by TalentHaus for talent management, digital brand partnerships, and creative collaborations. Known for dynamic content and passionate audience resonance.",
    shortBio: "TalentHaus represented creator · Entertainment & Fashion.",
    audienceSize: "1M",
    engagementRate: "High Engagement",
    image: "https://res.cloudinary.com/nssbycq1/image/upload/v1792376694/talenthaus/creators/nsg1jedw2ukkofiwfvvg.jpg",
    coverImage: "/images/roster/placeholder-cover.jpg",
    cloudinaryPublicId: "talenthaus/creators/nsg1jedw2ukkofiwfvvg",
    featured: true,
    status: "published",
    instagramHandle: "najo10no_",
    instagramFollowers: "1M",
    selectedWork: [],
  },
  {
    slug: "rishi-agrawal",
    name: "Rishi Agrawal",
    niche: ["Lifestyle", "Entertainment"],
    platforms: ["Instagram"],
    location: "India",
    bio: "Rishi Agrawal is exclusively represented by TalentHaus for talent management, brand sponsorships, and commercial partnerships. Known for high-engagement digital storytelling and authentic community resonance.",
    shortBio: "TalentHaus represented creator · Lifestyle & Entertainment.",
    audienceSize: "Verified Roster",
    engagementRate: "High Engagement",
    image: "https://res.cloudinary.com/nssbycq1/image/upload/v1792335379/talenthaus/creators/rp1kdc7fqpow1wurnyzb.jpg",
    coverImage: "https://res.cloudinary.com/nssbycq1/image/upload/v1792335851/talenthaus/creators/sbuk4t2xswwgougralor.jpg",
    cloudinaryPublicId: "talenthaus/creators/rp1kdc7fqpow1wurnyzb",
    featured: true,
    status: "published",
    instagramHandle: "rishiagrawalofficial",
    instagramFollowers: "850K",
    selectedWork: [],
  },
  {
    slug: "amit-chandel",
    name: "Amit Chandel",
    niche: ["Entertainment"],
    platforms: ["Instagram", "YouTube"],
    location: "Bhopal, India",
    bio: "Amit Chandel is represented exclusively by TalentHaus for talent management and strategic digital brand collaborations.",
    shortBio: "Amit Chandel across platforms · Entertainment.",
    audienceSize: "899K",
    engagementRate: "High Engagement",
    image: "https://res.cloudinary.com/nssbycq1/image/upload/v1792428447/talenthaus/creators/sstpoeqc3de0aeists0f.jpg",
    coverImage: "/images/roster/placeholder-cover.jpg",
    cloudinaryPublicId: "talenthaus/creators/sstpoeqc3de0aeists0f",
    featured: true,
    status: "published",
    instagramHandle: "amit__chandel_",
    instagramFollowers: "899K",
    selectedWork: [],
  },
  {
    slug: "mishti-pathak",
    name: "Mishti Pathak",
    niche: ["Fashion"],
    platforms: ["Instagram", "YouTube"],
    location: "Indore, India",
    bio: "Mishti Pathak is represented exclusively by TalentHaus.",
    shortBio: "Mishti Pathak across platforms · Fashion.",
    audienceSize: "137K",
    engagementRate: "High Engagement",
    image: "https://res.cloudinary.com/nssbycq1/image/upload/v1794051358/talenthaus/creators/ny8iilhifkou4pnrj96p.jpg",
    coverImage: "/images/roster/placeholder-cover.jpg",
    cloudinaryPublicId: "talenthaus/creators/ny8iilhifkou4pnrj96p",
    featured: true,
    status: "published",
    instagramHandle: "mishtiii.i_",
    instagramFollowers: "137K",
    selectedWork: [],
  },
];

export const niches: Niche[] = ["Fashion", "Beauty", "Lifestyle", "Tech", "Finance", "Fitness", "Food", "Travel", "Gaming", "Music", "Comedy", "Business", "Entertainment"];
export const platforms: Platform[] = ["Instagram", "YouTube", "TikTok", "Twitter", "LinkedIn", "Podcast"];
