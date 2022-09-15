<template>
  <header class="navbar appHeader">
    <section class="navbar-section">
      <span class="navbar-brand mr-2">CartographerApp</span>
    </section>
    <section class="navbar-section">
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
// const xmlUri = 'testfile.xml'
// 'https://digital.blb-karlsruhe.de/i3f/v20/6146583/manifest'
// const manifestUri = 'https://api.beethovens-werkstatt.de/iiif/document/r24d1c005-acee-43a0-acfa-5dae796b7ec4/manifest.json' // 'https://iiif.bodleian.ox.ac.uk/iiif/manifest/644ee314-14a2-4006-9fe6-80eea1258a17.json'

export default {
  name: 'AppHeader',
  components: {
    MainMenu
  },
  computed: {

  },
  methods: {

  }
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
}
</style>
