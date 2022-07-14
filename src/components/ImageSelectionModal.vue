
<template>
  <modal v-model="visible">
    <h5 slot="header">Default modal</h5>
    <p slot="body">Please insert manifest url here</p>
    <input slot="footer" v-model="url" >
    <btn  type="primary" @click="openManifest">Ok</btn>

  </modal>
</template>

<script>

export default {
  name: 'ImageSelectionModal',
  components: {

  },

  computed: {

    visible: {
      get () {
        return this.$store.getters.imageSelectionModalVisible
      }
    },
    url: {

      get () {
        return this.$store.getters.message
      },
      set (val) {
        this.$store.dispatch('changeMessage', val)
      }

    }
  },
  methods: {
    openManifest: function () {
      // close modal
      this.$store.dispatch('hideImageSelectionModal')
      this.$store.dispatch('getManifest', this.$store.getters.message)
      this.$store.dispatch('getManifestWithoutParameter')

      // load specified uri
    }

  }
}
</script>

<style lang="scss" scoped>

</style>
