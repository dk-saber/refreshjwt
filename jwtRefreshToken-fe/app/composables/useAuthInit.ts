import { useAuthStore } from '~/stores/auth'

// composables/useAuthInit.ts
export function useAuthInit() {
  const apiBase = useApiBase()
  const auth = useAuthStore()
  const event = useRequestEvent()

  async function tryRefresh(): Promise<boolean> {
    try {
      const headers = new Headers()

      // En SSR, on transfère les cookies du navigateur au backend
      if (import.meta.server && event) {
        const reqCookie = getRequestHeader(event, 'cookie')
        if (reqCookie) headers.set('cookie', reqCookie)
      }

      // 1. Appel du refresh token
      const refreshData = await $fetch<{ accessToken: string }>(`${apiBase}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers
      })

      if (!refreshData?.accessToken) return false

      // 2. Récupération du profil utilisateur
      const userProfile = await $fetch<{ user: Record<string, any> }>(`${apiBase}/profile/me`, {
        headers: {
          ...Object.fromEntries(headers.entries()),
          Authorization: `Bearer ${refreshData.accessToken}`
        }
      })

      // 3. Mise à jour du store Pinia (l'API renvoie { user }, il faut le déballer)
      auth.setSession(refreshData.accessToken, userProfile.user)
      return true
    } catch {
      auth.clearSession()
      return false
    }
  }

  return { tryRefresh }
}