"use client";

import { useI18n } from "@/lib/i18n";
import { Activity, DollarSign, Key, Cpu, BarChart3 } from "lucide-react";

export default function DashboardOverview() {
    const { t } = useI18n();

    // Mock data for initial layout
    const stats = [
        { label: "Total Spend (This Month)", value: "$342.50", change: "+12.5%", icon: DollarSign, trend: "up" },
        { label: "API Requests", value: "2.4M", change: "+5.2%", icon: Activity, trend: "up" },
        { label: "Active Keys", value: "14", change: "2 new", icon: Key, trend: "neutral" },
        { label: "Total Tokens", value: "85M", change: "+18%", icon: Cpu, trend: "up" },
    ];

    const recentActivity = [
        { id: 1, action: "Created API Key 'Production-App'", user: "Admin", time: "2 hours ago" },
        { id: 2, action: "Budget limit reached for 'Test-Key'", user: "System", time: "5 hours ago", alert: true },
        { id: 3, action: "Added new team member", user: "Admin", time: "1 day ago" },
        { id: 4, action: "Upgraded 'GPT-4' model context limit", user: "Admin", time: "2 days ago" },
    ];

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
                <p className="text-muted-foreground mt-1 text-sm">Welcome back to SilkDock Console. Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="dashboard-card stat-card">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground text-sm font-medium">{stat.label}</span>
                                <div className="p-2 bg-white/[0.04] rounded-md">
                                    <Icon className="w-4 h-4 text-muted-foreground" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-2xl font-bold tracking-tight">{stat.value}</span>
                                <span className={`text-xs font-medium ${stat.trend === "up" ? "text-emerald-500" :
                                        stat.trend === "down" ? "text-rose-500" : "text-muted-foreground"
                                    }`}>
                                    {stat.change}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts & Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Chart Area (Mock) */}
                <div className="lg:col-span-2 dashboard-card p-6 min-h-[360px] flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-base font-semibold">Spend & Usage</h2>
                        <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] p-1 rounded-lg text-xs font-medium">
                            <button className="px-3 py-1 bg-primary text-primary-foreground rounded shadow-sm">7d</button>
                            <button className="px-3 py-1 text-muted-foreground hover:text-foreground rounded">30d</button>
                            <button className="px-3 py-1 text-muted-foreground hover:text-foreground rounded">90d</button>
                        </div>
                    </div>
                    {/* Placeholder for actual chart */}
                    <div className="flex-1 border border-dashed border-white/[0.1] rounded-lg bg-white/[0.01] flex items-center justify-center relative overflow-hidden group">

                        {/* Fake Bar Chart Visualization */}
                        <div className="absolute inset-0 p-8 flex items-end justify-between gap-2 opacity-60">
                            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                                <div key={i} className="w-full bg-gradient-to-t from-primary/10 to-primary/40 rounded-t-sm transition-all duration-500 group-hover:to-primary/60" style={{ height: `${h}%` }}></div>
                            ))}
                        </div>

                        <div className="relative z-10 text-center pointer-events-none">
                            <BarChart3 className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                            <p className="text-sm tracking-tight text-muted-foreground">Chart Data Pending</p>
                        </div>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="dashboard-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-base font-semibold">Recent Activity</h2>
                        <button className="text-xs text-primary hover:text-primary/80 font-medium">View All</button>
                    </div>
                    <div className="space-y-6">
                        {recentActivity.map((item) => (
                            <div key={item.id} className="relative pl-6">
                                {/* Timeline line */}
                                <div className="absolute left-[7px] top-2 bottom-[-16px] w-[2px] bg-white/[0.06] last:hidden"></div>
                                {/* Timeline dot */}
                                <div className={`absolute left-1 top-1.5 w-[14px] h-[14px] rounded-full border-2 border-background ${item.alert ? "bg-rose-500/20 border-rose-500/50" : "bg-primary/20 border-primary/50"
                                    }`}></div>

                                <p className="text-sm text-foreground">{item.action}</p>
                                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                    <span className="font-medium text-foreground/70">{item.user}</span>
                                    <span>•</span>
                                    <span>{item.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
