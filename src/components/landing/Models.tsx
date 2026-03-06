"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface Model {
    name: string;
    provider: string;
    providerColor: string;
    context: string;
    inputPrice: string;
    outputPrice: string;
    tags: string[];
}

const models: Model[] = [
    { name: "GPT-5", provider: "OpenAI", providerColor: "text-green-500", context: "256K", inputPrice: "$2.50", outputPrice: "$10.00", tags: ["Chat", "Code", "Vision"] },
    { name: "Claude Opus 4", provider: "Anthropic", providerColor: "text-orange-500", context: "200K", inputPrice: "$15.00", outputPrice: "$75.00", tags: ["Chat", "Code", "Agents"] },
    { name: "Gemini 3 Pro", provider: "Google", providerColor: "text-blue-500", context: "2M", inputPrice: "$1.25", outputPrice: "$5.00", tags: ["Chat", "Vision", "Video"] },
    { name: "DeepSeek R1", provider: "DeepSeek", providerColor: "text-indigo-500", context: "128K", inputPrice: "$0.55", outputPrice: "$2.19", tags: ["Chat", "Reasoning"] },
    { name: "Llama 4 Maverick", provider: "Meta", providerColor: "text-sky-500", context: "1M", inputPrice: "$0.20", outputPrice: "$0.60", tags: ["Chat", "Code", "Open Source"] },
    { name: "Qwen 3 235B", provider: "Alibaba", providerColor: "text-amber-500", context: "128K", inputPrice: "$0.30", outputPrice: "$1.20", tags: ["Chat", "Multilingual"] },
];

function ModelCard({ model, index }: { model: Model; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: index * 0.06, duration: 0.4 }}
            className="group glass-card rounded-xl p-5"
        >
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {model.name}
                    </h3>
                    <p className={`text-xs ${model.providerColor} mt-0.5 font-medium`}>{model.provider}</p>
                </div>
                <span className="text-xs text-muted-foreground bg-foreground/[0.04] px-2 py-1 rounded-md font-mono">
                    {model.context}
                </span>
            </div>

            <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
                <div>
                    <span className="text-foreground font-medium">{model.inputPrice}</span>
                    <span className="ml-1">/ 1M in</span>
                </div>
                <div>
                    <span className="text-foreground font-medium">{model.outputPrice}</span>
                    <span className="ml-1">/ 1M out</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
                {model.tags.map((tag) => (
                    <Badge
                        key={tag}
                        variant="secondary"
                        className="text-[10px] px-2 py-0.5 bg-foreground/[0.04] text-muted-foreground border-0 font-normal"
                    >
                        {tag}
                    </Badge>
                ))}
            </div>
        </motion.div>
    );
}

export default function Models() {
    const { t } = useI18n();

    return (
        <section id="models" className="relative py-24 md:py-32 border-t border-border">
            <div className="mx-auto max-w-6xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                        <span className="text-foreground">{t("models.title1")}</span>
                        <span className="gradient-text">{t("models.title2")}</span>
                    </h2>
                    <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
                        {t("models.subtitle")}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {models.map((model, i) => (
                        <ModelCard key={model.name} model={model} index={i} />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mt-10"
                >
                    <a
                        href="/models"
                        className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors group"
                    >
                        {t("models.viewall")}
                        <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
