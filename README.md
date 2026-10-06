# Raed Masri portfolio — v2.4.5 client-focused hero

This pass only refines the homepage hero copy around client outcomes and fixes the overlapping Request a Project intro text. The working five-step form and submission flow are unchanged.

# Raed Masri portfolio — v2.4.2 cal-and-real-covers

This package updates all Book a call links to Cal.com and replaces the five short-form client thumbnails with the real provided Reel covers, lightly upscaled where needed for cleaner display.

# Raed Masri Portfolio — Next.js v2

A conversion-focused video editor portfolio rebuilt with **Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4 and Motion for React**.

The information architecture is inspired by the parts that make AfterMotions effective — clear positioning, service-specific pages, work close to the top, client proof, a multi-step project request, FAQ and repeated booking CTAs — while the code, copy, visual identity and assets here are original to Raed Masri.


## v2.3.3 focused refinement

This pass changes only the homepage process interaction and desktop navbar control proportions:

- Process progress rail and glowing dot are driven directly by scroll position and reverse on upward scroll.
- Step activation is cumulative at approximately 0%, 30%, 62.5% and 90%.
- Active process cards use stronger bottom under-light; pointer hover tracks the glow horizontally only.
- Process cards are wider/taller on desktop to match the supplied reference proportions.
- Desktop theme/CTA controls are slimmer with slightly larger labels to match the supplied navbar crop.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run build
npm start
```

## Netlify deployment

Netlify supports modern Next.js App Router projects through its current OpenNext adapter. You do **not** need to convert this to a static HTML export and you do **not** need to install `@netlify/plugin-nextjs` manually for the normal setup.

1. Push this folder to a GitHub repository.
2. In Netlify, choose **Add new project → Import an existing project** and connect the GitHub repository.
3. Netlify should detect Next.js automatically.
4. Build command: `npm run build`.
5. Keep your existing custom domain `raedmasri.me` attached in Netlify Domain Management.
6. In Netlify, enable **Forms → Form detection** and redeploy. The hidden `public/__forms.html` blueprint exists so the React project-request form is discoverable by Netlify.

## Booking link

The current `Book a call` buttons now default to your Cal.com event:

`https://cal.com/raed-xyyqgc/30min`

This is configured in `src/data/site.ts`, while still allowing an environment override through `NEXT_PUBLIC_BOOKING_URL` if you ever want to change it later.

## Adding / replacing projects

All portfolio content is stored in:

`src/data/projects.ts`

Add the final Midnight Studios video there when it is ready. Put optimized thumbnails in `public/thumbs/` and video previews in `public/videos/`.

## Performance strategy

- Most pages are Server Components by default.
- Motion for React is isolated to interactive client components.
- The homepage hero uses optimized poster imagery instead of a heavy autoplay background video.
- YouTube embeds load only after the visitor opens a project.
- Portfolio thumbnails are optimized through `next/image`.
- Heavy case-study/video media can be added later without putting it into the initial page payload.
- `prefers-reduced-motion` is respected.

## SEO included

- Per-page metadata.
- Canonical `metadataBase` at `https://raedmasri.me`.
- Person JSON-LD.
- Generated Open Graph image.
- `robots.ts` and `sitemap.ts`.
- Dedicated long-form, short-form, motion-design and project pages.
- Semantic headings and descriptive content.

## Still needed before final launch

- Final Midnight Studios watermarked/public preview and permission scope.
- Strong original exports/thumbnails for Dr. Kenza and Scent Council (better than relying on social links).
- Real Calendly/Cal.com booking URL.
- Confirmed public attribution for testimonials.
- Optional professional photo of Raed.
- Any verified performance metrics that can be shown honestly.

## Visual refinement pass (v2.2)

This build applies the AfterMotions design reference as a quality benchmark without copying its brand or proprietary assets. The homepage now uses a neutral light/dark surface system, an interactive draggable editor timeline with real timecode, sequenced hero reveals, poster-first project presentation, editorial service cards, a lightweight client marquee, bento-style value cards, animated FAQ states, and a conversion-focused mobile drawer.

Performance choices in this pass:
- no autoplay hero video; the hero editor uses optimized Next.js images instead
- CSS marquee rather than a JavaScript animation loop
- Motion for React only where state/reveal animation benefits the UX
- transform/opacity-based animation where practical
- Server Components remain the default for static sections
- portfolio videos still load only after the visitor asks to play them
- `prefers-reduced-motion` disables continuous/reveal motion while keeping interactions usable

The homepage also now reflects Arabic, English and French as Raed's spoken languages.


### v2.2 atmospheric design pass

- Warm cinematic hero atmosphere built with CSS radial gradients.
- Rich graphite editor/timeline surfaces with distinct long-form, short-form and motion clip colors.
- Motion preview now uses the correct motion-design artwork instead of the Sony long-form thumbnail.
- Long-form, short-form and motion service cards now have separate color climates.
- Bento/value cards use restrained amber, violet, cyan, emerald and coral atmosphere families.
- Testimonials and FAQ/contact areas use warmer human surfaces.
- Final CTA is the strongest multi-atmosphere moment; footer calms back down.
- Light mode uses warm off-whites and pale tints instead of a simple black/white inversion.
- Added the two new short-form projects and supplied project poster images.
- Portrait portfolio videos now open in a portrait modal instead of a 16:9 player.
- All supplied PNG poster assets were converted to compact WebP files for faster loading.

### v2.3 verified orange / glow pass

- Keeps the existing Next.js + React + TypeScript + Tailwind + Motion stack intact.
- Replaces the mixed amber/violet/cyan/green decorative system with a warm black / charcoal / off-white / orange / peach palette.
- Adds a static SVG/Bezier hero ribbon with a luminous orange edge across the hero, timeline and stats zone.
- Rebuilds primary buttons as orange-to-peach gradient pills with a dark circular end-cap, bright rim and warm outer glow.
- Adds reusable pointer-tracking card glows: the bottom hotspot follows pointer X only and eases back to center on leave.
- Refines process, bento/value, testimonial and FAQ cards with charcoal-to-black surfaces, warmer lower borders and under-light.
- Uses editorial serif italic emphasis for select high-value words such as “watching” and “unforgettable.”
- Makes the homepage CTA a near-black panel lit from below, and adds an intentionally full-orange pre-footer CTA.
- Keeps Recent Work visually quieter so project thumbnails remain the main source of color.
- Adds Ishi Vision to the real-client proof strip and updates the represented-client count to four.
- Preserves performance: static SVG, CSS gradients/pseudo-elements and one CSS custom property per pointer move; no WebGL or background video.

## v2.3.1 focused visual fix
- Fixed cropped serif descenders in orange editorial words (for example, the `g` in `watching` / `unforgettable`).
- Replaced the segmented Auto/Light/Dark control with a single circular moon/sun toggle.
- Matched the header CTA order and pill styling more closely to the supplied After Motions reference: theme circle → Book a call → Request a project.
- No other site sections or architecture were changed in this pass.


## v2.3.2 focused fixes
- Enlarged the editorial gradient paint box so descenders such as the `g` in `watching.` cannot clip across desktop/mobile headline sizes.
- Recalibrated the navbar theme circle to the supplied After Motions reference proportions and brighter orange ring.
- Replaced font-glyph navbar arrows with centered inline SVG arrows.
- Replaced the generic moon path with a crescent silhouette traced from the supplied reference crop.
- No other page sections or architecture were intentionally changed in this pass.


## v2.3.4 focused pass
- Hero/editor/stats orange ribbon now moves continuously with scroll and reverses naturally.
- The oversized SVG artwork is moved with Motion transform values; no path morphing, canvas, WebGL, background video, or scroll-driven React state.
- Selected client proof circles now use the supplied Midnight Studios, Dr. Kenza, Scent Council, and Ishi Vision images.
- No other page sections or routes were redesigned in this pass.

## v2.3.5 focused process-card visual match
- Changes only the four process-card visuals; ProcessSection scroll logic, progress rail, active-step thresholds and pointer-X tracking are unchanged.
- Moves titles to roughly 30% of card height and body copy to roughly 50% to match the supplied After Motions reference.
- Keeps the middle nearly black while strengthening the wide bottom inner under-light and external halo.
- Brightens the cool-gray top edge and warms the border progressively toward the bottom instead of using a uniform orange outline.
- Softens the active numbered-circle rim/glow and increases body-copy size/readability with a warmer neutral gray.

## v2.3.6 — focused final-refinement pass (October 2026)

Built from the existing v2.3.5 source, not a redesign. Preserves Next.js,
TypeScript, Tailwind, Motion, routes, the process section and the navbar.

Changes are restricted to the final AfterMotions refinement checklist:
- Reduced the homepage's navbar-to-hero whitespace.
- Tuned the existing scroll-linked SVG hero ribbon for dark copy space, a softer
  trailing fade and continuous, reversible travel; no new animation dependency.
- Reorganized the three existing metrics to number-above-label.
- Added a desktop orange Play hover affordance on playable project cards.
- Upgraded the existing VideoModal with project title/context, close button,
  native YouTube embed and bottom booking CTA. Closing unmounts the video so
  playback stops. Mobile portrait video remains portrait.
- Refined the FAQ accordion and built an expanded WhatsApp contact card.
- Switched the lower CTA to premium pill buttons and added WhatsApp.
- Strengthened the orange pre-footer and added a quiet footer wordmark.

### Contact
WhatsApp CTAs use the user-provided `https://wa.me/96170060592`.
The existing booking URL still opens the *existing email fallback* until a real
Calendly/Cal.com link is supplied; no fake calendar has been added.

### Duration labels
The original project data has no video runtimes. Since actual durations cannot
be verified reliably from the provided files or YouTube metadata here, no
values were fabricated. The hover badges say **Play**. To add durations after
verifying them, update `verifiedVideoDurations` in
`src/components/ProjectCard.tsx` (e.g. `"project-slug": "0:50"`). Then the
badge automatically displays **Play · 0:50**. The Instagram-only and coming
soon entries retain their existing external-link/placeholder behavior.

### Build check
Run `npm install && npm run build` on a machine with npm registry access before
publishing. The editing environment could parse all changed TSX/CSS and test
standalone responsive CSS states with Chromium, but could not perform a real
Next.js production build because package installation was unavailable offline.


## Booking links and favicon (v2.4.1)

The site now has a crisp orange `RM` favicon in SVG, ICO and PNG forms, including an Apple touch icon. The same design is reused at mobile sizes.

**Booking:** I recommend a free Cal.com individual account. Create an event called `Free 20-minute discovery call`, connect your calendar, and copy your actual event URL. Put it in `.env.local` in the project root:

```env
NEXT_PUBLIC_BOOKING_URL=https://cal.com/YOUR-USERNAME/YOUR-EVENT
```

Restart `npm run dev`. All existing “Book a call”/“Book a free call” links use this value automatically. In Netlify, add the same key and value under environment variables and trigger a new deploy. Until a real booking URL is set, the original email link remains, so no fictional Cal.com account is used.

**Instagram cover frames:** The existing five portrait thumbnails remain as fallbacks. The published Instagram Reel pages expose actual cover metadata, but downloading the image bytes was unavailable in this environment. Supply the five actual reel cover images, and they can be optimized and swapped into `public/thumbs/dr-kenza-reel-01.webp` through `...04.webp` and `public/thumbs/scent-council-reel.webp` without changing your project data or layout.

## v2.4.3: Request a Project form only

All five original steps, questions, choices, progress indicator, data model, and other site sections were preserved. This refinement adds accessible validation and feedback, polished pill buttons, forward/back animations, a personalized greeting, honeypot, failure state, confirmed success state and a seven-day browser cooldown.

**Enable actual delivery on Netlify:** Set the private environment variables described in `.env.example` in Netlify → Project configuration → Environment variables, then redeploy. The destination inbox is `raed.bus.raed@gmail.com` and is set when registering the Web3Forms access key. Neither the access key nor Redis credentials belong in `NEXT_PUBLIC_` variables or GitHub. The additional `/api/project-request` route is the sole new endpoint: it checks all fields, checks an Upstash Redis 7-day cooldown per contact or provided email, limits submissions by IP, then sends the formatted request to Web3Forms. It returns success only after Web3Forms reports `success: true` and the cooldown has been saved. If the services are not configured, it returns an error and keeps the visitor's form data rather than pretending to submit.

**Web3Forms caveat:** Web3Forms documents that server-side use requires a paid plan and server-IP allowlisting. Obtain a suitable plan and key for server-to-server submission, or ask to switch to another email delivery service (e.g. Resend) that supports server-side delivery on a free tier. Do not assume a free Web3Forms key will work from this API route. The seven-day server-side duplicate protection uses an Upstash Redis REST database; create its credentials before testing email delivery.

**Real end-to-end check (required before publishing):** Install dependencies, configure `.env.local`, run `npm run dev` and test `/request-project`, including sending a real request. Confirm the new message arrives in your inbox. Then refresh the wizard, verify the seven-day notice, and test repeat submission using the same contact in a second browser. A valid Web3Forms key is necessary for a real email delivery test; this repository has no secret keys preloaded.

## v2.4.4 — Free Web3Forms + Upstash submission flow

The existing five-step Request a Project wizard remains intact. This pass changes only the delivery/protection path:

1. `/api/project-request` performs server-side validation, IP rate limiting and the 7-day contact/email duplicate check in Upstash.
2. If accepted, the browser sends the request directly to Web3Forms using `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` (compatible with the free Web3Forms client-side flow).
3. Only after Web3Forms returns `success: true` does the browser call the API again to persist the 7-day cooldown.
4. Only after that confirmation succeeds does the UI show “That’s a wrap.” and write the localStorage cooldown timestamp.
5. If Web3Forms fails, the pending server lock is cancelled and all entered data remains in the wizard for retry.
6. If Web3Forms succeeds but the final cooldown write temporarily fails, retrying submits only the confirmation step, not a second email.

Required `.env.local` values:

```env
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY="your-public-web3forms-access-key"
UPSTASH_REDIS_REST_URL="your-upstash-rest-url"
UPSTASH_REDIS_REST_TOKEN="your-private-upstash-token"
PROJECT_REQUEST_HASH_SECRET="your-private-random-hash-secret"
```

The Upstash token and hash secret must also be configured in Netlify Environment Variables before production deployment. `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` is public by design and must be present at build time, so redeploy after adding/changing it.

For local testing, keep your `.env.local` in the project root, restart `npm run dev`, submit one real test request, and verify it reaches the Web3Forms recipient inbox. A second attempt with the same contact/email should then be blocked for seven days.

## v2.4.6 targeted refinement

- Hero copy now follows the client/outcome-focused structure of the supplied After Motions reference while remaining Raed's own copy.
- The availability badge uses the supplied recording as reference: warmer dark pill, brighter neutral border, off-white bold label, and lightweight rotating/pulsing orange orb animation with reduced-motion fallback.
- FAQ plus/X controls use centered SVG geometry instead of font glyph baselines.
- “Ask me directly.” opens WhatsApp.
- X / Twitter was added to the footer.
- All Book-a-call button endcaps now use a calendar icon instead of an arrow, including navbar, homepage, service pages, modal, footer and form-success CTAs.
- Project-request form logic/submission flow was otherwise left unchanged.

## v2.4.14 — client-focused copy optimization

This version applies the targeted copy changes justified by the 30-site conversion-copy research audit. Strong existing copy is intentionally preserved; only weak, overly editor-focused, defensive, or unsupported-outcome language was refined. No layout, styling, routing, interaction, or architecture changes were intended.

## v2.4.25 — Private portfolio dashboard

A private `/admin` content dashboard is included for managing the portfolio without editing source code manually. It is intentionally GitHub-backed: dashboard saves commit structured JSON and uploaded images to the existing repository, and the existing Netlify Git integration deploys those changes automatically.

### What can be managed

- **Projects:** title, client/creator, EN/AR language, Long-form/Short-form/Motion format, client/concept/test classification, cover image, video/external URLs, description, roles, aspect ratio, year, duration, homepage featured status, coming-soon state, draft/published state and display order.
- **Clients & creators:** name, type, profile image/logo, URL, whether the profile appears in the hero profile row, whether the name appears in the “Client work for” marquee, draft/published state and order.
- **Testimonials:** feedback text, client name/role, company, draft/published state and display order.

The existing public portfolio visuals are preserved. Existing data was migrated into `src/data/content/projects.json`, `clients.json` and `testimonials.json`; the public components now read those files through the same typed data modules.

### One-time production setup

Add these **private** environment variables in Netlify → Project configuration → Environment variables:

```env
ADMIN_PASSWORD="choose-a-strong-private-password"
ADMIN_SESSION_SECRET="a-random-secret-at-least-32-characters-long"
GITHUB_CMS_TOKEN="github-fine-grained-token"
GITHUB_CMS_OWNER="raedmasri11"
GITHUB_CMS_REPO="newest-portfolio"
GITHUB_CMS_BRANCH="main"
```

For `GITHUB_CMS_TOKEN`, create a **fine-grained GitHub personal access token** restricted to the `newest-portfolio` repository, with repository permission **Contents: Read and write**. Do not expose this token in client code and do not prefix it with `NEXT_PUBLIC_`.

After adding the variables, trigger one Netlify redeploy. Then open:

```text
https://raedmasri.me/admin
```

Sign in with `ADMIN_PASSWORD`. Saving an item commits the corresponding content JSON to GitHub. Uploading a cover/profile image commits it under `public/uploads/`. GitHub then triggers the normal Netlify deployment.

### Security notes

- `/admin` is protected by an HttpOnly, SameSite=Strict session cookie derived from `ADMIN_SESSION_SECRET`.
- Admin API routes require that session as well.
- The dashboard is marked `noindex`, and `/admin` plus `/api/admin` are disallowed in `robots.txt`.
- Dashboard secrets remain server-side only.
- Image uploads accept JPG, PNG, WEBP or GIF and are limited to 5 MB per image.

### Publishing behavior

The dashboard writes to GitHub rather than directly to Netlify's immutable runtime filesystem. This keeps content versioned, makes every change reversible in Git history, and works with the existing Netlify auto-deploy flow. A saved change is not visible on the public site until the triggered Netlify deployment finishes.
