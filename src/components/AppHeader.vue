<template>
  <div class="appHeader">
    <div class="container gapless oneline">
      <div class="columns">
        <div class="column col-2">
          MercatorApp
        </div>
        <div class="column col-2">
        </div>
        <div class="column col-8">
          <button class="btn btn-link" :class="{multiZone}" @click="toggleMultiZone">Combine</button>
          <button class="btn btn-link" @click="importXML">Import XML Example</button>
          <button class="btn btn-link" @click="importManifest">Import IIIF Example</button>
          <a :href="xmlDataUrl()" target="_blank" :disabled="!downloadAvailable" :download="xmlFilename">
            <i class="icon icon-download"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 'https://digital.blb-karlsruhe.de/i3f/v20/6146583/manifest'
const manifestUri = 'https://api.beethovens-werkstatt.de/iiif/document/r24d1c005-acee-43a0-acfa-5dae796b7ec4/manifest.json'

export default {
  name: 'AppHeader',
  components: {

  },
  computed: {
    manifest: function () {
      return this.$store.getters.manifest
    },
    xmlFilename: function () {
      // TODO: Come up with better name, maybe generate from first title in file?!
      return 'meiFile.xml'
    },
    downloadAvailable: function () {
      return this.$store.getters.meiFileForDownload !== null
    },
    multiZone: function () {
      return this.$store.getters.multiZoneActive
    }
  },
  methods: {
    toggleMultiZone: function () {
      this.$store.dispatch('toggleMultiZone')
    },
    importXML: function () {
      this.$store.dispatch('importXMLtest')
    },
    importManifest: function () {
      this.$store.dispatch('importIIIF', manifestUri)
    },
    xmlDataUrl () {
      const xml = this.$store.getters.meiFileForDownload
      if (xml !== null) {
        return 'data:text/xml,' + encodeURIComponent(xml)
      }
      return '#'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/css/_variables.scss';

.appHeader {
  height: $appHeaderHeight;
  background-color: $appColor;

  .multiZone {
    font-weight: 900;
  }
}
</style>
