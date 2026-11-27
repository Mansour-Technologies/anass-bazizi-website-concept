import { bindFallback, play } from './posters';

const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

function menu() {
  const open = document.querySelector<HTMLButtonElement>('[data-menu-open]');
  const sheet = document.querySelector<HTMLElement>('[data-sheet]');
  const close = document.querySelector<HTMLButtonElement>('[data-menu-close]');
  if (!open || !sheet || !close) return;
  const focusables = () => [...sheet.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')];
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); hide(); return; }
    if (e.key !== 'Tab') return;
    const f = focusables(); const first = f[0]; const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  const show = () => {
    sheet.hidden = false;
    requestAnimationFrame(() => sheet.classList.add('is-open'));
    open.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('is-locked');
    document.addEventListener('keydown', onKey);
    close.focus();
  };
  const hide = (returnFocus = true) => {
    sheet.classList.remove('is-open');
    sheet.hidden = true;
    open.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('is-locked');
    document.removeEventListener('keydown', onKey);
    if (returnFocus) open.focus();
  };
  open.addEventListener('click', show);
  close.addEventListener('click', () => hide());
  sheet.querySelectorAll('[data-menu-link]').forEach((a) => a.addEventListener('click', () => hide(false)));
}

function library() {
  const lib = document.querySelector<HTMLElement>('[data-lib]');
  if (!lib) return;
  const rows = [...lib.querySelectorAll<HTMLButtonElement>('.lib__row')];
  const chapter = lib.querySelector<HTMLElement>('[data-lib-chapter]')!;
  const title = lib.querySelector<HTMLElement>('[data-lib-title]')!;
  // pristine copy of the stage facade, restored after a playback
  const pristine = lib.querySelector<HTMLElement>('.lib__stage [data-poster]')!.outerHTML;
  rows.forEach((row) => row.addEventListener('click', () => {
    rows.forEach((r) => r.setAttribute('aria-pressed', String(r === row)));
    const stage = lib.querySelector<HTMLElement>('.lib__stage');
    const old = stage!.querySelector<HTMLElement>('[data-poster]')!;
    // Rebuild the facade for the chosen video (an iframe from a previous play is discarded).
    let fig = old;
    if (old.classList.contains('is-playing')) {
      const tpl = document.createElement('template');
      tpl.innerHTML = pristine;
      fig = tpl.content.firstElementChild as HTMLElement;
      old.replaceWith(fig);
      fig.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('.poster__btn')) play(fig); });
    }
    fig.dataset.poster = row.dataset.id!;
    fig.dataset.title = row.dataset.titleAr!;
    fig.style.setProperty('--pos', row.dataset.pos || '50% 40%');
    const img = fig.querySelector<HTMLImageElement>('.poster__img')!;
    img.src = row.dataset.img!;
    fig.querySelector('.poster__btn')!.setAttribute('aria-label', `Lire la vidéo officielle : ${row.dataset.titleAr}`);
    fig.querySelector('.poster__play-text small')!.textContent = row.dataset.meta!;
    const fb = fig.querySelector<HTMLElement>('.poster__fallback-title');
    if (fb) fb.textContent = row.dataset.titleAr!;
    bindFallback(fig);
    chapter.textContent = row.dataset.chapter!;
    title.textContent = row.dataset.titleFr!;
    if (matchMedia('(max-width: 899px)').matches) stage!.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth', block: 'start' });
  }));
}

function progress() {
  const bar = document.querySelector<HTMLElement>('[data-progress]');
  const hdr = document.querySelector<HTMLElement>('[data-hdr]');
  const spy = [...document.querySelectorAll<HTMLAnchorElement>('[data-spy]')];
  let ticking = false;
  const update = () => {
    ticking = false;
    const h = document.documentElement;
    const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
    if (bar) bar.style.transform = `scaleX(${p.toFixed(4)})`;
    hdr?.classList.toggle('is-scrolled', h.scrollTop > 8);
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
  if (spy.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      spy.forEach((a) => a.toggleAttribute('aria-current', a.dataset.spy === e.target.id));
    }), { rootMargin: '-45% 0px -50% 0px' });
    spy.forEach((a) => { const s = document.getElementById(a.dataset.spy!); if (s) io.observe(s); });
  }
}

function reveal() {
  if (reduce() || !('IntersectionObserver' in window)) return;
  const els = document.querySelectorAll<HTMLElement>('.sec__head, .h2, .lead, .spec > div, .pillar, .start__one, .start__next > li, .lib__row, .channels li, .bazic__quote');
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  els.forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.top > innerHeight) { el.classList.add('rv'); io.observe(el); }
  });
}

export function initUi() { menu(); library(); progress(); reveal(); }
