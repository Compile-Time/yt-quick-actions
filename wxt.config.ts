import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';
import vueI18n from '@intlify/unplugin-vue-i18n/vite';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-vue', '@wxt-dev/auto-icons'],
  autoIcons: {
    developmentIndicator: 'overlay',
  },
  manifest: (configEnv) => {
    const manifest: Record<string, unknown> = {
      name: '__MSG_extName__',
      description: '__MSG_extDescription__',
      default_locale: 'en',
    };

    if (configEnv.browser === 'firefox') {
      manifest.permissions = ['*://www.youtube.com/*', 'storage'];
    }
    if (configEnv.browser === 'chrome') {
      manifest.permissions = ['storage'];
      manifest.host_permissions = ['*://www.youtube.com/*'];
    }

    return manifest;
  },
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
