import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { PortalSkeleton } from "@/components/ui/PortalSkeleton";

const PortalClient = dynamic(
    () => import("./PortalClient").then((mod) => mod.PortalClient),
    {
        loading: () => <PortalSkeleton />,
    }
);

export const metadata: Metadata = {
    title: "Client & Talent Portal | TalentHaus",
    description: "TalentHaus private portal for roster talent and partnering luxury brands.",
};

export default function PortalPage() {
    return <PortalClient />;
}
