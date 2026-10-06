import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaqAccordion } from "@/components/FaqAccordion";
import { HeroEditor } from "@/components/HeroEditor";
import { HeroRibbon } from "@/components/HeroRibbon";
import { GlowCard } from "@/components/GlowCard";
import { ProjectGrid } from "@/components/ProjectGrid";
import { ProcessSection } from "@/components/ProcessSection";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { CalendarIcon } from "@/components/CalendarIcon";
import { PerformanceGauge } from "@/components/PerformanceGauge";
import { featuredProjects, projects } from "@/data/projects";
import { testimonials } from "@/data/testimonials";
import { site } from "@/data/site";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const services = [
  {
    href: "/long-form",
    index: "01",
    title: "YouTube & long-form",
    copy: "Documentaries, founder stories, VSLs and talking heads shaped around hooks, story clarity and watch time.",
    meta: "16:9 · story-led",
    image: "/thumbs/service-long-form.webp",
    tone: "long",
  },
  {
    href: "/short-form",
    index: "02",
    title: "Short-form",
    copy: "Reels and Shorts with clean hooks, readable captions and purposeful visual movement.",
    meta: "9:16 · social-first",
    image: "/thumbs/service-short-form.webp",
    tone: "short",
  },
  {
    href: "/motion-design",
    index: "03",
    title: "Motion design",
    copy: "Kinetic type, visual callouts, logo motion and graphics designed to make the edit clearer and more memorable.",
    meta: "After Effects · custom",
    image: "/thumbs/service-motion-design.webp",
    tone: "motion",
  },
];

const process = [
  ["01", "Discovery call", "We talk through the audience, goal, references, deadline and what the video needs to achieve."],
  ["02", "Plan the edit", "I map the opening, story structure, pacing and visual direction before polishing details."],
  ["03", "Edit & review", "You get a focused first cut, leave notes, and I refine what matters instead of adding noise."],
  ["04", "Deliver & publish", "Final files are exported for the right platform and ready to post."],
] as const;

const reasons = [
  ["Make the message easy to follow", "The story comes first, so every cut helps the viewer understand what matters and gives them a reason to keep watching."],
  ["Motion that supports the message", "Captions, callouts and motion guide attention without distracting from what you’re saying."],
  ["Sound that keeps the edit feeling alive", "Clean dialogue and purposeful sound design give the video energy without making it feel over-edited."],
  ["Know exactly what happens next", "Clear scope, deadlines and feedback rounds mean fewer surprises and an easier project from start to finish."],
  ["Built for where your audience watches", "Long-form, Shorts and square content need different pacing and framing. Your edit is shaped around where you actually publish."],
] as const;

const faqs = [
  ["What types of videos do you edit?", "YouTube and documentary-style long-form videos, talking-head and personal-brand content, Reels/Shorts, VSLs, and motion-heavy social content."],
  ["Which languages do you work in?", "I speak Arabic, English and French. My client portfolio currently includes Arabic / Darija and English editing, and I can also work with French-language projects."],
  ["How much does editing cost?", "Pricing depends on video length, edit complexity, research, motion design and volume. Send a project request and I’ll recommend a scope that fits the job."],
  ["How long does turnaround take?", "Short-form work is commonly 24–48 hours depending on scope. Long-form timelines are agreed before the project begins."],
  ["Can we start with one project?", "Yes. One-off projects are welcome, and I also work with clients on recurring content."],
] as const;


const portfolioProjects = [
  ...featuredProjects.filter((project) => !project.comingSoon),
  ...featuredProjects.filter((project) => project.comingSoon),
  ...projects.filter((project) => !project.featured),
];

const marquee = ["Dr. Kenza Alami", "Scent Council", "Ishi Vision", "Midnight Studios"] as const;

export default function Home() {
  return (
    <main>
      <div className="hero-atmosphere-zone">
        <HeroRibbon />
        <section className="hero page-container">
        <div className="hero-copy">
          <Reveal delay={0.02}><p className="status-pill"><i /> Available for new projects</p></Reveal>
          <Reveal delay={0.08}><p className="hero-role">Freelance video editor &amp; motion designer</p></Reveal>
          <Reveal delay={0.14}><h1>Edits that make your brand <span className="accent-word">unforgettable.</span></h1></Reveal>
          <Reveal delay={0.2}><p className="hero-lead">Your footage should do more than look polished. I turn it into YouTube videos, Reels and TikToks built to hold attention, make your message land and move viewers toward the next step.</p></Reveal>
          <Reveal delay={0.26}>
            <div className="hero-actions">
              <a className="button button-dark" href={site.bookingUrl}>Book a free call <span className="button-endcap"><CalendarIcon /></span></a>
              <a className="button button-ghost" href="#work">Watch my work <span>↓</span></a>
            </div>
          </Reveal>
          <Reveal delay={0.32}>
            <div className="hero-proof">
              <div className="proof-avatars" aria-label="Selected clients">
                <i><Image src="/clients/midnight-studios.webp" alt="Midnight Studios" width={40} height={40} /></i>
                <i><Image src="/clients/dr-kenza.webp" alt="Dr. Kenza Alami" width={40} height={40} /></i>
                <i><Image src="/clients/scent-council.webp" alt="Scent Council" width={40} height={40} /></i>
                <i><Image src="/clients/ishivision.webp" alt="Ishi Vision" width={40} height={40} /></i>
              </div>
              <p><strong>Trusted by creators, brands &amp; agencies.</strong><span>Real client work + clearly labeled skill studies.</span></p>
            </div>
          </Reveal>
        </div>
        <Reveal className="hero-editor-wrap" delay={0.36}><HeroEditor /></Reveal>
        </section>

      <section className="proof-band" aria-label="Client proof">
        <div className="page-container proof-band-inner">
          <span className="proof-label">Client work for</span>
          <div className="client-marquee">
            <div className="client-track">
              {[...marquee, ...marquee].map((client, index) => (
                <span key={`${client}-${index}`} aria-hidden={index >= marquee.length}>
                  {client}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="stats page-container" aria-label="Portfolio facts">
        <Reveal><div className="stat"><strong>4</strong><span>client brands featured in this portfolio</span></div></Reveal>
        <Reveal delay={.05}><div className="stat"><strong>2+</strong><span>years focused on video editing</span></div></Reveal>
        <Reveal delay={.1}><div className="stat"><strong>3</strong><span>languages spoken: AR · EN · FR</span></div></Reveal>
      </section>
      </div>

      <section className="section page-container formats-section">
        <SectionHeading eyebrow="Formats" title="The right edit for the way your audience watches." copy="Long-form, short-form and motion-led content compete for attention differently. I shape the pacing, visuals and motion around the format so your message lands and your audience keeps watching." />
        <div className="service-cards visual-service-cards">
          {services.map((service, index) => (
            <Reveal key={service.href} delay={index * .06}>
              <Link className={`service-card visual-service-card service-tone-${service.tone}`} href={service.href}>
                <div className="service-media">
                  <Image src={service.image} alt="" fill sizes="(max-width: 980px) 100vw, 33vw" />
                  <span>{service.meta}</span>
                </div>
                <div className="service-card-body">
                  <span className="service-index">{service.index}</span>
                  <div><h3>{service.title}</h3><p>{service.copy}</p></div>
                  <div className="service-footer"><span>Explore format</span><b>View work <i>↗</i></b></div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section work-section page-container" id="work">
        <SectionHeading eyebrow="Selected work" title="Press play. The work should do the convincing." copy="Client projects, concept pieces and editing tests are labeled clearly so you always know what you’re watching." />
        <ProjectGrid projects={portfolioProjects} variant="carousel" />
      </section>

      <ProcessSection
        steps={process}
        title="From raw footage to final delivery without the chaos."
        copy="You always know what happens next — with clear timelines, focused feedback and enough room to shape the edit as we go."
      />

      <section className="section page-container performance-section performance-redesign">
        <div className="performance-head">
          <Reveal>
            <p className="eyebrow">Built around your audience</p>
            <h2>I don’t just edit videos. I engineer them to perform.</h2>
            <p>Story, pacing, motion and sound work toward one goal: making your message clearer, holding attention and helping your brand feel more polished.</p>
          </Reveal>
        </div>

        <div className="performance-bento" aria-label="Editing approach">
          <Reveal className="performance-bento-anchor" delay={0.02}>
            <GlowCard className="performance-card performance-anchor-card">
              <div className="performance-card-topline">
                <span className="performance-seq">01</span>
                <span className="performance-micro-label">Audience system</span>
              </div>

              <PerformanceGauge />

              <div className="performance-anchor-copy">
                <h3>{reasons[0][0]}</h3>
                <p>{reasons[0][1]}</p>
              </div>
            </GlowCard>
          </Reveal>

          <Reveal className="performance-bento-motion" delay={0.07}>
            <GlowCard className="performance-card performance-card-motion">
              <div className="performance-card-topline">
                <span className="performance-icon-tile" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><rect x="5" y="5" width="9" height="9" rx="2"/><rect x="10" y="10" width="9" height="9" rx="2"/></svg>
                </span>
                <span className="performance-micro-label">02 · Motion</span>
              </div>
              <div className="performance-card-copy"><h3>{reasons[1][0]}</h3><p>{reasons[1][1]}</p></div>
              <div className="performance-motif performance-motif-layers" aria-hidden="true"><i /><i /><i /></div>
            </GlowCard>
          </Reveal>

          <Reveal className="performance-bento-sound" delay={0.11}>
            <GlowCard className="performance-card performance-card-sound">
              <div className="performance-card-topline">
                <span className="performance-icon-tile" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M4 13h3l3 5V6L7 11H4z"/><path d="M15 9c1.2 1 1.2 5 0 6"/><path d="M18 6c3 3 3 9 0 12"/></svg>
                </span>
                <span className="performance-micro-label">03 · Sound</span>
              </div>
              <div className="performance-wave" aria-hidden="true">
                {[26,46,70,38,84,58,34,76,52,68,30,48].map((height,index)=><i key={index} style={{height:`${height}%`}} />)}
              </div>
              <div className="performance-card-copy"><h3>{reasons[2][0]}</h3><p>{reasons[2][1]}</p></div>
            </GlowCard>
          </Reveal>

          <Reveal className="performance-bento-workflow" delay={0.15}>
            <GlowCard className="performance-card performance-card-workflow">
              <div className="performance-card-topline">
                <span className="performance-icon-tile" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><circle cx="6" cy="12" r="2"/><circle cx="18" cy="7" r="2"/><circle cx="18" cy="17" r="2"/><path d="M8 12h4c3 0 3-5 4-5M12 12c3 0 3 5 4 5"/></svg>
                </span>
                <span className="performance-micro-label">04 · Workflow</span>
              </div>
              <div className="performance-flow" aria-hidden="true">
                <span><i />Brief</span><span><i />First cut</span><span><i />Feedback</span><span><i />Final</span><b />
              </div>
              <div className="performance-card-copy"><h3>{reasons[3][0]}</h3><p>{reasons[3][1]}</p></div>
            </GlowCard>
          </Reveal>

          <Reveal className="performance-bento-platform" delay={0.19}>
            <GlowCard className="performance-card performance-card-platform">
              <div className="performance-platform-copy">
                <div className="performance-card-topline">
                  <span className="performance-icon-tile" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M8 19v2M16 19v2M7 9h10"/></svg>
                  </span>
                  <span className="performance-micro-label">05 · Format aware</span>
                </div>
                <div className="performance-card-copy"><h3>{reasons[4][0]}</h3><p>{reasons[4][1]}</p></div>
              </div>
              <div className="performance-format-stack" aria-hidden="true">
                <span className="format-wide"><i />16:9</span>
                <span className="format-vertical"><i />9:16</span>
                <span className="format-square"><i />1:1</span>
              </div>
            </GlowCard>
          </Reveal>
        </div>
      </section>

      <section className="section page-container testimonials-section atmosphere-soft">
        <SectionHeading eyebrow="Client feedback" title="The best proof is what clients say after the delivery." />
        <div className="testimonial-grid editorial-testimonials">
          {testimonials.map((item, index) => <Reveal key={item.quote} delay={index * .06}><GlowCard as="figure" className={index === 0 ? "testimonial-featured testimonial-glow-card" : "testimonial-glow-card"}><div className="quote-meta"><span>0{index + 1}</span><span>Client feedback</span></div><blockquote><span className="testimonial-quote-mark" aria-hidden="true">“</span>{item.quote}<span className="testimonial-quote-mark" aria-hidden="true">”</span></blockquote><figcaption><strong>{item.name}</strong><span>{item.company}</span></figcaption></GlowCard></Reveal>)}
        </div>
        <div className="center-link"><Link href="/reviews">Read client feedback <span>↗</span></Link></div>
      </section>

      <section className="section page-container about-section atmosphere-about">
        <Reveal className="about-visual">
          <div className="about-monogram">RM</div>
          <div className="about-wave" aria-hidden="true">{Array.from({ length: 18 }).map((_, i) => <i key={i} style={{ height: `${16 + ((i * 17) % 54)}%` }} />)}</div>
          <span>AR · EN · FR</span>
        </Reveal>
        <Reveal className="about-copy" delay={0.08}>
          <p className="eyebrow">About Raed</p>
          <h2>A hands-on editor who thinks about the message before the effects.</h2>
          <p>I’m Raed Masri, a video editor and motion designer based in Lebanon and working remotely. I speak Arabic, English and French, and I build edits around clarity, story, retention and a clean client workflow.</p>
          <div className="about-facts"><span>Premiere Pro</span><span>After Effects</span><span>Motion graphics</span><span>Sound design</span></div>
        </Reveal>
      </section>

      <section className="section page-container faq-section atmosphere-faq" id="faq">
        <div className="faq-intro">
          <Reveal>
            <p className="eyebrow">FAQ</p>
            <h2>Questions before we start?</h2>
            <div className="faq-contact-card faq-contact-upgraded">
              <div className="faq-profile-row"><span className="brand-mark" aria-hidden="true">RM</span><div><strong>Raed Masri</strong><small>Video editor &amp; motion designer</small></div></div>
              <p>Didn’t find your answer? Ask me directly.</p>
              <a className="button faq-whatsapp-button" href={site.whatsappUrl} target="_blank" rel="noopener noreferrer">Message me on WhatsApp <span className="button-endcap" aria-hidden="true"><svg className="whatsapp-icon" viewBox="0 0 24 24" focusable="false"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.149-.173.198-.297.297-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.208-.242-.58-.487-.501-.669-.51-.173-.009-.371-.011-.57-.011-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.002-5.45 4.437-9.884 9.892-9.884 2.64.001 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.993c-.003 5.45-4.437 9.886-9.889 9.886m8.413-18.297A11.815 11.815 0 0 0 12.055 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.056 24l6.305-1.654a11.882 11.882 0 0 0 5.689 1.448h.005c6.559 0 11.894-5.335 11.897-11.893a11.821 11.821 0 0 0-3.488-8.413Z" /></svg></span></a>
            </div>
          </Reveal>
        </div>
        <FaqAccordion items={faqs} />
      </section>

      <section className="cta-section page-container">
        <Reveal>
          <span className="cta-kicker-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false"><rect x="4.5" y="6.5" width="15" height="11" rx="2.5"/><path d="m10 9.5 5 2.5-5 2.5z"/></svg>
          </span>
          <h2><span>Let’s make</span><span>your next video</span><em className="accent-word">unforgettable.</em></h2>
          <p>Partner with a video editor and motion designer who obsesses over retention.</p>
          <div className="hero-actions cta-actions">
            <a className="button nav-book-button" href={site.bookingUrl}>Book a free call <span className="button-endcap" aria-hidden="true"><CalendarIcon /></span></a>
            <Link className="button nav-request-button" href="/request-project">Request a project <span className="button-endcap" aria-hidden="true">→</span></Link>
            <a className="cta-whatsapp-circle" href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Message me on WhatsApp">
              <svg className="whatsapp-icon" viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.149-.173.198-.297.297-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.208-.242-.58-.487-.501-.669-.51-.173-.009-.371-.011-.57-.011-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.002-5.45 4.437-9.884 9.892-9.884 2.64.001 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.993c-.003 5.45-4.437 9.886-9.889 9.886m8.413-18.297A11.815 11.815 0 0 0 12.055 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.056 24l6.305-1.654a11.882 11.882 0 0 0 5.689 1.448h.005c6.559 0 11.894-5.335 11.897-11.893a11.821 11.821 0 0 0-3.488-8.413Z" /></svg>
              <span className="cta-whatsapp-status" aria-hidden="true" />
            </a>
          </div>
          <small>The first call is free, with no commitment.</small>
        </Reveal>
      </section>
    </main>
  );
}
