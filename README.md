# Anass Bazizi — website concept (unofficial)

> **Concept de site internet proposé par Mansour Technologies — Démonstration non officielle.**
> This is an unsolicited, unofficial demonstration. It is not commissioned, endorsed or operated by Anass Bazizi.

A single-page static showcase for a strength & muscle-building coach based in Marrakech. Visitors see who he is, what he coaches (muscle gain and fat loss, in his own words), how to start (send « COACHING » by Instagram DM, as his bio instructs), a curated set of six of his official videos, and his verified channels.

**Private demonstration.** The repository is private and nothing is deployed publicly. A Pages workflow is included but runs only when triggered manually.

## Stack
- Astro (static output), TypeScript, hand-written CSS (custom properties), ~3 kB of vanilla JS.
- Fonts self-hosted via Fontsource: **Epilogue** (variable), **IBM Plex Sans Arabic**, **DM Mono**.
- Playwright tests and a Node static server that mirrors the GitHub Pages sub-path.

## Run locally
```bash
npm ci
npm run build && npm run preview   # → http://localhost:4410/anass-bazizi-website-concept/
npm test                            # Playwright (starts the preview server itself)
```
If the Playwright-bundled browser is missing, point to an installed Chromium:
`PW_CHROMIUM="/path/to/chrome" npm test`.

Other tools: `npm run og` (re-renders `public/og.png`), `npm run shots -- <outDir>` (visual QA captures).

## Configuration
Everything factual lives in `src/data/site.ts`: identity, verified links, dated audience figures, the videos used as posters, and the navigation.
- `whatsapp: null`: the button is hidden. WhatsApp number to be inserted on the coach's approval.
- `email: null`: an address appears in a 2017 video description, but whether it is still current is unverified, so it is not used.
- `transformations: []`: the client-transformations section renders **only** entries whose client gave written consent and whose photos Anass supplied.

## Publishing after approval
1. Make the repo public (or move to a paid plan): `gh repo edit Mansour-Technologies/anass-bazizi-website-concept --visibility public --accept-visibility-change-consequences`.
2. Enable Pages with Actions: `gh api -X POST repos/Mansour-Technologies/anass-bazizi-website-concept/pages -f build_type=workflow`.
3. Run the workflow: `gh workflow run pages.yml` and then `gh run watch`.
4. Site URL: https://mansour-technologies.github.io/anass-bazizi-website-concept/ (`site`/`base` are already set in `astro.config.mjs`).
5. Remove `noindex` and `robots.txt` Disallow only if the coach takes ownership of the site.

## Assets and permissions
No photograph is committed to this repository or rehosted. Every image of the coach is the **official YouTube-hosted frame** (`i.ytimg.com`) of one of his own videos, used **only** as the click-to-play poster of that same video (youtube-nocookie iframe on click), with a credit and a typographic fallback. Frames that carry his Instagram watermark are shown unaltered. Play controls are placed so they do not cover it.

| Placement | Video | Image used now | Replace on approval with |
|---|---|---|---|
| Hero | _L3waOqmWcc (2018, in the gym) | `vi/_L3waOqmWcc/maxres2.jpg` | A recent portrait in a coaching context (vertical + horizontal, ≥2400 px) |
| §01 Le coach | insUKKS_yWc (2020) | `vi/insUKKS_yWc/maxres1.jpg` | A recent environmental portrait (gym, Marrakech) |
| §02 Cuisiner | m9ICZyGzGCA (2020) | `vi/m9ICZyGzGCA/maxres2.jpg` | A kitchen / meal-prep still |
| §04 Vidéos (6) | Xg4Xy4zgJFg, oIN98xEjLII, Zxs5C17UPdo, fYJH2PSlDyA, A_pA-3MX-M0, NdcFAeEExy8 | `maxres1/2/3` frames | Keep as video posters, or replace with his chosen thumbnails |
| Wordmark | – | Typographic « Anass **Bazizi** » | His signature logo (« Anass Bazizi — Personal Trainer ») as SVG |

Profile portraits (Instagram avatar, YouTube avatar, Facebook page picture) are **not** used. They are listed as options awaiting approval.

`public/og.png` is an original typographic image (no photo) and carries the demo notice.

## Content rules applied
- Only verified facts: his bio wording is quoted and attributed. « Certified PT » is shown as **self-reported**. No client counts, prices, package names, testimonials, guarantees or health claims.
- Audience figures are static and dated (observed 27 Nov 2026).
- Partners: none shown. (A 2017 apparel partnership is past and its site is offline.)
- No forms, questionnaires, accounts, payments or tracking.

## Licence
All rights reserved — Mansour Technologies. Concept digital proposé par Mansour Technologies — https://mansourtechnologies.com/
