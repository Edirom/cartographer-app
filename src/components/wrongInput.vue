
<template>
  <modal v-model="visible">
    <h5 slot="header">Wrong input modal</h5>
    <p slot="body">Please insert the correct url!</p>
    <btn  type="primary" @click="hideWrongInputModal">Ok</btn>
  </modal>
</template>

<script>

export default {
  name: 'WrongInputModal',
  components: {

  },

  computed: {

    visible: {
      get () {
        return this.$store.getters.wrongInputModalVisible
      }
    }
  },
  methods: {
    hideWrongInputModal: function () {
      // close modal
      this.$store.dispatch('hideWrongInputModalVisible')
      // load specified uri
    }

  }
}
</script>

<style lang="scss" scoped>

</style>
