<template>
  <div class="appSidebar">
    <button class="btn btn-action" @click="autoDetect">MD</button>
  </div>
</template>

<script>

export default {
  name: 'AppSidebar',
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
    autoDetect: function () {
      this.$store.dispatch('autoDetectZonesOnCurrentPage')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/css/_variables.scss';

.appSidebar {
  height: calc(100vh - $appHeaderHeight - $appFooterHeight);
  width: $appSidebarWidth;
  background-color: $appColor;
  float: right;
}
</style>
