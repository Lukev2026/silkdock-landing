"use client";

import { motion } from "motion/react";
import { Shuffle, Shield, Zap, BarChart3, Globe, Layers } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    accentColor: string;
    index: number;
    span?: string;
}

function FeatureCard({ icon, title, description, accentColor, index, span = "" }: FeatureCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
            className={`group relative rounded-2xl glass-card p-6 md:p-8 overflow-hidden ${span}`}
        >
            {/* Subtle accent line at top */}
            <div
                className="absolute top-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
            />

            <div className="relative z-10">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                    style={{ background: `color-mix(in oklch, ${accentColor} 8%, transparent)` }}
                >
                    {icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
        </motion.div>
    );
}

export default function Features() {
    const { t } = useI18n();

    const features = [
        {
            icon: <Shuffle className="w-5 h-5 text-blue-500" />,
            title: t("features.unified.title"),
            description: t("features.unified.desc"),
            accentColor: "#3b82f6",
            span: "md:col-span-2",
        },
        {
            icon: <Zap className="w-5 h-5 text-amber-500" />,
            title: t("features.routing.title"),
            description: t("features.routing.desc"),
            accentColor: "#f59e0b",
        },
        {
            icon: <Shield className="w-5 h-5 text-emerald-500" />,
            title: t("features.ha.title"),
            description: t("features.ha.desc"),
            accentColor: "#10b981",
        },
        {
            icon: <BarChart3 className="w-5 h-5 text-purple-500" />,
            title: t("features.cost.title"),
            description: t("features.cost.desc"),
            accentColor: "#8b5cf6",
            span: "md:col-span-2",
        },
        {
            icon: <Globe className="w-5 h-5 text-cyan-500" />,
            title: t("features.global.title"),
            description: t("features.global.desc"),
            accentColor: "#06b6d4",
            span: "sm:col-span-1 md:col-span-1",
        },
        {
            icon: <Layers className="w-5 h-5 text-rose-500" />,
            title: t("features.multimodal.title"),
            description: t("features.multimodal.desc"),
            accentColor: "#f43f5e",
            span: "sm:col-span-1 md:col-span-2",
        },
    ];

    return (
        <section id="features" className="relative py-24 md:py-32">
            <div className="mx-auto max-w-6xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                        <span className="text-foreground">{t("features.title1")}</span>
                        <span className="gradient-text">{t("features.title2")}</span>
                    </h2>
                    <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
                        {t("features.subtitle")}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {features.map((feature, i) => (
                        <FeatureCard key={feature.title} {...feature} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
