import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.perplexitypro.info"),
  title: {
    default: "Perplexity Pro Learning Hub",
    template: "%s | Perplexity Pro",
  },
  description:
    "Learn how Comet Browser and Perplexity AI combine to accelerate your workflows with curated tutorials, demos, and pro reviews.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 验证 Google Analytics Measurement ID 格式
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const isValidGAId = gaId && /^G-[A-Z0-9]+$/.test(gaId);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#21808d" />
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-base text-primary`}
      >
        {children}
        <Analytics />
        {isValidGAId && <GoogleAnalytics measurementId={gaId} />}
      </body>
    </html>
  );
}