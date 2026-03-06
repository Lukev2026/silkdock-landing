"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Menu, X, Sun, Moon, Globe, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
    { key: "nav.models", href: "/models" },
    { key: "nav.features", href: "/#features" },
    { key: "nav.pricing", href: "/pricing" },
    { key: "nav.docs", href: "/docs" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { t, locale, setLocale } = useI18n();
    const { theme, toggleTheme } = useTheme();
    const { data: session } = useSession();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass-nav" : "bg-transparent"
                }`}
        >
            <nav className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between relative">
                {/* Text-only Logo */}
                <a href="/" className="flex items-center gap-0.5 group">
                    <span className="text-xl font-bold tracking-tight text-foreground transition-colors">
                        Silk
                    </span>
                    <span className="text-xl font-bold tracking-tight gradient-text">
                        Dock
                    </span>
                </a>

                {/* Desktop Nav — absolutely centered */}
                <div className="hidden md:flex items-center gap-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    {navLinks.map((link) => (
                        <a
                            key={link.key}
                            href={link.href}
                            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-foreground/[0.04]"
                        >
                            {t(link.key)}
                        </a>
                    ))}
                </div>

                {/* Desktop controls */}
                <div className="hidden md:flex items-center gap-2">
                    {/* Language toggle */}
                    <button
                        onClick={() => setLocale(locale === "en" ? "zh" : "en")}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground rounded-md hover:bg-foreground/[0.04] transition-colors"
                        aria-label="Toggle language"
                    >
                        <Globe className="w-3.5 h-3.5" />
                        <span className="font-medium">{locale === "en" ? "中文" : "EN"}</span>
                    </button>

                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-foreground/[0.04] transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? (
                            <Sun className="w-4 h-4" />
                        ) : (
                            <Moon className="w-4 h-4" />
                        )}
                    </button>

                    <div className="w-px h-5 bg-border mx-1" />

                    {session?.user ? (
                        <div className="flex items-center gap-2">
                            {session.user.image && (
                                <img
                                    src={session.user.image}
                                    alt=""
                                    className="w-7 h-7 rounded-full ring-1 ring-border"
                                />
                            )}
                            <span className="text-sm text-foreground font-medium max-w-[100px] truncate">
                                {session.user.name?.split(" ")[0]}
                            </span>
                            <button
                                onClick={() => signOut()}
                                className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-foreground/[0.04] transition-colors"
                                title="Sign out"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ) : (
                        <>
                            <a href="/login">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground hover:text-foreground text-sm"
                                >
                                    {t("nav.signin")}
                                </Button>
                            </a>
                            <a href="/login">
                                <Button
                                    size="sm"
                                    className="btn-gradient text-sm rounded-lg"
                                >
                                    <span className="relative z-10">{t("nav.getkey")}</span>
                                </Button>
                            </a>
                        </>
                    )}
                </div>

                {/* Mobile toggle */}
                <div className="flex md:hidden items-center gap-2">
                    <button
                        onClick={() => setLocale(locale === "en" ? "zh" : "en")}
                        className="p-2 text-muted-foreground"
                        aria-label="Toggle language"
                    >
                        <Globe className="w-4 h-4" />
                    </button>
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-muted-foreground"
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                    <button
                        className="p-2 text-foreground"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            {menuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden glass-nav px-6 pb-6"
                >
                    <div className="flex flex-col gap-1 pt-2">
                        {navLinks.map((link) => (
                            <a
                                key={link.key}
                                href={link.href}
                                className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground rounded-md"
                                onClick={() => setMenuOpen(false)}
                            >
                                {t(link.key)}
                            </a>
                        ))}
                        <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
                            {session?.user ? (
                                <div className="flex items-center gap-3 px-2 py-2">
                                    {session.user.image && (
                                        <img src={session.user.image} alt="" className="w-8 h-8 rounded-full" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">{session.user.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                                    </div>
                                    <button onClick={() => signOut()} className="p-2 text-muted-foreground hover:text-foreground">
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <a href="/login">
                                        <Button variant="ghost" size="sm" className="w-full h-11">{t("nav.signin")}</Button>
                                    </a>
                                    <a href="/login">
                                        <Button size="sm" className="btn-gradient w-full h-11 rounded-lg">
                                            <span className="relative z-10">{t("nav.getkey")}</span>
                                        </Button>
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.header>
    );
}
