<template>
  <header class="navbar appHeader">
    <section class="navbar-section">
      <span class="navbar-brand mr-2">MercatorApp</span>
    </section>
    <section class="navbar-section">
      <div class="input-group input-inline">
        <div class="button-group">
          <button class="btn btn-action btn-sm" @click="importXML" title="load MEI file">
            <font-awesome-icon icon="fa-solid fa-file-import"/>
          </button>
          <button class="btn btn-action btn-sm" @click="importManifest" title="import IIIF Manifest">
            <font-awesome-icon icon="fa-solid fa-cloud-arrow-down"/>
          </button>
          <a class="btn btn-action btn-sm" :href="xmlDataUrl()" target="_blank" title="download MEI file" :disabled="!downloadAvailable" :download="xmlFilename">
            <font-awesome-icon icon="fa-solid fa-download"/>
          </a>
        </div>
      </div>
    </section>
  </header>
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
    }
  },
  methods: {
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
