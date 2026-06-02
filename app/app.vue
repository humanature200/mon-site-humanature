<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
      
      <h1 class="text-3xl font-bold text-center text-emerald-400 mb-2">HumaNature</h1>
      <p class="text-gray-400 text-center text-sm mb-6">Créer votre compte étudiant</p>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Nom complet</label>
          <input 
            v-model="form.name"
            type="text" 
            placeholder="John Doe" 
            class="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Adresse Email</label>
          <input 
            v-model="form.email"
            type="email" 
            placeholder="nom@exemple.com" 
            class="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Mot de passe</label>
          <input 
            v-model="form.password"
            type="password" 
            placeholder="••••••••" 
            class="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-emerald-500"
            required
          />
        </div>

        <button 
          type="submit" 
          class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
        >
          S'inscrire
        </button>
      </form>

      <div v-if="response" class="mt-4 p-3 rounded text-sm text-center" :class="response.status === 'success' ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700' : 'bg-rose-900/50 text-rose-300 border border-rose-700'">
        {{ response.message }}
        <pre v-if="response.user" class="text-left bg-gray-900 p-2 rounded mt-2 text-xs overflow-x-auto">{{ JSON.stringify(response.user, null, 2) }}</pre>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// L'état du formulaire réactif
const form = ref({
  name: '',
  email: '',
  password: ''
})

// Stockage de la réponse de l'API
const response = ref(null)

// Fonction déclenchée à la soumission du formulaire
const handleRegister = async () => {
  response.value = null
  
  try {
    // Utilisation de $fetch (méthode native de Nuxt 3 pour interroger l'API)
    const data = await $fetch('/api/auth/register', {
      method: 'POST',
      body: form.value
    })

    response.value = {
      status: 'success',
      message: 'Compte créé avec succès !',
      user: data.user
    }

    // On vide les champs du formulaire après le succès
    form.value = { name: '', email: '', password: '' }

  } catch (error) {
    response.value = {
      status: 'error',
      message: error.statusMessage || "Une erreur est survenue lors de l'envoi."
    }
  }
}
</script>