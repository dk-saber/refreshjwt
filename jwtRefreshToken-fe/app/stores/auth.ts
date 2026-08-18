// stores/auth.ts
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | Record<string, any>,
    accessToken: null as string | null
  }),
  getters: {
    isAuthenticated: (state) => !!state.accessToken
  },
  actions: {
    setSession(accessToken: string, user: any) {
      this.accessToken = accessToken
      this.user = user
    },
    clearSession() {
      this.accessToken = null
      this.user = null
    }
  }
})