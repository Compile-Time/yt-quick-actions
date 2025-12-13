import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';
import vueI18n from '@intlify/unplugin-vue-i18n/vite';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-vue', '@wxt-dev/auto-icons'],
  autoIcons: {
    developmentIndicator: 'overlay',
  },
  manifest: (_) => ({
    permissions: ['*://www.youtube.com/*', 'storage'],
    name: '__MSG_extName__',
    description: '__MSG_extDescription__',
    default_locale: 'en',
  }),
  vite: (configEnv) => ({
    plugins: [
      tailwindcss(),
      vueI18n({
        include: 'assets/locales/*.json',
      }),
    ],
    build: {
      sourcemap: configEnv.mode === 'development',
    },
  }),
});
