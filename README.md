# OVAYO website

The official OVAYO website uses static HTML, shared CSS and JavaScript, and responsive layouts. No package installation or build step is required.

The single-page layout restored on November 24, 2026 keeps the latest approved information on one scrolling `index.html`. Work appears before Pricing, and the contact form is the final main section. The Find–Trust–Choose process section remains removed.

## Pages and files

| File | Content |
| --- | --- |
| `index.html` | Hero → founders → services → Work → monthly social plans → one-time projects/additional services → measurement → trust statements → contact form |
| `work.html` | Compatibility redirect to `index.html#work` |
| `pricing.html` | Compatibility redirect to `index.html#pricing` |
| `contact.html` | Compatibility redirect to `index.html#checkup` |

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

Header and footer navigation scroll to sections on the single page, with Work before Pricing. Home, Work, Pricing and Contact links use `#top`, `#work`, `#pricing` and `#checkup`. Package and checkup buttons lead to the bottom form; Services and About links lead to `#services` and `#team`.

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

Open `http://127.0.0.1:8000/` and check the section links. Check that the `work.html`, `pricing.html` and `contact.html` aliases redirect to the correct section on `index.html`. Serve only this website directory so internal business records in the parent workspace are not exposed. Stop the server with `Ctrl+C` when finished.

Check desktop and mobile layouts, navigation, page refreshes, image loading and CTA destinations after changes. Shared CSS affects every page.

## Existing homepage links

All homepage section links remain on `index.html`:

| Old homepage fragment | New destination |
| --- | --- |
| `#pricing` | Monthly social plans |
| `#one-time-pricing` | One-time projects |
| `#additional-services` | Optional services |
| `#work` | Work and concept projects |
| `#checkup` | Bottom contact form |

`#team`, `#services` and `#top` also remain on the homepage. The `work.html`, `pricing.html` and `contact.html` aliases redirect to `index.html`, preserving query parameters and fragments with JavaScript; each provides a no-JavaScript fallback to its default section. Ordinary homepage anchor navigation works without JavaScript.

## Contact-form status

The owner deferred the receiving email and form integration. The form is visible, its submit button is disabled, and it says **Online inquiries are coming soon.** No inquiry is sent in this state.

When the owner supplies an approved endpoint that accepts form POSTs, set the form's `data-endpoint` attribute in `index.html`. `assets/js/contact.js` reads that value and enables submission when it is configured. Verify delivery to the intended destination before treating inquiries as operational. Do not invent an endpoint or business inbox.

Placeholder email and missing legal-page links are not shown in the shared footer. Add them when real contact details and approved legal pages are available.

## Deployment

Repository: `https://github.com/tee2thehee/ovayo`.

GitHub Pages is configured to publish the repository root from **`main`**, using the custom domain recorded in `CNAME`: **ovayostudio.com**.

Work on a `codex/` branch, preview the concrete changes, and obtain the owner's publication authorization before updating `main`. A push to the configured publishing branch can deploy the website. Verify the exact deployed commit and public pages before reporting publication as complete.

## Copyright

© 2026 OVAYO. All rights reserved. The code, branding, graphics and other materials in this repository are proprietary to OVAYO unless otherwise stated.
