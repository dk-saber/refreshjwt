// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2026-06-30',

  runtimeConfig: {
    // Côté SERVEUR uniquement (jamais exposé au navigateur).
    // En Docker, le serveur Nuxt appelle le backend via le nom du service
    // Compose (ex: http://api:5000/api), pas via localhost.
    apiBase: process.env.NUXT_API_BASE || 'http://localhost:5000/api',
    public: {
      // Côté NAVIGATEUR : doit être une URL joignable depuis la machine
      // de l'utilisateur (ex: http://localhost:5000/api si le port du
      // backend est publié sur l'hôte).
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:5000/api'
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})