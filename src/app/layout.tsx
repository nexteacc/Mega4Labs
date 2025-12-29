import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { SITE_NAME, SEO_DESCRIPTION } from "@/lib/i18n";
import Link from "next/link";
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
  metadataBase: new URL("https://mega4lab.com"),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SEO_DESCRIPTION,
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
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const isValidGAId = gaId && /^G-[A-Z0-9]+$/.test(gaId);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#1a1a2e" />
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-base text-primary`}
      >
        <div className="min-h-screen bg-base">
          <header className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-2 px-4 pb-6 pt-8 sm:gap-4 sm:px-8 lg:px-10">
            <Link
              href="/"
              className="rounded-full bg-hero px-3 py-1 text-xs font-medium text-accent hover:opacity-80 transition-opacity sm:px-4 sm:text-sm"
              title={SITE_NAME}
            >
              <span className="hidden sm:inline">{SITE_NAME}</span>
              <span className="inline sm:hidden">MEGA 4</span>
            </Link>
          </header>
          <Navigation />
          <main>{children}</main>
        </div>
        <Footer />
        <Analytics />
        {isValidGAId && <GoogleAnalytics measurementId={gaId} />}
      </body>
    </html>
  );
}
