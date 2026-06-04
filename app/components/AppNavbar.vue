<!-- app/components/AppNavbar.vue -->
<template>
  <nav class="bg-[#111827] border-b border-gray-800 text-sm font-medium text-gray-300 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      
      <!-- LOGO + LIENS GAUCHE -->
      <div class="flex items-center gap-8">
        <NuxtLink to="/" class="flex items-center gap-2 text-white font-black text-lg tracking-wider group">
          <span class="bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 rounded-lg text-white font-mono text-sm leading-none group-hover:scale-105 transition">
            G
          </span>
          <span class="text-base font-bold hidden sm:inline">Grafiklone</span>
        </NuxtLink>

        <div class="hidden md:flex items-center gap-6 text-gray-400">
          <NuxtLink to="/tutorials" class="hover:text-white transition flex items-center gap-1.5 py-2">🧭 Tutoriels</NuxtLink>
          <NuxtLink to="/courses" class="hover:text-white transition flex items-center gap-1.5 py-2">🎓 Formations</NuxtLink>
          <NuxtLink to="/pathways" class="hover:text-white transition flex items-center gap-1.5 py-2">🛣️ Cursus</NuxtLink>
          <NuxtLink to="/premium" class="text-amber-400 hover:text-amber-300 transition flex items-center gap-1.5 py-2">⭐ Premium</NuxtLink>
          <NuxtLink to="/blog" class="hover:text-white transition flex items-center gap-1.5 py-2">📰 Blog</NuxtLink>
        </div>
      </div>

      <!-- RECHERCHE + CONNEXION DYNAMIQUE -->
      <div class="flex items-center gap-4">
        <button class="text-gray-400 hover:text-white p-2 transition" aria-label="Rechercher">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.604 10.604z" />
          </svg>
        </button>

        <div class="flex items-center gap-3 border-l border-gray-800 pl-4">
          <!-- ÉTAT : UTILISATEUR CONNECTÉ -->
          <div v-if="user" class="flex items-center gap-4">
            <span class="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {{ user.name || 'Mon Profil' }}
            </span>
            <button @click="handleLogout" class="text-xs text-red-400 hover:text-red-300 transition font-medium">
              Se déconnecter
            </button>
          </div>

          <!-- ÉTAT : VISITEUR NON CONNECTÉ -->
          <div v-else class="flex items-center gap-3">
            <NuxtLink to="/auth/register" class="text-xs hover:text-white transition hidden sm:inline">
              S'inscrire
            </NuxtLink>
            <NuxtLink to="/auth/login" class="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold rounded-md border border-gray-700 transition">
              Se connecter
            </NuxtLink>
          </div>
        </div>
      </div>

    </div>
  </nav>
</template>

<script setup>
// 1. On importe explicitement les fonctions de routage si nécessaire (optionnel mais plus sûr)
const { user, logout } = useAuth()
const router = useRouter()

const handleLogout = () => {
  // 2. On exécute la fonction de déconnexion de ton composable
  logout()
  
  // 3. Redirection propre vers la page d'accueil
  router.push('/')
}
</script>