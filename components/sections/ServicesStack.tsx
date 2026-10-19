"use client";

import React, { useState } from "react";
import { services } from "@/content/services";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

function ServiceCard({
    service,
}: {
    service: (typeof services)[0];
}) {
    const [open, setOpen] = useState(false);

    return (
        <div
            className={cn(
                "border-b border-[#C084FC]/20 group transition-colors duration-300",
                open ? "bg-[#250F40]/40" : "hover:bg-white/[0.02]"
            )}
        >
            <button
                className="w-full flex items-start justify-between gap-8 py-6 md:py-8 text-left"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls={`service-panel-${service.slug}`}
            >
                <div className="flex items-start gap-4 md:gap-8 min-w-0">
                    {/* Number */}
                    <span className="font-mono text-[#C084FC] text-xs sm:text-sm tracking-widest mt-1 md:mt-2 flex-shrink-0 font-semibold">
                        {service.number}
                    </span>
                    {/* Title */}
                    <div className="min-w-0">
                        <h3 className={cn(
                            "font-display text-white",
                            "text-xl sm:text-2xl md:text-3xl lg:text-4xl",
                            "leading-tight tracking-tight group-hover:text-[#DDD6FE] transition-colors"
                        )}>
                            {service.title}
                        </h3>
                        <p className="font-body text-[#DDD6FE]/70 text-sm mt-1 hidden md:block">{service.tagline}</p>
                    </div>
                </div>
                {/* Expand icon */}
                <ArrowUpRight
                    size={20}
                    className={cn(
                        "flex-shrink-0 mt-2 text-[#C084FC]/70 transition-all duration-300",
                        open ? "rotate-[135deg] text-[#C084FC]" : "group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    )}
                />
            </button>

            {/* Expandable details */}
            <div
                id={`service-panel-${service.slug}`}
                role="region"
                className={cn(
                    "overflow-hidden transition-all duration-500",
                    open ? "max-h-96 pb-8 opacity-100" : "max-h-0 pb-0 opacity-0"
                )}
            >
                <div className="pl-[calc(1.75rem+2rem)] md:pl-[calc(3.5rem+2rem)] pr-8">
                    <p className="font-body text-[#DDD6FE]/80 text-base leading-relaxed mb-6 max-w-2xl">
                        {service.description}
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {service.deliverables.map((d) => (
                            <li key={d} className="flex items-center gap-2 font-body text-sm text-[#DDD6FE]/75">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#C084FC] flex-shrink-0" />
                                {d}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export function ServicesStack() {
    return (
        <section
            className="py-28 md:py-36 relative overflow-hidden border-b border-[#C084FC]/20"
            style={{
                background:
                    "radial-gradient(ellipse at 80% 20%, rgba(139, 92, 246, 0.25) 0%, rgba(17, 9, 30, 0.95) 55%, #0D0614 100%)",
            }}
            aria-labelledby="services-heading"
        >
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
                    <div>
                        <p className="eyebrow mb-4 text-[#C084FC] tracking-[0.28em] text-xs uppercase font-semibold">
                            03 / What We Do
                        </p>
                        <h2
                            id="services-heading"
                            className={cn(
                                "font-display text-white",
                                "text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
                                "leading-tight tracking-tight max-w-lg"
                            )}
                        >
                            Capabilities that <em className="italic bg-gradient-to-r from-white via-[#E9D5FF] to-[#C084FC] bg-clip-text text-transparent font-normal">build your future.</em>
                        </h2>
                    </div>
                    <a
                        href="/services"
                        className="font-body text-xs sm:text-sm text-[#C084FC] hover:text-white transition-colors duration-200 underline underline-offset-4 decoration-[#C084FC]/30 hover:decoration-[#C084FC] flex-shrink-0 uppercase tracking-wider font-semibold"
                    >
                        See all services →
                    </a>
                </div>

                {/* Accordion cards */}
                <div className="border-t border-[#C084FC]/20">
                    {services.map((service) => (
                        <ServiceCard key={service.slug} service={service} />
                    ))}
                </div>
            </div>
        </section>
    );
}
