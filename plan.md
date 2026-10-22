# Taaluka Waitlist Landing Page — Plan

## Implementation

Build a single-page, mobile-first React experience for Taaluka with a polished Marathi-first landing page, real waitlist persistence through the managed MySQL database, and a tRPC API for registration, stats, and referral status. The client renders the supplied Taaluka logo from project storage, a configurable launch countdown, an Akole-inspired CSS illustration, responsive conversion sections, and success states that reveal queue position and referral progress only after a real registration response.

The database layer adds a `waitlistEntries` table with unique contact and referral-code constraints. The server normalizes email/mobile input, prevents duplicates, assigns a unique referral code, attributes valid referrers, calculates queue position from insertion order, and exposes the live registered-user total. If the database is unavailable, the UI stays honest and communicates that live figures will appear when the service is connected rather than fabricating activity.

## Project structure

- `client/src/pages/Home.tsx` — landing page sections, registration/referral UI, countdown, and interactions.
- `client/src/index.css` — brand palette, typography, responsive layout, illustration styling, and motion.
- `client/index.html` — Marathi document language, SEO metadata, and social preview metadata.
- `drizzle/schema.ts` — users plus durable waitlist/referral data model.
- `server/db.ts` — database access helpers for waitlist registration, stats, and status.
- `server/routers.ts` — public tRPC waitlist procedures.
- `public/manus-routes.json` — route manifest for the single-page site.
- `app.config.ts` — platform logo metadata.

## Design direction

Three low-probability style directions considered:

- **Deccan Editorial Minimalism** — 0.06: civic warmth, bold Marathi typography, quiet geometry, and red signal accents.
- **Soft Neighbourhood Utility** — 0.05: friendly cards, approachable icons, and a lighter community-app tone.
- **Festive Maharashtra Pop** — 0.04: louder saturated shapes and celebratory energy.

### Chosen: Deccan Editorial Minimalism

**Design Movement:** Deccan Editorial Minimalism, borrowing from contemporary Indian civic posters and independent magazine layouts rather than generic SaaS patterns.

**Core Principles:** local pride without nostalgia; decisive type hierarchy; generous negative space; honest data and low-friction action.

**Color Philosophy:** Taaluka red `#C82121` is the signal color for movement and belonging; soft neutral `#F8F6F4` keeps the page warm and paper-like; charcoal `#252525` gives Marathi headlines weight without looking harsh; small saffron-gold details hint at Maharashtra without turning the interface festive.

**Layout Paradigm:** an editorial flow of offset bands, oversized left-aligned headlines, and split hero composition. Content breathes across the page instead of sitting inside a centered dashboard grid.

**Signature Elements:** a thin red route-line motif inspired by taluka roads; a CSS-built Sahyadri horizon in the hero; compact “Akole / Maharashtra” location stamps and numbered benefit cards.

**Interaction Philosophy:** every interaction should feel like a clear invitation from a local movement. Buttons have a small lift and shadow, form feedback is direct, and the share state celebrates the user’s participation without fake urgency.

**Animation:** use slow, low-amplitude float for the local illustration, fade-up for section entrances, a pulsing live marker, and a gentle count transition. Respect `prefers-reduced-motion`.

**Typography System:** use `Noto Sans Devanagari` for Marathi coverage with system fallbacks, with heavy 800–900 headlines, 500–600 UI labels, and relaxed 1.6 body leading. Keep English metadata in the same family for a cohesive bilingual mark.

**Brand Essence:** Akole’s own digital front door for local updates, services, and businesses; personality: rooted, optimistic, direct.

**Brand Voice:** warm, confident, community-first. Example lines: “अकोले बदलतंय. आपण सोबत आहोत.” and “पहिल्यांदा कळण्यासाठी, पहिल्यांदा जोडले जा.”

**Wordmark & Logo:** preserve the supplied Taaluka logo exactly as the primary mark; pair it with a small location stamp rather than redrawing the wordmark.

**Signature Brand Color:** `#C82121`, used in the primary CTA, route-line motifs, live indicator, and key emphasis.

## Data and privacy behavior

Registration accepts one email address or Indian mobile number, trims and normalizes input, stores it as a unique contact, and never renders the raw contact back into public social proof. Referral links carry only the public referral code. Consent copy states that the contact is used for launch updates, and the UI includes Privacy Policy and Terms links as configurable placeholders until official URLs are supplied.

## Required configuration

- Launch date defaults to `2026-12-01T18:00:00+05:30` and is overridable with `VITE_TAALUKA_LAUNCH_DATE`.
- Supplied logo is stored at `/manus-storage/taaluka__1_-removebg-preview_cadf55b2.png`.
- Social/contact links are centralized as constants in `Home.tsx` for easy replacement with official handles.
