/** Click-to-play facades for official YouTube posters, with a typographic fallback. */
const failed = (img: HTMLImageElement) => img.complete && (img.naturalWidth === 0 || img.naturalWidth <= 120);

export function bindFallback(el: HTMLElement) {
  const img = el.querySelector<HTMLImageElement>('.poster__img');
  if (!img) return;
  el.classList.remove('is-fallback');
  const check = () => { if (failed(img)) el.classList.add('is-fallback'); };
  if (img.complete) check();
  img.addEventListener('load', check);
  img.addEventListener('error', () => el.classList.add('is-fallback'));
}

export function play(el: HTMLElement) {
  const btn = el.querySelector<HTMLButtonElement>('.poster__btn');
  if (!btn) return;
  const f = document.createElement('iframe');
  f.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(el.dataset.poster!)}?autoplay=1&rel=0`;
  f.title = el.dataset.title || 'Vidéo YouTube';
  f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  f.allowFullscreen = true;
  f.referrerPolicy = 'strict-origin-when-cross-origin';
  f.className = 'poster__iframe';
  el.classList.add('is-playing');
  btn.replaceWith(f);
  f.focus();
}

export function initPosters() {
  document.querySelectorAll<HTMLElement>('[data-poster]').forEach((el) => {
    bindFallback(el);
    el.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('.poster__btn')) play(el);
    });
  });
}
