"use client";

import { motion } from "motion/react";
import { useI18n } from "@/lib/i18n";

const partners = [
    { name: "LobeChat", slug: "lobehub" },
    { name: "Cursor", slug: "cursor" },
    { name: "Dify", slug: "dify" },
    { name: "LangChain", slug: "langchain" },
    { name: "Vercel", slug: "vercel" },
    { name: "Next.js", slug: "nextjs" },
    { name: "FastAPI", slug: "fastapi" },
    { name: "Supabase", slug: "supabase" },
    { name: "Hugging Face", slug: "huggingface" },
    { name: "Midjourney", slug: "midjourney" },
    { name: "Figma", slug: "figma" },
    { name: "Docker", slug: "docker" }
];

const ICON_CDN = "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light";

export default function Partners() {
    const { t } = useI18n();
    const allPartners = [...partners, ...partners];

    return (
        <section className="relative py-24 border-t border-border overflow-hidden">
            <div className="mx-auto max-w-6xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                        {t("partners.title")}
                    </h2>
                    <p className="mt-3 text-muted-foreground text-sm">{t("partners.subtitle")}</p>
                </motion.div>
            </div>

            <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-background to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-background to-transparent z-10" />

                <div className="flex gap-5 animate-marquee" style={{ "--duration": "40s" } as React.CSSProperties}>
                    {allPartners.map((partner, i) => (
                        <div
                            key={`${partner.name}-${i}`}
                            className="flex-shrink-0 flex items-center gap-3 px-7 py-3.5 rounded-lg glass-card !shadow-none border border-border/50"
                        >
                            <img
                                src={`${ICON_CDN}/${partner.slug}.png`}
                                alt={partner.name}
                                className="w-5 h-5 rounded drop-shadow-sm"
                                loading="lazy"
                                onError={(e) => {
                                    // Fallback if icon missing
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                            <span className="text-sm font-medium text-foreground whitespace-nowrap">
                                {partner.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
