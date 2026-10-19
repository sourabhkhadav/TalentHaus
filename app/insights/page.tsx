import type { Metadata } from "next";
import { InsightsClient } from "./InsightsClient";

export const metadata: Metadata = {
    title: "Agency Intelligence & Insights | TalentHaus",
    description: "Perspectives on culture, creator economics, and luxury brand architecture.",
};

export default function InsightsPage() {
    return <InsightsClient />;
}
