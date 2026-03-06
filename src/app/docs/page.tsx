"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Copy, Check, BookOpen, Terminal, Code, Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            onClick={handleCopy}
            className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50 transition-colors"
        >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
    );
}

function CodeBlock({ title, lang, code }: { title: string; lang: string; code: string }) {
    return (
        <div className="code-block rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                    <span className="ml-2 text-xs text-neutral-500 font-mono">{title}</span>
                </div>
                <CopyButton text={code} />
            </div>
            <pre className="px-4 sm:px-5 py-4 text-xs sm:text-sm overflow-x-auto font-mono leading-relaxed text-neutral-200">
                <code>{code}</code>
            </pre>
        </div>
    );
}

const pythonCode = `from openai import OpenAI

client = OpenAI(
    base_url="https://api.silkdock.ai/v1",
    api_key="sk-your-key"
)

response = client.chat.completions.create(
    model="claude-sonnet-4-20250514",
    messages=[{"role": "user", "content": "Hello!"}]
)

print(response.choices[0].message.content)`;

const nodeCode = `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.silkdock.ai/v1',
  apiKey: 'sk-your-key',
});

const response = await client.chat.completions.create({
  model: 'gpt-5',
  messages: [{ role: 'user', content: 'Hello!' }],
});

console.log(response.choices[0].message.content);`;

const curlCode = `curl https://api.silkdock.ai/v1/chat/completions \\
  -H "Authorization: Bearer sk-your-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gemini-3-pro",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'`;

const sdkTabs = [
    { label: "Python", code: pythonCode, file: "quickstart.py" },
    { label: "Node.js", code: nodeCode, file: "quickstart.ts" },
    { label: "cURL", code: curlCode, file: "terminal" },
];

export default function DocsPage() {
    const { t } = useI18n();
    const [activeTab, setActiveTab] = useState(0);

    const steps = [
        {
            icon: <Zap className="w-5 h-5" />,
            title: t("docs.step1.title"),
            desc: t("docs.step1.desc"),
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
        },
        {
            icon: <Terminal className="w-5 h-5" />,
            title: t("docs.step2.title"),
            desc: t("docs.step2.desc"),
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
        },
        {
            icon: <Code className="w-5 h-5" />,
            title: t("docs.step3.title"),
            desc: t("docs.step3.desc"),
            color: "text-emerald-500",
            bgColor: "bg-emerald-500/10",
        },
    ];

    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-24 pb-16">
                <div className="mx-auto max-w-4xl px-6">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-primary/20 bg-primary/5 text-sm text-primary">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>{t("docs.badge")}</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                            <span className="text-foreground">{t("docs.title1")}</span>
                            <br />
                            <span className="gradient-text">{t("docs.title2")}</span>
                        </h1>
                        <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
                            {t("docs.subtitle")}
                        </p>
                    </motion.div>

                    {/* Quick Start Steps */}
                    <div className="space-y-6 mb-16">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + i * 0.1 }}
                                className="glass-card rounded-lg p-6 flex items-start gap-4"
                            >
                                <div className={`w-10 h-10 rounded-lg ${step.bgColor} flex items-center justify-center shrink-0`}>
                                    <span className={step.color}>{step.icon}</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs font-mono ${step.color}`}>Step {String(i + 1).padStart(2, "0")}</span>
                                    </div>
                                    <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* SDK Code examples */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mb-16"
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{t("docs.sdk.title")}</h2>

                        <div className="flex gap-1 mb-4 border border-border rounded-lg p-1 w-fit mx-auto">
                            {sdkTabs.map((tab, i) => (
                                <button
                                    key={tab.label}
                                    onClick={() => setActiveTab(i)}
                                    className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${activeTab === i
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <CodeBlock
                            title={sdkTabs[activeTab].file}
                            lang={sdkTabs[activeTab].label}
                            code={sdkTabs[activeTab].code}
                        />
                    </motion.div>

                    {/* Key features */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{t("docs.features.title")}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { title: t("docs.features.f1.title"), desc: t("docs.features.f1.desc") },
                                { title: t("docs.features.f2.title"), desc: t("docs.features.f2.desc") },
                                { title: t("docs.features.f3.title"), desc: t("docs.features.f3.desc") },
                                { title: t("docs.features.f4.title"), desc: t("docs.features.f4.desc") },
                            ].map((f, i) => (
                                <div key={i} className="glass-card rounded-lg p-5">
                                    <h4 className="font-semibold text-foreground mb-1">{f.title}</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </>
    );
}
