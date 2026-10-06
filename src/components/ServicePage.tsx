import Link from "next/link";
import type { ProjectFormat } from "@/data/projects";
import { getProjectsByFormat } from "@/data/projects";
import { site } from "@/data/site";
import { ProjectGrid } from "./ProjectGrid";
import { Reveal } from "./Reveal";
import { CalendarIcon } from "./CalendarIcon";

function ArrowRightIcon() {
  return (
    <svg className="service-arrow-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 12h14" />
      <path d="m14 7 5 5-5 5" />
    </svg>
  );
}

const content = {
  "long-form": {
    kicker: "YouTube & long-form",
    title: "Long-form edits built around the reason people keep watching.",
    copy: "Documentary videos, founder stories, VSLs and YouTube content shaped around a strong opening, story clarity, pacing, b-roll, motion and sound.",
    deliverables: ["Hook & story structure", "B-roll and visual research", "Motion graphics", "Sound design", "Captions when needed", "Platform-ready exports"],
  },
  "short-form": {
    kicker: "Reels, Shorts & personal brands",
    title: "Short-form editing that makes the message land fast.",
    copy: "Talking-head Reels, educational clips and personal-brand content with intentional hooks, clean captions, purposeful b-roll and pacing that never feels over-edited.",
    deliverables: ["Hook refinement", "Clean captions", "B-roll and punch-ins", "Sound polish", "Light motion design", "9:16 exports"],
  },
  motion: {
    kicker: "Motion design",
    title: "Motion that supports the story instead of distracting from it.",
    copy: "Typography, interface-style graphics, animated callouts and visual systems built in After Effects to make an edit clearer, more premium and more memorable.",
    deliverables: ["Kinetic typography", "Graphic callouts", "UI-style animation", "Transitions", "Logo motion", "Custom visual systems"],
  },
} as const;

export function ServicePage({ format }: { format: ProjectFormat }) {
  const page = content[format];
  const projects = getProjectsByFormat(format);
  return (
    <main className={`service-page service-page-${format}`}>
      <section className={`service-hero page-container service-hero-${format}`}>
        <Reveal>
          <p className="status-pill"><i /> Available for new projects</p>
          <p className="eyebrow">{page.kicker}</p>
          <h1>{page.title}</h1>
          <p className="service-lead">{page.copy}</p>
          <div className="hero-actions"><a className="button button-dark" href={site.bookingUrl}>Book a free call <span className="button-endcap"><CalendarIcon /></span></a><Link className="button button-ghost" href="/request-project">Request a project <span className="button-endcap"><ArrowRightIcon /></span></Link></div>
        </Reveal>
      </section>
      <section className="section page-container service-details-section">
        <div className="service-split">
          <Reveal><p className="eyebrow">What’s included</p><h2>Everything your video needs to feel clear, polished and ready to publish.</h2></Reveal>
          <div className="deliverables">{page.deliverables.map((item, index) => <Reveal key={item} delay={index * .05}><div className="deliverable"><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></div></Reveal>)}</div>
        </div>
      </section>
      <section className="section page-container service-work-section">
        <div className="section-heading"><p className="eyebrow">Selected work</p><h2>Relevant projects. No digging required.</h2></div>
        <ProjectGrid projects={projects} />
      </section>
      <section className={`cta-section service-cta service-cta-${format} page-container`}><h2>What does your next video need to achieve?</h2><p>Tell me about the channel, audience and result you’re after, and I’ll recommend the right scope.</p><div className="hero-actions"><a className="button button-light" href={site.bookingUrl}>Book a free call <span className="button-endcap"><CalendarIcon /></span></a><Link className="button button-outline-light" href="/request-project">Request a project <span className="button-endcap"><ArrowRightIcon /></span></Link></div></section>
    </main>
  );
}
