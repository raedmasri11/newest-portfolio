"use client";

import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { site } from "@/data/site";
import { CalendarIcon } from "./CalendarIcon";

function youtubeId(url: string) {
  const match = url.match(/(?:youtu\.be\/|v=|shorts\/)([A-Za-z0-9_-]{11})/);
  return match?.[1] ?? null;
}

export function VideoModal({ url, aspect = "16:9", title, subtitle, onClose }: {
  url: string | null;
  aspect?: "16:9" | "9:16";
  title: string;
  subtitle: string;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!url) return;
    const previous = document.body.style.overflow;
    const formerlyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        // Keep keyboard focus inside this modal while it is open.
        const panel = closeRef.current?.closest(".video-modal-panel");
        const controls = panel?.querySelectorAll<HTMLElement>('button, a[href], iframe, video[controls]');
        if (!controls?.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", key);
      formerlyFocused?.focus({ preventScroll: true });
    };
  }, [url, onClose]);

  if (!url) return null;
  const id = youtubeId(url);
  return (
    <motion.div className="video-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      onMouseDown={onClose} role="dialog" aria-modal="true" aria-labelledby="video-modal-heading" aria-describedby="video-modal-description">
      <motion.div className={`video-modal-panel video-modal-branded ${aspect === "9:16" ? "is-portrait" : ""}`}
        initial={{ opacity: 0, scale: .975, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: .24, ease: [0.22, 1, 0.36, 1] }} onMouseDown={(event) => event.stopPropagation()}>
        <div className="video-modal-head">
          <div><h2 id="video-modal-heading">{title}</h2><p id="video-modal-description">{subtitle}</p></div>
          <button ref={closeRef} type="button" className="modal-close" onClick={onClose} aria-label="Close video">×</button>
        </div>
        <div className={`video-modal-media ${aspect === "9:16" ? "is-portrait" : ""}`}>
          {id ? <iframe key={id} src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
          : <video key={url} src={url} controls autoPlay playsInline />}
        </div>
        <div className="video-modal-cta">
          <span>Want an edit like this?</span>
          <a className="button nav-book-button" href={site.bookingUrl}>Book a free call <span className="button-endcap" aria-hidden="true"><CalendarIcon /></span></a>
        </div>
      </motion.div>
    </motion.div>
  );
}
