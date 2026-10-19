// ──────────────────────────────────────────────
// ROSTER CONTENT — Talent Management Data
// PLACEHOLDER: Replace all entries with real talent profiles
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
    coverImage: "https://res.cloudinary.com/nssbycq1/image/upload/v1792376694/talenthaus/creators/nsg1jedw2ukkofiwfvvg.jpg",
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
    selectedWork: [],
  },
  {
    slug: "ayuxiety",
    name: "Ayuxiety",
    niche: ["Lifestyle", "Fashion"],
    platforms: ["Instagram"],
    location: "India",
    bio: "Ayuxiety is exclusively represented by TalentHaus for talent management and strategic brand collaborations. Built around contemporary aesthetics, curated visual style, and dedicated digital followers.",
    shortBio: "TalentHaus represented creator · Lifestyle & Fashion.",
    audienceSize: "Verified Roster",
    engagementRate: "High Engagement",
    image: "https://res.cloudinary.com/nssbycq1/image/upload/v1792335899/talenthaus/creators/qnnux0dlefehbhdke7xz.jpg",
    coverImage: "https://res.cloudinary.com/nssbycq1/image/upload/v1792335899/talenthaus/creators/qnnux0dlefehbhdke7xz.jpg",
    cloudinaryPublicId: "talenthaus/creators/qnnux0dlefehbhdke7xz",
    featured: true,
    status: "published",
    instagramHandle: "ayuxiety_",
    selectedWork: [],
  },
];

export const niches: Niche[] = ["Fashion", "Beauty", "Lifestyle", "Tech", "Finance", "Fitness", "Food", "Travel", "Gaming", "Music", "Comedy", "Business", "Entertainment"];
export const platforms: Platform[] = ["Instagram", "YouTube", "TikTok", "Twitter", "LinkedIn", "Podcast"];

