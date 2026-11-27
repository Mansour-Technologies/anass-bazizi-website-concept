/** Base-aware URL helper (GitHub Pages sub-path). */
export const withBase = (p = '') => {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  return base + p.replace(/^\//, '');
};
export const ytImg = (id: string, frame: string) => `https://i.ytimg.com/vi/${id}/${frame}.jpg`;
export const ytWatch = (id: string) => `https://www.youtube.com/watch?v=${id}`;
