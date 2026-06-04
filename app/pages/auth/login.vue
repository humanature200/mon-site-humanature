<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full bg-[#0f1423] border border-gray-800 rounded-xl p-8 shadow-2xl space-y-6">
      
      <div class="text-center space-y-2">
        <h2 class="text-2xl font-black text-white tracking-tight">Connexion</h2>
        <p class="text-sm text-gray-400">Heureux de vous revoir ! Accédez à vos tutoriels.</p>
      </div>

      <div v-if="errorMessage" class="p-3 bg-red-950/50 border border-red-500/30 rounded-lg text-xs text-red-400">
        ⚠️ {{ errorMessage }}
      </div>

      <form @submit.prevent="handleLoginSubmit" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Adresse Email</label>
          <input 
            v-model="email" 
            type="email" 
            required
            placeholder="exemple@mail.com"
            class="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Mot de passe</label>
          <input 
            v-model="password" 
            type="password" 
            required
            placeholder="••••••••"
            class="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <button 
          type="submit"
          :disabled="loading"
          class="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold text-sm rounded-lg transition shadow-lg shadow-blue-600/20"
        >
          {{ loading ? 'Connexion en cours...' : 'Se connecter' }}
        </button>
      </form>

      <div class="text-center text-xs text-gray-500">
        Pas encore de compte ? 
        <NuxtLink to="/auth/register" class="text-blue-400 hover:underline">S'inscrire</NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const { setSession } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

const handleLoginSubmit = async () => {
  errorMessage.value = ''
  loading.value = true
  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })

    if (response.status === 'success' && response.user) {
      setSession(response.user)
      router.push('/')
    }
  } catch (err) {
    errorMessage.value = err.statusMessage || "Identifiants incorrects (Vérifiez votre email/mot de passe)."
  } finally {
    loading.value = false
  }
}
</script>