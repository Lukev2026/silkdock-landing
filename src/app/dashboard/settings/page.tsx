"use client";

import { useI18n } from "@/lib/i18n";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
    const { t } = useI18n();
    const { data: session } = useSession();

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-1 text-sm">Manage your account and platform preferences.</p>
            </div>

            <div className="dashboard-card p-6">
                <h2 className="text-lg font-semibold mb-4">Profile Info</h2>
                <div className="flex items-center gap-4">
                    {session?.user?.image ? (
                        <img src={session.user.image} alt="" className="w-16 h-16 rounded-full border border-white/10" />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center">
                            <span className="text-2xl text-muted-foreground">?</span>
                        </div>
                    )}
                    <div>
                        <p className="font-medium text-lg">{session?.user?.name || "Guest User"}</p>
                        <p className="text-muted-foreground">{session?.user?.email || "No email provided"}</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-card p-6">
                <h2 className="text-lg font-semibold mb-6">API Configuration</h2>
                <div className="space-y-4 max-w-md">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Base URL</label>
                        <input
                            type="text"
                            value="https://api.silkdock.com/v1"
                            disabled
                            className="w-full bg-white/[0.02] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-muted-foreground cursor-not-allowed focus:outline-none"
                        />
                        <p className="text-xs text-muted-foreground mt-1.5">Use this URL as the base URL in your OpenAI SDK client.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
