// Minimal static server that mirrors GitHub Pages (sub-path base, 404.html fallback).
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
const BASE = '/anass-bazizi-website-concept';
const ROOT = fileURLToPath(new URL('../dist/', import.meta.url));
const PORT = Number(process.env.PORT || 4410);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff', '.txt': 'text/plain', '.json': 'application/json' };
http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');
  let p = decodeURIComponent(u.pathname);
  const send404 = async () => { res.writeHead(404, { 'content-type': types['.html'] }); res.end(await readFile(join(ROOT, '404.html'))); };
  if (!p.startsWith(BASE)) return send404();
  p = normalize(p.slice(BASE.length) || '/');
  if (p.includes('..')) return send404();
  let f = join(ROOT, p);
  try {
    const s = await stat(f);
    if (s.isDirectory()) {
      if (!u.pathname.endsWith('/')) { res.writeHead(301, { location: u.pathname + '/' + u.search }); return res.end(); }
      f = join(f, 'index.html');
    }
    const body = await readFile(f);
    res.writeHead(200, { 'content-type': types[extname(f)] || 'application/octet-stream' });
    res.end(body);
  } catch { return send404(); }
}).listen(PORT, () => console.log(`serving ${ROOT} at http://localhost:${PORT}${BASE}/`));
