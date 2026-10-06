"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nav, site } from "@/data/site";
import { ThemeToggle } from "./ThemeToggle";
import { CalendarIcon } from "./CalendarIcon";

function ArrowUpRightIcon() {
  return (
    <svg className="nav-arrow-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="nav-arrow-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5.5 12h13M13.5 6.5L19 12l-5.5 5.5" />
    </svg>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 22);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  return (
    <header className={`site-header-wrap ${scrolled ? "is-scrolled" : ""}`}>
      <div className="site-header">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">RM</span>
          <span>Raed Masri.</span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {nav.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>

        <div className="header-actions">
          <div className="desktop-theme"><ThemeToggle /></div>
          <a className="button button-small nav-book-button desktop-cta" href={site.bookingUrl}>Book a call <span className="button-endcap"><CalendarIcon /></span></a>
          <Link className="button button-small nav-request-button desktop-cta" href="/request-project">Request a project <span className="button-endcap"><ArrowRightIcon /></span></Link>
          <button
            className={`menu-button ${open ? "is-open" : ""}`}
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          ><span /><span /></button>
        </div>
      </div>

      {open && (
        <div className="mobile-drawer-wrap" onMouseDown={() => setOpen(false)}>
          <div className="mobile-panel" onMouseDown={(event) => event.stopPropagation()}>
            <div className="mobile-panel-head"><span>Menu</span><button type="button" onClick={() => setOpen(false)} aria-label="Close menu">×</button></div>
            <nav aria-label="Mobile navigation">
              <Link href="/" onClick={() => setOpen(false)}>Home <span>↗</span></Link>
              {nav.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}<span>↗</span></Link>)}
            </nav>
            <div className="mobile-theme-row"><span>Appearance</span><ThemeToggle /></div>
            <div className="mobile-ctas">
              <Link className="button button-ghost" href="/request-project" onClick={() => setOpen(false)}>Request a project</Link>
              <a className="button button-dark" href={site.bookingUrl}>Book a free call <span className="button-endcap"><CalendarIcon /></span></a>
            </div>
            <a className="mobile-email" href={`mailto:${site.email}`}>{site.email}</a>
          </div>
        </div>
      )}
    </header>
  );
}
