export default defineNuxtConfig({
  compatibilityDate: '2026-06-04',
  modules: ['../src/module', '@nuxtjs/tailwindcss', '@nuxtjs/color-mode'],
  aiElements: {
    defaultStyles: true,
  },
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classSuffix: '',
  },
  app: {
    // GitHub Pages project site: https://<user>.github.io/<repo>/
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cormorant:wght@500;600&display=swap',
        },
      ],
    },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
  },
})
