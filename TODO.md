# Taaluka Waitlist Landing Page — TODO

## Durable waitlist and referral data

- [ ] Persist registrations in managed database storage with a unique normalized email-or-mobile contact; prevent duplicate registration responses from creating a second row.
- [ ] Generate a unique public referral code for every successful registration and attribute a new registration to a valid referring code.
- [ ] Calculate and return the real queue position, successful referral count, and positions gained from backend data; do not display fabricated progress or referral statistics.
- [ ] Expose the actual registered-user total for social proof, with an honest zero/unavailable state when no data exists.

## Hero and conversion flow

- [ ] Build a bold minimal hero using the supplied Taaluka logo, the exact Marathi headline “आपल्या अकोल्याचा हक्काचा डिजिटल प्लॅटफॉर्म!”, supporting copy, configurable live launch countdown, primary CTA “Early Access मिळवा”, secondary CTA “आपल्या मित्रांना सांगा”, and a subtle Akole-inspired visual.
- [ ] Provide email-or-mobile registration with validation, privacy-conscious consent copy, clear duplicate/success/error states, and a reusable closing registration CTA “माझी जागा निश्चित करा”.
- [ ] After registration show the backend-derived queue position, referral link, WhatsApp/share actions, referral progress, successful referrals, positions gained, and configurable milestone perks without revealing a full app interface.

## Benefits, trust, and brand system

- [ ] Add three responsive benefit cards for local updates/community happenings, local shops/services/offers, and early participation/exclusive benefits.
- [ ] Add the social proof section with exact headline “अकोलेकरांची पसंती, तालुक्याच्या डिजिटल भविष्याकडे!”, actual backend count, subtle update animation, and optional honest joining message.
- [ ] Add closing CTA with “अकोलेकर, तयार आहात ना?” and “आपल्या तालुक्याच्या डिजिटल प्रवासाचा भाग व्हा.”
- [ ] Add footer with supplied logo, “Our Taaluka. Our App. Our People.”, configurable official social links, contact/company details, Privacy Policy, Terms & Conditions, and copyright.

## Delivery quality

- [ ] Keep the interface responsive, accessible, fast, Marathi-first, and consistent with `#C82121`, `#FFFFFF`, `#252525`, and `#F8F6F4`.
- [ ] Add basic SEO and social-sharing metadata, semantic structure, reduced-motion behavior, and the `/manus-routes.json` route manifest.
- [ ] Set the project logo metadata, run diagnostics/build checks, start Preview, and save a checkpoint after the implemented experience is verified.
