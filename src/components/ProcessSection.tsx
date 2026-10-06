"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import type { CSSProperties, PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";

type ProcessStep = readonly [number: string, title: string, copy: string];

type ProcessSectionProps = {
  steps: readonly ProcessStep[];
  title: string;
  copy: string;
};

const thresholds = [0, 0.3, 0.625, 0.9] as const;

function activeCountFor(progress: number) {
  if (progress >= thresholds[3]) return 4;
  if (progress >= thresholds[2]) return 3;
  if (progress >= thresholds[1]) return 2;
  return 1;
}

function ProcessCard({ step, active }: { step: ProcessStep; active: boolean }) {
  const cardRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number | null>(null);

  const moveGlow = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const target = event.currentTarget;
    const clientX = event.clientX;

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = target.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      target.style.setProperty("--process-glow-x", `${x}%`);
    });
  };

  const resetGlow = (event: PointerEvent<HTMLElement>) => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    event.currentTarget.style.setProperty("--process-glow-x", "50%");
  };

  useEffect(() => () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <article
      ref={cardRef}
      className={`process-card${active ? " is-active" : ""}`}
      onPointerMove={moveGlow}
      onPointerLeave={resetGlow}
      style={{ "--process-glow-x": "50%" } as CSSProperties}
    >
      <span className="process-step-circle" aria-hidden="true">
        {Number(step[0])}
      </span>
      <div className="process-card-copy">
        <h3>{step[1]}</h3>
        <p>{step[2]}</p>
      </div>
    </article>
  );
}

export function ProcessSection({ steps, title, copy }: ProcessSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [activeCount, setActiveCount] = useState(1);
  const railTravel = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // The section remains part of normal document flow. Progress begins as the
    // heading/rail enters and reaches 100% while the cards are still visible.
    offset: ["start 64%", "start -18%"],
  });

  const dotX = useTransform([scrollYProgress, railTravel], ([progress, travel]) => Number(progress) * Number(travel));

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const next = activeCountFor(latest);
    setActiveCount((current) => (current === next ? current : next));
  });

  useEffect(() => {
    setActiveCount(activeCountFor(scrollYProgress.get()));
  }, [scrollYProgress]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const updateTravel = () => {
      // Dot is centered on the rail endpoints, so it travels the full content width.
      railTravel.set(Math.max(0, rail.clientWidth));
    };

    updateTravel();
    const observer = new ResizeObserver(updateTravel);
    observer.observe(rail);
    return () => observer.disconnect();
  }, [railTravel]);

  return (
    <section ref={sectionRef} className="section page-container process-section process-scroll-section atmosphere-open">
      <div className="process-heading">
        <h2>{title}</h2>
        <p>{copy}</p>
      </div>

      <div className="process-experience">
        <div ref={railRef} className="process-rail" aria-hidden="true">
          <motion.div
            className="process-rail-fill"
            style={{ scaleX: scrollYProgress }}
          />
          <motion.span
            className="process-rail-dot"
            style={{ x: dotX }}
          />
        </div>

        <div className="process-scroll-grid">
          {steps.map((step, index) => (
            <ProcessCard key={step[0]} step={step} active={index < activeCount} />
          ))}
        </div>
      </div>
    </section>
  );
}
