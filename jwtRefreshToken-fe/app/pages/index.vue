<script setup lang="ts">
const auth = useAuthStore()

// Boutons dynamiques selon l'état de connexion de l'utilisateur
const heroLinks = computed(() => {
  if (auth.isAuthenticated) {
    return [
      {
        label: 'Accéder au Dashboard',
        to: '/dashboard',
        trailingIcon: 'i-lucide-arrow-right',
        size: 'xl'
      }
    ]
  }

  return [
    {
      label: 'Se connecter',
      to: '/login',
      trailingIcon: 'i-lucide-arrow-right',
      size: 'xl'
    },
    {
      label: 'Créer un compte',
      to: '/register',
      icon: 'i-lucide-user-plus',
      size: 'xl',
      color: 'neutral',
      variant: 'subtle'
    }
  ]
})
</script>

<template>
  <div>
    <UPageHero
      title="Plateforme de Gestion d'Accès"
      description="Interface sécurisée avec authentification JWT, renouvellement automatique du token et gestion des rôles."
      :links="heroLinks"
    />

    <UPageSection
      id="features"
      title="Fonctionnalités de l'application"
      description="Une architecture robuste construite avec Nuxt 3, Pinia et Nuxt UI."
      :features="[
        {
          icon: 'i-lucide-shield-check',
          title: 'Authentification JWT',
          description: 'Gestion sécurisée des tokens d\'accès en mémoire et refresh tokens via cookies HTTP-only.'
        },
        {
          icon: 'i-lucide-refresh-cw',
          title: 'Auto-refresh silencieux',
          description: 'Renouvellement automatique de la session sans interruption pour l\'utilisateur.'
        },
        {
          icon: 'i-lucide-users',
          title: 'Gestion des profils',
          description: 'Attribution des directions, départements et rôles (USER, MANAGER, ADMIN).'
        },
        {
          icon: 'i-lucide-lock',
          title: 'Middlewares de route',
          description: 'Protection stricte des pages réservées aux membres authentifiés.'
        }
      ]"
    />

    <UPageSection>
      <UPageCTA
        title="Prêt à commencer ?"
        description="Connectez-vous à votre espace de travail ou créez un compte."
        variant="subtle"
        :links="heroLinks"
      />
    </UPageSection>
  </div>
</template>