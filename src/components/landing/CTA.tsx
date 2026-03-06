"use client";

import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export default function CTA() {
    const { t } = useI18n();

    return (
        <section className="relative py-24 md:py-32 border-t border-border overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06] bg-primary blur-[120px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-primary/20 bg-primary/5 text-sm text-primary">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{t("cta.badge")}</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                        <span className="text-foreground">{t("cta.title1")}</span>
                        <span className="gradient-text">{t("cta.title2")}</span>
                    </h2>

                    <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
                        {t("cta.subtitle")}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8 w-full sm:w-auto">
                        <Button
                            size="lg"
                            className="btn-gradient w-full sm:w-auto sm:min-w-[200px] px-8 h-12 text-base font-medium group rounded-lg"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {t("cta.start")}
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto sm:min-w-[200px] text-muted-foreground hover:text-foreground h-12 text-base rounded-lg border-border hover:border-primary/30"
                        >
                            {t("cta.sales")}
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
