"use client";

import type { PointerEvent, ReactNode } from "react";

type GlowCardProps = {
  as?: "article" | "figure" | "div";
  className?: string;
  children: ReactNode;
};

export function GlowCard({ as = "article", className = "", children }: GlowCardProps) {
  const classNames = `glow-card ${className}`.trim();

  const moveGlow = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
    event.currentTarget.style.setProperty("--glow-x", `${x}%`);
  };

  const resetGlow = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--glow-x", "50%");
  };

  if (as === "figure") {
    return <figure className={classNames} onPointerMove={moveGlow} onPointerLeave={resetGlow}>{children}</figure>;
  }
  if (as === "div") {
    return <div className={classNames} onPointerMove={moveGlow} onPointerLeave={resetGlow}>{children}</div>;
  }
  return <article className={classNames} onPointerMove={moveGlow} onPointerLeave={resetGlow}>{children}</article>;
}
