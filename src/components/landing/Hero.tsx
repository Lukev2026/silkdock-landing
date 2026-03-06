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
        let w = 0, h = 0;
        const dpr = window.devicePixelRatio || 1;

        // Grid configuration
        const SPACING = 60;
        const GRID_OFFSET = { x: 0, y: 0 };

        interface DataPacket {
            x: number;
            y: number;
            vx: number;
            vy: number;
            length: number;
            speed: number;
            color: string;
            alpha: number;
            axis: 'x' | 'y'; // Moves along grid horizontal or vertical
        }

        const packets: DataPacket[] = [];
        const MAX_PACKETS = 45;

        // Glowing intersection nodes
        interface Node {
            x: number;
            y: number;
            radius: number;
            pulsePhase: number;
            pulseSpeed: number;
            baseAlpha: number;
        }
        const nodes: Node[] = [];

        const colors = {
            dark: ["#6366f1", "#8b5cf6", "#ec4899", "#14b8a6", "#3b82f6"],
            light: ["#4f46e5", "#7c3aed", "#db2777", "#0d9488", "#2563eb"],
        };

        const createPacket = (isDark: boolean): DataPacket => {
            const axis = Math.random() > 0.5 ? 'x' : 'y';
            const speed = (2 + Math.random() * 4) * (Math.random() > 0.5 ? 1 : -1);
            const palette = isDark ? colors.dark : colors.light;
            const color = palette[Math.floor(Math.random() * palette.length)];

            // Snap to grid
            let x, y, vx, vy;
            if (axis === 'x') {
                y = Math.floor(Math.random() * (h / SPACING)) * SPACING;
                x = speed > 0 ? -100 : w + 100;
                vx = speed;
                vy = 0;
            } else {
                x = Math.floor(Math.random() * (w / SPACING)) * SPACING;
                y = speed > 0 ? -100 : h + 100;
                vx = 0;
                vy = speed;
            }

            return {
                x, y, vx, vy,
                length: 20 + Math.random() * 80,
                speed: Math.abs(speed),
                color,
                alpha: 0.1 + Math.random() * 0.8,
                axis
            };
        };

        const resize = () => {
            w = canvas.offsetWidth;
            h = canvas.offsetHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            // Recalculate fixed nodes on grid intersections randomly
            nodes.length = 0;
            const cols = Math.floor(w / SPACING);
            const rows = Math.floor(h / SPACING);
            for (let i = 0; i < 30; i++) {
                nodes.push({
                    x: Math.floor(Math.random() * cols) * SPACING,
                    y: Math.floor(Math.random() * rows) * SPACING,
                    radius: 1.5 + Math.random() * 2,
                    pulsePhase: Math.random() * Math.PI * 2,
                    pulseSpeed: 0.02 + Math.random() * 0.04,
                    baseAlpha: 0.2 + Math.random() * 0.4
                });
            }
        };

        const draw = () => {
            const isDark = document.documentElement.classList.contains("dark");
            ctx.clearRect(0, 0, w, h);

            // 1. Draw geometric background grid
            ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.025)";
            ctx.lineWidth = 1;

            // Pan grid slightly over time
            GRID_OFFSET.y = (GRID_OFFSET.y + 0.1) % SPACING;

            ctx.beginPath();
            for (let x = 0; x <= w; x += SPACING) {
                ctx.moveTo(x, 0); ctx.lineTo(x, h);
            }
            for (let y = GRID_OFFSET.y; y <= h; y += SPACING) {
                ctx.moveTo(0, y); ctx.lineTo(w, y);
            }
            ctx.stroke();

            // 2. Draw animated intersection nodes
            nodes.forEach(node => {
                node.pulsePhase += node.pulseSpeed;
                const alpha = node.baseAlpha + Math.sin(node.pulsePhase) * 0.2 * (isDark ? 1 : 0.6);

                ctx.beginPath();
                ctx.arc(node.x, node.y + GRID_OFFSET.y, node.radius, 0, Math.PI * 2);
                ctx.fillStyle = isDark ? `rgba(99, 102, 241, ${alpha})` : `rgba(79, 70, 229, ${alpha})`;
                ctx.fill();

                // Extra glow for bright nodes
                if (alpha > node.baseAlpha + 0.1) {
                    ctx.shadowColor = isDark ? "rgba(99, 102, 241, 0.8)" : "rgba(79, 70, 229, 0.5)";
                    ctx.shadowBlur = 10;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            });

            // 3. Update and draw data packets (streaks)
            // Maintain packet count
            while (packets.length < MAX_PACKETS) {
                packets.push(createPacket(isDark));
            }

            for (let i = packets.length - 1; i >= 0; i--) {
                const p = packets[i];
                p.x += p.vx;
                p.y += p.vy;

                // Adjust Y for scrolling grid effect if moving horizontally
                const drawY = p.axis === 'x' ? p.y + GRID_OFFSET.y : p.y;
                const drawX = p.x;

                // Draw streak gradient
                const grad = p.axis === 'x'
                    ? ctx.createLinearGradient(drawX - (p.vx > 0 ? p.length : 0), drawY, drawX + (p.vx < 0 ? p.length : 0), drawY)
                    : ctx.createLinearGradient(drawX, drawY - (p.vy > 0 ? p.length : 0), drawX, drawY + (p.vy < 0 ? p.length : 0));

                // The "head" of the packet is brighter
                const opacity = isDark ? p.alpha : p.alpha * 0.6;
                const rColor = p.color; // Using hex color directly

                // We convert hex to rgb manually or cheat by drawing distinct segments
                ctx.beginPath();
                if (p.axis === 'x') {
                    ctx.moveTo(drawX - (p.vx > 0 ? p.length : -p.length), drawY);
                    ctx.lineTo(drawX, drawY);
                } else {
                    ctx.moveTo(drawX, drawY - (p.vy > 0 ? p.length : -p.length));
                    ctx.lineTo(drawX, drawY);
                }

                ctx.strokeStyle = p.color;
                ctx.globalAlpha = opacity;
                ctx.lineWidth = 2;
                ctx.stroke();

                // Bright moving head
                ctx.beginPath();
                ctx.arc(drawX, drawY, 2, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.globalAlpha = opacity + 0.2;
                ctx.fill();

                // Add heavy glow to head
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 15;
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.globalAlpha = 1; // reset

                // Remove dead packets
                if (p.x < -200 || p.x > w + 200 || p.y < -200 || p.y > h + 200) {
                    packets.splice(i, 1);
                }
            }

            // 4. Draw large blurry ambient geometric glows
            const t = Date.now() * 0.0005;
            const drawGlow = (gx: number, gy: number, rad: number, colorStr: string) => {
                const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, rad);
                grad.addColorStop(0, colorStr);
                grad.addColorStop(1, "transparent");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, w, h);
            };

            if (isDark) {
                drawGlow(w * 0.2 + Math.sin(t) * 100, h * 0.3 + Math.cos(t * 0.8) * 100, 400, "rgba(99, 102, 241, 0.08)");
                drawGlow(w * 0.8 + Math.cos(t * 1.2) * 100, h * 0.6 + Math.sin(t * 0.9) * 100, 500, "rgba(139, 92, 246, 0.06)");
            } else {
                drawGlow(w * 0.2 + Math.sin(t) * 100, h * 0.3 + Math.cos(t * 0.8) * 100, 400, "rgba(99, 102, 241, 0.04)");
                drawGlow(w * 0.8 + Math.cos(t * 1.2) * 100, h * 0.6 + Math.sin(t * 0.9) * 100, 500, "rgba(59, 130, 246, 0.03)");
            }

            animationId = requestAnimationFrame(draw);
        };

        resize();
        window.addEventListener("resize", resize);
        // Start animation after a tiny delay to ensure proper layout
        setTimeout(() => draw(), 50);

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

export default function Hero() {
    const { t } = useI18n();

    return (
        <section className="relative overflow-hidden pt-28 pb-8 md:pt-32 md:pb-10">
            <GridBackground />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--background)_70%)]" />

            <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
                >
                    <span className="text-foreground">{t("hero.title1")}</span>
                    <br />
                    <span className="gradient-text">{t("hero.title2")}</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2"
                    dangerouslySetInnerHTML={{
                        __html: t("hero.subtitle")
                            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>'),
                    }}
                />
            </div>
        </section>
    );
}

