
<template>
  <modal v-model="visible">
    <h5 slot="header">Default modal</h5>
    <p slot="body">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
    <input value="message"  v-model="messaged">
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
      console.log(this.$store.getters.message)
      return this.$store.getters.imageSelectionModalVisible
    },
    messaged: {
      get () {
        return this.$store.getters.message
      },
      set (val) {
        this.$store.dispatch('changeMessage', val)
      }
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
