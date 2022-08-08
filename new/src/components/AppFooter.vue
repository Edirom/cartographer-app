<template>
  <div class="appFooter">

    <div class="container gapless oneline">
      <div class="columns">
        <div class="column col-4">
          <button class="btn btn-link btn-action" @click="showPrevPage" :disabled="!prevAvailable">L</button>
          {{ currentPage }} / {{ maxPage }}
          <button class="btn btn-link btn-action" @click="showNextPage" :disabled="!nextAvailable">R</button>
        </div>
        <div class="column col-4">
          zones: {{ zonesCount }}
        </div>
        <div class="column col-4">
          <div class="loading" v-if="isLoading"></div>
        </div>
      </div>
    </div>

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
    isLoading: function () {
      return this.$store.getters.isLoading
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
  position: absolute;
  bottom: 0;
  height: $appFooterHeight;
  width: 100vw;
  background-color: $appColor;
}
</style>
