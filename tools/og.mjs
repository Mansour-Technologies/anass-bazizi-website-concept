// Renders the original Open Graph image (1200x630) to public/og.png: typographic, no personal photo.
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const f = (p) => 'data:font/woff2;base64,' + readFileSync(resolve('node_modules', p)).toString('base64');
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:E;font-weight:100 900;src:url(${f('@fontsource-variable/epilogue/files/epilogue-latin-wght-normal.woff2')})}
@font-face{font-family:A;font-weight:700;src:url(${f('@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-700-normal.woff2')})}
@font-face{font-family:M;font-weight:500;src:url(${f('@fontsource/dm-mono/files/dm-mono-latin-500-normal.woff2')})}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#f4eee6;color:#1a1613;font-family:E;position:relative;overflow:hidden}
.top{position:absolute;top:0;left:0;right:0;height:50px;background:#1a1613;color:#f4eee6;font-size:19px;display:flex;align-items:center;gap:12px;padding:0 64px}
.top i{width:9px;height:9px;border-radius:50%;background:#f0a13f}
.strip{position:absolute;right:0;top:50px;bottom:0;width:300px;background:linear-gradient(160deg,#ec8a55,#f0a13f 55%,#f3c040)}
.big{position:absolute;right:-30px;bottom:-14px;font-weight:900;font-size:250px;letter-spacing:-.06em;color:#1a1613;opacity:.92;writing-mode:vertical-rl;transform:rotate(180deg);line-height:.8}
.k{position:absolute;top:104px;left:64px;font-family:M;font-size:20px;letter-spacing:.14em;text-transform:uppercase;color:#3a322c}
h1{position:absolute;top:142px;left:58px;text-transform:uppercase;line-height:.84;letter-spacing:-.045em;font-size:150px}
h1 span{display:block}
h1 .a{font-weight:250}
h1 .b{font-weight:850}
.ar{position:absolute;left:64px;top:430px;font-family:A;font-size:46px;direction:rtl;background:linear-gradient(transparent 62%,rgba(240,161,63,.4) 0);padding:0 4px}
svg{position:absolute;left:64px;bottom:58px;width:740px;height:18px}
</style></head><body>
<div class="top"><i></i>Concept de site internet proposé par Mansour Technologies — Démonstration non officielle</div>
<div class="strip"></div><div class="big">BAZIC</div>
<div class="k">Coach en musculation — Marrakech</div>
<h1><span class="a">Anass</span><span class="b">Bazizi</span></h1>
<div class="ar">مدرب مختص في البناء العضلي</div>
<svg viewBox="0 0 240 16" preserveAspectRatio="none"><g fill="#1a1613"><rect x="0" y="1" width="5" height="14"/><rect x="6" y="4" width="4" height="8"/><rect x="230" y="4" width="4" height="8"/><rect x="235" y="1" width="5" height="14"/></g><rect x="10" y="7" width="220" height="2" fill="#f0a13f"/></svg>
</body></html>`;
const exe = process.env.PW_CHROMIUM;
const b = await chromium.launch(exe ? { executablePath: exe } : {});
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.setContent(html, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: 'public/og.png' });
await b.close();
console.log('og.png written');
