"use client";

import { motion } from "motion/react";
import { UserPlus, Key, Code } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function GettingStarted() {
    const { t } = useI18n();

    const steps = [
        {
            icon: <UserPlus className="w-5 h-5" />,
            step: "01",
            title: t("start.step1.title"),
            description: t("start.step1.desc"),
            color: "text-blue-500",
            borderColor: "border-blue-500/20",
            bgColor: "bg-blue-500/5",
        },
        {
            icon: <Key className="w-5 h-5" />,
            step: "02",
            title: t("start.step2.title"),
            description: t("start.step2.desc"),
            color: "text-purple-500",
            borderColor: "border-purple-500/20",
            bgColor: "bg-purple-500/5",
        },
        {
            icon: <Code className="w-5 h-5" />,
            step: "03",
            title: t("start.step3.title"),
            description: t("start.step3.desc"),
            color: "text-emerald-500",
            borderColor: "border-emerald-500/20",
            bgColor: "bg-emerald-500/5",
        },
    ];

    return (
        <section className="relative py-24 md:py-32 border-t border-border">
            <div className="mx-auto max-w-5xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                        <span className="text-foreground">{t("start.title1")}</span>
                        <span className="gradient-text">{t("start.title2")}</span>
                    </h2>
                    <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
                        {t("start.subtitle")}
                    </p>
                </motion.div>

                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="hidden md:block absolute top-12 left-[16.7%] right-[16.7%] h-px bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20" />

                    {steps.map((s, i) => (
                        <motion.div
                            key={s.step}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: i * 0.15, duration: 0.5 }}
                            className="relative text-center"
                        >
                            <div className={`w-12 h-12 mx-auto rounded-full border ${s.borderColor} ${s.bgColor} flex items-center justify-center mb-6 relative z-10`}>
                                <span className={s.color}>{s.icon}</span>
                            </div>
                            <div className={`text-xs font-mono ${s.color} mb-2`}>Step {s.step}</div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">{s.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-16 code-block rounded-xl overflow-hidden"
                >
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                        <span className="ml-3 text-xs text-neutral-500 font-mono">Terminal</span>
                    </div>
                    <pre className="px-5 py-4 text-sm font-mono overflow-x-auto leading-relaxed">
                        <code>
                            <span className="text-neutral-500">$ </span>
                            <span className="text-emerald-400">curl</span>
                            <span className="text-neutral-200"> https://api.silkdock.ai/v1/chat/completions \</span>
                            {"\n  "}
                            <span className="text-neutral-200">-H </span>
                            <span className="text-green-400">&quot;Authorization: Bearer sk-your-key&quot;</span>
                            <span className="text-neutral-200"> \</span>
                            {"\n  "}
                            <span className="text-neutral-200">-H </span>
                            <span className="text-green-400">&quot;Content-Type: application/json&quot;</span>
                            <span className="text-neutral-200"> \</span>
                            {"\n  "}
                            <span className="text-neutral-200">-d </span>
                            <span className="text-green-400">&apos;{`{"model":"gpt-5","messages":[{"role":"user","content":"Hello!"}]}`}&apos;</span>
                        </code>
                    </pre>
                </motion.div>
            </div>
        </section>
    );
}
