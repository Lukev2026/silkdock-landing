import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SilkDock AI — One API for Every AI Model",
  description:
    "Unified AI API gateway. Access GPT, Claude, Gemini, DeepSeek and 300+ models through a single API. Enterprise-grade reliability, smart routing, and cost optimization.",
  keywords: [
    "AI API", "LLM Gateway", "OpenAI API", "Claude API",
    "Gemini API", "unified API", "AI proxy", "model aggregator",
  ],
  openGraph: {
    type: "website",
    title: "SilkDock AI — One API for Every AI Model",
    description: "Unified AI API gateway. Access 300+ models through a single API endpoint.",
    siteName: "SilkDock AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
