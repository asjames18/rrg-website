import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  site: 'https://realandrawgospel.com', // Update with your actual domain
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(), 
    mdx(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    })
  ],
  vite: {
    resolve: {
      alias: { '@': new URL('./src', import.meta.url).pathname },
      dedupe: ['@supabase/supabase-js']
    }
  }
});