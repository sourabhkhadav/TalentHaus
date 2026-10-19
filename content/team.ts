// ──────────────────────────────────────────────
// TEAM CONTENT
// PLACEHOLDER: Replace with real team members
// ──────────────────────────────────────────────

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin?: string;
}

export const team: TeamMember[] = [
  {
    name: "Sourabh Khadav",
    role: "Co-Founder & Managing Director",
    bio: "Sourabh leads executive operations, investment strategy, and agency growth from our Indore headquarters. Focused on institutionalizing creator business models.",
    image: "/images/team/sourabh.jpg",
    linkedin: "mailto:info@talenthaus.in",
  },
  {
    name: "Navneet Jat",
    role: "Founder & Head of Brand Partnerships",
    bio: "Navneet directs commercial relationships with leading consumer enterprises, brand partners, and media organizations. Has orchestrated landmark creator campaigns.",
    image: "/images/team/navneet.jpg",
    linkedin: "mailto:info@talenthaus.in",
  },
  {
    name: "Atharv Sharma",
    role: "Co-Founder & Managing Director",
    bio: "Atharv oversees talent discovery, roster incubation, and creator equity partnerships. Specializes in transforming digital reach into permanent cultural authority.",
    image: "/images/team/atharv.jpg",
    linkedin: "mailto:info@talenthaus.in",
  },
];

export const facts = [
  { label: "Founded", value: "2026" },
  { label: "Headquarters", value: "Indore, India" },
  { label: "Creators Engaged", value: "100+" },
  { label: "Campaigns Executed", value: "500+" },
];

