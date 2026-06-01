<template>
  <div class="auth-callback">
    <div v-if="error" class="toast toast-error" style="max-width: 480px;">
      <font-awesome-icon icon="fa-solid fa-user" class="mr-1" />
      Authentication failed: {{ error }}
      <a href="/" class="btn btn-link ml-2">Go home</a>
    </div>
    <div v-else style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
      <div class="loading loading-lg"></div>
      <span>Authenticating with GitHub…</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthCallback',
  data: () => ({ error: null }),
  async mounted () {
    const code = this.$route.query.code
    if (!code) {
      this.error = 'No authorization code received from GitHub.'
      return
    }
    try {
      await this.$store.dispatch('auth/authenticate', code)
      this.$router.push('/')
    } catch (e) {
      this.error = e.message
    }
  },
}
</script>

<style scoped>
.auth-callback {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
