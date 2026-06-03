// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],

  tailwindcss: {
    config: {
      content: [
        // Le "**" permet de scanner TOUS les sous-dossiers de /app (y compris /pages et /tutorials)
        "./app/**/*.{vue,js,ts,jsx,tsx}",
        "./plugins/**/*.{js,ts}",
        "./nuxt.config.{js,ts}"
      ]
    }
  }
})