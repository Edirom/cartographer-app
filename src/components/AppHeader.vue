<template>
  <header class="navbar appHeader">
    <section class="navbar-section">
      <span class="navbar-brand mr-2">CartographerApp</span>
    </section>
    <section class="navbar-section">
      <template v-if="isAuthenticated">
        <!-- Profile dropdown -->
        <div class="dropdown dropdown-right gh-user-dropdown" :class="{ active: menuOpen }">
          <a
            class="dropdown-toggle gh-profile-toggle"
            tabindex="0"
            @click.prevent="menuOpen = !menuOpen"
            @keydown.enter.prevent="menuOpen = !menuOpen"
          >
            <img
              v-if="user && user.avatar_url"
              :src="user.avatar_url"
              class="gh-avatar"
              :alt="user.login"
            />
            <span class="gh-username ml-1">{{ user && user.login }}</span>
            <i class="icon icon-caret ml-1"></i>
          </a>
          <ul class="menu" @mousedown.prevent>
            <li class="menu-item menu-item-static">
              <div class="tile tile-centered">
                <div class="tile-icon">
                  <img
                    v-if="user && user.avatar_url"
                    :src="user.avatar_url"
                    class="gh-avatar-lg"
                    :alt="user.login"
                  />
                </div>
                <div class="tile-content">
                  <div class="tile-title">{{ user && user.name }}</div>
                  <div class="tile-subtitle text-gray">{{ user && user.login }}</div>
                </div>
              </div>
            </li>
            <li class="divider"></li>
            <li class="menu-item" v-if="isAuthenticated">
              <a href="#" @click.prevent="openLoadGitModal">
                <font-awesome-icon icon="fa-solid fa-cloud-arrow-down" class="mr-1" /> Load from GitHub
              </a>
            </li>
            <li class="menu-item" v-if="githubFile">
              <a href="#" @click.prevent="openCommitModal">
                <font-awesome-icon icon="fa-solid fa-code-commit" class="mr-1" /> Commit to GitHub
              </a>
            </li>
            <li class="divider"></li>
            <li class="menu-item">
              <a href="#" @click.prevent="logout">
                <font-awesome-icon icon="fa-solid fa-user" class="mr-1" /> Sign out
              </a>
            </li>
          </ul>
        </div>
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
  data () {
    return { menuOpen: false }
  },
  computed: {
    isAuthenticated () { return this.$store.getters['auth/isAuthenticated'] },
    user ()            { return this.$store.getters['auth/user'] },
    githubFile ()      { return this.$store.getters.githubFile },
  },
  mounted () {
    // Close dropdown when clicking anywhere outside
    document.addEventListener('click', this.handleOutsideClick)
  },
  beforeUnmount () {
    document.removeEventListener('click', this.handleOutsideClick)
  },
  methods: {
    login ()  { this.$store.dispatch('auth/login') },
    logout () {
      this.menuOpen = false
      this.$store.dispatch('auth/logout')
    },
    openLoadGitModal () {
      this.menuOpen = false
      this.$store.dispatch('toggleLoadGitModal')
    },
    openCommitModal () {
      this.menuOpen = false
      this.$store.dispatch('toggleCommitModal')
    },
    handleOutsideClick (e) {
      if (!this.$el.contains(e.target)) this.menuOpen = false
    },
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

  .gh-user-dropdown {
    position: relative;
    margin-right: 0.5rem;

    .gh-profile-toggle {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 0.1rem 0.4rem;
      border-radius: 4px;
      color: $fontColorDark;
      text-decoration: none;

      &:hover { background: rgba(255,255,255,0.15); }
    }

    .menu {
      min-width: 180px;
      right: 0;
      left: auto;
      top: 100%;

      .gh-avatar-lg {
        width: 36px;
        height: 36px;
        border-radius: 50%;
      }
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
