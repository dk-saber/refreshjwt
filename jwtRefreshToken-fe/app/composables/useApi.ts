// composables/useApi.ts
export function useApi() {
  const apiBase = useApiBase()
  const auth = useAuthStore()

  async function request<T = any>(path: string, options: any = {}): Promise<T | null> {
    const res = await $fetch.raw(`${apiBase}${path}`, {
      ...options,
      credentials: 'include', // indispensable pour envoyer/recevoir le cookie refresh_token
      headers: {
        ...options.headers,
        ...(auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {})
      },
      ignoreResponseError: true
    })

    if (res.status === 401 && path !== '/auth/refresh') {
      const refreshed = await tryRefresh()
      if (refreshed) {
        return request<T>(path, options) // on rejoue la requête initiale
      }
      auth.clearSession()
      await navigateTo('/login')
      return null
    }

    return res._data as T
  }

  async function tryRefresh(): Promise<boolean> {
    try {
      const data = await $fetch<{ accessToken: string }>(`${apiBase}/auth/refresh`, {
        method: 'POST',
        credentials: 'include'
      })
      auth.accessToken = data.accessToken
      return true
    } catch {
      return false
    }
  }

  return { request }
}
