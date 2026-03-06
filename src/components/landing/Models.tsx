"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Search, ExternalLink, ChevronDown, Type, Image, AudioLines, Video, Sparkles, LayoutGrid } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";

const ICON_CDN = "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files";

// ─── Data ──────────────────────────────────────────────────────────────

interface Model {
    name: string;
    provider: string;
    providerIcon: string;
    type: "text" | "image" | "audio" | "video" | "embedding";
    context: string;
    inputPrice: number;
    outputPrice: number;
    badge?: "HOT" | "NEW" | "-30%" | "-50%";
    featured?: boolean;
}

const providerList = [
    { name: "OpenAI", slug: "openai" },
    { name: "Anthropic", slug: "claude-color" },
    { name: "Google", slug: "gemini-color" },
    { name: "DeepSeek", slug: "deepseek-color" },
    { name: "Meta", slug: "meta-color" },
    { name: "Qwen", slug: "qwen-color" },
    { name: "Mistral", slug: "mistral-color" },
    { name: "Stability", slug: "stability-color" },
];

const typeFilters = [
    { key: "featured", label: { en: "⚡ Featured", zh: "⚡ 精选" }, icon: Sparkles },
    { key: "all", label: { en: "All Models", zh: "所有模型" }, icon: LayoutGrid },
    { key: "text", label: { en: "Text", zh: "文本" }, icon: Type },
    { key: "image", label: { en: "Image", zh: "图像" }, icon: Image },
    { key: "audio", label: { en: "Audio", zh: "音频" }, icon: AudioLines },
    { key: "video", label: { en: "Video", zh: "视频" }, icon: Video },
];

const allModels: Model[] = [
    // Text — flagships
    { name: "gpt-5", provider: "OpenAI", providerIcon: "openai", type: "text", context: "256K", inputPrice: 2.5, outputPrice: 10.0, badge: "NEW", featured: true },
    { name: "gpt-4.1", provider: "OpenAI", providerIcon: "openai", type: "text", context: "1M", inputPrice: 2.0, outputPrice: 8.0, featured: true },
    { name: "gpt-4o-mini", provider: "OpenAI", providerIcon: "openai", type: "text", context: "128K", inputPrice: 0.15, outputPrice: 0.6, badge: "HOT" },
    { name: "o3", provider: "OpenAI", providerIcon: "openai", type: "text", context: "200K", inputPrice: 10.0, outputPrice: 40.0, badge: "NEW" },
    { name: "claude-opus-4", provider: "Anthropic", providerIcon: "claude-color", type: "text", context: "200K", inputPrice: 15.0, outputPrice: 75.0, featured: true },
    { name: "claude-sonnet-4", provider: "Anthropic", providerIcon: "claude-color", type: "text", context: "200K", inputPrice: 3.0, outputPrice: 15.0, badge: "HOT", featured: true },
    { name: "claude-haiku-3.5", provider: "Anthropic", providerIcon: "claude-color", type: "text", context: "200K", inputPrice: 0.8, outputPrice: 4.0 },
    { name: "gemini-2.5-pro", provider: "Google", providerIcon: "gemini-color", type: "text", context: "1M", inputPrice: 1.25, outputPrice: 5.0, badge: "HOT", featured: true },
    { name: "gemini-2.5-flash", provider: "Google", providerIcon: "gemini-color", type: "text", context: "1M", inputPrice: 0.15, outputPrice: 0.6, badge: "-30%", featured: true },
    { name: "deepseek-r1", provider: "DeepSeek", providerIcon: "deepseek-color", type: "text", context: "128K", inputPrice: 0.55, outputPrice: 2.19, badge: "HOT", featured: true },
    { name: "deepseek-v3", provider: "DeepSeek", providerIcon: "deepseek-color", type: "text", context: "128K", inputPrice: 0.27, outputPrice: 1.1, badge: "-50%" },
    { name: "llama-4-maverick", provider: "Meta", providerIcon: "meta-color", type: "text", context: "1M", inputPrice: 0.2, outputPrice: 0.6, featured: true },
    { name: "llama-4-scout", provider: "Meta", providerIcon: "meta-color", type: "text", context: "10M", inputPrice: 0.15, outputPrice: 0.45, badge: "NEW" },
    { name: "qwen-3-235b", provider: "Qwen", providerIcon: "qwen-color", type: "text", context: "128K", inputPrice: 0.3, outputPrice: 1.2, featured: true },
    { name: "qwen-3-32b", provider: "Qwen", providerIcon: "qwen-color", type: "text", context: "128K", inputPrice: 0.1, outputPrice: 0.4, badge: "-30%" },
    { name: "mistral-large", provider: "Mistral", providerIcon: "mistral-color", type: "text", context: "128K", inputPrice: 2.0, outputPrice: 6.0 },
    // Image
    { name: "dall-e-4", provider: "OpenAI", providerIcon: "openai", type: "image", context: "-", inputPrice: 0.04, outputPrice: 0.0, badge: "NEW", featured: true },
    { name: "stable-diffusion-3.5", provider: "Stability", providerIcon: "stability-color", type: "image", context: "-", inputPrice: 0.03, outputPrice: 0.0, badge: "-30%" },
    { name: "imagen-4", provider: "Google", providerIcon: "gemini-color", type: "image", context: "-", inputPrice: 0.04, outputPrice: 0.0, badge: "NEW" },
    // Audio
    { name: "whisper-v4", provider: "OpenAI", providerIcon: "openai", type: "audio", context: "-", inputPrice: 0.006, outputPrice: 0.0 },
    { name: "tts-1-hd", provider: "OpenAI", providerIcon: "openai", type: "audio", context: "-", inputPrice: 0.03, outputPrice: 0.0 },
    // Video
    { name: "sora-2", provider: "OpenAI", providerIcon: "openai", type: "video", context: "-", inputPrice: 0.1, outputPrice: 0.0, badge: "NEW", featured: true },
    { name: "veo-3", provider: "Google", providerIcon: "gemini-color", type: "video", context: "-", inputPrice: 0.08, outputPrice: 0.0, badge: "HOT" },
    // Embedding
    { name: "text-embedding-3-large", provider: "OpenAI", providerIcon: "openai", type: "embedding", context: "8K", inputPrice: 0.13, outputPrice: 0.0 },
];

// ─── Components ────────────────────────────────────────────────────────

function ProviderIcon({ slug, size = 18 }: { slug: string; size?: number }) {
    const { theme } = useTheme();
    const mode = theme === "dark" ? "dark" : "light";
    return (
        <img
            src={`${ICON_CDN}/${mode}/${slug}.png`}
            alt=""
            width={size}
            height={size}
            className="inline-block shrink-0"
            loading="lazy"
        />
    );
}

const typeLabelMap: Record<string, { en: string; zh: string }> = {
    text: { en: "Text", zh: "文本" },
    image: { en: "Image", zh: "图像" },
    audio: { en: "Audio", zh: "音频" },
    video: { en: "Video", zh: "视频" },
    embedding: { en: "Embed", zh: "嵌入" },
};

const badgeColors: Record<string, string> = {
    HOT: "bg-red-500/10 text-red-500 border-red-500/20",
    NEW: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "-30%": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    "-50%": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
};

function ModelCard({ model, locale }: { model: Model; locale: string }) {
    const typeLabel = typeLabelMap[model.type]?.[locale as "en" | "zh"] ?? model.type;
    return (
        <div className="group relative bg-card border border-border/60 rounded-xl p-4 hover:border-primary/30 hover:shadow-sm transition-all duration-200">
            {/* Badge */}
            {model.badge && (
                <span className={`absolute top-3 right-3 text-[10px] font-semibold px-1.5 py-0.5 rounded border ${badgeColors[model.badge]}`}>
                    {model.badge}
                </span>
            )}

            {/* Header: icon + name */}
            <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-muted/50 border border-border/40 flex items-center justify-center shrink-0">
                    <ProviderIcon slug={model.providerIcon} size={18} />
                </div>
                <div className="min-w-0">
                    <div className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">{model.name}</div>
                    <div className="text-[11px] text-muted-foreground">{model.provider}</div>
                </div>
            </div>

            {/* Type + context */}
            <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground">
                    {typeLabel}
                </span>
                {model.context !== "-" && (
                    <span className="text-[10px] text-muted-foreground font-mono">{model.context}</span>
                )}
            </div>

            {/* Pricing */}
            <div className="flex items-center gap-3 text-xs">
                <div>
                    <span className="font-semibold text-foreground">${model.inputPrice < 0.01 ? model.inputPrice.toFixed(3) : model.inputPrice.toFixed(2)}</span>
                    <span className="text-muted-foreground">/Mt</span>
                </div>
                {model.outputPrice > 0 && (
                    <>
                        <div className="w-px h-3 bg-border" />
                        <div>
                            <span className="font-semibold text-foreground">${model.outputPrice.toFixed(2)}</span>
                            <span className="text-muted-foreground">/Mt</span>
                        </div>
                    </>
                )}
                <div className="ml-auto text-[10px] text-muted-foreground">
                    {locale === "zh" ? "输入 / 输出" : "in / out"}
                </div>
            </div>
        </div>
    );
}

// ─── Main Section ──────────────────────────────────────────────────────

export default function Models() {
    const { t, locale } = useI18n();
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("featured");
    const [providerFilter, setProviderFilter] = useState<string | null>(null);
    const [showMoreProviders, setShowMoreProviders] = useState(false);

    const visibleProviders = providerList.slice(0, 6);
    const moreProviders = providerList.slice(6);

    const filtered = useMemo(() => {
        return allModels.filter((m) => {
            const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.provider.toLowerCase().includes(search.toLowerCase());
            const matchType = typeFilter === "all" ? true : typeFilter === "featured" ? m.featured : m.type === typeFilter;
            const matchProvider = !providerFilter || m.provider === providerFilter;
            return matchSearch && matchType && matchProvider;
        });
    }, [search, typeFilter, providerFilter]);

    const sectionTitle = typeFilter === "featured"
        ? (locale === "zh" ? "精选模型" : "Featured Models")
        : typeFilter === "all"
            ? (locale === "zh" ? "所有模型" : "All Models")
            : (typeLabelMap[typeFilter]?.[locale as "en" | "zh"] ?? typeFilter);

    return (
        <section id="models" className="relative py-12 md:py-16">
            <div className="mx-auto max-w-6xl px-6">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-8"
                >
                    <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
                        <span className="text-foreground">{t("models.title1")}</span>
                        <span className="gradient-text">{t("models.title2")}</span>
                    </h2>
                    <p className="mt-3 text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
                        {t("models.subtitle")}
                    </p>
                </motion.div>

                {/* Search bar */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 }}
                    className="mb-5"
                >
                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder={locale === "zh" ? "搜索模型名称或ID" : "Search model name or ID"}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/30 transition-colors"
                        />
                    </div>
                </motion.div>

                {/* Type filter tabs */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center justify-center gap-1 mb-4 flex-wrap"
                >
                    {typeFilters.map((tf) => {
                        const Icon = tf.icon;
                        const active = typeFilter === tf.key;
                        return (
                            <button
                                key={tf.key}
                                onClick={() => setTypeFilter(tf.key)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${active
                                    ? "bg-foreground text-background"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {tf.label[locale as "en" | "zh"]}
                            </button>
                        );
                    })}
                </motion.div>

                {/* Provider filter */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className="flex items-center justify-center gap-1.5 mb-8 flex-wrap"
                >
                    <span className="text-xs text-muted-foreground mr-1">{locale === "zh" ? "厂商：" : "Provider:"}</span>
                    <button
                        onClick={() => setProviderFilter(null)}
                        className={`px-2 py-1 text-xs rounded-md transition-colors ${!providerFilter ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        {locale === "zh" ? "全部" : "All"}
                    </button>
                    {visibleProviders.map((p) => (
                        <button
                            key={p.name}
                            onClick={() => setProviderFilter(providerFilter === p.name ? null : p.name)}
                            className={`flex items-center gap-1.5 px-2 py-1 text-xs rounded-md transition-colors ${providerFilter === p.name
                                ? "bg-primary/10 text-primary font-medium border border-primary/20"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <ProviderIcon slug={p.slug} size={14} />
                            {p.name}
                        </button>
                    ))}
                    {moreProviders.length > 0 && (
                        <div className="relative">
                            <button
                                onClick={() => setShowMoreProviders(!showMoreProviders)}
                                className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground rounded-md transition-colors"
                            >
                                {locale === "zh" ? "更多" : "More"}
                                <ChevronDown className={`w-3 h-3 transition-transform ${showMoreProviders ? "rotate-180" : ""}`} />
                            </button>
                            {showMoreProviders && (
                                <div className="absolute top-full left-0 mt-1 py-1 bg-popover border border-border rounded-lg shadow-lg z-20 min-w-[120px]">
                                    {moreProviders.map((p) => (
                                        <button
                                            key={p.name}
                                            onClick={() => { setProviderFilter(p.name); setShowMoreProviders(false); }}
                                            className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                                        >
                                            <ProviderIcon slug={p.slug} size={14} />
                                            {p.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>

                {/* Section sub-heading */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-foreground">
                        {sectionTitle}
                        <span className="ml-2 text-muted-foreground font-normal">({filtered.length})</span>
                    </h3>
                    <a
                        href="/models"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                        {t("models.viewall")}
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>

                {/* Model grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {filtered.map((model, i) => (
                        <motion.div
                            key={model.name}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-20px" }}
                            transition={{ delay: Math.min(i * 0.03, 0.3), duration: 0.3 }}
                        >
                            <ModelCard model={model} locale={locale} />
                        </motion.div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground text-sm">
                        {locale === "zh" ? "未找到匹配模型" : "No models found. Try adjusting your filters."}
                    </div>
                )}
            </div>
        </section>
    );
}
