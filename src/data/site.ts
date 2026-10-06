export const site = {
  name: "Raed Masri",
  role: "Video editor & motion designer",
  url: "https://raedmasri.me",
  email: "raed.bus.raed@gmail.com",
  instagram: "https://www.instagram.com/masrieditmaster/",
  xUrl: "https://x.com/masrieditmaster",
  whatsappUrl: "https://wa.me/96170060592",
  // Set NEXT_PUBLIC_BOOKING_URL in .env.local (and Netlify) after creating your
  // booking page. Falls back to your Cal.com booking URL by default.
  bookingUrl:
    process.env.NEXT_PUBLIC_BOOKING_URL?.trim() ||
    "https://cal.com/raed-xyyqgc/30min",
} as const;

export const nav = [
  { label: "Long-form", href: "/long-form" },
  { label: "Short-form", href: "/short-form" },
  { label: "Motion", href: "/motion-design" },
  { label: "Reviews", href: "/reviews" },
  { label: "FAQ", href: "/#faq" },
] as const;
