"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type Theme = "light" | "dark";

interface ThemeContextValue {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: "dark",
    toggleTheme: () => { },
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("dark");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem("silkdock-theme") as Theme | null;
        const initial = saved === "light" || saved === "dark" ? saved : "dark";
        setTheme(initial);
        applyThemeClass(initial);
    }, []);

    const applyThemeClass = (t: Theme) => {
        const html = document.documentElement;
        if (t === "dark") {
            html.classList.add("dark");
            html.classList.remove("light");
        } else {
            html.classList.remove("dark");
            html.classList.add("light");
        }
    };

    const toggleTheme = useCallback(() => {
        setTheme((prev) => {
            const next = prev === "dark" ? "light" : "dark";
            localStorage.setItem("silkdock-theme", next);
            applyThemeClass(next);
            return next;
        });
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
