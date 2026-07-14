<template>
  <div class="appFooter">

    <div class="container gapless oneline">
      <div class="columns">
        <div class="column col-4 text-left">
          <span @click="showMdivModal" v-if="mdivLabel !== ''">
            <font-awesome-icon icon="fa-solid fa-sitemap" /> {{ mdivLabel }}
          </span>
        </div>
        <div class="column col-4" v-if="!mobileLayout">
          <span @click="showPrevPage" :disabled="!prevAvailable">
            <font-awesome-icon icon="fa-solid fa-angle-left" />
          </span>
          <input type="text" class="ml-2 input pageInput" v-model="inputPage" v-on:keyup.enter="jumpToPage()" :placeholder="currentPage"/> / {{ maxPage }}
          <span @click="showNextPage" :disabled="!nextAvailable">
            <font-awesome-icon icon="fa-solid fa-angle-right" />
          </span>
          <button class="ml-2 btn jumpBtn" @click="jumpToPage()">Go</button>
        </div>
        <div class="column col-4 pageCount" v-else>
          {{ currentPage }} / {{ maxPage }}
        </div>
        <div class="column col-3">
          zones: {{ zonesCount }}
        </div>
        <div class="column col-1">
          <progress v-if="isLoading" class="progress" max="100"></progress>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { isMobileApp } from '@/tools/platform.js'

export default {
  name: 'AppFooter',
  components: {

  },
  data: function () {
    return {
      inputPage: ''
    }
  },
  computed: {
    mobileLayout: function () {
      return isMobileApp()
    },
    currentPage: function () {
      return this.$store.getters.currentPageIndexOneBased
    },
    maxPage: function () {
      return this.$store.getters.maxPageNumber
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
    },
    mdivLabel: function () {
      const mdiv = this.$store.getters.currentMdiv
      if (mdiv === null) {
        return ''
      }
      return (mdiv.index + 1) + ': ' + mdiv.label
    }
  },
  watch: {
    currentPage: function (newPage) {
      this.inputPage = newPage
    }
  },
  methods: {
    showPrevPage: function () {
      const prev = this.$store.getters.currentPageIndexZeroBased - 1
      if (prev >= 0) {
        this.$store.dispatch('setCurrentPage', prev)
        this.$store.dispatch('setCurrentPageZone', this.$store.getters.zonesOnCurrentPage.length)
      }
    },
    showNextPage: function () {
      const next = this.$store.getters.currentPageIndexZeroBased + 1
      if (next < this.$store.getters.maxPageNumber) {
        this.$store.dispatch('setCurrentPage', next)
      }
    },
    showMdivModal: function () {
      this.$store.dispatch('toggleMdivModal')
    },
    jumpToPage: function () {
      const page = this.inputPage === NaN ? 0 : parseInt(this.inputPage) - 1
      if (page >= 0 && page < this.$store.getters.maxPageNumber) {
        this.$store.dispatch('setCurrentPage', page)
      }
      else {
        console.info('Invalid page number: ', this.inputPage)
      }
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
  height: calc(#{$appFooterHeight} + env(safe-area-inset-bottom, 0px));
  padding-bottom: env(safe-area-inset-bottom, 0px);
  width: 100%;
  background-color: $appColor;
  border-top: $thickBorder;
  box-sizing: border-box;

  font-size: .7rem;
  font-weight: 300;

  progress {
    color: $fontColorDark;
    height: .3rem;
    position: relative;
    top: -3px;
    border: $thinBorder;
    background: #eef0f3 linear-gradient(to right, #999999 30%, #eef0f3 30%) top left/150% 150% no-repeat;
  }

  button {
    color: $fontColorDark;
    border-color: $fontColorDark;
  }
  
  .pageInput {
    width: 2rem;
    height: 1rem;
    text-align: center;
    border: $thinBorder;
    border-radius: .2rem;
    padding: .1rem;
  }

  .jumpBtn {
      padding: 0 .1rem;
      height: 1rem;
      margin: 0 .2rem;
    }
}

// Small screens (phones): keep the footer on a single row and make its
// contents fit instead of overflowing / being clipped.
@media (max-width: 599px) {
  .appFooter {
    font-size: .6rem;

    .container,
    .columns {
      flex-wrap: nowrap;
      align-items: center;
      height: 100%;
    }

    .column {
      padding-left: 2px;
      padding-right: 2px;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    // The mdiv label is supplementary (also reachable via the mdiv modal),
    // so let it shrink/truncate first to give the page navigation room.
    .col-4.text-left {
      flex: 0 1 auto;
      width: auto;
    }

    // Page navigation and zone count keep their natural width (most useful);
    // the progress column absorbs any remaining space.
    .col-4:not(.text-left),
    .col-3 {
      flex: 0 0 auto;
      width: auto;
    }

    .col-1 {
      flex: 1 1 auto;
      width: auto;
    }

    .pageInput {
      width: 1.4rem;
    }

    .jumpBtn {
      margin: 0 .1rem;
    }
  }
}
</style>
