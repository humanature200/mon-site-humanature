<template>
  <div class="min-h-screen bg-[#0b0f19] text-gray-300 font-sans antialiased">
    
    <header class="relative bg-[#111827] border-b border-gray-800/60 py-16 lg:py-24 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        <div class="lg:col-span-5 space-y-6 text-left">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-none">
            Devenez un <br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">développeur web.</span>
          </h1>
          <p class="text-gray-400 text-lg leading-relaxed max-w-md">
            Apprenez ou améliorez vos compétences grâce à des heures de formations et de tutoriels vidéos pas à pas.
          </p>
          
          <div class="flex flex-wrap gap-4 pt-2">
            <NuxtLink to="/courses" class="px-6 py-3 bg-[#2563eb] hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all duration-200 text-sm">
              Choisir mon cursus
            </NuxtLink>
            <NuxtLink to="/tutorials" class="px-6 py-3 bg-transparent hover:bg-white/5 text-blue-400 hover:text-blue-300 font-bold rounded-lg border border-blue-500/30 hover:border-blue-400/50 transition-all duration-200 text-sm">
              Voir les tutoriels
            </NuxtLink>
          </div>
        </div>
        
        <div class="lg:col-span-7 w-full">
          <div class="aspect-video w-full bg-[#1e293b]/40 rounded-xl border border-gray-800 shadow-2xl overflow-hidden relative group flex items-center justify-center">
            <div class="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-transparent to-transparent"></div>
            
            <div class="w-full h-full bg-[#0f172a] flex flex-col items-center justify-center relative">
              <span class="text-6xl filter drop-shadow-md opacity-80">👨‍💻</span>
              <div class="absolute bottom-4 left-4 bg-black/60 border border-gray-800 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs text-gray-400">
                Clone Grafikart - Workspace
              </div>
              
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-16 h-16 bg-white text-gray-900 rounded-full flex items-center justify-center pl-1 shadow-2xl group-hover:scale-110 transition duration-300 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
                    <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-16">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        <div class="lg:col-span-2 space-y-12">
          
          <section class="space-y-6">
            <h2 class="text-xl font-black text-white border-b border-gray-800 pb-3 flex items-center gap-2">
              🎓 Formations Complètes
            </h2>
            
            <div v-if="courses.length === 0" class="text-sm text-gray-500 bg-[#0f1423] p-6 rounded-xl border border-gray-800">
              Aucun parcours configuré. N'oublie pas de lancer <code class="bg-gray-900 px-1 text-emerald-400">npx prisma db seed</code>.
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="course in courses" :key="course.id" class="bg-[#0f1423] border border-gray-800/80 hover:border-blue-500/40 rounded-xl overflow-hidden transition group flex flex-col justify-between">
                <div class="p-5 space-y-2">
                  <span class="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Cursus</span>
                  <h3 class="text-base font-bold text-white group-hover:text-blue-400 transition">{{ course.title }}</h3>
                  <p class="text-gray-400 text-xs line-clamp-2 leading-relaxed">{{ course.description }}</p>
                </div>
                <div class="p-4 bg-gray-950/40 border-t border-gray-800/40 flex items-center justify-between text-xs text-gray-500">
                  <span>{{ course.tutorials?.length || 0 }} chapitres</span>
                  <span class="text-blue-400 group-hover:underline font-semibold">Découvrir →</span>
                </div>
              </div>
            </div>
          </section>

          <section class="space-y-6">
            <h2 class="text-xl font-black text-white border-b border-gray-800 pb-3">
              📺 Derniers Tutoriels Vidéos
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NuxtLink v-for="tutorial in tutorials" :key="tutorial.id" :to="`/tutorials/${tutorial.slug}`" class="bg-[#0f1423] border border-gray-800/60 hover:border-gray-700 rounded-xl overflow-hidden transition flex flex-col group">
                <div class="aspect-video w-full bg-gray-950 relative flex items-center justify-center text-gray-700 border-b border-gray-800/50">
                  <div class="w-full h-full bg-gradient-to-tr from-slate-900 to-slate-950 flex items-center justify-center text-3xl">🎬</div>
                  <span v-if="tutorial.duration" class="absolute bottom-2 right-2 bg-black/80 font-mono text-gray-400 text-[10px] px-1.5 py-0.5 rounded">
                    {{ tutorial.duration }} min
                  </span>
                </div>
                <div class="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <h3 class="text-sm font-bold text-gray-200 group-hover:text-blue-400 transition line-clamp-1">{{ tutorial.title }}</h3>
                  <p class="text-gray-400 text-xs line-clamp-2 leading-relaxed">{{ tutorial.description }}</p>
                </div>
              </NuxtLink>
            </div>
          </section>

        </div>

        <aside class="space-y-6">
          <div class="bg-[#0f1423] border border-gray-800 rounded-xl p-5 space-y-4 shadow-xl">
            <h3 class="text-xs font-black text-white uppercase tracking-wider border-b border-gray-800 pb-2">
              💬 Activité du Forum
            </h3>
            <div class="space-y-3">
              <div class="p-3 bg-gray-950/40 rounded-lg border border-gray-800/60 space-y-1">
                <div class="flex justify-between items-center text-[10px]">
                  <span class="font-bold text-blue-400">ADINDA adinda</span>
                  <span class="text-gray-500">Récemment</span>
                </div>
                <p class="text-gray-300 text-xs line-clamp-2">"Super cours sur Prisma, très utile pour le projet !"</p>
              </div>
              <div class="p-3 bg-gray-950/40 rounded-lg border border-gray-800/60 space-y-1">
                <div class="flex justify-between items-center text-[10px]">
                  <span class="font-bold text-indigo-400">Daniel Bizo</span>
                  <span class="text-gray-500">Hier</span>
                </div>
                <p class="text-gray-300 text-xs line-clamp-2">Quelqu'un a réussi à lier la table Progress de façon réactive ?</p>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </main>

  </div>
</template>

<script setup>
import { computed } from 'vue'

// 1. On appelle ta route existante pour récupérer tous les tutoriels !
const { data: tutorialsData, pending: pendingTutos } = await useFetch('/api/tutorials')

// 2. On extrait proprement la liste des tutoriels
const tutorials = computed(() => {
  // Si ta route retourne directement un tableau ou un objet contenant les données
  return Array.isArray(tutorialsData.value) ? tutorialsData.value : tutorialsData.value?.tutorials || []
})

// 3. Pour les formations, comme on n'a pas encore de route spécifique, 
// on va simuler un tableau vide ou une structure factice en attendant d'en créer une si besoin.
const courses = ref([
  {
    id: 1,
    title: "Devenir Développeur Full-Stack Nuxt 3",
    description: "Un cursus complet pour maîtriser le développement moderne de bout en bout avec Nuxt, Node.js et l'écosystème Prisma.",
    tutorials: { length: 5 }
  }
])

// 4. On appelle ta route existante pour les commentaires du forum
const { data: commentsData } = await useFetch('/api/comments')
const recentComments = computed(() => {
  return Array.isArray(commentsData.value) ? commentsData.value.slice(0, 5) : commentsData.value?.comments?.slice(0, 5) || []
})
</script>