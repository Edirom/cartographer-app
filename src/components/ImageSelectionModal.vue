<template>
  <modal v-model="visible">
    <h5 slot="header">Default modal</h5>
    <p slot="body">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
    <btn slot="footer" type="primary" @click="hideOverlay">Ok</btn>
  </modal>
</template>

<script>

export default {
  name: 'ImageSelectionModal',
  components: {

  },
  computed: {
    visible: function () {
      return this.$store.getters.imageSelectionModalVisible
    }
  },
  methods: {
    hideOverlay: function () {
      this.$store.dispatch('hideImageSelectionModal')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
