<template>
  <div class="appHeader">
    <container gapless oneline>
      <columns>
        <column col=2>
          MercatorApp
        </column>
        <column col=2>
        </column>
        <column col=8>
          <btn type="link" :class="{multiZone}" @click="toggleMultiZone">Combine</btn>
          <btn type="link" @click="importXML">Import XML Example</btn>
          <btn type="link" @click="importManifest">Import IIIF Example</btn>
          <a :href="xmlDataUrl()" target="_blank" :disabled="!downloadAvailable" :download="xmlFilename">
            <i class="icon icon-download"></i>
          </a>
        </column>
      </columns>
    </container>
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
