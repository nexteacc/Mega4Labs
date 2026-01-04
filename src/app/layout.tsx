import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { SITE_NAME, SEO_DESCRIPTION } from "@/lib/i18n";
import Link from "next/link";
import Image from "next/image";
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
  metadataBase: new URL("https://mega4labs.vercel.app"),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SEO_DESCRIPTION,
  icons: {
    icon: [
      { url: "/M.svg", type: "image/svg+xml" }
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        {/* M4 Logo 区域 - 在 Footer 之外 */}
        <div className="bg-base px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
          <div className="mx-auto flex justify-center">
            <Image
              src="/m4.svg"
              alt="Mega 4 Labs"
              width={453}
              height={174}
              className="w-[300px] sm:w-[400px] lg:w-[453px] h-auto"
              priority
            />
          </div>
        </div>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
