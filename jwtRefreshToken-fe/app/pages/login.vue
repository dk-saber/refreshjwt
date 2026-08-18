<script setup lang="ts">
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const auth = useAuthStore()
const apiBase = useApiBase()

async function onSubmit() {
  error.value = ''
  loading.value = true

  try {
    const data: any = await $fetch(`${apiBase}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      body: { email: email.value, password: password.value }
    })
    auth.setSession(data.accessToken, data.user)
    await navigateTo('/dashboard')
  } catch (e: any) {
    error.value = e?.data?.message || 'Erreur de connexion'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <UCard class="w-full max-w-sm">
      <template #header>
        <h1 class="text-xl font-semibold text-gray-900">Connexion</h1>
      </template>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <UFormField label="Email">
          <UInput
            v-model="email"
            type="email"
            placeholder="votre@email.com"
            icon="i-lucide-mail"
            required
          />
        </UFormField>

        <UFormField label="Mot de passe">
          <UInput
            v-model="password"
            type="password"
            placeholder="••••••••"
            icon="i-lucide-lock"
            required
          />
        </UFormField>

        <p v-if="error" class="text-sm text-red-600">
          {{ error }}
        </p>

        <UButton
          type="submit"
          block
          color="primary"
          :loading="loading"
        >
          Se connecter
        </UButton>
      </form>
    </UCard>
  </div>
</template>