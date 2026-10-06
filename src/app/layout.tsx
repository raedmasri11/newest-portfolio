import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Raed Masri — Video Editor & Motion Designer", template: "%s | Raed Masri" },
  description: "Story-driven YouTube, documentary and short-form video editing for creators, personal brands and businesses. Motion graphics, sound design and retention-focused pacing.",
  openGraph: {
    type: "website",
    url: site.url,
    siteName: "Raed Masri",
    title: "Raed Masri — Video Editor & Motion Designer",
    description: "YouTube, documentary and short-form edits built around story, clarity and retention.",
  },
  twitter: { card: "summary_large_image", title: "Raed Masri — Video Editor & Motion Designer", description: "YouTube, documentary and short-form edits built around story, clarity and retention." },
  icons: {
    icon: [
      { url: "/favicon.svg?v=2", type: "image/svg+xml" },
      { url: "/favicon.ico?v=2", sizes: "any", type: "image/x-icon" },
      { url: "/favicon.png?v=2", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=2",
    apple: "/apple-touch-icon.png?v=2",
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: [
  { media: "(prefers-color-scheme: light)", color: "#f3eee8" },
  { media: "(prefers-color-scheme: dark)", color: "#060403" },
] };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Raed Masri",
    url: site.url,
    jobTitle: "Video Editor & Motion Designer",
    sameAs: [site.instagram],
    knowsAbout: ["Video editing", "YouTube editing", "Documentary editing", "Short-form video editing", "Motion graphics", "Sound design"],
    knowsLanguage: ["Arabic", "English", "French"],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Script id="theme-init" strategy="beforeInteractive">{`try{var t=localStorage.getItem('theme')||'auto';document.documentElement.dataset.theme=t;var d=t==='dark'||(t==='auto'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}`}</Script>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        <a className="skip-link" href="#main">Skip to content</a>
        <Header />
        <div id="main">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
