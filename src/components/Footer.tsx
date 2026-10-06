import Link from "next/link";
import { site } from "@/data/site";
import { CalendarIcon } from "./CalendarIcon";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-precta">
        <div>
          <p className="eyebrow">Ready when you are</p>
          <h2>Ready to make your next video unforgettable?</h2>
          <p>Tell me what you’re creating, who it’s for and what you want it to achieve. We’ll plan the edit together on a free call.</p>
        </div>
        <a className="button button-footer-dark" href={site.bookingUrl}>Book a free call <span className="button-endcap"><CalendarIcon /></span></a>
      </div>
      <div className="footer-main">
        <div>
          <Link className="brand footer-brand" href="/"><span className="brand-mark">RM</span><span>Raed Masri.</span></Link>
          <p>Video editing &amp; motion design for creators and brands that want content people keep watching.</p>
        </div>
        <div className="footer-columns">
          <div><strong>Services</strong><Link href="/long-form">YouTube editing</Link><Link href="/short-form">Short-form editing</Link><Link href="/motion-design">Motion design</Link></div>
          <div><strong>Studio</strong><Link href="/work">Selected work</Link><Link href="/reviews">Client reviews</Link><Link href="/request-project">Request a project</Link></div>
          <div><strong>Contact</strong><a href={`mailto:${site.email}`}>{site.email}</a><a href={site.instagram} target="_blank" rel="noreferrer">Instagram</a><a href={site.xUrl} target="_blank" rel="noreferrer">X / Twitter</a></div>
        </div>
      </div>
      <div className="footer-ambient-wordmark" aria-hidden="true">Raed Masri.</div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Raed Masri. All rights reserved.</span><span>Remote video editing · Arabic · English · French</span></div>
    </footer>
  );
}
