"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

export function PerformanceGauge() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reducedMotion = useReducedMotion();
  const active = inView && !reducedMotion;

  return (
    <div ref={ref} className="performance-instrument" aria-hidden="true">
      <div className="performance-dial">
        <div className="performance-dial-ticks">
          {Array.from({ length: 33 }).map((_, index) => (
            <span key={index} style={{ transform: `rotate(${-104 + index * 6.5}deg)` }}><i /></span>
          ))}
        </div>
        <div className="performance-dial-arc" />
        <motion.div
          className="performance-needle"
          animate={active ? { rotate: [-48, 14, 46, -18] } : { rotate: -12 }}
          transition={active
            ? { duration: 13, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }
            : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <i />
        </motion.div>
        <div className="performance-dial-core"><span>VIEWER</span><small>first</small></div>
      </div>
      <span className="performance-instrument-label label-a">CLARITY</span>
      <span className="performance-instrument-label label-b">PACING</span>
      <span className="performance-instrument-label label-c">RETENTION</span>
    </div>
  );
}
