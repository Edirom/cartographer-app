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
          <template v-if="downloadAvailable">
            <a class="btn btn-action btn-sm" :href="xmlDataUrl()" target="_blank" title="download MEI file" :download="xmlFilename">
              <font-awesome-icon icon="fa-solid fa-download"/>
            </a>
          </template>
          <template v-else>
            <a class="btn btn-action btn-sm" :href="xmlDataUrl()" target="_blank" title="download MEI file" disabled :download="xmlFilename">
              <font-awesome-icon icon="fa-solid fa-download"/>
            </a>
          </template>
        </div>
      </div>
    </section>
  </header>
</template>

<script>
// const xmlUri = 'testfile.xml'
// 'https://digital.blb-karlsruhe.de/i3f/v20/6146583/manifest'
// const manifestUri = 'https://api.beethovens-werkstatt.de/iiif/document/r24d1c005-acee-43a0-acfa-5dae796b7ec4/manifest.json' // 'https://iiif.bodleian.ox.ac.uk/iiif/manifest/644ee314-14a2-4006-9fe6-80eea1258a17.json'

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
      this.$store.dispatch('toggleLoadXMLModal')
    },
    importManifest: function () {
      this.$store.dispatch('toggleLoadIIIFModal')
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
