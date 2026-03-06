"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export type Locale = "en" | "zh";

type Translations = Record<string, Record<Locale, string>>;

const translations: Translations = {
    // Navbar
    "nav.models": { en: "Models", zh: "模型" },
    "nav.features": { en: "Features", zh: "特性" },
    "nav.pricing": { en: "Pricing", zh: "价格" },
    "nav.docs": { en: "Docs", zh: "文档" },
    "nav.signin": { en: "Sign In", zh: "登录" },
    "nav.getkey": { en: "Get API Key", zh: "获取 API Key" },

    // Hero
    "hero.badge": {
        en: "Now supporting GPT-5, Claude Opus 4, Gemini 3",
        zh: "已支持 GPT-5、Claude Opus 4、Gemini 3",
    },
    "hero.title1": { en: "One API for", zh: "一个 API" },
    "hero.title2": { en: "Every AI Model", zh: "接入所有 AI 模型" },
    "hero.subtitle": {
        en: "Access **300+ AI models** from **60+ providers** through a single OpenAI-compatible API. Smart routing, automatic failover, and real-time cost tracking.",
        zh: "通过一个兼容 OpenAI 的 API，即可访问来自 **60+ 服务商**的 **300+ AI 模型**。智能路由、自动故障转移、实时成本追踪。",
    },
    "hero.cta.primary": { en: "Get Your API Key", zh: "获取 API Key" },
    "hero.cta.secondary": { en: "Explore Models", zh: "浏览模型" },

    // Metrics
    "metrics.models": { en: "AI Models", zh: "AI 模型" },
    "metrics.providers": { en: "Providers", zh: "服务商" },
    "metrics.uptime": { en: "Uptime SLA", zh: "可用性 SLA" },
    "metrics.tokens": { en: "Monthly Tokens", zh: "月处理 Token" },

    // Features
    "features.title1": { en: "Built for ", zh: "为" },
    "features.title2": { en: "production", zh: "生产环境而生" },
    "features.subtitle": {
        en: "Enterprise-grade infrastructure that handles billions of tokens daily. Focus on building your AI product, we handle the rest.",
        zh: "企业级基础设施，日处理数十亿 Token。专注构建你的 AI 产品，其余的交给我们。",
    },
    "features.unified.title": { en: "Unified API Standard", zh: "统一 API 标准" },
    "features.unified.desc": {
        en: "OpenAI-compatible interface for all models. Switch between GPT, Claude, Gemini, DeepSeek with a single parameter change. Zero migration cost.",
        zh: "兼容 OpenAI 的统一接口。只需修改一个参数即可在 GPT、Claude、Gemini、DeepSeek 之间自由切换。零迁移成本。",
    },
    "features.routing.title": { en: "Smart Routing", zh: "智能路由" },
    "features.routing.desc": {
        en: "Automatically route requests to the fastest, cheapest, or most reliable provider. Latency-aware load balancing across regions.",
        zh: "自动将请求路由至最快、最便宜或最可靠的服务商。跨区域延迟感知负载均衡。",
    },
    "features.ha.title": { en: "High Availability", zh: "高可用性" },
    "features.ha.desc": {
        en: "99.9% uptime SLA with automatic failover. When one provider goes down, we seamlessly switch to a backup in milliseconds.",
        zh: "99.9% 可用性 SLA，自动故障转移。当某个服务商宕机时，毫秒级无缝切换至备用通道。",
    },
    "features.cost.title": { en: "Cost Optimization", zh: "成本优化" },
    "features.cost.desc": {
        en: "Real-time token tracking, per-model cost analytics, and smart caching to reduce your AI spend by up to 40%. Budget alerts and spending caps included.",
        zh: "实时 Token 追踪、按模型成本分析和智能缓存，最多可降低 40% 的 AI 支出。内置预算警报和消费上限。",
    },
    "features.global.title": { en: "Global Acceleration", zh: "全球加速" },
    "features.global.desc": {
        en: "Edge nodes worldwide with intelligent DNS routing. Sub-100ms response times no matter where your users are located.",
        zh: "全球边缘节点 + 智能 DNS 路由。无论用户身在何处，响应时间均低于 100ms。",
    },
    "features.multimodal.title": { en: "Multi-Modal Support", zh: "多模态支持" },
    "features.multimodal.desc": {
        en: "Not just text — unified APIs for image generation, video creation, speech-to-text, and embedding models. One platform for all AI capabilities.",
        zh: "不止文本——统一的图像生成、视频创作、语音转文字和 Embedding 模型 API。一个平台，满足所有 AI 需求。",
    },

    // Models
    "models.title1": { en: "All the models, ", zh: "所有模型，" },
    "models.title2": { en: "one endpoint", zh: "一个端点" },
    "models.subtitle": {
        en: "From frontier models to open-source giants. Compare prices, context windows, and capabilities across every major provider.",
        zh: "从前沿闭源到开源巨头。跨服务商对比价格、上下文窗口和能力。",
    },
    "models.viewall": { en: "View all 300+ models", zh: "查看全部 300+ 模型" },

    // Getting Started
    "start.title1": { en: "Up and running ", zh: "几分钟内" },
    "start.title2": { en: "in minutes", zh: "快速上线" },
    "start.subtitle": {
        en: "No complex setup. No vendor lock-in. Just change your base URL.",
        zh: "无需复杂配置，无供应商锁定。只需修改 Base URL。",
    },
    "start.step1.title": { en: "Create an account", zh: "创建账户" },
    "start.step1.desc": {
        en: "Sign up with GitHub, Google, or email. Takes less than 30 seconds.",
        zh: "通过 GitHub、Google 或邮箱注册，不到 30 秒即可完成。",
    },
    "start.step2.title": { en: "Get your API key", zh: "获取 API Key" },
    "start.step2.desc": {
        en: "Generate your API key from the dashboard. Add credits via any payment method.",
        zh: "在控制台生成 API Key，支持多种支付方式充值。",
    },
    "start.step3.title": { en: "Start building", zh: "开始构建" },
    "start.step3.desc": {
        en: "Point your OpenAI SDK to our endpoint. Access every model instantly — no changes needed.",
        zh: "将 OpenAI SDK 指向我们的端点，即刻访问所有模型——无需任何代码变更。",
    },

    // Partners
    "partners.title": { en: "Trusted by the AI ecosystem", zh: "受到 AI 生态系统的信赖" },
    "partners.subtitle": {
        en: "Works seamlessly with every major AI client and framework",
        zh: "与所有主流 AI 客户端和框架无缝协作",
    },

    // CTA
    "cta.badge": {
        en: "Free tier available — no credit card required",
        zh: "提供免费额度——无需信用卡",
    },
    "cta.title1": { en: "Ready to power your ", zh: "准备好为你的 " },
    "cta.title2": { en: "AI product?", zh: "AI 产品赋能了吗？" },
    "cta.subtitle": {
        en: "Join thousands of developers building with SilkDock AI. Get started for free and scale as you grow.",
        zh: "加入数千名使用 SilkDock AI 进行开发的开发者行列。免费开始使用，随业务增长而扩展。",
    },
    "cta.start": { en: "Start for Free", zh: "免费开始" },
    "cta.sales": { en: "Talk to Sales", zh: "联系销售" },

    // Footer
    "footer.tagline": {
        en: "The unified API gateway for every AI model.",
        zh: "面向所有 AI 模型的统一 API 网关。",
    },
    "footer.product": { en: "Product", zh: "产品" },
    "footer.developers": { en: "Developers", zh: "开发者" },
    "footer.company": { en: "Company", zh: "公司" },
    "footer.connect": { en: "Connect", zh: "联系" },
};

interface I18nContextValue {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue>({
    locale: "en",
    setLocale: () => { },
    t: (key: string) => key,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>("en");

    useEffect(() => {
        const saved = localStorage.getItem("silkdock-locale") as Locale | null;
        if (saved && (saved === "en" || saved === "zh")) {
            setLocaleState(saved);
        }
    }, []);

    const setLocale = useCallback((newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem("silkdock-locale", newLocale);
    }, []);

    const t = useCallback(
        (key: string) => {
            return translations[key]?.[locale] ?? key;
        },
        [locale]
    );

    return (
        <I18nContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    return useContext(I18nContext);
}
