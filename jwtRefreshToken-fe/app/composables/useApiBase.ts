// composables/useApiBase.ts
//
// Résout l'URL de base de l'API backend selon le contexte d'exécution :
// - côté serveur (SSR, à l'intérieur du conteneur Nuxt) -> config.apiBase
//   (privée), qui pointe vers le nom du service Docker (ex: http://api:5000/api)
// - côté client (navigateur) -> config.public.apiBase, une URL publique
//   joignable depuis la machine de l'utilisateur (ex: http://localhost:5000/api)
export function useApiBase(): string {
  const config = useRuntimeConfig()
  return import.meta.server ? config.apiBase : config.public.apiBase
}
