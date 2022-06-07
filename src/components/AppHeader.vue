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
        </column>
      </columns>
    </container>
  </div>
</template>

<script>

export default {
  name: 'AppHeader',
  components: {

  },
  computed: {
    /* visible: function() {
      return this.$store.getters.imageSelectionModalVisible
    } */
  },
  methods: {
    showImageSelectionOverlay: function () {
      this.$store.dispatch('showImageSelectionModal')
    }
  }
}
</script>

<style lang="scss" scoped>
.appHeader {
  background-color: palegoldenrod;
}
</style>
