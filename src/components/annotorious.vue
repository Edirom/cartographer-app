<template>
  <div id="annot" class="annotContainer"></div>
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
      id: 'osd',
      preserveViewport: true,
      visibilityRatio: 1,
      minZoomLevel: 1,
      defaultZoomLevel: 1,
      sequenceMode: true/*,
      tileSources: [
        'https://libimages1.princeton.edu/loris/pudl0001%2F4609321%2Fs42%2F00000001.jp2/info.json',
        'https://libimages1.princeton.edu/loris/pudl0001%2F4609321%2Fs42%2F00000002.jp2/info.json',
        'https://libimages1.princeton.edu/loris/pudl0001%2F4609321%2Fs42%2F00000003.jp2/info.json',
        'https://libimages1.princeton.edu/loris/pudl0001%2F4609321%2Fs42%2F00000004.jp2/info.json',
        'https://libimages1.princeton.edu/loris/pudl0001%2F4609321%2Fs42%2F00000005.jp2/info.json',
        'https://libimages1.princeton.edu/loris/pudl0001%2F4609321%2Fs42%2F00000006.jp2/info.json',
        'https://libimages1.princeton.edu/loris/pudl0001%2F4609321%2Fs42%2F00000007.jp2/info.json'
      ] */
    })

    console.log('hello', this.viewer)

    const annotoriousConfig = {}

    // Initialize the Annotorious plugin
    const anno = Annotorious(this.viewer, annotoriousConfig)

    // Load annotations in W3C WebAnnotation format
    // anno.loadAnnotations('annotations.w3c.json');

    // Attach handlers to listen to events
    anno.on('createAnnotation', (a) => {
      console.log('created annot:', a)
    })
    /* const anno = Annotorious({
      image: this.$refs.tag_img
    }, {})
    anno.setDrawingTool('polygon') */

    this.unwatch = this.$store.watch(
      (state, getters) => getters.imageArray,
      (newArr, oldArr) => {
        console.log('We had following images:', oldArr)
        console.log('We now have these images:', newArr)

        console.log(this.viewer)

        this.viewer.open(newArr)
      }
    )
  }
}
</script>

<style lang="scss" scoped>
.osdContainer {
  margin: 0 auto;
  width: 1200px;
  height: 800px;
}
</style>
