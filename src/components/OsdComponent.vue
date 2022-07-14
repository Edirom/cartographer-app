<template>
  <div id="osdContainer"></div>
</template>

<script>
import OpenSeadragon from 'openseadragon'
import * as Annotorious from '@recogito/annotorious-openseadragon'
import '@recogito/annotorious-openseadragon/dist/annotorious.min.css'

export default {
  name: 'OsdComponent',
  components: {

  },
  computed: {
    imageArray: function () {
      return this.$store.getters.imageArray
    }
  },
  beforeDestroy () {
    this.unwatch()
  },
  mounted: function () {
    this.viewer = OpenSeadragon({
      id: 'osdContainer',
      preserveViewport: false,
      visibilityRatio: 0.8,
      sequenceMode: true,
      showNavigator: false,
      showZoomControl: false,
      showHomeControl: false,
      showFullPageControl: false,
      showSequenceControl: false
      // navigatorId: 'someId',
      //
      /* homeButton: 'zoomHome',
      zoomInButton: 'zoomIn',
      zoomOutButton: 'zoomOut',
      previousButton: 'pageLeft',
      nextButton: 'pageRight' */
    })

    const annotoriousConfig = {
      disableEditor: true
    }

    // Initialize the Annotorious plugin
    this.anno = Annotorious(this.viewer, annotoriousConfig)

    // Load annotations in W3C WebAnnotation format
    // anno.loadAnnotations('annotations.w3c.json');

    this.anno.on('createSelection', async (selection) => {
      // The user has created a new shape...

      // it is necessary to have some type of body, or it will not save
      selection.body = [{
        type: 'TextualBody',
        purpose: 'tagging',
        value: 'measure'
      }]

      // console.log('selection:')
      // console.log(selection)

      await this.anno.updateSelected(selection)
      this.anno.saveSelected()
    })

    this.anno.on('selectAnnotation', async (annotation) => {
      // The users has selected an existing annotation
      // console.log('selected annotation')
      // console.log(annotation)
    })

    this.anno.on('createAnnotation', (annotation) => {
      // The users has selected an existing annotation
      this.$store.dispatch('createZone', annotation)
    })

    this.anno.on('updateAnnotation', (annotation) => {
      // The users has selected an existing annotation
      console.log('updated annotation')
      console.log(annotation)
    })

    this.viewer.addHandler('page', (data) => {
      this.anno.clearAnnotations()

      const annots = this.$store.getters.zonesOnCurrentPage
      this.anno.setAnnotations(annots)
    })

    this.unwatchPages = this.$store.watch((state, getters) => getters.pages,
      (newArr, oldArr) => {
        this.viewer.open(newArr)
        this.$store.dispatch('setCurrentPage', 0)
      })

    this.unwatchCurrentPage = this.$store.watch((state, getters) => getters.currentPageIndexZeroBased,
      (newPage, oldPage) => {
        this.viewer.goToPage(newPage)
      })
  },
  beforeUnmount () {
    this.unwatchPages()
  }
}
</script>

<style lang="scss" scoped>
@import '@/css/_variables.scss';

#osdContainer {
  height: calc(100vh - $appHeaderHeight - $appFooterHeight);
  width: 100%;
}
</style>
