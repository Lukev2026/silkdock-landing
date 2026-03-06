"use client";

import { useI18n } from "@/lib/i18n";
import { BarChart3 } from "lucide-react";

export default function UsagePage() {
    const { t } = useI18n();

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Usage & Billing</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Monitor your API consumption and costs.</p>
                </div>
            </div>

            <div className="dashboard-card p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center mb-6">
                    <BarChart3 className="w-8 h-8 text-primary/80" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Detailed Usage Coming Soon</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                    The advanced usage charts, daily break-downs, and token usage by model will be available once the LiteLLM proxy integration is completed.
                </p>
            </div>
        </div>
    );
}
