import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/data/site";

const socialTitle = "Raed Masri — Video Editor & Motion Designer";
const socialDescription = "YouTube, documentary and short-form edits built around story, clarity and retention.";
const socialImagePath = "/og-preview.png";
const socialImageUrl = new URL(socialImagePath, site.url).toString();

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: socialTitle, template: "%s | Raed Masri" },
  description: socialDescription,
  alternates: { canonical: site.url },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: "Raed Masri",
    title: socialTitle,
    description: socialDescription,
    images: [
      {
        url: socialImageUrl,
        width: 1200,
        height: 630,
        alt: socialTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: socialTitle,
    description: socialDescription,
    images: [socialImageUrl],
  },
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3eee8" },
    { media: "(prefers-color-scheme: dark)", color: "#060403" },
  ],
};

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

  const themeInitScript = `(function(){var r=document.documentElement;var saved=null;try{var value=localStorage.getItem('theme');if(value==='light'||value==='dark'){saved=value}else if(value!==null){localStorage.removeItem('theme')}}catch(e){}var systemDark=!!(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);var resolved=saved||(systemDark?'dark':'light');r.dataset.theme=resolved;r.dataset.themeSource=saved?'manual':'system';r.classList.toggle('dark',resolved==='dark');r.style.colorScheme=resolved})();`;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        <a className="skip-link" href="#main">Skip to content</a>
        <Header />
        <div id="main">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
