"use client";

import { useI18n } from "@/lib/i18n";
import { Search, Filter, RefreshCcw } from "lucide-react";

export default function LogsPage() {
    const { t } = useI18n();

    const logs = [
        { id: "req-1", time: "2023-10-24 14:32:01", model: "gpt-4-turbo", key: "Production App", tokens: "4,245", cost: "$0.042", latency: "1.2s", status: 200 },
        { id: "req-2", time: "2023-10-24 14:31:45", model: "claude-3-opus", key: "Production App", tokens: "892", cost: "$0.013", latency: "2.4s", status: 200 },
        { id: "req-3", time: "2023-10-24 14:28:12", model: "gpt-3.5-turbo", key: "Development", tokens: "0", cost: "$0.000", latency: "0.1s", status: 429 },
        { id: "req-4", time: "2023-10-24 14:25:05", model: "gemini-pro", key: "Legacy", tokens: "1,024", cost: "$0.001", latency: "0.8s", status: 200 },
        { id: "req-5", time: "2023-10-24 14:20:18", model: "gpt-4-turbo", key: "Production App", tokens: "125", cost: "$0.001", latency: "0.5s", status: 200 },
    ];

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Request Logs</h1>
                    <p className="text-muted-foreground mt-1 text-sm">View and debug recent API requests.</p>
                </div>
                <button className="flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium border border-white/[0.08] rounded-lg hover:bg-white/[0.04] transition-colors">
                    <RefreshCcw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            <div className="dashboard-card">
                <div className="p-4 border-b border-white/[0.06] flex flex-wrap gap-3 items-center">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by Request ID or Error..."
                            className="w-full bg-white/[0.02] border border-white/[0.08] rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-primary/50"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-white/[0.08] rounded-lg hover:bg-white/[0.04]">
                        <Filter className="w-4 h-4" />
                        Model
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-white/[0.08] rounded-lg hover:bg-white/[0.04]">
                        <Filter className="w-4 h-4" />
                        Status
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Model</th>
                                <th>API Key</th>
                                <th>Tokens</th>
                                <th>Cost</th>
                                <th>Latency</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id} className="cursor-pointer group">
                                    <td className="text-muted-foreground whitespace-nowrap">{log.time}</td>
                                    <td>
                                        <span className="bg-white/[0.04] px-2 py-1 rounded text-xs font-mono border border-white/[0.04] whitespace-nowrap">
                                            {log.model}
                                        </span>
                                    </td>
                                    <td className="text-muted-foreground whitespace-nowrap">{log.key}</td>
                                    <td className="font-mono text-xs">{log.tokens}</td>
                                    <td className="font-mono text-xs text-muted-foreground">{log.cost}</td>
                                    <td className="text-muted-foreground text-xs">{log.latency}</td>
                                    <td>
                                        <span className={log.status === 200 ? 'badge-success' : 'badge-error'}>
                                            {log.status === 200 ? '200 OK' : `${log.status} Error`}
                                        </span>
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
