import { useAuthStore } from '~/stores/auth'

// middleware/auth.global.ts
// Le suffixe ".global" fait tourner ce middleware sur CHAQUE navigation,
// y compris /login et /register (indispensable pour la redirection
// des utilisateurs déjà connectés, et pour restaurer la session au reload).

const PROTECTED_ROUTES = ['/dashboard']
const GUEST_ONLY_ROUTES = ['/login', '/register']

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()
  const nuxtApp = useNuxtApp()

  const isProtectedRoute = PROTECTED_ROUTES.includes(to.path)
  const isGuestOnlyRoute = GUEST_ONLY_ROUTES.includes(to.path)

  // Cas particulier : hydratation de la page initiale rendue côté serveur.
  // Le middleware a déjà tourné sur le serveur et le store Pinia a déjà été
  // restauré depuis le payload SSR à ce stade. Le relancer ici déclencherait
  // un DEUXIÈME appel réseau à /auth/refresh, qui est temporairement "non
  // authentifié" pendant son exécution -> flash /login puis retour au
  // dashboard, et header qui affiche brièvement les deux états à la fois.
  if (import.meta.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered) {
    return
  }

  // 1. Si pas encore authentifié en mémoire, tenter une restauration
  //    silencieuse de session via le cookie refresh_token (utile après
  //    un rechargement complet de page, le store Pinia étant vidé).
  if (!auth.isAuthenticated) {
    const { tryRefresh } = useAuthInit()
    await tryRefresh()
  }

  // 2. Route protégée + toujours pas authentifié après tentative -> login
  if (isProtectedRoute && !auth.isAuthenticated) {
    return navigateTo('/login')
  }

  // 3. Route réservée aux invités (login/register) + déjà authentifié -> dashboard
  if (isGuestOnlyRoute && auth.isAuthenticated) {
    return navigateTo('/dashboard')
  }
})
