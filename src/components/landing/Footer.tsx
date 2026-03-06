"use client";

import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/lib/i18n";

const footerLinks = {
    product: [
        { label: "Models", labelZh: "模型", href: "/models" },
        { label: "Pricing", labelZh: "价格", href: "#pricing" },
        { label: "Playground", labelZh: "试用", href: "/playground" },
        { label: "API Status", labelZh: "状态", href: "/status" },
    ],
    developers: [
        { label: "Documentation", labelZh: "文档", href: "https://docs.silkdock.ai" },
        { label: "API Reference", labelZh: "API 参考", href: "https://docs.silkdock.ai/api" },
        { label: "SDKs", labelZh: "SDK", href: "https://docs.silkdock.ai/sdks" },
        { label: "Changelog", labelZh: "更新日志", href: "/changelog" },
    ],
    company: [
        { label: "About", labelZh: "关于", href: "/about" },
        { label: "Blog", labelZh: "博客", href: "/blog" },
        { label: "Contact", labelZh: "联系", href: "mailto:support@silkdock.ai" },
        { label: "Terms", labelZh: "条款", href: "/legal/terms" },
    ],
    connect: [
        { label: "GitHub", labelZh: "GitHub", href: "https://github.com/silkdock" },
        { label: "Discord", labelZh: "Discord", href: "/discord" },
        { label: "Twitter / X", labelZh: "Twitter / X", href: "https://x.com/silkdockai" },
    ],
};

export default function Footer() {
    const { t, locale } = useI18n();

    const categories = [
        { key: "product", label: t("footer.product"), links: footerLinks.product },
        { key: "developers", label: t("footer.developers"), links: footerLinks.developers },
        { key: "company", label: t("footer.company"), links: footerLinks.company },
        { key: "connect", label: t("footer.connect"), links: footerLinks.connect },
    ];

    return (
        <footer className="border-t border-border">
            <div className="mx-auto max-w-6xl px-6 py-16">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <a href="/" className="inline-flex items-center gap-0.5 mb-4">
                            <span className="text-sm font-bold tracking-tight text-foreground">Silk</span>
                            <span className="text-sm font-bold tracking-tight gradient-text">Dock</span>
                        </a>
                        <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
                            {t("footer.tagline")}
                        </p>
                    </div>

                    {categories.map((cat) => (
                        <div key={cat.key}>
                            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
                                {cat.label}
                            </h4>
                            <ul className="space-y-2.5">
                                {cat.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {locale === "zh" ? link.labelZh : link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <Separator className="my-8 bg-border" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} SilkDock AI. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="/legal/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                            Privacy Policy
                        </a>
                        <a href="/legal/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
