import { defineConfig } from 'astro/config';
// Deploy-ready for GitHub Pages (NOT enabled: private concept repo).
export default defineConfig({
  site: 'https://mansour-technologies.github.io',
  base: '/anass-bazizi-website-concept',
  trailingSlash: 'always',
  compressHTML: false,
  build: { format: 'directory' },
});
