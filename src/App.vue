<template>
  <div id="app">
    <h1>Hello Mercator!</h1>
    <AppHeader/>
    <ImageSelectionModal/>
    <WrongInputModal/>
    <OsdComponent/>
    <!-- todo: the following two lines can safely go away, just kept for reference -->
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import AppHeader from './components/AppHeader.vue'
import OsdComponent from './components/OsdComponent.vue'
import ImageSelectionModal from './components/ImageSelectionModal.vue'
import WrongInputModal from './components/wrongInput.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    AppHeader,
    OsdComponent,
    ImageSelectionModal,
    WrongInputModal
  }
}
</script>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;

  h1 {
    color: red;
  }
}
</style>
