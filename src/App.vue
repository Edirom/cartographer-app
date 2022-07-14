<template>
  <div id="app">
    <AppHeader/>
    <ImageSelectionModal/>
    <OsdComponent/>
    <AppFooter/>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import OsdComponent from './components/OsdComponent.vue'
import ImageSelectionModal from './components/ImageSelectionModal.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    OsdComponent,
    ImageSelectionModal
  }
}
</script>

<style lang="scss">
@import '@/css/_variables.scss';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $fontColorDark;
  height: 100vh;
  width: 100%;
  position: relative;
}
</style>
