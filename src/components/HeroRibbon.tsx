"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

export function HeroRibbon() {
  const reduced = useReducedMotion();
  const regionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: regionRef, offset: ["start start", "end start"] });
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 700px)");
    const sync = () => setCompact(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // One stable oversized ribbon follows the actual hero region scroll amount.
  // Scroll down/reverse both use the same Motion Value; no staged triggers or rerenders.
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1], { clamp: true });
  const x = useTransform(progress, [0, 1], compact ? [300, -250] : [355, -420]);
  const y = useTransform(progress, [0, 1], compact ? [12, -115] : [0, -160]);

  return (
    <div className="hero-ribbon-stage" aria-hidden="true" ref={regionRef}>
      <motion.svg
        className="hero-ribbon"
        viewBox="0 0 1440 1180"
        preserveAspectRatio="none"
        focusable="false"
        style={reduced ? { x: compact ? 190 : 220, y: 0 } : { x, y }}
      >
        <defs>
          <linearGradient id="heroRibbonFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4d1707" stopOpacity="0.23" />
            <stop offset="40%" stopColor="#6f2409" stopOpacity="0.35" />
            <stop offset="72%" stopColor="#a43a0c" stopOpacity="0.19" />
            <stop offset="100%" stopColor="#230b05" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="heroRibbonEdge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#b43a09" stopOpacity="0.36" />
            <stop offset="45%" stopColor="#f57429" stopOpacity="0.94" />
            <stop offset="78%" stopColor="#ffc36c" stopOpacity="0.96" />
            <stop offset="100%" stopColor="#e96819" stopOpacity="0.44" />
          </linearGradient>
          <filter id="heroRibbonGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="11" />
          </filter>
        </defs>

        <defs>
          <linearGradient id="heroRibbonCopyFade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="black" />
            <stop offset="24%" stopColor="#555" />
            <stop offset="54%" stopColor="white" />
            <stop offset="100%" stopColor="white" />
          </linearGradient>
          <mask id="heroRibbonCopyMask"><rect x="-100" y="-200" width="1900" height="1500" fill="url(#heroRibbonCopyFade)" /></mask>
        </defs>
        {/* One oversized upper sheet. Its geometry stays fixed; the whole artwork travels with scroll. */}
        <g mask="url(#heroRibbonCopyMask)">
        <path
          className="hero-ribbon-sheet"
          d="M 705 -120 C 960 8 1208 60 1478 262 L 1478 610 C 1265 472 1088 432 914 488 C 755 540 665 704 456 690 C 290 679 123 573 -78 432 L -78 294 C 140 436 323 456 495 363 C 672 268 612 80 705 -120 Z"
          fill="url(#heroRibbonFill)"
        />
        <path
          className="hero-ribbon-edge hero-ribbon-edge-blur"
          d="M -78 432 C 123 573 290 679 456 690 C 665 704 755 540 914 488 C 1088 432 1265 472 1478 610"
          fill="none"
          stroke="url(#heroRibbonEdge)"
          strokeWidth="16"
          filter="url(#heroRibbonGlow)"
          opacity="0.34"
        />
        <path
          className="hero-ribbon-edge"
          d="M -78 432 C 123 573 290 679 456 690 C 665 704 755 540 914 488 C 1088 432 1265 472 1478 610"
          fill="none"
          stroke="url(#heroRibbonEdge)"
          strokeWidth="2.1"
        />

        </g>

        {/* Broad lower crest revealed as the same oversized composition advances into the stats region. */}
        <path
          className="hero-ribbon-lower-fill"
          d="M -90 930 C 190 786 382 774 548 895 C 699 1005 775 1130 958 1118 C 1138 1106 1265 1006 1512 1038 L 1512 1190 L -90 1190 Z"
          fill="url(#heroRibbonFill)"
          opacity="0.78"
        />
        <path
          className="hero-ribbon-edge hero-ribbon-edge-blur"
          d="M -90 930 C 190 786 382 774 548 895 C 699 1005 775 1130 958 1118 C 1138 1106 1265 1006 1512 1038"
          fill="none"
          stroke="url(#heroRibbonEdge)"
          strokeWidth="14"
          filter="url(#heroRibbonGlow)"
          opacity="0.30"
        />
        <path
          className="hero-ribbon-edge"
          d="M -90 930 C 190 786 382 774 548 895 C 699 1005 775 1130 958 1118 C 1138 1106 1265 1006 1512 1038"
          fill="none"
          stroke="url(#heroRibbonEdge)"
          strokeWidth="1.55"
          opacity="0.65"
        />
      </motion.svg>
    </div>
  );
}
