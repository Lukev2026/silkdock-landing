"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check, ArrowRight, Sparkles, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

function PricingCard({
    name, price, unit, description, features, cta, highlighted, delay,
}: {
    name: string; price: string; unit: string; description: string;
    features: string[]; cta: string; highlighted?: boolean; delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className={`relative glass-card rounded-2xl p-8 flex flex-col ${highlighted ? "ring-2 ring-primary/30" : ""}`}
        >
            {highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        <Sparkles className="w-3 h-3" /> Most Popular
                    </span>
                </div>
            )}
            <h3 className="text-xl font-bold text-foreground">{name}</h3>
            <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold gradient-text">{price}</span>
                <span className="text-sm text-muted-foreground">{unit}</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{description}</p>

            <ul className="mt-8 space-y-3 flex-1">
                {features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span className="text-foreground">{f}</span>
                    </li>
                ))}
            </ul>

            <Button
                size="lg"
                className={`mt-8 w-full h-12 rounded-xl text-base font-medium ${highlighted ? "btn-gradient" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
            >
                <span className="relative z-10 flex items-center gap-2 justify-center">
                    {cta}
                    <ArrowRight className="w-4 h-4" />
                </span>
            </Button>
        </motion.div>
    );
}

function FAQItem({ q, a, delay }: { q: string; a: string; delay: number }) {
    const [open, setOpen] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="glass-card rounded-xl overflow-hidden"
        >
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between p-5 text-left"
            >
                <span className="font-medium text-foreground pr-4">{q}</span>
                <HelpCircle className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                    {a}
                </div>
            )}
        </motion.div>
    );
}

export default function PricingPage() {
    const { t } = useI18n();

    const plans = [
        {
            name: t("pricing.free.name"),
            price: "$0",
            unit: "",
            description: t("pricing.free.desc"),
            features: [
                t("pricing.free.f1"),
                t("pricing.free.f2"),
                t("pricing.free.f3"),
                t("pricing.free.f4"),
                t("pricing.free.f5"),
            ],
            cta: t("pricing.free.cta"),
        },
        {
            name: t("pricing.pro.name"),
            price: "$29",
            unit: "/ mo",
            description: t("pricing.pro.desc"),
            features: [
                t("pricing.pro.f1"),
                t("pricing.pro.f2"),
                t("pricing.pro.f3"),
                t("pricing.pro.f4"),
                t("pricing.pro.f5"),
                t("pricing.pro.f6"),
            ],
            cta: t("pricing.pro.cta"),
            highlighted: true,
        },
        {
            name: t("pricing.enterprise.name"),
            price: t("pricing.enterprise.price"),
            unit: "",
            description: t("pricing.enterprise.desc"),
            features: [
                t("pricing.enterprise.f1"),
                t("pricing.enterprise.f2"),
                t("pricing.enterprise.f3"),
                t("pricing.enterprise.f4"),
                t("pricing.enterprise.f5"),
                t("pricing.enterprise.f6"),
            ],
            cta: t("pricing.enterprise.cta"),
        },
    ];

    const faqs = [
        { q: t("pricing.faq.q1"), a: t("pricing.faq.a1") },
        { q: t("pricing.faq.q2"), a: t("pricing.faq.a2") },
        { q: t("pricing.faq.q3"), a: t("pricing.faq.a3") },
        { q: t("pricing.faq.q4"), a: t("pricing.faq.a4") },
    ];

    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-24 pb-16">
                <div className="mx-auto max-w-6xl px-6">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                            <span className="text-foreground">{t("pricing.title1")}</span>
                            <span className="gradient-text">{t("pricing.title2")}</span>
                        </h1>
                        <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
                            {t("pricing.subtitle")}
                        </p>
                    </motion.div>

                    {/* Pricing cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
                        {plans.map((plan, i) => (
                            <PricingCard key={plan.name} {...plan} delay={i * 0.1} />
                        ))}
                    </div>

                    {/* Pay-as-you-go note */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="glass-card rounded-2xl p-8 text-center mb-24"
                    >
                        <h3 className="text-xl font-bold text-foreground mb-2">{t("pricing.payg.title")}</h3>
                        <p className="text-muted-foreground max-w-xl mx-auto">{t("pricing.payg.desc")}</p>
                    </motion.div>

                    {/* FAQ */}
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{t("pricing.faq.title")}</h2>
                        <div className="space-y-3">
                            {faqs.map((faq, i) => (
                                <FAQItem key={i} {...faq} delay={0.3 + i * 0.05} />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
