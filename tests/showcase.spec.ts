import { test, expect, type Page } from '@playwright/test';

const NOTICE = 'Concept de site internet proposé par Mansour Technologies — Démonstration non officielle.';
const ALLOWED = ['ig.me', 'www.instagram.com', 'www.tiktok.com', 'www.youtube.com', 'www.facebook.com', 'mansourtechnologies.com'];

async function open(page: Page, w = 1440, h = 900) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto('./', { waitUntil: 'networkidle' });
}

test('loads with no console errors and no failed same-origin assets', async ({ page }) => {
  const errors: string[] = [];
  const bad: string[] = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('response', (r) => { if (r.status() >= 400 && r.url().startsWith('http://localhost')) bad.push(`${r.status()} ${r.url()}`); });
  await open(page);
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } });
  await page.waitForLoadState('networkidle');
  expect(errors).toEqual([]);
  expect(bad).toEqual([]);
});

test('notice, noindex, robots.txt and footer attribution', async ({ page, request }) => {
  await open(page);
  await expect(page.locator('.notice')).toContainText(NOTICE);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  const credit = page.locator('.foot__credit a');
  await expect(credit).toHaveAttribute('href', 'https://mansourtechnologies.com/');
  const robots = await request.get('robots.txt');
  expect(await robots.text()).toContain('Disallow: /');
  const nf = await request.get('page-inexistante/');
  expect(nf.status()).toBe(404);
});

test('OG / Twitter tags are absolute production URLs', async ({ page }) => {
  await open(page);
  for (const sel of ['meta[property="og:image"]', 'meta[property="og:url"]', 'meta[name="twitter:image"]', 'link[rel="canonical"]']) {
    const v = (await page.locator(sel).getAttribute(sel.startsWith('link') ? 'href' : 'content'))!;
    expect(v).toMatch(/^https:\/\/mansour-technologies\.github\.io\/anass-bazizi-website-concept\//);
  }
});

test('contact and social links: verified https domains, new tab, noopener', async ({ page }) => {
  await open(page);
  const links = page.locator('a[target="_blank"]');
  const n = await links.count();
  expect(n).toBeGreaterThan(5);
  for (let i = 0; i < n; i++) {
    const a = links.nth(i);
    const href = (await a.getAttribute('href'))!;
    const u = new URL(href);
    expect(u.protocol).toBe('https:');
    expect(ALLOWED).toContain(u.hostname);
    expect(await a.getAttribute('rel')).toContain('noopener');
  }
  await expect(page.locator('.hero a.btn')).toHaveAttribute('href', 'https://ig.me/m/bazizi_anass');
  // WhatsApp intentionally not rendered (whatsapp: null)
  await expect(page.locator('a[href*="wa.me"], a[href*="whatsapp"]')).toHaveCount(0);
  // No transformation section without consented entries
  await expect(page.locator('#transformations')).toHaveCount(0);
  // No forms / questionnaires
  await expect(page.locator('form, input, textarea, select')).toHaveCount(0);
});

test('anchor nav scrolls to sections', async ({ page }) => {
  await open(page);
  for (const id of ['coach', 'bazic', 'demarrer', 'videos', 'contact']) {
    await page.locator(`.hdr__nav a[href="#${id}"]`).click();
    await expect(page.locator(`#${id}`)).toBeInViewport({ ratio: 0.1 });
  }
});

test('mobile sommaire: keyboard open, focus trap, Escape closes and returns focus', async ({ page }) => {
  await open(page, 390, 844);
  const btn = page.locator('[data-menu-open]');
  await btn.focus();
  await page.keyboard.press('Enter');
  const sheet = page.locator('#sommaire');
  await expect(sheet).toBeVisible();
  await expect(btn).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('[data-menu-close]')).toBeFocused();
  for (let i = 0; i < 12; i++) await page.keyboard.press('Tab');
  expect(await page.evaluate(() => !!document.activeElement?.closest('#sommaire'))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(sheet).toBeHidden();
  await expect(btn).toBeFocused();
  // link closes the sheet and navigates
  await btn.click();
  await page.locator('.sheet__list a[href="#contact"]').click();
  await expect(sheet).toBeHidden();
  await expect(page.locator('#contact')).toBeInViewport({ ratio: 0.1 });
});

test('tap targets in the mobile first screen are at least 44px', async ({ page }) => {
  await open(page, 375, 812);
  for (const sel of ['[data-menu-open]', '.hero a.btn', '.poster--hero .poster__btn', '.mark']) {
    const b = await page.locator(sel).first().boundingBox();
    expect(b!.height, sel).toBeGreaterThanOrEqual(44);
  }
});

test('video facades: no iframe until click, then youtube-nocookie of the same video', async ({ page }) => {
  await open(page);
  await expect(page.locator('iframe')).toHaveCount(0);
  const imgs = page.locator('.poster__img');
  const n = await imgs.count();
  for (let i = 0; i < n; i++) {
    const src = (await imgs.nth(i).getAttribute('src'))!;
    expect(src).toMatch(/^https:\/\/i\.ytimg\.com\/vi\/[\w-]{11}\/maxres[123]\.jpg$/);
    if (i > 0) expect(await imgs.nth(i).getAttribute('loading')).toBe('lazy');
  }
  const hero = page.locator('.poster--hero');
  const id = await hero.getAttribute('data-poster');
  await expect(hero.locator('.poster__btn')).toHaveAttribute('aria-label', /^Lire la vidéo officielle : /);
  await hero.locator('.poster__btn').click();
  const f = hero.locator('iframe');
  await expect(f).toHaveAttribute('src', new RegExp(`^https://www\\.youtube-nocookie\\.com/embed/${id}\\?`));
  await expect(page.locator('iframe')).toHaveCount(1);
});

test('video index swaps the stage facade, and plays the chosen video', async ({ page }) => {
  await open(page);
  const rows = page.locator('.lib__row');
  await rows.nth(2).click();
  await expect(rows.nth(2)).toHaveAttribute('aria-pressed', 'true');
  await expect(rows.nth(0)).toHaveAttribute('aria-pressed', 'false');
  const stage = page.locator('.lib__stage [data-poster]');
  const id = await rows.nth(2).getAttribute('data-id');
  await expect(stage).toHaveAttribute('data-poster', id!);
  await stage.locator('.poster__btn').click();
  await expect(stage.locator('iframe')).toHaveAttribute('src', new RegExp(`/embed/${id}\\?`));
  // choosing another chapter after playback restores a facade (no stray iframe)
  await rows.nth(4).click();
  await expect(page.locator('.lib__stage iframe')).toHaveCount(0);
  await expect(page.locator('.lib__stage [data-poster]')).toHaveAttribute('data-poster', (await rows.nth(4).getAttribute('data-id'))!);
});

test('poster fallback appears when the official image fails', async ({ page }) => {
  await page.route('https://i.ytimg.com/**', (r) => r.abort());
  await open(page);
  await expect(page.locator('.poster--hero')).toHaveClass(/is-fallback/);
  await expect(page.locator('.poster--hero .poster__fallback')).toBeVisible();
  await expect(page.locator('.poster--hero .poster__btn')).toBeVisible();
});

for (const w of [320, 360, 375, 390, 393, 430, 768, 1024, 1440, 1920]) {
  test(`no horizontal overflow at ${w}px`, async ({ page }) => {
    await open(page, w, 900);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(over).toBeLessThanOrEqual(0);
  });
}
