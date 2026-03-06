"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Search, ExternalLink, ChevronDown, Type, Image, AudioLines, Video, Sparkles, LayoutGrid, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    { key: "featured", label: { en: "Featured", zh: "精选" }, icon: Sparkles },
    { key: "all", label: { en: "All Models", zh: "所有模型" }, icon: LayoutGrid },
    { key: "text", label: { en: "Text", zh: "文本" }, icon: Type },
    { key: "image", label: { en: "Image", zh: "图像" }, icon: Image },
    { key: "audio", label: { en: "Audio", zh: "音频" }, icon: AudioLines },
    { key: "video", label: { en: "Video", zh: "视频" }, icon: Video },
];

const allModels: Model[] = [
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
    { name: "dall-e-4", provider: "OpenAI", providerIcon: "openai", type: "image", context: "-", inputPrice: 0.04, outputPrice: 0.0, badge: "NEW", featured: true },
    { name: "stable-diffusion-3.5", provider: "Stability", providerIcon: "stability-color", type: "image", context: "-", inputPrice: 0.03, outputPrice: 0.0, badge: "-30%" },
    { name: "imagen-4", provider: "Google", providerIcon: "gemini-color", type: "image", context: "-", inputPrice: 0.04, outputPrice: 0.0, badge: "NEW" },
    { name: "whisper-v4", provider: "OpenAI", providerIcon: "openai", type: "audio", context: "-", inputPrice: 0.006, outputPrice: 0.0 },
    { name: "tts-1-hd", provider: "OpenAI", providerIcon: "openai", type: "audio", context: "-", inputPrice: 0.03, outputPrice: 0.0 },
    { name: "sora-2", provider: "OpenAI", providerIcon: "openai", type: "video", context: "-", inputPrice: 0.1, outputPrice: 0.0, badge: "NEW", featured: true },
    { name: "veo-3", provider: "Google", providerIcon: "gemini-color", type: "video", context: "-", inputPrice: 0.08, outputPrice: 0.0, badge: "HOT" },
    { name: "text-embedding-3-large", provider: "OpenAI", providerIcon: "openai", type: "embedding", context: "8K", inputPrice: 0.13, outputPrice: 0.0 },
];

const promoSlides = [
    {
        title: { en: "DeepSeek V3 — 50% OFF", zh: "DeepSeek V3 — 限时 5 折" },
        desc: { en: "High-efficiency reasoning at just $0.14/Mt.", zh: "高效推理模型仅需 $0.14/Mt，超高性价比。" },
        tag: "-50%",
    },
    {
        title: { en: "GPT-5 Now Available", zh: "GPT-5 全新上线" },
        desc: { en: "OpenAI's most powerful multimodal model.", zh: "OpenAI 最强多模态引擎，256K 超大上下文。" },
        tag: "NEW",
    },
    {
        title: { en: "Sora 2 API Live", zh: "Sora 2 API 现已开放" },
        desc: { en: "Generate 1080p videos at 60fps from text.", zh: "文本极速生成 1080p 60帧高清视频，抢先体验。" },
        tag: "NEW",
    },
];

// ─── Components ────────────────────────────────────────────────────────

// Cyberpunk Text Scramble Effect
function ScrambleText({ text }: { text: string }) {
    const [displayText, setDisplayText] = useState(text);

    useEffect(() => {
        let iteration = 0;
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/`~";
        let animationFrame: number;

        const animate = () => {
            setDisplayText((prev) =>
                text
                    .split("")
                    .map((char, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("")
            );

            if (iteration >= text.length) {
                cancelAnimationFrame(animationFrame);
                return;
            }

            iteration += Math.max(1, text.length / 30); // Finish in ~0.5s
            animationFrame = requestAnimationFrame(animate);
        };

        animate();

        return () => cancelAnimationFrame(animationFrame);
    }, [text]);

    return <span>{displayText}</span>;
}

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
        <div className="group relative glass-card rounded-lg p-5 cursor-pointer">
            {/* Badge */}
            {model.badge && (
                <span className={`absolute top-4 right-4 text-[10px] font-semibold px-1.5 py-0.5 rounded border ${badgeColors[model.badge]}`}>
                    {model.badge}
                </span>
            )}

            {/* Header: icon + name */}
            <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-md bg-muted/60 border border-border/50 flex items-center justify-center shrink-0">
                    <ProviderIcon slug={model.providerIcon} size={20} />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">{model.name}</div>
                    <div className="text-xs text-muted-foreground">{model.provider}</div>
                </div>
            </div>

            {/* Type + context */}
            <div className="flex items-center gap-2 mb-4">
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-muted/60 text-muted-foreground border border-border/30">
                    {typeLabel}
                </span>
                {model.context !== "-" && (
                    <span className="text-[11px] text-muted-foreground font-mono">{model.context}</span>
                )}
            </div>

            {/* Pricing */}
            <div className="flex items-center gap-4 text-sm">
                <div>
                    <span className="font-semibold text-foreground">${model.inputPrice < 0.01 ? model.inputPrice.toFixed(3) : model.inputPrice.toFixed(2)}</span>
                    <span className="text-muted-foreground text-xs">/Mt</span>
                </div>
                {model.outputPrice > 0 && (
                    <>
                        <div className="w-px h-3.5 bg-border" />
                        <div>
                            <span className="font-semibold text-foreground">${model.outputPrice.toFixed(2)}</span>
                            <span className="text-muted-foreground text-xs">/Mt</span>
                        </div>
                    </>
                )}
                <div className="ml-auto text-[11px] text-muted-foreground">
                    {locale === "zh" ? "输入 / 输出" : "in / out"}
                </div>
            </div>
        </div>
    );
}

// Promo Banner with auto-carousel
function PromoBanner({ locale }: { locale: string }) {
    const [current, setCurrent] = useState(0);

    const next = useCallback(() => {
        setCurrent((c) => (c + 1) % promoSlides.length);
    }, []);

    useEffect(() => {
        const timer = setInterval(next, 10000);
        return () => clearInterval(timer);
    }, [next]);

    const slide = promoSlides[current];
    const tagColor = slide.tag === "NEW" ? "bg-blue-500" : "bg-emerald-500";
    const titleText = slide.title[locale as "en" | "zh"];
    const descText = slide.desc[locale as "en" | "zh"];

    return (
        <div className="promo-banner rounded-lg overflow-hidden mb-8 relative">
            {/* The animated background is handled via CSS class */}
            <div className="relative px-6 py-5 md:px-8 md:py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0 w-full">
                    <h3 className="text-xl md:text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
                        <span className="truncate">
                            <ScrambleText text={titleText} />
                        </span>
                        <span className={`text-[12px] font-bold px-2 py-0.5 rounded text-white ${tagColor} shrink-0`}>
                            {slide.tag}
                        </span>
                    </h3>
                    {/* Fixed height on mobile to allow 2 lines without jumping */}
                    <div className="h-[48px] md:h-auto overflow-hidden">
                        <p className="text-base text-muted-foreground/90 max-w-2xl font-mono line-clamp-2 md:line-clamp-none">
                            <ScrambleText text={descText} />
                        </p>
                    </div>
                </div>

                {/* Right aligned on mobile */}
                <div className="w-full md:w-auto flex justify-end mt-2 md:mt-0 shrink-0">
                    <Button
                        size="sm"
                        className="btn-gradient h-9 px-5 text-sm font-medium rounded-md"
                    >
                        <span className="relative z-10 flex items-center gap-1.5">
                            {locale === "zh" ? "立即接入" : "Get Started"}
                            <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                    </Button>
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
        <section id="models" className="relative py-8 md:py-12">
            <div className="mx-auto max-w-7xl px-6">
                {/* Promo Banner */}
                <PromoBanner locale={locale} />

                {/* Search bar — full width */}
                <div className="mb-5">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder={locale === "zh" ? "搜索模型名称或ID" : "Search model name or ID"}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-11 pl-11 pr-4 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/20 transition-colors"
                        />
                    </div>
                </div>

                {/* Type filter tabs — full width */}
                <div className="flex items-center gap-1.5 mb-4 flex-wrap">
                    <span className="text-sm text-muted-foreground mr-1">{locale === "zh" ? "类型：" : "Type:"}</span>
                    {typeFilters.map((tf) => {
                        const Icon = tf.icon;
                        const active = typeFilter === tf.key;
                        return (
                            <button
                                key={tf.key}
                                onClick={() => setTypeFilter(tf.key)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${active
                                    ? "bg-foreground text-background font-medium"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                                    }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {tf.label[locale as "en" | "zh"]}
                            </button>
                        );
                    })}
                </div>

                {/* Provider filter — full width */}
                <div className="flex items-center gap-2 mb-6 flex-wrap">
                    <span className="text-sm text-muted-foreground mr-1">{locale === "zh" ? "厂商：" : "Provider:"}</span>
                    <button
                        onClick={() => setProviderFilter(null)}
                        className={`px-2.5 py-1.5 text-sm rounded-md transition-colors ${!providerFilter ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        {locale === "zh" ? "全部" : "All"}
                    </button>
                    {visibleProviders.map((p) => (
                        <button
                            key={p.name}
                            onClick={() => setProviderFilter(providerFilter === p.name ? null : p.name)}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-sm rounded-md transition-colors ${providerFilter === p.name
                                ? "bg-primary/10 text-primary font-medium border border-primary/20"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <ProviderIcon slug={p.slug} size={16} />
                            {p.name}
                        </button>
                    ))}
                    {moreProviders.length > 0 && (
                        <div className="relative">
                            <button
                                onClick={() => setShowMoreProviders(!showMoreProviders)}
                                className="flex items-center gap-1 px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-md transition-colors"
                            >
                                {locale === "zh" ? "更多" : "More"}
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMoreProviders ? "rotate-180" : ""}`} />
                            </button>
                            {showMoreProviders && (
                                <div className="absolute top-full left-0 mt-1 py-1 bg-popover border border-border rounded-lg shadow-lg z-20 min-w-[130px]">
                                    {moreProviders.map((p) => (
                                        <button
                                            key={p.name}
                                            onClick={() => { setProviderFilter(p.name); setShowMoreProviders(false); }}
                                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                                        >
                                            <ProviderIcon slug={p.slug} size={16} />
                                            {p.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Section sub-heading */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-foreground">
                        {sectionTitle}
                        <span className="ml-2 text-muted-foreground font-normal">({filtered.length})</span>
                    </h3>
                    <a
                        href="/models"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                        {t("models.viewall")}
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>

                {/* Model grid — 3 columns on desktop to match Models page sizing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {filtered.map((model, i) => (
                        <motion.div
                            key={model.name}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-20px" }}
                            transition={{ delay: Math.min(i * 0.03, 0.3), duration: 0.25 }}
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
