# OVAYO website

The official OVAYO website uses static HTML, shared CSS and JavaScript, and responsive layouts. No package installation or build step is required.

The two-page layout prepared on November 24, 2026 supersedes the earlier four-page draft. Both pages end with a contact form; the Find–Trust–Choose process section has been removed.

## Pages and files

| File | Content |
| --- | --- |
| `index.html` | Home and About: hero, founders, services, measurement and contact form |
| `work.html` | Work → monthly social plans → one-time projects/additional services → trust statements → contact form |
| `pricing.html` | Compatibility redirect to the combined page's pricing section |
| `contact.html` | Compatibility redirect to the combined page's contact section |

```text
website/
├── index.html
├── pricing.html
├── work.html
├── contact.html
├── assets/
│   ├── brand/             # Original wordmark and ribbon, extracted without image changes
│   ├── css/site.css       # Shared design and responsive rules
│   ├── js/site.js         # Navigation and legacy homepage-link compatibility
│   ├── js/contact.js      # Contact-form availability and submission handling
│   └── team/              # Existing original portrait files
├── CNAME
└── README.md
```

Header and footer navigation connect the two pages and their sections, with Work before Pricing. Work and Pricing links lead to `work.html#work` and `work.html#pricing`. Contact and checkup buttons lead to each page's own bottom form. Package buttons lead to `work.html#checkup`; Services links lead to `index.html#services`.

## Preserved content

The restructure retains the approved visual style, founder photographs and pricing:

- Stay Active: **$79/month**.
- Look Professional: **$149/month**, Recommended. Its eight posts include one short video.
- Branding Kit: **$349 one-time**.
- Website Design: **$399 one-time**.
- Business Launch Kit: **$699 one-time**, Recommended, saving $49 versus buying its components separately.

Portrait files are unchanged. The separate brand PNGs contain the same image bytes as the former embedded assets.

The three Work cards remain labelled **Concept project**. Replace them with owner-supplied work when available, and retain accurate labels until genuine client work can be shown. Do not invent client names, testimonials or results. Placeholder testimonials are omitted from the draft.

## Local preview

Run this command from this website repository's root, not the parent OVAYO business workspace:

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory .
```

Open `http://127.0.0.1:8000/`, then visit `work.html` and its section links. Check that the `pricing.html` and `contact.html` aliases redirect correctly. Serve only this website directory so internal business records in the parent workspace are not exposed. Stop the server with `Ctrl+C` when finished.

Check desktop and mobile layouts, navigation, page refreshes, image loading and CTA destinations after changes. Shared CSS affects every page.

## Existing homepage links

The shared script preserves links to sections moved from the original homepage:

| Old homepage fragment | New destination |
| --- | --- |
| `#pricing` | `work.html#pricing` |
| `#one-time-pricing` | `work.html#one-time-pricing` |
| `#additional-services` | `work.html#additional-services` |
| `#work` | `work.html#work` |
| `#checkup` | Home's own contact form |

Homepage fragment redirects preserve query parameters. `#team`, `#services` and `#top` remain on Home. The `pricing.html` and `contact.html` aliases also redirect to `work.html`, preserving query parameters and fragments with JavaScript; each provides a no-JavaScript fallback to its default section. Ordinary page navigation works without JavaScript; legacy homepage fragment redirects require it.

## Contact-form status

The owner deferred the receiving email and form integration. The form is visible, its submit button is disabled, and it says **Online inquiries are coming soon.** No inquiry is sent in this state.

When the owner supplies an approved endpoint that accepts form POSTs, set the form's `data-endpoint` attribute in both `index.html` and `work.html`. Keep the form markup consistent between pages. `assets/js/contact.js` reads that value and enables submission when it is configured. Verify delivery to the intended destination before treating inquiries as operational. Do not invent an endpoint or business inbox.

Placeholder email and missing legal-page links are not shown in the shared footer. Add them when real contact details and approved legal pages are available.

## Deployment

Repository: `https://github.com/tee2thehee/ovayo`.

GitHub Pages is configured to publish the repository root from **`main`**, using the custom domain recorded in `CNAME`: **ovayostudio.com**.

Work on a `codex/` branch, preview the concrete changes, and obtain the owner's publication authorization before updating `main`. A push to the configured publishing branch can deploy the website. Verify the exact deployed commit and public pages before reporting publication as complete.

## Copyright

© 2026 OVAYO. All rights reserved. The code, branding, graphics and other materials in this repository are proprietary to OVAYO unless otherwise stated.
