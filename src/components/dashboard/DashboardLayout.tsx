"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, Key, BarChart3, ScrollText, Settings,
    ChevronLeft, ChevronRight, LogOut, Menu, X
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { useSession, signOut } from "next-auth/react";
import { Sun, Moon, Globe } from "lucide-react";

const navItems = [
    { key: "dash.nav.overview", href: "/dashboard", icon: LayoutDashboard },
    { key: "dash.nav.keys", href: "/dashboard/keys", icon: Key },
    { key: "dash.nav.usage", href: "/dashboard/usage", icon: BarChart3 },
    { key: "dash.nav.logs", href: "/dashboard/logs", icon: ScrollText },
    { key: "dash.nav.settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();
    const { t, locale, setLocale } = useI18n();
    const { theme, toggleTheme } = useTheme();
    const { data: session } = useSession();

    const isActive = (href: string) => {
        if (href === "/dashboard") return pathname === "/dashboard";
        return pathname.startsWith(href);
    };

    const sidebar = (
        <div className={`flex flex-col h-full ${collapsed ? "w-[68px]" : "w-[240px]"} transition-all duration-300`}>
            {/* Logo */}
            <div className="flex items-center gap-2 px-4 h-16 border-b border-white/[0.06]">
                <a href="/" className="flex items-center gap-0.5">
                    <span className="text-lg font-bold text-foreground">S</span>
                    <span className={`text-lg font-bold gradient-text transition-all duration-300 ${collapsed ? "w-0 opacity-0 overflow-hidden" : ""}`}>
                        ilkDock
                    </span>
                </a>
                {!collapsed && (
                    <span className="ml-auto text-[10px] text-muted-foreground font-mono bg-muted/30 px-1.5 py-0.5 rounded">
                        Console
                    </span>
                )}
            </div>

            {/* Nav items */}
            <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                        <a
                            key={item.key}
                            href={item.href}
                            className={`sidebar-item ${active ? "active" : ""} ${collapsed ? "justify-center px-0" : ""}`}
                            title={collapsed ? t(item.key) : undefined}
                            onClick={() => setMobileOpen(false)}
                        >
                            <Icon className="w-[18px] h-[18px] shrink-0" />
                            {!collapsed && <span>{t(item.key)}</span>}
                        </a>
                    );
                })}
            </nav>

            {/* User section */}
            <div className="border-t border-white/[0.06] p-3">
                {session?.user ? (
                    <div className={`flex items-center gap-2.5 ${collapsed ? "justify-center" : ""}`}>
                        {session.user.image && (
                            <img
                                src={session.user.image}
                                alt=""
                                className="w-8 h-8 rounded-full ring-1 ring-white/10 shrink-0"
                            />
                        )}
                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{session.user.name}</p>
                                <p className="text-[11px] text-muted-foreground truncate">{session.user.email}</p>
                            </div>
                        )}
                        {!collapsed && (
                            <button
                                onClick={() => signOut()}
                                className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-white/[0.04] transition-colors"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                ) : (
                    <a href="/login" className={`sidebar-item ${collapsed ? "justify-center px-0" : ""}`}>
                        <LogOut className="w-[18px] h-[18px]" />
                        {!collapsed && <span>{t("nav.signin")}</span>}
                    </a>
                )}
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Desktop sidebar */}
            <aside className="hidden md:flex flex-col border-r border-white/[0.06] bg-card/50 backdrop-blur-xl relative">
                {sidebar}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-10"
                >
                    {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                </button>
            </aside>

            {/* Mobile sidebar overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
                    <aside className="absolute left-0 top-0 bottom-0 w-[260px] bg-card border-r border-white/[0.06]">
                        {sidebar}
                    </aside>
                </div>
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="h-14 border-b border-white/[0.06] bg-card/30 backdrop-blur-xl flex items-center justify-between px-4 md:px-6 shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="md:hidden p-1.5 text-muted-foreground hover:text-foreground"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="text-sm text-muted-foreground">
                            {navItems.find((item) => isActive(item.href))
                                ? t(navItems.find((item) => isActive(item.href))!.key)
                                : "Dashboard"}
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => setLocale(locale === "en" ? "zh" : "en")}
                            className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-foreground/[0.04] transition-colors"
                        >
                            <Globe className="w-4 h-4" />
                        </button>
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-foreground/[0.04] transition-colors"
                        >
                            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
