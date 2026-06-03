<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
      
      <h1 class="text-3xl font-bold text-center text-emerald-400 mb-2">HumaNature</h1>

      <div v-if="isLoggedIn" class="text-center space-y-6 py-4">
        <div class="space-y-2">
          <p class="text-gray-400">Ravi de vous revoir,</p>
          <h2 class="text-2xl font-semibold text-white">{{ user?.name }}</h2>
          <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
            :class="isAdmin ? 'bg-amber-900/50 text-amber-300 border border-amber-700' : 'bg-emerald-900/50 text-emerald-300 border border-emerald-700'">
            Espace {{ user?.role }}
          </span>
        </div>

        <p class="text-sm text-gray-400 bg-gray-900 p-3 rounded border border-gray-700">
          Votre session est active. Vous pouvez maintenant naviguer sur les cours ou accéder aux fonctionnalités.
        </p>

        <button 
          @click="logout"
          type="button"
          class="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
        >
          Se déconnecter
        </button>
      </div>

      <div v-else>
        <div class="flex border-b border-gray-700 mb-6">
          <button 
            @click="currentTab = 'login'; response = null"
            type="button"
            class="w-1/2 py-2 text-center font-medium border-b-2 transition-colors"
            :class="currentTab === 'login' ? 'text-emerald-400 border-emerald-400' : 'text-gray-400 border-transparent hover:text-gray-200'"
          >
            Se connecter
          </button>
          <button 
            @click="currentTab = 'register'; response = null"
            type="button"
            class="w-1/2 py-2 text-center font-medium border-b-2 transition-colors"
            :class="currentTab === 'register' ? 'text-emerald-400 border-emerald-400' : 'text-gray-400 border-transparent hover:text-gray-200'"
          >
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
          <button type="submit" class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded transition duration-200">
            Se connecter
          </button>
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
          <button type="submit" class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded transition duration-200">
            S'inscrire
          </button>
        </form>

        <div v-if="response" class="mt-4 p-3 rounded text-sm text-center" :class="response.status === 'success' ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700' : 'bg-rose-900/50 text-rose-300 border border-rose-700'">
          {{ response.message }}
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from './composables/useAuth'

// On extrait nos variables et méthodes globales du composable auth
const { user, isLoggedIn, isAdmin, setSession, logout } = useAuth()

const currentTab = ref('login')
const loginForm = ref({ email: '', password: '' })
const registerForm = ref({ name: '', email: '', password: '' })
const response = ref(null)

const handleLogin = async () => {
  response.value = null
  try {
    const data = await $fetch('/api/auth/login', {
      method: 'POST',
      body: loginForm.value
    })

    // On stocke l'utilisateur dans la session globale (Cookie + State) !
    setSession(data.user)

  } catch (error) {
    response.value = {
      status: 'error',
      message: error.statusMessage || "Email ou mot de passe incorrect."
    }
  }
}

const handleRegister = async () => {
  response.value = null
  try {
    const data = await $fetch('/api/auth/register', {
      method: 'POST',
      body: registerForm.value
    })

    // On connecte automatiquement l'utilisateur juste après son inscription !
    setSession(data.user)
    registerForm.value = { name: '', email: '', password: '' }

  } catch (error) {
    response.value = {
      status: 'error',
      message: error.statusMessage || "Une erreur est survenue à l'inscription."
    }
  }
}
</script>