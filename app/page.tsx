import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { TalentCarousel } from "@/components/sections/TalentCarousel";
import { ClientStrip } from "@/components/sections/ClientStrip";
import { AboutStatement } from "@/components/sections/AboutStatement";
import { ServicesStack } from "@/components/sections/ServicesStack";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { RosterTicker } from "@/components/sections/RosterTicker";
import { CampaignStories } from "@/components/sections/CampaignStories";
import { CtaBand } from "@/components/sections/CtaBand";
import { siteMeta } from "@/content/site";

import { getFeaturedCreators, getCreators } from "@/lib/data";

export const metadata: Metadata = {
    title: `${siteMeta.name} — ${siteMeta.tagline}`,
    description: siteMeta.description,
    alternates: { canonical: "/" },
};

export default async function HomePage() {
    const featuredCreators = await getFeaturedCreators();
    const allCreators = await getCreators();

    return (
        <>
            <Hero />
            <TalentCarousel initialCreators={featuredCreators} />
            <ClientStrip />
            <AboutStatement />
            <ServicesStack />
            <ProcessSection />
            <RosterTicker initialCreators={allCreators} />
            <CampaignStories />
            {/* PLACEHOLDER: Add real testimonials section before launch */}
            <CtaBand />
        </>
    );
}
