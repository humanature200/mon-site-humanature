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

      <div class="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-6 shadow-lg">
        <h3 class="text-xl font-bold text-white border-b border-gray-700 pb-3 flex items-center gap-2">
          💬 Discussion du Forum ({{ comments?.length || 0 }})
        </h3>

        <div v-if="user" class="space-y-3">
          <label class="block text-sm font-medium text-gray-300">Poser une question ou lancer une discussion sur ce cours :</label>
          <textarea 
            v-model="newCommentText" 
            rows="3" 
            placeholder="Écrivez votre message pour le forum..." 
            class="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-emerald-500 text-sm resize-none"
          ></textarea>
          <div class="flex justify-end">
            <button 
              @click="submitComment" 
              :disabled="!newCommentText.trim() || commentLoading"
              class="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 disabled:text-gray-400 text-gray-900 font-bold py-2 px-5 rounded text-sm transition duration-200"
            >
              {{ commentLoading ? 'Envoi...' : 'Envoyer' }}
            </button>
          </div>
        </div>
        
        <div v-else class="bg-gray-900/50 p-4 rounded text-center text-sm text-gray-400 border border-gray-700/50">
          🔑 Vous devez être connecté pour participer aux discussions de ce forum.
        </div>

        <div class="space-y-4 pt-2">
          <div v-if="commentsPending" class="text-center text-sm text-gray-500">
            Chargement des discussions...
          </div>
          <div v-else-if="!comments || comments.length === 0" class="text-center text-sm text-gray-500 py-4">
            Aucun message pour le moment. Lancez le débat !
          </div>
          <div 
            v-else 
            v-for="comment in comments" 
            :key="comment.id" 
            class="p-4 rounded bg-gray-900/60 border border-gray-700/60 space-y-1 text-sm"
          >
            <div class="flex justify-between items-center text-xs">
              <span class="font-bold text-emerald-400">{{ comment.userName }}</span>
              <span class="text-gray-500">
                {{ new Date(comment.createdAt).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }}
              </span>
            </div>
            <p class="text-gray-300 whitespace-pre-line">{{ comment.content }}</p>
          </div>
        </div>
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

// 2. Gestion de l'état "Terminé" (Adapté pour tutorialId en String)
const isCompleted = ref(false)
const progressLoading = ref(false)

watchEffect(async () => {
  if (user.value?.id && tutorial.value?.id) {
    const data = await $fetch('/api/tutorials/progress', {
      query: { userId: user.value.id, tutorialId: tutorial.value.id } // Transmis directement en String
    })
    isCompleted.value = data.completed
  }
})

const toggleProgress = async () => {
  if (!user.value?.id || !tutorial.value?.id) return
  progressLoading.value = true
  try {
    const data = await $fetch('/api/tutorials/progress', {
      method: 'POST',
      body: { userId: user.value.id, tutorialId: tutorial.value.id } // Transmis directement en String
    })
    isCompleted.value = data.completed
  } catch (err) {
    console.error("Erreur progression:", err)
  } finally {
    progressLoading.value = false
  }
}

// 3. GESTION DES COMMENTAIRES (Adaptée pour le Forum avec authorId et tutorialId en String)
const newCommentText = ref('')
const commentLoading = ref(false)

// Récupérer dynamiquement les commentaires associés au tutoriel actuel
const { data: comments, pending: commentsPending, refresh: refreshComments } = await useFetch('/api/comments', {
  query: { tutorialId: computed(() => tutorial.value?.id || '') }
})

// Soumettre le commentaire à l'API du Forum
const submitComment = async () => {
  if (!newCommentText.value.trim() || !user.value || !tutorial.value) return
  
  commentLoading.value = true
  try {
    await $fetch('/api/comments', {
      method: 'POST',
      body: {
        content: newCommentText.value,
        authorId: user.value.id,   // Envoi sous "authorId" pour ton système de forum
        userName: user.value.name,
        tutorialId: tutorial.value.id // Envoi direct en String
      }
    })
    newCommentText.value = '' // Vide le champ de saisie
    await refreshComments()   // Rafraîchit instantanément la zone de discussion !
  } catch (err) {
    console.error("Erreur lors de l'envoi du commentaire :", err)
  } finally {
    commentLoading.value = false
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