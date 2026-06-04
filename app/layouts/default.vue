<template>
  <div class="min-h-screen bg-[#0b0f19] selection:bg-blue-500/30">
    <AppNavbar />

    <slot />
    
    <footer class="border-t border-gray-900 bg-[#0f1423]/40 py-8 text-center text-xs text-gray-600">
      <div class="max-w-7xl mx-auto px-4">
        © 2026 Grafiklone - Projet d'apprentissage. Tous droits réservés.
      </div>
    </footer>
  </div>
</template>