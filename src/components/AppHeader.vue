<template>
  <div class="appHeader">
    <container gapless oneline>
      <columns>
        <column col=4>
          MercatorApp
        </column>
        <column col=4>
        </column>
        <column col=4>
          <btn action icon="menu" @click="showImageSelectionOverlay"/>
          <btn action icon="download" @click="getManifest"/>
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
    /* visible: function() {
      return this.$store.getters.imageSelectionModalVisible
    } */
    manifest: function () {
      return this.$store.getters.manifest
    }
  },
  methods: {
    showImageSelectionOverlay: function () {
      this.$store.dispatch('showImageSelectionModal')
    },
    getManifest: function () {
      this.$store.dispatch('getManifest', manifestUri)
    }
  }
}
</script>

<style lang="scss" scoped>
.appHeader {
  background-color: palegoldenrod;
}
</style>
