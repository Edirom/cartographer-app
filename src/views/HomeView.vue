<template>
  <div>
    <LoadXMLModal v-if="showLoadXMLModal"/>
    <LoadIIIFModal v-if="showLoadIIIFModal"/>
    <LoadGitModal v-if="showLoadGitModal"/>
    <!--<ImageSelectionModal/>-->
    <MeasureModal v-if="showMeasureModal"/>
    <MdivModal v-if="showMdivModal"/>
    <PagesModal v-if="showPagesModal"/>
    <PageImportModal v-if="showPageImportModal"/>
    <AppHeader/>
    <OsdComponent/>
    <ContentPreviewPane/>
    <AppSidebar/>
    <AppFooter/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppHeader from '@/components/AppHeader.vue'
import ContentPreviewPane from '@/components/ContentPreviewPane.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AppFooter from '@/components/AppFooter.vue'
import OsdComponent from '@/components/OsdComponent.vue'
// import ImageSelectionModal from '@/components/ImageSelectionModal.vue'
import MeasureModal from '@/components/MeasureModal.vue'
import PagesModal from '@/components/PagesModal.vue'
import PageImportModal from '@/components/PageImportModal.vue'
import MdivModal from '@/components/MdivModal.vue'
import LoadXMLModal from '@/components/LoadXMLModal.vue'
import LoadIIIFModal from '@/components/LoadIIIFModal.vue'
import LoadGitModal from '@/components/LoadGitModal.vue'


export default {
  name: 'App',
  components: {
    AppHeader,
    ContentPreviewPane,
    AppSidebar,
    AppFooter,
    OsdComponent,
    // ImageSelectionModal,
    MeasureModal,
    PagesModal,
    PageImportModal,
    MdivModal,
    LoadXMLModal,
    LoadIIIFModal,
    LoadGitModal
  },
  computed: {
    ...mapGetters([
      'showLoadXMLModal',
      'showLoadIIIFModal',
      'showMeasureModal',
      'showMdivModal',
      'showPagesModal',
      'showPageImportModal',
      'showLoadGitModal',
    ])
  },
  mounted () {
    window.addEventListener('keyup', e => {
      // console.log('keyupped ' + e.key)
      if (e.key === 'm') {
        // console.log('toggle measureList')
        this.$store.dispatch('toggleMeasureList')
      } else if (e.key === 'p') {
        // console.log('toggle pageModal')
        this.$store.dispatch('togglePagesModal')
      }
    })
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
