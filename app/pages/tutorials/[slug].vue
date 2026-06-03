<template>
  <div class="flex-1 w-full max-w-5xl mx-auto p-4 space-y-6 my-6">
    
    <NuxtLink to="/" class="inline-flex items-center text-sm font-medium text-emerald-400 hover:text-emerald-300 transition">
      ← Retour au catalogue
    </NuxtLink>

    <div v-if="pending" class="text-center py-12 text-gray-400">
      Chargement du cours vidéo...
    </div>

    <div v-else-if="error" class="bg-rose-900/40 border border-rose-700 text-rose-300 p-6 rounded-lg text-center">
      <h3 class="text-lg font-bold">Une erreur est survenue</h3>
      <p class="text-sm">{{ error.statusMessage || 'Impossible de charger ce tutoriel.' }}</p>
    </div>

    <div v-else-if="tutorial" class="space-y-6">
      
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="space-y-2">
          <span class="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-900/50 text-emerald-300 border border-emerald-700">
            Tutoriel Premium
          </span>
          <h1 class="text-3xl font-bold text-white">{{ tutorial.title }}</h1>
        </div>

        <div v-if="user">
          <button 
            @click="toggleProgress"
            :disabled="progressLoading"
            class="w-full md:w-auto font-bold py-2 px-6 rounded transition duration-200 flex items-center justify-center gap-2"
            :class="isCompleted ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'"
          >
            <span v-if="isCompleted">✅ Cours terminé</span>
            <span v-else>⬜ Marquer comme terminé</span>
          </button>
        </div>
      </div>

      <div class="aspect-video w-full bg-black rounded-lg overflow-hidden border border-gray-700 shadow-2xl">
        <iframe 
          v-if="embedUrl"
          :src="embedUrl" 
          class="w-full h-full"
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen
        ></iframe>
        <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-500 space-y-2">
          <span>📺</span>
          <p class="text-sm">Aucune vidéo disponible pour ce tutoriel.</p>
        </div>
      </div>

      <div class="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-3 shadow-lg">
        <h3 class="text-lg font-semibold text-emerald-400 border-b border-gray-700 pb-2">À propos de ce cours</h3>
        <p class="text-gray-300 leading-relaxed whitespace-pre-line">
          {{ tutorial.description }}
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../../composables/useAuth'

const route = useRoute()
const slug = route.params.slug
const auth = useAuth()
const user = computed(() => auth.user.value)

// 1. Récupération du tutoriel
const { data: tutorial, pending, error } = await useFetch(`/api/tutorials/${slug}`)

// 2. Gestion de l'état "Terminé"
const isCompleted = ref(false)
const progressLoading = ref(false)

// Aller chercher le statut initial dans MySQL dès que le user et le tuto sont chargés
watchEffect(async () => {
  if (user.value?.id && tutorial.value?.id) {
    const data = await $fetch('/api/tutorials/progress', {
      query: { userId: user.value.id, tutorialId: tutorial.value.id }
    })
    isCompleted.value = data.completed
  }
})

// Action de clic sur le bouton
const toggleProgress = async () => {
  if (!user.value?.id || !tutorial.value?.id) return
  
  progressLoading.value = true
  try {
    const data = await $fetch('/api/tutorials/progress', {
      method: 'POST',
      body: { userId: user.value.id, tutorialId: tutorial.value.id }
    })
    isCompleted.value = data.completed
  } catch (err) {
    console.error("Erreur progression:", err)
  } finally {
    progressLoading.value = false
  }
}

// Transformation de l'URL YouTube
const embedUrl = computed(() => {
  if (!tutorial.value?.videoUrl) return null
  const url = tutorial.value.videoUrl
  let videoId = ''
  if (url.includes('v=')) {
    videoId = url.split('v=')[1]?.split('&')[0]
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0]
  } else if (url.includes('embed/')) {
    return url
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url
})
</script>