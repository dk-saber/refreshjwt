<script setup lang="ts">
const form = reactive({
  name: '',
  lastname: '',
  username: '',
  email: '',
  password: '',
  passwordConfirm: '',
  direction: '',
  department: '',
  role: 'USER'
})

const error = ref('')
const loading = ref(false)

const auth = useAuthStore()
const apiBase = useApiBase()

// Options pour les menus déroulants (à adapter selon vos besoins)
const roleOptions = [
  { label: 'Utilisateur', value: 'USER' },
  { label: 'Manager', value: 'MANAGER' },
  { label: 'Administrateur', value: 'ADMIN' }
]

const directionOptions = [
  { label: 'Direction Générale', value: 'DG' },
  { label: 'Direction Systèmes d\'Information', value: 'DSI' },
  { label: 'Direction Ressources Humaines', value: 'DRH' },
  { label: 'Direction Financière', value: 'DF' }
]

const departmentOptions = [
  { label: 'Infrastructure & Cloud', value: 'INFRA' },
  { label: 'Développement Web', value: 'DEV' },
  { label: 'Support & Maintenance', value: 'SUPPORT' },
  { label: 'Recrutement', value: 'RH_REC' }
]

async function onSubmit() {
  error.value = ''

  if (form.password !== form.passwordConfirm) {
    error.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  loading.value = true

  try {
    const data: any = await $fetch(`${apiBase}/auth/register`, {
      method: 'POST',
      credentials: 'include',
      body: {
        name: form.name,
        lastname: form.lastname,
        username: form.username,
        email: form.email,
        password: form.password,
        direction: form.direction,
        department: form.department,
        role: form.role
      }
    })

    auth.setSession(data.accessToken, data.user)
    await navigateTo('/dashboard')
  } catch (e: any) {
    error.value = e?.data?.message || 'Une erreur est survenue lors de l\'inscription.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 py-8">
    <UCard class="w-full max-w-2xl">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Créer un compte</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Remplissez vos informations professionnelles
          </p>
        </div>
      </template>

      <form @submit.prevent="onSubmit" class="space-y-6">
        <!-- Informations personnelles -->
        <div class="space-y-4">
          <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Identité</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField label="Prénom" required>
              <UInput
                v-model="form.name"
                placeholder="John"
                icon="i-lucide-user"
              />
            </UFormField>

            <UFormField label="Nom" required>
              <UInput
                v-model="form.lastname"
                placeholder="Doe"
                icon="i-lucide-user"
              />
            </UFormField>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField label="Nom d'utilisateur" required>
              <UInput
                v-model="form.username"
                placeholder="johndoe"
                icon="i-lucide-at-sign"
              />
            </UFormField>

            <UFormField label="Adresse email" required>
              <UInput
                v-model="form.email"
                type="email"
                placeholder="john.doe@company.com"
                icon="i-lucide-mail"
              />
            </UFormField>
          </div>
        </div>

        <USeparator />

        <!-- Organisation & Rôle -->
        <div class="space-y-4">
          <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Organisation</h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <UFormField label="Direction" required>
              <USelect
                v-model="form.direction"
                :items="directionOptions"
                placeholder="Sélectionner..."
                icon="i-lucide-building-2"
              />
            </UFormField>

            <UFormField label="Département" required>
              <USelect
                v-model="form.department"
                :items="departmentOptions"
                placeholder="Sélectionner..."
                icon="i-lucide-briefcase"
              />
            </UFormField>

            <UFormField label="Rôle" required>
              <USelect
                v-model="form.role"
                :items="roleOptions"
                icon="i-lucide-users"
              />
            </UFormField>
          </div>
        </div>

        <USeparator />

        <!-- Sécurité -->
        <div class="space-y-4">
          <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sécurité</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField label="Mot de passe" required>
              <UInput
                v-model="form.password"
                type="password"
                placeholder="••••••••"
                icon="i-lucide-lock"
              />
            </UFormField>

            <UFormField label="Confirmer le mot de passe" required>
              <UInput
                v-model="form.passwordConfirm"
                type="password"
                placeholder="••••••••"
                icon="i-lucide-shield-check"
              />
            </UFormField>
          </div>
        </div>

        <p v-if="error" class="text-sm text-red-600 dark:text-red-400">
          {{ error }}
        </p>

        <UButton
          type="submit"
          block
          color="primary"
          size="lg"
          :loading="loading"
        >
          Créer mon compte
        </UButton>
      </form>

      <template #footer>
        <p class="text-xs text-center text-gray-500 dark:text-gray-400">
          Vous avez déjà un compte ?
          <NuxtLink to="/login" class="text-primary-600 font-medium hover:underline">
            Se connecter
          </NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>