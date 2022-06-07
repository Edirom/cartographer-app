<template>
  <div id="app">
    <AppHeader/>
    <ImageSelectionModal/>
    <OsdComponent/>
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import AppHeader from './components/AppHeader.vue'
import OsdComponent from './components/OsdComponent.vue'
import ImageSelectionModal from './components/ImageSelectionModal.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    AppHeader,
    OsdComponent,
    ImageSelectionModal
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
