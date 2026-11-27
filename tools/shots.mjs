// Visual QA captures. Usage: node tools/shots.mjs <outDir> [baseUrl]
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
const out = process.argv[2] || 'screenshots';
const base = process.argv[3] || 'http://localhost:4410/anass-bazizi-website-concept/';
const exe = process.env.PW_CHROMIUM;
mkdirSync(out, { recursive: true });
const b = await chromium.launch(exe ? { executablePath: exe } : {});
async function page(w, h, dpr = 1) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, locale: 'fr-FR' });
  await p.goto(base, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(1400);
  return p;
}
async function settle(p) {
  // Sticky elements cannot be represented in stitched captures: flatten them for screenshots only.
  await p.addStyleTag({ content: '.hdr{position:relative!important}.lib__stage,.coach__media{position:static!important}' });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 160)); } scrollTo(0, 0); });
  await p.evaluate(() => document.querySelectorAll('.rv').forEach((e) => e.classList.add('in')));
  await p.waitForTimeout(2500);
}
const shotEl = async (p, sel, file) => { const el = p.locator(sel).first(); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(500); await el.screenshot({ path: join(out, file) }); };

// Desktop
let d = await page(1440, 900);
await d.screenshot({ path: join(out, 'desktop-hero.png') });
await settle(d);
await d.screenshot({ path: join(out, 'desktop-full.png'), fullPage: true });
await shotEl(d, '#coach', 'bio.png');
await shotEl(d, '#bazic', 'achievements.png');
await shotEl(d, '#demarrer', 'services.png');
await shotEl(d, '#videos', 'photography.png');
await shotEl(d, '#contact', 'contact.png');
await d.close();
// Mobile
let m = await page(390, 844, 2);
await m.screenshot({ path: join(out, 'mobile-hero.png') });
await m.screenshot({ path: join(out, 'share-preview.png') });
await m.locator('[data-menu-open]').click();
await m.waitForTimeout(500);
await m.screenshot({ path: join(out, 'mobile-nav.png') });
await m.keyboard.press('Escape');
await m.close();
// full mobile page at DPR 1: a DPR-2 capture exceeds Chromium's 16k texture limit and tiles incorrectly
m = await page(390, 844, 1);
await settle(m);
await m.screenshot({ path: join(out, 'mobile-full.png'), fullPage: true });
await m.close();
await b.close();
console.log('shots →', out);
