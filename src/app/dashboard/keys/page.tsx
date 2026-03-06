"use client";

import { useI18n } from "@/lib/i18n";
import { Plus, Search, MoreVertical, Copy, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function ApiKeysPage() {
    const { t } = useI18n();
    const [showKey, setShowKey] = useState<string | null>(null);

    const keys = [
        { id: "sk-1a2b", name: "Production App", key: "sk-live-1a2b3c4d5e6f7g8h9i0j", created: "Oct 12, 2023", lastUsed: "2 mins ago", spend: "$145.20", limit: "$500.00", status: "active" },
        { id: "sk-8x9y", name: "Development Testing", key: "sk-test-8x9y0z1a2b3c4d5e6f", created: "Nov 05, 2023", lastUsed: "1 day ago", spend: "$12.50", limit: "$50.00", status: "active" },
        { id: "sk-4m5n", name: "Legacy Integration", key: "sk-old-4m5n6o7p8q9r0s1t2u", created: "Jan 18, 2023", lastUsed: "3 weeks ago", spend: "$890.00", limit: "$1000.00", status: "revoked" },
    ];

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">API Keys</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Manage your API keys and set usage limits.</p>
                </div>
                <button className="btn-gradient px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create New Key
                </button>
            </div>

            <div className="dashboard-card">
                <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search keys by name or ID..."
                            className="w-full bg-white/[0.02] border border-white/[0.08] rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Secret Key</th>
                                <th>Created</th>
                                <th>Last Used</th>
                                <th>Spend / Budget</th>
                                <th>Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {keys.map((k) => (
                                <tr key={k.id}>
                                    <td className="font-medium">{k.name}</td>
                                    <td>
                                        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap font-mono text-xs bg-black/20 px-2 py-1 rounded inline-flex">
                                            <span>{showKey === k.id ? k.key : k.key.substring(0, 8) + '•'.repeat(16)}</span>
                                            <button
                                                onClick={() => setShowKey(showKey === k.id ? null : k.id)}
                                                className="text-muted-foreground hover:text-foreground"
                                            >
                                                {showKey === k.id ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                            </button>
                                            <button className="text-muted-foreground hover:text-foreground">
                                                <Copy className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="text-muted-foreground">{k.created}</td>
                                    <td className="text-muted-foreground">{k.lastUsed}</td>
                                    <td className="min-w-[140px]">
                                        <div className="flex items-center justify-between">
                                            <span>{k.spend}</span>
                                            <span className="text-muted-foreground text-xs">/ {k.limit}</span>
                                        </div>
                                        <div className="w-full bg-white/[0.04] h-1.5 rounded-full mt-1.5 overflow-hidden">
                                            <div
                                                className="bg-primary h-full rounded-full"
                                                style={{ width: `${Math.min(100, (parseFloat(k.spend.slice(1)) / parseFloat(k.limit.slice(1))) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={k.status === 'active' ? 'badge-success' : 'badge-error'}>
                                            {k.status.charAt(0).toUpperCase() + k.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        <button className="p-1.5 text-muted-foreground hover:text-foreground rounded hover:bg-white/[0.04]">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
