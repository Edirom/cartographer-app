
<template>
  <div class="modal modal-sm active">
    <a href="#close" class="modal-overlay" aria-label="Close"></a>
    <div class="modal-container">
      <div class="modal-header">
        <a href="#close" class="btn btn-clear float-right" aria-label="Close"></a>
        <div class="modal-title h5">Measure Label</div>
      </div>
      <div class="modal-body">
        <div class="content">
          Hallo
        </div>
      </div>
      <div class="modal-footer">
        <a class="btn btn-link" href="#close" @click="close">Close</a>
      </div>
    </div>
  </div>
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
