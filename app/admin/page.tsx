import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { AdminSkeleton } from "@/components/ui/AdminSkeleton";
import { createClient, isSupabaseServerConfigured } from "@/lib/supabase/server";

const AdminClient = dynamic(
    () => import("./AdminClient").then((mod) => mod.AdminClient),
    {
        loading: () => <AdminSkeleton />,
    }
);

export const metadata: Metadata = {
    title: "Founder Command Center | TalentHaus",
    description: "TalentHaus Founder Operating System — Deals, Expenses, Tasks, and Roster.",
};

export default async function AdminPage() {
    if (isSupabaseServerConfigured()) {
        try {
            const supabase = await createClient();
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                redirect("/login?redirectTo=/admin");
            }

            const lowerEmail = (user.email || "").toLowerCase().trim();
            const isFounderEmail =
                lowerEmail === "sourabh@talenthaus.in" ||
                lowerEmail === "navneet@talenthaus.in" ||
                lowerEmail === "atharv@talenthaus.in" ||
                lowerEmail.includes("sourabh") ||
                lowerEmail.includes("navneet") ||
                lowerEmail.includes("atharv") ||
                lowerEmail.endsWith("@talenthaus.in");
            const userRole =
                (user.user_metadata?.role as string) ||
                (user.app_metadata?.role as string) ||
                "";
            const isFounderOrAdmin = isFounderEmail || userRole === "founder" || userRole === "admin";

            if (!isFounderOrAdmin) {
                redirect("/portal?error=unauthorized_admin_access");
            }
        } catch (err: unknown) {
            if (
                err &&
                typeof err === "object" &&
                "digest" in err &&
                typeof (err as { digest?: string }).digest === "string" &&
                (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
            ) {
                throw err;
            }
            redirect("/login?redirectTo=/admin");
        }
    }

    return <AdminClient />;
}
