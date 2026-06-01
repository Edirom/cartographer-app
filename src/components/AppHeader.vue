<template>
  <header class="navbar appHeader">
    <section class="navbar-section">
      <span class="navbar-brand mr-2">CartographerApp</span>
    </section>
    <section class="navbar-section">
      <template v-if="isAuthenticated">
        <img
          v-if="user && user.avatar_url"
          :src="user.avatar_url"
          class="gh-avatar mr-1"
          :alt="user.login"
        />
        <span class="mr-2 gh-username">{{ user && user.login }}</span>
        <button class="btn btn-sm mr-2" @click="logout" title="Log out of GitHub">
          <font-awesome-icon icon="fa-solid fa-user" /> Logout
        </button>
      </template>
      <template v-else>
        <button class="btn btn-sm btn-primary mr-2" @click="login" title="Sign in with GitHub">
          <font-awesome-icon icon="fa-solid fa-user" /> Login with GitHub
        </button>
      </template>
      <div class="input-group input-inline">
        <div class="button-group">
          <MainMenu/>
        </div>
      </div>
    </section>
  </header>
</template>

<script>
import MainMenu from '@/components/MainMenu.vue'

export default {
  name: 'AppHeader',
  components: { MainMenu },
  computed: {
    isAuthenticated () { return this.$store.getters['auth/isAuthenticated'] },
    user ()            { return this.$store.getters['auth/user'] },
  },
  methods: {
    login ()  { this.$store.dispatch('auth/login') },
    logout () { this.$store.dispatch('auth/logout') },
  },
}
</script>

<style lang="scss" scoped>
@import '@/css/_variables.scss';

.appHeader {
  height: $appHeaderHeight;
  background-color: $appColor;
  border-bottom: $thickBorder;
  box-sizing: border-box;

  .navbar-brand {
    padding-left: 1rem;
  }

  .button-group {
    padding-right: 0.4rem;

    a, button {
      color: $fontColorDark;
      border-color: $fontColorDark;
      margin-left: .3rem;
    }
  }

  .gh-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    vertical-align: middle;
  }

  .gh-username {
    font-size: 0.75rem;
    vertical-align: middle;
  }

  .btn-primary {
    color: white;
    border-color: white;
  }
}
</style>
