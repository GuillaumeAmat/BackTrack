// https://nuxt.com/docs/api/configuration/nuxt-config

import glslPlugin from 'vite-plugin-glsl';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: false },

  imports: {
    autoImport: false,
  },

  vite: {
    plugins: [glslPlugin()],
  },

  pages: {
    pattern: ['**/*.vue', '!**/components/**', '!**/composables/**'],
  },

  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/scripts', '@nuxt/test-utils', '@nuxt/ui'],

  css: ['~/assets/css/main.css'],
});
