import type { Metadata } from "next";
import { ContactClient } from "./ContactClient";

export const metadata: Metadata = {
    title: "Direct Partnerships & Contact | TalentHaus",
    description: "Book talent or initiate brand partnerships. Connect directly with our Indore headquarters.",
};

export default function ContactPage() {
    return <ContactClient />;
}
