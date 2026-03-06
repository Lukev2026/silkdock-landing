"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useI18n } from "@/lib/i18n";

interface MetricCardProps {
    value: number;
    prefix?: string;
    suffix: string;
    label: string;
    delay: number;
}

function AnimatedNumber({ value, prefix = "", suffix }: { value: number; prefix?: string; suffix: string }) {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (hasAnimated) return;
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    const duration = 2000;
                    const steps = 60;
                    const increment = value / steps;
                    let current = 0;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= value) {
                            setCount(value);
                            clearInterval(timer);
                        } else {
                            setCount(Math.floor(current));
                        }
                    }, duration / steps);
                }
            },
            { threshold: 0.2 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [value, hasAnimated]);

    return (
        <span ref={ref} className="tabular-nums">
            {prefix}{count}{suffix}
        </span>
    );
}

function MetricCard({ value, prefix, suffix, label, delay }: MetricCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay, duration: 0.5 }}
            className="group relative text-center px-6 py-8 rounded-2xl transition-colors hover:bg-muted/50"
        >
            <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
            </div>
            <div className="text-sm text-muted-foreground">{label}</div>
        </motion.div>
    );
}

export default function Metrics() {
    const { t } = useI18n();

    const metrics = [
        { value: 300, suffix: "+", label: t("metrics.models") },
        { value: 60, suffix: "+", label: t("metrics.providers") },
        { value: 9, prefix: "99.", suffix: "%", label: t("metrics.uptime") },
        { value: 10, suffix: "T+", label: t("metrics.tokens") },
    ];

    return (
        <section className="relative py-20 border-y border-border">
            <div className="mx-auto max-w-5xl px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
                    {metrics.map((m, i) => (
                        <MetricCard key={m.label} {...m} delay={i * 0.1} />
                    ))}
                </div>
            </div>
        </section>
    );
}
