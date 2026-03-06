"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Search, Filter, ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const ICON_CDN = "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files";

interface Model {
    name: string;
    provider: string;
    providerColor: string;
    providerIcon: string; // LobeHub icon slug
    context: string;
    inputPrice: number;
    outputPrice: number;
    tags: string[];
    description: string;
}

// Map provider name → LobeHub icon slug
const providerIcons: Record<string, string> = {
    OpenAI: "openai",
    Anthropic: "claude-color",
    Google: "gemini-color",
    DeepSeek: "deepseek-color",
    Meta: "meta-color",
    Alibaba: "qwen-color",
    Mistral: "mistral-color",
    Stability: "stability-color",
};

const allModels: Model[] = [
    { name: "GPT-5", provider: "OpenAI", providerColor: "text-green-500", providerIcon: "openai", context: "256K", inputPrice: 2.5, outputPrice: 10.0, tags: ["Chat", "Code", "Vision", "Function Calling"], description: "Most advanced reasoning model from OpenAI" },
    { name: "GPT-4.1", provider: "OpenAI", providerColor: "text-green-500", providerIcon: "openai", context: "1M", inputPrice: 2.0, outputPrice: 8.0, tags: ["Chat", "Code", "Vision"], description: "Efficient reasoning with extended context" },
    { name: "GPT-4o mini", provider: "OpenAI", providerColor: "text-green-500", providerIcon: "openai", context: "128K", inputPrice: 0.15, outputPrice: 0.6, tags: ["Chat", "Vision"], description: "Cost-effective for everyday tasks" },
    { name: "Claude Opus 4", provider: "Anthropic", providerColor: "text-orange-500", providerIcon: "claude-color", context: "200K", inputPrice: 15.0, outputPrice: 75.0, tags: ["Chat", "Code", "Agents"], description: "Most capable model for complex reasoning and coding" },
    { name: "Claude Sonnet 4", provider: "Anthropic", providerColor: "text-orange-500", providerIcon: "claude-color", context: "200K", inputPrice: 3.0, outputPrice: 15.0, tags: ["Chat", "Code", "Vision"], description: "High-performance balanced model" },
    { name: "Claude Haiku 3.5", provider: "Anthropic", providerColor: "text-orange-500", providerIcon: "claude-color", context: "200K", inputPrice: 0.8, outputPrice: 4.0, tags: ["Chat", "Code"], description: "Fastest model with excellent quality" },
    { name: "Gemini 3 Pro", provider: "Google", providerColor: "text-blue-500", providerIcon: "gemini-color", context: "2M", inputPrice: 1.25, outputPrice: 5.0, tags: ["Chat", "Vision", "Video", "Code"], description: "Next-gen multimodal with 2M context" },
    { name: "Gemini 2.5 Flash", provider: "Google", providerColor: "text-blue-500", providerIcon: "gemini-color", context: "1M", inputPrice: 0.15, outputPrice: 0.6, tags: ["Chat", "Vision", "Reasoning"], description: "Fast thinking model with hybrid reasoning" },
    { name: "DeepSeek R1", provider: "DeepSeek", providerColor: "text-indigo-500", providerIcon: "deepseek-color", context: "128K", inputPrice: 0.55, outputPrice: 2.19, tags: ["Chat", "Reasoning", "Code"], description: "Advanced reasoning model" },
    { name: "DeepSeek V3", provider: "DeepSeek", providerColor: "text-indigo-500", providerIcon: "deepseek-color", context: "128K", inputPrice: 0.27, outputPrice: 1.1, tags: ["Chat", "Code"], description: "High-efficiency open model" },
    { name: "Llama 4 Maverick", provider: "Meta", providerColor: "text-sky-500", providerIcon: "meta-color", context: "1M", inputPrice: 0.2, outputPrice: 0.6, tags: ["Chat", "Code", "Open Source"], description: "Meta's latest open-source flagship" },
    { name: "Llama 4 Scout", provider: "Meta", providerColor: "text-sky-500", providerIcon: "meta-color", context: "10M", inputPrice: 0.15, outputPrice: 0.45, tags: ["Chat", "Open Source"], description: "Ultra-long context open model" },
    { name: "Qwen 3 235B", provider: "Alibaba", providerColor: "text-amber-500", providerIcon: "qwen-color", context: "128K", inputPrice: 0.3, outputPrice: 1.2, tags: ["Chat", "Code", "Multilingual"], description: "Leading multilingual model" },
    { name: "Mistral Large", provider: "Mistral", providerColor: "text-red-500", providerIcon: "mistral-color", context: "128K", inputPrice: 2.0, outputPrice: 6.0, tags: ["Chat", "Code", "Function Calling"], description: "Top-tier model with native function calling" },
    { name: "DALL-E 4", provider: "OpenAI", providerColor: "text-green-500", providerIcon: "dalle-color", context: "-", inputPrice: 0.04, outputPrice: 0.0, tags: ["Image Generation"], description: "State-of-the-art image generation" },
    { name: "Stable Diffusion 3.5", provider: "Stability", providerColor: "text-purple-500", providerIcon: "stability-color", context: "-", inputPrice: 0.03, outputPrice: 0.0, tags: ["Image Generation", "Open Source"], description: "Open-source image model" },
    { name: "text-embedding-3-large", provider: "OpenAI", providerColor: "text-green-500", providerIcon: "openai", context: "8K", inputPrice: 0.13, outputPrice: 0.0, tags: ["Embedding"], description: "High-dimension text embedding" },
    { name: "Whisper v4", provider: "OpenAI", providerColor: "text-green-500", providerIcon: "openai", context: "-", inputPrice: 0.006, outputPrice: 0.0, tags: ["Speech-to-Text"], description: "Multilingual speech recognition" },
];

const categories = ["All", "Chat", "Code", "Vision", "Reasoning", "Image Generation", "Embedding", "Open Source"];
const providers = ["All", "OpenAI", "Anthropic", "Google", "DeepSeek", "Meta", "Alibaba", "Mistral", "Stability"];

function ProviderIcon({ slug, size = 20, className = "" }: { slug: string; size?: number; className?: string }) {
    const { theme } = useTheme();
    const mode = theme === "dark" ? "dark" : "light";
    return (
        <img
            src={`${ICON_CDN}/${mode}/${slug}.png`}
            alt=""
            width={size}
            height={size}
            className={`inline-block shrink-0 ${className}`}
            loading="lazy"
        />
    );
}

export default function ModelsPage() {
    const { t } = useI18n();
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [provider, setProvider] = useState("All");

    const filtered = useMemo(() => {
        return allModels.filter((m) => {
            const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                m.provider.toLowerCase().includes(search.toLowerCase()) ||
                m.description.toLowerCase().includes(search.toLowerCase());
            const matchCat = category === "All" || m.tags.includes(category);
            const matchProvider = provider === "All" || m.provider === provider;
            return matchSearch && matchCat && matchProvider;
        });
    }, [search, category, provider]);

    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-24 pb-16">
                <div className="mx-auto max-w-6xl px-6">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                            <span className="text-foreground">{t("models.page.title1")}</span>
                            <span className="gradient-text">{t("models.page.title2")}</span>
                        </h1>
                        <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
                            {t("models.page.subtitle")}
                        </p>
                    </motion.div>

                    {/* Search & Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-8 space-y-4"
                    >
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder={t("models.page.search")}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full h-12 pl-11 pr-4 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-colors"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${category === cat
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-foreground/[0.04] text-muted-foreground hover:text-foreground hover:bg-foreground/[0.08]"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                            {providers.map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setProvider(p)}
                                    className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md transition-colors ${provider === p
                                        ? "bg-primary/10 text-primary border border-primary/20"
                                        : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    {p !== "All" && providerIcons[p] && (
                                        <ProviderIcon slug={providerIcons[p]} size={14} />
                                    )}
                                    {p}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Results count */}
                    <div className="text-sm text-muted-foreground mb-4">
                        {filtered.length} {t("models.page.results")}
                    </div>

                    {/* Model grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((model, i) => (
                            <motion.div
                                key={model.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03, duration: 0.3 }}
                                className="group glass-card rounded-lg p-5 cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 rounded-lg bg-foreground/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                                            <ProviderIcon slug={model.providerIcon} size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                                {model.name}
                                            </h3>
                                            <p className={`text-xs ${model.providerColor} mt-0 font-medium`}>{model.provider}</p>
                                        </div>
                                    </div>
                                    {model.context !== "-" && (
                                        <span className="text-xs text-muted-foreground bg-foreground/[0.04] px-2 py-1 rounded-md font-mono">
                                            {model.context}
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{model.description}</p>

                                <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
                                    <div>
                                        <span className="text-foreground font-medium">${model.inputPrice.toFixed(2)}</span>
                                        <span className="ml-1">/ 1M in</span>
                                    </div>
                                    {model.outputPrice > 0 && (
                                        <div>
                                            <span className="text-foreground font-medium">${model.outputPrice.toFixed(2)}</span>
                                            <span className="ml-1">/ 1M out</span>
                                        </div>
                                    )}
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
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="text-center py-20 text-muted-foreground">
                            <p className="text-lg">{t("models.page.noresults")}</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
