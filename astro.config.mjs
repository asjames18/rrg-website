import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(), 
    mdx()
  ],
  vite: {
    resolve: {
      alias: { '@': new URL('./src', import.meta.url).pathname },
      dedupe: ['@supabase/supabase-js']
    }
  }
});