<template>
  <div class="flex-1 flex flex-col items-center justify-center p-4">
    
    <div v-if="isLoggedIn" class="w-full max-w-4xl space-y-6 my-8">
      <div class="flex justify-between items-center bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
        <div>
          <p class="text-gray-400 text-sm">Ravi de vous revoir,</p>
          <h2 class="text-2xl font-bold text-white">{{ user?.name }}</h2>
        </div>
        <div class="flex items-center gap-4">
          <span class="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-900/50 text-emerald-300 border border-emerald-700">
            {{ user?.role }}
          </span>
          <button @click="logout" class="bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 text-sm font-medium py-1.5 px-4 rounded transition duration-200">
            Déconnexion
          </button>
        </div>
      </div>

      <div>
        <h3 class="text-xl font-bold text-emerald-400 mb-4">Vos Tutoriels Vidéos</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="tuto in tutorials" :key="tuto.id" class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-md hover:border-emerald-500/50 transition duration-300">
            <div class="p-6 space-y-3">
              <span class="text-xs font-mono text-emerald-400 uppercase tracking-widest">Tutoriel</span>
              <h4 class="text-lg font-bold text-white">{{ tuto.title }}</h4>
              <p class="text-gray-400 text-sm line-clamp-2">{{ tuto.description }}</p>
              <div class="pt-2">
                <button class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded text-sm transition duration-200">
                  Voir le cours →
                </button>
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
import { useAuth } from '../composables/useAuth' // Chemin ajusté suite au déplacement !

const auth = useAuth()
const isLoggedIn = computed(() => auth.isLoggedIn.value)
const user = computed(() => auth.user.value)
const logout = auth.logout

const currentTab = ref('login')
const loginForm = ref({ email: '', password: '' })
const registerForm = ref({ name: '', email: '', password: '' })
const response = ref(null)

const { data: tutorials } = await useFetch('/api/tutorials', {
  lazy: true,
  default: () => []
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
</script>