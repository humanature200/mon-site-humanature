<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full bg-[#0f1423] border border-gray-800 rounded-xl p-8 shadow-2xl space-y-6">
      
      <div class="text-center space-y-2">
        <h2 class="text-2xl font-black text-white tracking-tight">Créer un compte</h2>
        <p class="text-sm text-gray-400">Rejoignez la communauté et suivez votre progression.</p>
      </div>

      <div v-if="errorMessage" class="p-3 bg-red-950/50 border border-red-500/30 rounded-lg text-xs text-red-400">
        ⚠️ {{ errorMessage }}
      </div>

      <form @submit.prevent="handleRegisterSubmit" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Nom / Pseudo</label>
          <input 
            v-model="name" 
            type="text" 
            required
            placeholder="John Doe"
            class="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition"
          />
        </div>

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
          {{ loading ? 'Création en cours...' : "S'inscrire" }}
        </button>
      </form>

      <div class="text-center text-xs text-gray-500">
        Déjà inscrit ? 
        <NuxtLink to="/auth/login" class="text-blue-400 hover:underline">Se connecter</NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const { setSession } = useAuth()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

const handleRegisterSubmit = async () => {
  errorMessage.value = ''
  loading.value = true
  try {
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: { name: name.value, email: email.value, password: password.value }
    })

    if (response.status === 'success' && response.user) {
      // Une fois inscrit, on connecte directement l'utilisateur
      setSession(response.user)
      router.push('/')
    }
  } catch (err) {
    errorMessage.value = err.statusMessage || "Erreur lors de l'inscription."
  } finally {
    loading.value = false
  }
}
</script>