// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://opentao.ai',

  vite: {
    plugins: [tailwindcss()],
    build: {
      // Pagefind index is emitted post-build into /pagefind/. Don't try to bundle it.
      rollupOptions: {
        external: [/^\/pagefind\//],
      },
    },
  },

  integrations: [mdx(), preact(), sitemap()],

  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
});