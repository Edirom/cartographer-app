<template>
  <div class="auth-callback">
    <div v-if="error" class="toast toast-error" style="max-width: 480px;">
      <font-awesome-icon icon="fa-solid fa-user" class="mr-1" />
      Authentication failed: {{ error }}
      <router-link :to="{ name: 'home' }" class="btn btn-link ml-2">Go home</router-link>
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
    const state = this.$route.query.state
    if (!code) {
      this.error = 'No authorization code received from GitHub.'
      return
    }
    if (!state) {
      this.error = 'Missing OAuth state; cannot validate the callback.'
      return
    }
    const expectedState = sessionStorage.getItem('gh_oauth_state')
    sessionStorage.removeItem('gh_oauth_state')
    if (!expectedState || state !== expectedState) {
      this.error = 'OAuth state mismatch. Possible CSRF attempt or expired login session.'
      return
    }
    try {
      await this.$store.dispatch('auth/authenticate', code)
      this.$router.push('/')
    } catch (e) {
      const msg = e.message || ''
      const isNetwork = msg.toLowerCase().includes('failed to fetch') ||
                        msg.toLowerCase().includes('networkerror') ||
                        msg.toLowerCase().includes('load failed')
      this.error = isNetwork
        ? 'Cannot reach the authentication proxy. Make sure you started it with `npm run dev` (or `node node-ghcred/server.js` in a separate terminal).'
        : msg
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
