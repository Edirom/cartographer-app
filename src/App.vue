<template>
  <div id="app">
    <ImageSelectionModal/>
    <MeasureModal v-if="showMeasureModal"/>
    <MdivModal v-if="showMdivModal"/>
    <AppHeader/>
    <OsdComponent/>
    <AppSidebar/>
    <AppFooter/>
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AppFooter from '@/components/AppFooter.vue'
import OsdComponent from '@/components/OsdComponent.vue'
import ImageSelectionModal from '@/components/ImageSelectionModal.vue'
import MeasureModal from '@/components/MeasureModal.vue'
import MdivModal from '@/components/MdivModal.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppSidebar,
    AppFooter,
    OsdComponent,
    ImageSelectionModal,
    MeasureModal,
    MdivModal
  },
  computed: {
    showMeasureModal: function () {
      return this.$store.getters.showMeasureModal
    },
    showMdivModal: function () {
      return this.$store.getters.showMdivModal
    }
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
