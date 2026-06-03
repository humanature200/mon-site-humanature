<template>
  <div class="flex-1 flex flex-col items-center justify-center p-4">
    
    <div v-if="isLoggedIn" class="w-full max-w-4xl space-y-8 my-8">
      
      <div class="flex justify-between items-center bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
        <div>
          <p class="text-gray-400 text-sm">Ravi de vous revoir,</p>
          <h2 class="text-2xl font-bold text-white">{{ user?.name }}</h2>
        </div>
        <div class="flex items-center gap-4">
          <span class="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
            :class="isAdmin ? 'bg-amber-900/50 text-amber-300 border border-amber-700' : 'bg-emerald-900/50 text-emerald-300 border border-emerald-700'">
            {{ user?.role }}
          </span>
          <button @click="logout" class="bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 text-sm font-medium py-1.5 px-4 rounded transition duration-200">
            Déconnexion
          </button>
        </div>
      </div>

      <div v-if="isAdmin || user?.role === 'USER'" class="bg-gray-800 p-6 rounded-lg border border-amber-500/30 shadow-lg space-y-4">
        <h3 class="text-xl font-bold text-amber-400 flex items-center gap-2">
          <span>🛠️</span> Espace Administration : Ajouter un Cours
        </h3>
        
        <form @submit.prevent="handleCreateTutorial" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">Titre du tutoriel</label>
              <input v-model="tutoForm.title" type="text" placeholder="Ex: Maîtriser les composants Vue" class="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-amber-500" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">Lien de la vidéo (Optionnel)</label>
              <input v-model="tutoForm.videoUrl" type="text" placeholder="Ex: https://youtube.com/..." class="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-amber-500" />
            </div>
          </div>
          
          <div class="flex flex-col justify-between">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea v-model="tutoForm.description" rows="4" placeholder="De quoi parle ce cours vidéo..." class="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-amber-500 resize-none" required></textarea>
            </div>
            <button type="submit" class="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-2 px-4 rounded transition duration-200">
              Publier le tutoriel sur HumaNature
            </button>
          </div>
        </form>

        <div v-if="adminResponse" class="p-3 rounded text-sm text-center bg-amber-900/40 text-amber-300 border border-amber-700">
          {{ adminResponse }}
        </div>
      </div>

      <div>
        <h3 class="text-xl font-bold text-emerald-400 mb-4">Vos Tutoriels Vidéos</h3>
        
        <div v-if="tutorials.length === 0" class="text-gray-400 bg-gray-800 p-6 rounded-lg text-center border border-gray-700">
          Aucun cours n'est disponible pour le moment.
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="tuto in tutorials" :key="tuto.id" class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-md hover:border-emerald-500/50 transition duration-300">
            <div class="p-6 space-y-3">
  <div class="flex justify-between items-center">
    <span class="text-xs font-mono text-emerald-400 uppercase tracking-widest">Tutoriel</span>
    <span v-if="tuto.isCompleted" class="bg-emerald-900/60 text-emerald-400 border border-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
      ✅ Terminé
    </span>
  </div>
              <h4 class="text-lg font-bold text-white">{{ tuto.title }}</h4>
              <p class="text-gray-400 text-sm line-clamp-2">{{ tuto.description }}</p>
              <div class="pt-2">
                <NuxtLink 
  :to="`/tutorials/${tuto.slug}`" 
  class="block w-full text-center bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded text-sm transition duration-200"
>
  Voir le cours →
</NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
      <h1 class="text-3xl font-bold text-center text-emerald-400 mb-2">HumaNature</h1>
      
      <div class="flex border-b border-gray-700 mb-6">
        <button @click="currentTab = 'login'; response = null" type="button" class="w-1/2 py-2 text-center font-medium border-b-2 transition-colors" :class="currentTab === 'login' ? 'text-emerald-400 border-emerald-400' : 'text-gray-400 border-transparent hover:text-gray-200'">
          Se connecter
        </button>
        <button @click="currentTab = 'register'; response = null" type="button" class="w-1/2 py-2 text-center font-medium border-b-2 transition-colors" :class="currentTab === 'register' ? 'text-emerald-400 border-emerald-400' : 'text-gray-400 border-transparent hover:text-gray-200'">
          S'inscrire
        </button>
      </div>

      <form v-if="currentTab === 'login'" @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Adresse Email</label>
          <input v-model="loginForm.email" type="email" placeholder="nom@exemple.com" class="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-emerald-500" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Mot de passe</label>
          <input v-model="loginForm.password" type="password" placeholder="••••••••" class="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-emerald-500" required />
        </div>
        <button type="submit" class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded transition duration-200">Se connecter</button>
      </form>

      <form v-if="currentTab === 'register'" @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Nom complet</label>
          <input v-model="registerForm.name" type="text" placeholder="John Doe" class="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-emerald-500" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Adresse Email</label>
          <input v-model="registerForm.email" type="email" placeholder="nom@exemple.com" class="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-emerald-500" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Mot de passe</label>
          <input v-model="registerForm.password" type="password" placeholder="••••••••" class="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-emerald-500" required />
        </div>
        <button type="submit" class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded transition duration-200">S'inscrire</button>
      </form>

      <div v-if="response" class="mt-4 p-3 rounded text-sm text-center" :class="response.status === 'success' ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700' : 'bg-rose-900/50 text-rose-300 border border-rose-700'">
        {{ response.message }}
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '../composables/useAuth'

const auth = useAuth()
const isLoggedIn = computed(() => auth.isLoggedIn.value)
const isAdmin = computed(() => auth.isAdmin.value)
const user = computed(() => auth.user.value)
const logout = auth.logout

// Formulaires Authentification
const currentTab = ref('login')
const loginForm = ref({ email: '', password: '' })
const registerForm = ref({ name: '', email: '', password: '' })
const response = ref(null)

// Formulaire Administration
const tutoForm = ref({ title: '', description: '', videoUrl: '' })
const adminResponse = ref(null)

// On passe dynamiquement le userId pour charger les états "Terminé"
const { data: tutorials, refresh } = await useFetch('/api/tutorials', {
  query: { userId: computed(() => user.value?.id || '') }
})

const handleLogin = async () => {
  response.value = null
  try {
    const data = await $fetch('/api/auth/login', { method: 'POST', body: loginForm.value })
    auth.setSession(data.user)
  } catch (error) {
    response.value = { status: 'error', message: error.statusMessage || "Email ou mot de passe incorrect." }
  }
}

const handleRegister = async () => {
  response.value = null
  try {
    const data = await $fetch('/api/auth/register', { method: 'POST', body: registerForm.value })
    auth.setSession(data.user)
    registerForm.value = { name: '', email: '', password: '' }
  } catch (error) {
    response.value = { status: 'error', message: error.statusMessage || "Une erreur est survenue." }
  }
}

// Soumission du nouveau tutoriel
const handleCreateTutorial = async () => {
  adminResponse.value = null
  try {
    await $fetch('/api/tutorials', {
      method: 'POST',
      body: tutoForm.value
    })
    
    adminResponse.value = "Tutoriel publié avec succès !"
    tutoForm.value = { title: '', description: '', videoUrl: '' }
    
    // ✅ CORRIGÉ ICI : On utilise "refresh" (le même nom que dans ton useFetch plus haut)
    await refresh()
  } catch (error) {
    adminResponse.value = error.statusMessage || "Erreur lors de l'ajout."
  }
}
</script>