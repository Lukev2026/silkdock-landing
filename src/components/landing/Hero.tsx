"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

function GridBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        let time = 0;

        const resize = () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };

        const draw = () => {
            const w = canvas.offsetWidth;
            const h = canvas.offsetHeight;
            ctx.clearRect(0, 0, w, h);

            // Subtle grid
            const spacing = 60;
            const isDark = document.documentElement.classList.contains("dark");
            const lineAlpha = isDark ? 0.03 : 0.04;
            ctx.strokeStyle = `rgba(${isDark ? "255,255,255" : "0,0,0"},${lineAlpha})`;
            ctx.lineWidth = 1;
            for (let x = 0; x <= w; x += spacing) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
            }
            for (let y = 0; y <= h; y += spacing) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
            }

            // Floating glow spots
            const spotAlpha = isDark ? 0.08 : 0.04;
            const spots = [
                { x: w * 0.3, y: h * 0.4, r: 200, hue: 265 },
                { x: w * 0.7, y: h * 0.3, r: 180, hue: 300 },
                { x: w * 0.5, y: h * 0.7, r: 160, hue: 240 },
            ];

            spots.forEach((spot, i) => {
                const ox = Math.sin(time * 0.0005 + i * 2) * 40;
                const oy = Math.cos(time * 0.0004 + i * 1.5) * 30;
                const gradient = ctx.createRadialGradient(
                    spot.x + ox, spot.y + oy, 0,
                    spot.x + ox, spot.y + oy, spot.r
                );
                gradient.addColorStop(0, `hsla(${spot.hue}, 70%, 60%, ${spotAlpha})`);
                gradient.addColorStop(1, `hsla(${spot.hue}, 70%, 60%, 0)`);
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, w, h);
            });

            time += 16;
            animationId = requestAnimationFrame(draw);
        };

        resize();
        window.addEventListener("resize", resize);
        draw();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export default function Hero() {
    const { t } = useI18n();

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            <GridBackground />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--background)_70%)]" />

            <div className="relative z-10 mx-auto max-w-5xl px-6 py-24 text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-primary/20 bg-primary/5 text-sm text-primary"
                >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{t("hero.badge")}</span>
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05]"
                >
                    <span className="text-foreground">{t("hero.title1")}</span>
                    <br />
                    <span className="gradient-text">{t("hero.title2")}</span>
                </motion.h1>

                {/* Subtitle — render bold text from translation */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2"
                    dangerouslySetInnerHTML={{
                        __html: t("hero.subtitle")
                            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>'),
                    }}
                />

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-10 w-full sm:w-auto px-2 sm:px-0"
                >
                    <Button
                        size="lg"
                        className="btn-gradient w-full sm:w-auto sm:min-w-[200px] px-8 h-12 text-base font-medium group rounded-xl"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {t("hero.cta.primary")}
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </span>
                    </Button>
                    <a href="/models">
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto sm:min-w-[200px] px-8 h-12 text-base font-medium border-border hover:border-primary/30 hover:bg-primary/5 rounded-xl"
                        >
                            {t("hero.cta.secondary")}
                        </Button>
                    </a>
                </motion.div>

                {/* Code preview */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="mt-16 mx-auto max-w-2xl w-full overflow-hidden"
                >
                    <div className="code-block rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg">
                        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/50">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                            <span className="ml-3 text-xs text-neutral-500 font-mono">quickstart.py</span>
                        </div>
                        <pre className="px-4 sm:px-5 py-4 text-xs sm:text-sm text-left overflow-x-auto font-mono leading-relaxed">
                            <code>
                                <span className="text-purple-400">from</span>{" "}
                                <span className="text-blue-400">openai</span>{" "}
                                <span className="text-purple-400">import</span>{" "}
                                <span className="text-neutral-200">OpenAI</span>
                                {"\n\n"}
                                <span className="text-neutral-500"># Just change the base_url — that&apos;s it!</span>
                                {"\n"}
                                <span className="text-neutral-200">client</span>{" "}
                                <span className="text-neutral-500">=</span>{" "}
                                <span className="text-blue-400">OpenAI</span>
                                <span className="text-neutral-500">(</span>
                                {"\n  "}
                                <span className="text-neutral-200">base_url</span>
                                <span className="text-neutral-500">=</span>
                                <span className="text-green-400">&quot;https://api.silkdock.ai/v1&quot;</span>
                                <span className="text-neutral-500">,</span>
                                {"\n  "}
                                <span className="text-neutral-200">api_key</span>
                                <span className="text-neutral-500">=</span>
                                <span className="text-green-400">&quot;sk-your-key&quot;</span>
                                {"\n"}
                                <span className="text-neutral-500">)</span>
                                {"\n\n"}
                                <span className="text-neutral-200">response</span>{" "}
                                <span className="text-neutral-500">=</span>{" "}
                                <span className="text-neutral-200">client</span>
                                <span className="text-neutral-500">.</span>
                                <span className="text-neutral-200">chat</span>
                                <span className="text-neutral-500">.</span>
                                <span className="text-neutral-200">completions</span>
                                <span className="text-neutral-500">.</span>
                                <span className="text-blue-400">create</span>
                                <span className="text-neutral-500">(</span>
                                {"\n  "}
                                <span className="text-neutral-200">model</span>
                                <span className="text-neutral-500">=</span>
                                <span className="text-green-400">&quot;claude-sonnet-4-20250514&quot;</span>
                                <span className="text-neutral-500">,</span>
                                {"\n  "}
                                <span className="text-neutral-200">messages</span>
                                <span className="text-neutral-500">=</span>
                                <span className="text-neutral-500">[{`{`}</span>
                                <span className="text-green-400">&quot;role&quot;</span>
                                <span className="text-neutral-500">:</span>
                                <span className="text-green-400"> &quot;user&quot;</span>
                                <span className="text-neutral-500">,</span>
                                <span className="text-green-400"> &quot;content&quot;</span>
                                <span className="text-neutral-500">:</span>
                                <span className="text-green-400"> &quot;Hello!&quot;</span>
                                <span className="text-neutral-500">{`}`}]</span>
                                {"\n"}
                                <span className="text-neutral-500">)</span>
                            </code>
                        </pre>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
