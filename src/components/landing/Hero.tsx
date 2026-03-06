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

        // Particle system
        interface Particle {
            x: number; y: number;
            vx: number; vy: number;
            baseVx: number; baseVy: number;
            size: number; alpha: number;
            hue: number; life: number; maxLife: number;
        }

        const particles: Particle[] = [];
        const PARTICLE_COUNT = 55;
        const CONNECTION_DIST = 120;

        const createParticle = (x?: number, y?: number): Particle => {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.15 + Math.random() * 0.35;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            return {
                x: x ?? Math.random() * w,
                y: y ?? Math.random() * h,
                vx, vy, baseVx: vx, baseVy: vy,
                size: 1 + Math.random() * 2,
                alpha: 0.2 + Math.random() * 0.5,
                hue: [260, 275, 230, 200, 290][Math.floor(Math.random() * 5)],
                life: 0,
                maxLife: 400 + Math.random() * 600,
            };
        };

        const resize = () => {
            w = canvas.offsetWidth;
            h = canvas.offsetHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const initParticles = () => {
            particles.length = 0;
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push(createParticle());
            }
        };

        // Convergence attractors — slowly orbiting focal points
        const attractors = [
            { cx: 0.35, cy: 0.4, phase: 0, strength: 0 },
            { cx: 0.65, cy: 0.35, phase: 2.1, strength: 0 },
            { cx: 0.5, cy: 0.65, phase: 4.2, strength: 0 },
        ];

        let frame = 0;

        const draw = () => {
            frame++;
            const isDark = document.documentElement.classList.contains("dark");
            ctx.clearRect(0, 0, w, h);

            // Ultra-subtle grid
            const spacing = 70;
            const gridAlpha = isDark ? 0.018 : 0.025;
            ctx.strokeStyle = `rgba(${isDark ? "255,255,255" : "0,0,0"}, ${gridAlpha})`;
            ctx.lineWidth = 0.5;
            for (let x = 0; x <= w; x += spacing) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
            }
            for (let y = 0; y <= h; y += spacing) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
            }

            // Ambient glow nebula
            const nebulaAlpha = isDark ? 0.05 : 0.025;
            const nebulae = [
                { x: w * 0.3, y: h * 0.35, r: 250, hue: 265 },
                { x: w * 0.7, y: h * 0.3, r: 220, hue: 240 },
                { x: w * 0.5, y: h * 0.7, r: 200, hue: 280 },
            ];
            nebulae.forEach((n, i) => {
                const ox = Math.sin(frame * 0.003 + i * 2) * 30;
                const oy = Math.cos(frame * 0.002 + i * 1.7) * 25;
                const g = ctx.createRadialGradient(n.x + ox, n.y + oy, 0, n.x + ox, n.y + oy, n.r);
                g.addColorStop(0, `hsla(${n.hue}, 60%, 55%, ${nebulaAlpha})`);
                g.addColorStop(1, `hsla(${n.hue}, 60%, 55%, 0)`);
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, w, h);
            });

            // Update attractors — periodic convergence pulses
            attractors.forEach((a, i) => {
                const cycle = Math.sin(frame * 0.004 + a.phase);
                // Pulse strength smoothly: strong convergence for part of the cycle
                a.strength = Math.max(0, cycle) * 0.012;
                a.cx = [0.35, 0.65, 0.5][i] + Math.sin(frame * 0.001 + i * 2) * 0.06;
                a.cy = [0.4, 0.35, 0.65][i] + Math.cos(frame * 0.0008 + i * 1.5) * 0.05;
            });

            // Update particles
            particles.forEach((p) => {
                p.life++;

                // Apply attractor pull
                let ax = 0, ay = 0;
                attractors.forEach((att) => {
                    const tx = att.cx * w;
                    const ty = att.cy * h;
                    const dx = tx - p.x;
                    const dy = ty - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 300 && dist > 5) {
                        const force = att.strength / (dist * 0.02);
                        ax += (dx / dist) * force;
                        ay += (dy / dist) * force;
                    }
                });

                p.vx = p.baseVx + ax;
                p.vy = p.baseVy + ay;
                p.x += p.vx;
                p.y += p.vy;

                // Wrap edges
                if (p.x < -20) p.x = w + 20;
                if (p.x > w + 20) p.x = -20;
                if (p.y < -20) p.y = h + 20;
                if (p.y > h + 20) p.y = -20;

                // Fade in/out
                let fadeAlpha = p.alpha;
                if (p.life < 40) fadeAlpha *= p.life / 40;
                if (p.life > p.maxLife - 60) fadeAlpha *= (p.maxLife - p.life) / 60;
                if (fadeAlpha < 0) fadeAlpha = 0;

                // Respawn
                if (p.life >= p.maxLife) {
                    Object.assign(p, createParticle());
                    return;
                }

                // Draw particle with glow
                const baseL = isDark ? 70 : 50;
                const bAlpha = isDark ? fadeAlpha : fadeAlpha * 0.6;

                // Outer glow
                const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6);
                glow.addColorStop(0, `hsla(${p.hue}, 65%, ${baseL}%, ${bAlpha * 0.15})`);
                glow.addColorStop(1, `hsla(${p.hue}, 65%, ${baseL}%, 0)`);
                ctx.fillStyle = glow;
                ctx.fillRect(p.x - p.size * 6, p.y - p.size * 6, p.size * 12, p.size * 12);

                // Core
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 70%, ${baseL + 10}%, ${bAlpha})`;
                ctx.fill();
            });

            // Connect nearby particles with faint lines
            const lineAlpha = isDark ? 0.06 : 0.03;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i], b = particles[j];
                    const dx = a.x - b.x, dy = a.y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECTION_DIST) {
                        const opacity = (1 - dist / CONNECTION_DIST) * lineAlpha;
                        const hue = (a.hue + b.hue) / 2;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = `hsla(${hue}, 50%, ${isDark ? 65 : 45}%, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            // Occasional bright streak — rare, fast particle trail
            if (frame % 300 === 0) {
                const streakY = Math.random() * h;
                const g = ctx.createLinearGradient(0, streakY, w * 0.6, streakY);
                g.addColorStop(0, `hsla(270, 60%, 65%, 0)`);
                g.addColorStop(0.3, `hsla(270, 60%, 65%, ${isDark ? 0.06 : 0.03})`);
                g.addColorStop(1, `hsla(270, 60%, 65%, 0)`);
                ctx.fillStyle = g;
                ctx.fillRect(0, streakY - 1, w, 2);
            }

            animationId = requestAnimationFrame(draw);
        };

        resize();
        initParticles();
        window.addEventListener("resize", () => { resize(); initParticles(); });
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

