"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export type Locale = "en" | "zh";

type Translations = Record<string, Record<Locale, string>>;

const translations: Translations = {
    // Dashboard
    "dash.nav.overview": { en: "Overview", zh: "总览" },
    "dash.nav.keys": { en: "API Keys", zh: "API 密钥" },
    "dash.nav.usage": { en: "Usage", zh: "使用量" },
    "dash.nav.logs": { en: "Logs", zh: "日志" },
    "dash.nav.settings": { en: "Settings", zh: "设置" },

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

    // Models (landing section)
    "models.title1": { en: "All the models, ", zh: "所有模型，" },
    "models.title2": { en: "one endpoint", zh: "一个端点" },
    "models.subtitle": {
        en: "From frontier models to open-source giants. Compare prices, context windows, and capabilities across every major provider.",
        zh: "从前沿闭源到开源巨头。跨服务商对比价格、上下文窗口和能力。",
    },
    "models.viewall": { en: "View all 300+ models", zh: "查看全部 300+ 模型" },

    // Models page
    "models.page.title1": { en: "Model ", zh: "模型" },
    "models.page.title2": { en: "Catalog", zh: "目录" },
    "models.page.subtitle": {
        en: "Browse and compare 300+ AI models across every major provider. Filter by capability, provider, and price.",
        zh: "浏览并对比 300+ AI 模型。按能力、服务商和价格筛选。",
    },
    "models.page.search": { en: "Search models, providers...", zh: "搜索模型、服务商..." },
    "models.page.results": { en: "models found", zh: "个模型" },
    "models.page.noresults": { en: "No models found. Try adjusting your filters.", zh: "未找到匹配模型，请调整筛选条件。" },

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

    // Pricing page
    "pricing.title1": { en: "Simple, ", zh: "简单" },
    "pricing.title2": { en: "transparent pricing", zh: "透明的价格" },
    "pricing.subtitle": {
        en: "Pay only for what you use. No hidden fees. No vendor lock-in.",
        zh: "按量付费，无隐藏费用，无供应商锁定。",
    },
    "pricing.free.name": { en: "Free", zh: "免费版" },
    "pricing.free.desc": { en: "Perfect for experimentation and personal projects.", zh: "适合个人项目和实验。" },
    "pricing.free.f1": { en: "$5 free credits monthly", zh: "每月 $5 免费额度" },
    "pricing.free.f2": { en: "All models accessible", zh: "可访问所有模型" },
    "pricing.free.f3": { en: "5 requests/minute rate limit", zh: "5 次/分钟速率限制" },
    "pricing.free.f4": { en: "Community support", zh: "社区支持" },
    "pricing.free.f5": { en: "Basic usage dashboard", zh: "基础用量面板" },
    "pricing.free.cta": { en: "Get Started Free", zh: "免费开始" },

    "pricing.pro.name": { en: "Pro", zh: "专业版" },
    "pricing.pro.desc": { en: "For teams and production workloads.", zh: "适合团队和生产环境。" },
    "pricing.pro.f1": { en: "Pay-as-you-go pricing", zh: "按量付费" },
    "pricing.pro.f2": { en: "All models + priority access", zh: "所有模型 + 优先访问" },
    "pricing.pro.f3": { en: "1000 requests/minute", zh: "1000 次/分钟" },
    "pricing.pro.f4": { en: "Smart routing & failover", zh: "智能路由和自动故障转移" },
    "pricing.pro.f5": { en: "Real-time analytics", zh: "实时分析面板" },
    "pricing.pro.f6": { en: "Priority support", zh: "优先技术支持" },
    "pricing.pro.cta": { en: "Start Pro Trial", zh: "开始专业版试用" },

    "pricing.enterprise.name": { en: "Enterprise", zh: "企业版" },
    "pricing.enterprise.price": { en: "Custom", zh: "定制" },
    "pricing.enterprise.desc": { en: "For organizations with advanced requirements.", zh: "面向有高级需求的企业。" },
    "pricing.enterprise.f1": { en: "Volume discounts", zh: "批量折扣" },
    "pricing.enterprise.f2": { en: "Dedicated endpoints", zh: "专属端点" },
    "pricing.enterprise.f3": { en: "Unlimited rate limits", zh: "无限速率" },
    "pricing.enterprise.f4": { en: "Custom SLA guarantee", zh: "自定义 SLA 保障" },
    "pricing.enterprise.f5": { en: "SSO & audit logs", zh: "SSO 和审计日志" },
    "pricing.enterprise.f6": { en: "24/7 dedicated support", zh: "7×24 专属支持" },
    "pricing.enterprise.cta": { en: "Contact Sales", zh: "联系销售" },

    "pricing.payg.title": { en: "Pay-as-you-go for all models", zh: "所有模型按量计费" },
    "pricing.payg.desc": {
        en: "Each model has its own pricing based on the upstream provider. We add a small markup for routing, failover, and infrastructure. Check the Models page for exact pricing.",
        zh: "每个模型的价格基于上游服务商。我们对路由、故障转移和基础设施收取少量溢价。具体价格请查看模型页面。",
    },

    "pricing.faq.title": { en: "Frequently Asked Questions", zh: "常见问题" },
    "pricing.faq.q1": { en: "How does billing work?", zh: "如何计费？" },
    "pricing.faq.a1": {
        en: "You prepay credits to your account. Each API call deducts credits based on the model's per-token pricing. You can set up auto-recharge to never run out.",
        zh: "您预充值额度到账户。每次 API 调用根据模型的 Token 定价扣除额度。可以设置自动充值，永不断供。",
    },
    "pricing.faq.q2": { en: "Can I switch plans anytime?", zh: "可以随时切换套餐吗？" },
    "pricing.faq.a2": {
        en: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and are prorated.",
        zh: "当然可以！您可以随时升级或降级套餐，变更立即生效并按比例计算。",
    },
    "pricing.faq.q3": { en: "Is there a free trial for Pro?", zh: "专业版有免费试用吗？" },
    "pricing.faq.a3": {
        en: "Yes, the Pro plan comes with a 14-day free trial. No credit card required to start.",
        zh: "有的，专业版提供 14 天免费试用，无需信用卡即可开始。",
    },
    "pricing.faq.q4": { en: "What payment methods are accepted?", zh: "支持哪些支付方式？" },
    "pricing.faq.a4": {
        en: "We accept credit/debit cards (Visa, Mastercard, Amex), PayPal, and wire transfer for enterprise customers.",
        zh: "我们支持信用卡/借记卡（Visa、Mastercard、Amex）、PayPal，企业客户支持银行转账。",
    },

    // Docs page
    "docs.badge": { en: "Quick Start Guide", zh: "快速入门指南" },
    "docs.title1": { en: "Get started", zh: "开始使用" },
    "docs.title2": { en: "in 3 minutes", zh: "只需 3 分钟" },
    "docs.subtitle": {
        en: "SilkDock is fully OpenAI-compatible. If you've used the OpenAI SDK before, you already know how to use us.",
        zh: "SilkDock 完全兼容 OpenAI。如果你用过 OpenAI SDK，你就已经知道怎么使用我们了。",
    },
    "docs.step1.title": { en: "Create an account & get credits", zh: "创建账户并充值" },
    "docs.step1.desc": {
        en: "Sign up at silkdock.ai with GitHub, Google, or email. New accounts get $5 free credits — no credit card required.",
        zh: "通过 GitHub、Google 或邮箱在 silkdock.ai 注册。新账户赠送 $5 免费额度——无需信用卡。",
    },
    "docs.step2.title": { en: "Generate your API key", zh: "生成 API Key" },
    "docs.step2.desc": {
        en: "Go to your dashboard, click 'Create Key', give it a name. Copy the key — you'll need it in the next step.",
        zh: "进入控制台，点击「创建 Key」，命名后复制密钥——下一步会用到。",
    },
    "docs.step3.title": { en: "Make your first API call", zh: "发起第一次 API 调用" },
    "docs.step3.desc": {
        en: "Use any OpenAI-compatible SDK. Just change the base_url to api.silkdock.ai/v1 and use your SilkDock API key.",
        zh: "使用任意 OpenAI 兼容的 SDK。只需将 base_url 改为 api.silkdock.ai/v1，并使用你的 SilkDock API Key。",
    },
    "docs.sdk.title": { en: "SDK Examples", zh: "SDK 示例" },
    "docs.features.title": { en: "What you get", zh: "你将获得" },
    "docs.features.f1.title": { en: "OpenAI Compatible", zh: "OpenAI 兼容" },
    "docs.features.f1.desc": {
        en: "Works with any OpenAI SDK — Python, Node.js, Go, Rust. Zero migration effort.",
        zh: "兼容所有 OpenAI SDK——Python、Node.js、Go、Rust。零迁移成本。",
    },
    "docs.features.f2.title": { en: "Streaming Support", zh: "流式输出" },
    "docs.features.f2.desc": {
        en: "Full SSE streaming support for real-time token-by-token responses.",
        zh: "完整的 SSE 流式支持，实时逐 Token 返回。",
    },
    "docs.features.f3.title": { en: "Function Calling", zh: "函数调用" },
    "docs.features.f3.desc": {
        en: "Native function/tool calling support for models that support it.",
        zh: "原生函数/工具调用支持（仅限支持该特性的模型）。",
    },
    "docs.features.f4.title": { en: "Error Handling", zh: "错误处理" },
    "docs.features.f4.desc": {
        en: "Standard OpenAI error format. Automatic retries with exponential backoff.",
        zh: "标准 OpenAI 错误格式。自动重试 + 指数退避策略。",
    },

    // Login page
    "login.title": { en: "Welcome back", zh: "欢迎回来" },
    "login.subtitle": { en: "Sign in to access your API keys and dashboard.", zh: "登录以访问你的 API Key 和控制台。" },
    "login.google": { en: "Continue with Google", zh: "使用 Google 账号登录" },
    "login.or": { en: "or", zh: "或" },
    "login.email.placeholder": { en: "your@email.com", zh: "your@email.com" },
    "login.email.cta": { en: "Continue with Email", zh: "使用邮箱登录" },
    "login.email.soon": { en: "Email login coming soon", zh: "邮箱登录即将上线" },
    "login.terms": {
        en: "By signing in, you agree to our Terms of Service and Privacy Policy.",
        zh: "登录即表示你同意我们的服务条款和隐私政策。",
    },
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
