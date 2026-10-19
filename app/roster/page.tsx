import type { Metadata } from "next";
import { getCreators } from "@/lib/data";
import { RosterClient } from "@/components/roster/RosterClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Creators Roster — TalentHaus",
    description: "Discover the exclusive talent represented by TalentHaus across lifestyle, fashion, digital culture, and entertainment.",
    alternates: { canonical: "/roster" },
};

export default async function RosterPage() {
    const initialCreators = await getCreators();
    return <RosterClient initialCreators={initialCreators} />;
}
