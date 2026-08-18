<script setup lang="ts">
const auth = useAuthStore()
const route = useRoute()

// Liens de navigation
const navItems = computed(() => [
  {
    label: 'Accueil',
    to: '/',
    icon: 'i-lucide-home',
    active: route.path === '/'
  },
  ...(auth.isAuthenticated
    ? [
        {
          label: 'Dashboard',
          to: '/dashboard',
          icon: 'i-lucide-layout-dashboard',
          active: route.path === '/dashboard'
        }
      ]
    : [])
])

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
  <UHeader title="Mon Application">
    <template #left>
      <NuxtLink to="/" class="flex items-center gap-2 font-bold text-lg text-gray-900 dark:text-white">
        <UIcon name="i-lucide-shield-check" class="w-6 h-6 text-primary-500" />
        <span>AuthApp</span>
      </NuxtLink>
    </template>

    <!-- Navigation principale -->
    <UNavigationMenu :items="navItems" />

    <template #right>
      <!-- Mode sombre / clair -->
      <UColorModeButton />

      <!-- Si l'utilisateur est connecté -->
      <template v-if="auth.isAuthenticated">
        <UDropdownMenu
          :items="[
            [
              {
                label: auth.user?.email || 'Mon profil',
                slot: 'account',
                disabled: true
              }
            ],
            [
              {
                label: 'Tableau de bord',
                icon: 'i-lucide-layout-dashboard',
                to: '/dashboard'
              }
            ],
            [
              {
                label: 'Déconnexion',
                icon: 'i-lucide-log-out',
                onSelect: handleLogout
              }
            ]
          ]"
          :content="{ align: 'end' }"
        >
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-user"
            trailing-icon="i-lucide-chevron-down"
          >
            {{ auth.user?.name || 'Compte' }}
          </UButton>

          <template #account>
            <div class="text-left">
              <p class="text-xs text-gray-500 dark:text-gray-400">Connecté en tant que</p>
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ auth.user?.email }}
              </p>
            </div>
          </template>
        </UDropdownMenu>
      </template>

      <!-- Si l'utilisateur N'EST PAS connecté -->
      <template v-else>
        <UButton
          to="/login"
          color="neutral"
          variant="ghost"
          icon="i-lucide-log-in"
        >
          Se connecter
        </UButton>
        <UButton
          to="/register"
          color="primary"
          icon="i-lucide-user-plus"
        >
          S'inscrire
        </UButton>
      </template>
    </template>
  </UHeader>
</template>