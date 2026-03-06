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

    const toggleTheme = useCallback((event?: React.MouseEvent) => {
        const next = theme === "dark" ? "light" : "dark";

        // Fallback for browsers without View Transitions API
        if (!document.startViewTransition || !event) {
            setTheme(next);
            localStorage.setItem("silkdock-theme", next);
            applyThemeClass(next);
            return;
        }

        // Calculate click position for sweeping circle origin
        const x = event.clientX;
        const y = event.clientY;
        const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        const transition = document.startViewTransition(() => {
            setTheme(next);
            localStorage.setItem("silkdock-theme", next);
            applyThemeClass(next);
        });

        transition.ready.then(() => {
            const clipPath = [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`
            ];
            document.documentElement.animate(
                {
                    clipPath: next === "dark" ? [...clipPath].reverse() : clipPath,
                },
                {
                    duration: 500,
                    easing: "ease-in-out",
                    pseudoElement: next === "dark" ? "::view-transition-old(root)" : "::view-transition-new(root)",
                }
            );
        });
    }, [theme]);

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
