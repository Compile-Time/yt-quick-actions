import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-vue', '@wxt-dev/auto-icons'],
  autoIcons: {
    developmentIndicator: 'overlay',
  },
  manifest: (_) => ({
    permissions: ['*://www.youtube.com/*', 'storage'],
    name: 'YT Quick Actions',
  }),
  vite: (configEnv) => ({
    plugins: [tailwindcss()],
    build: {
      sourcemap: configEnv.mode === 'development',
    },
  }),
});
