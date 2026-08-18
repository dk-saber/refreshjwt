<script setup lang="ts">
const { request } = useApi()
const auth = useAuthStore()

// Utilisation de useAsyncData pour un fetch SSR-safe et optimisé
const { data: profile, pending, error } = await useAsyncData('user-profile', () =>
  request<{
    user: {
      name: string
      lastname: string
      username: string
      email: string
      role: string
      department: string
      direction: string
    }
  }>('/profile/me')
)

// Récupération dynamique depuis le profile API ou depuis le store Pinia en fallback
const currentUser = computed(() => profile.value?.user || auth.user)

async function handleLogout() {
  const apiBase = useApiBase()
  try {
    await $fetch(`${apiBase}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    })
  } catch (e) {
    console.error('Erreur lors de la déconnexion:', e)
  } finally {
    auth.clearSession()
    await navigateTo('/login')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-8">
    <div class="max-w-5xl mx-auto space-y-6">
      
      <!-- En-tête du Dashboard -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-4">
          <UAvatar
            :alt="currentUser?.name || 'User'"
            size="lg"
            :chip="{ color: 'success', inset: true }"
          />
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              Bonjour, {{ currentUser?.name }} {{ currentUser?.lastname }}
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ currentUser?.role }} — {{ currentUser?.department }} ({{ currentUser?.direction }})
            </p>
          </div>
        </div>

        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-log-out"
          @click="handleLogout"
        >
          Déconnexion
        </UButton>
      </div>

      <!-- État de chargement -->
      <div v-if="pending" class="space-y-4">
        <USkeleton class="h-32 w-full" />
      </div>

      <!-- État d'erreur -->
      <UAlert
        v-else-if="error"
        icon="i-lucide-triangle-alert"
        color="error"
        variant="soft"
        title="Impossible de charger le profil"
        description="Une erreur est survenue lors de la récupération de vos données."
      />

      <!-- Contenu principal -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Fiche d'information -->
        <UCard class="md:col-span-1">
          <template #header>
            <h2 class="font-semibold text-gray-900 dark:text-white">Informations système</h2>
          </template>
          
          <dl class="space-y-3 text-sm">
            <div>
              <dt class="text-gray-500 dark:text-gray-400">Nom d'utilisateur</dt>
              <dd class="font-medium text-gray-900 dark:text-white">@{{ currentUser?.username }}</dd>
            </div>
            <div>
              <dt class="text-gray-500 dark:text-gray-400">Email professionnel</dt>
              <dd class="font-medium text-gray-900 dark:text-white">{{ currentUser?.email }}</dd>
            </div>
            <div>
              <dt class="text-gray-500 dark:text-gray-400">Direction</dt>
              <dd class="font-medium text-gray-900 dark:text-white">{{ currentUser?.direction }}</dd>
            </div>
          </dl>
        </UCard>

        <!-- Espace de travail principal (Placeholder) -->
        <UCard class="md:col-span-2">
          <template #header>
            <h2 class="font-semibold text-gray-900 dark:text-white">Espace de travail</h2>
          </template>
          
          <div class="py-12 text-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
            <UIcon name="i-lucide-layout-grid" class="w-10 h-10 mx-auto text-gray-400 mb-2" />
            <p>Bienvenue dans votre tableau de bord.</p>
            <p class="text-xs mt-1">Vous pouvez commencer à intégrer vos fonctionnalités ici.</p>
          </div>
        </UCard>

      </div>

    </div>
  </div>
</template>