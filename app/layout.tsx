import type { Metadata } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { LayoutClient } from "@/components/layout/LayoutClient";
import { NavigationProgress } from "@/components/ui/NavigationProgress";
import { siteMeta } from "@/content/site";

const instrumentSerif = Instrument_Serif({
    subsets: ["latin"],
    weight: ["400"],
    style: ["normal", "italic"],
    variable: "--font-display-loaded",
    display: "swap",
});

const manrope = Manrope({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800"],
    variable: "--font-body-loaded",
    display: "swap",
});

export const metadata: Metadata = {
    metadataBase: new URL(siteMeta.url),
    title: {
        default: `${siteMeta.name} — ${siteMeta.tagline}`,
        template: `%s | ${siteMeta.name}`,
    },
    description: siteMeta.description,
    keywords: ["talent management", "influencer marketing", "creator economy", "brand partnerships"],
    openGraph: {
        type: "website",
        siteName: siteMeta.name,
        title: `${siteMeta.name} — ${siteMeta.tagline}`,
        description: siteMeta.description,
        url: siteMeta.url,
        images: [{ url: siteMeta.ogImage, width: 1200, height: 630 }],
    },
    twitter: {
        card: "summary_large_image",
        title: `${siteMeta.name} — ${siteMeta.tagline}`,
        description: siteMeta.description,
        images: [siteMeta.ogImage],
    },
    robots: { index: true, follow: true },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Organization",
            "@id": `${siteMeta.url}/#organization`,
            name: siteMeta.name,
            url: siteMeta.url,
            logo: {
                "@type": "ImageObject",
                url: `${siteMeta.url}${siteMeta.logo}`,
            },
            description: siteMeta.description,
        },
        {
            "@type": "WebSite",
            "@id": `${siteMeta.url}/#website`,
            url: siteMeta.url,
            name: siteMeta.name,
            publisher: { "@id": `${siteMeta.url}/#organization` },
        },
    ],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${instrumentSerif.variable} ${manrope.variable}`}>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                {/* Skip to main content (accessibility) */}
                <link rel="icon" href="/favicon.ico" sizes="any" />
            </head>
            <body
                style={{
                    fontFamily: "var(--font-body-loaded, var(--font-body))",
                }}
            >
                {/* Skip link */}
                <a
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-gold focus:text-obsidian focus:text-sm focus:font-medium focus:rounded"
                >
                    Skip to main content
                </a>
                <Suspense fallback={null}>
                    <NavigationProgress />
                </Suspense>
                <LayoutClient>{children}</LayoutClient>
            </body>
        </html>
    );
}
