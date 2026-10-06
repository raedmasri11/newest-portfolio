"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type PointerEvent } from "react";

export function FaqAccordion({ items }: { items: readonly (readonly [string, string])[] }) {
  const [open, setOpen] = useState(0);

  const moveGlow = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
    event.currentTarget.style.setProperty("--glow-x", `${x}%`);
  };

  const resetGlow = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--glow-x", "50%");
  };

  return (
    <div className="faq-list">
      {items.map(([question, answer], index) => {
        const active = open === index;
        return (
          <div
            className={`faq-item glow-card ${active ? "is-open" : ""}`}
            key={question}
            onPointerMove={moveGlow}
            onPointerLeave={resetGlow}
          >
            <button type="button" aria-expanded={active} onClick={() => setOpen(active ? -1 : index)}>
              <span>{question}</span><i aria-hidden="true"><svg className="faq-toggle-icon" viewBox="0 0 24 24" focusable="false"><path d="M5 12h14" />{!active && <path d="M12 5v14" />}</svg></i>
            </button>
            <AnimatePresence initial={false}>
              {active && (
                <motion.div
                  className="faq-answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                ><p>{answer}</p></motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
