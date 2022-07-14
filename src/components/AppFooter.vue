<template>
  <div class="appFooter">
    <container gapless oneline>
      <columns>
        <column col=4>
          <btn action icon="left" type="link" @click="showPrevPage" :disabled="!prevAvailable"/>
          {{ currentPage }} / {{ maxPage }}
          <btn action icon="right" type="link" @click="showNextPage" :disabled="!nextAvailable"/>
        </column>
        <column col=4>
          zones: {{ zonesCount }}
        </column>
        <column col=4>

        </column>
      </columns>
    </container>
  </div>
</template>

<script>

export default {
  name: 'AppFooter',
  components: {

  },
  computed: {
    currentPage: function () {
      return this.$store.getters.currentPageIndexOneBased
    },
    maxPage: function () {
      return this.$store.getters.maxPageNumber
    },
    isReady: function () {
      return this.$store.getters.isReady
    },
    prevAvailable: function () {
      return this.$store.getters.currentPageIndexZeroBased > 0
    },
    nextAvailable: function () {
      return this.$store.getters.currentPageIndexOneBased < this.$store.getters.maxPageNumber
    },
    zonesCount: function () {
      return this.$store.getters.zonesOnCurrentPage.length
    }
    /* visible: function() {
      return this.$store.getters.imageSelectionModalVisible
    } */
  },
  methods: {
    showPrevPage: function () {
      this.$store.dispatch('setCurrentPage', this.$store.getters.currentPageIndexZeroBased - 1)
    },
    showNextPage: function () {
      this.$store.dispatch('setCurrentPage', this.$store.getters.currentPageIndexZeroBased + 1)
    }
    /* showImageSelectionOverlay: function () {
      this.$store.dispatch('showImageSelectionModal')
    } */
  }
}
</script>

<style lang="scss" scoped>
@import '@/css/_variables.scss';

.appFooter {
  height: $appFooterHeight;
  background-color: $appColor;
}
</style>
