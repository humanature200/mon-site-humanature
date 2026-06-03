// composables/useAuth.ts
import { useState } from '#app'

interface UserSession {
  id: string
  name: string
  email: string
  role: string
}

export const useAuth = () => {
  // 1. On crée un cookie réactif nommé 'user-session' qui expire dans 7 jours
  const authCookie = useCookie<UserSession | null>('user-session', {
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  })

  // 2. On initialise l'état global partagé avec la valeur du cookie (si elle existe)
  const userState = useState<UserSession | null>('user', () => authCookie.value)

  // 3. Fonction pour enregistrer la session (appelée lors du Login ou Register)
  const setSession = (user: UserSession) => {
    authCookie.value = user
    userState.value = user
  }

  // 4. Fonction pour détruire la session (Déconnexion)
  const logout = () => {
    authCookie.value = null
    userState.value = null
  }

  return {
    user: computed(() => userState.value),
    isLoggedIn: computed(() => !!userState.value),
    isAdmin: computed(() => userState.value?.role === 'ADMIN'),
    setSession,
    logout
  }
}