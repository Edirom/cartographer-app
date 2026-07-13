<template>
  <div class="appFooter">

    <div class="container gapless oneline">
      <div class="columns">
        <div class="column col-5 text-left">
          <span @click="showMdivModal" v-if="mdivLabel !== ''">
            <font-awesome-icon icon="fa-solid fa-sitemap" /> {{ mdivLabel }}
          </span>
        </div>
        <div class="column col-2">
          zones: {{ zonesCount }}
        </div>
        <div class="column col-2">
          <progress v-if="isLoading" class="progress" max="100"></progress>
        </div>
        <div class="column col-3 text-right footerBrand">
          <span class="aboutLink" title="About Cartographer" @click="showAbout">
            <font-awesome-icon icon="fa-solid fa-circle-info" /> <span>About</span>
          </span>
          <a :href="docsUrl" target="_blank" rel="noopener noreferrer" class="aboutLink" title="Documentation">
            <font-awesome-icon icon="fa-solid fa-book" /> <span>Docs</span>
          </a>
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
    docsUrl: function () {
      // Derive the docs URL from the current host (e.g. https://host/docs).
      return window.location.origin + '/docs'
    },
    isReady: function () {
      return this.$store.getters.isReady
    },
    isLoading: function () {
      return this.$store.getters.isLoading
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
  methods: {
    showMdivModal: function () {
      this.$store.dispatch('toggleMdivModal')
    },
    showAbout: function () {
      this.$store.dispatch('toggleAboutModal')
    }
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

  // Keep all footer content on a single, vertically centred row.
  .container,
  .columns {
    height: 100%;
    align-items: center;
  }

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

  .footerBrand {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;
    height: 100%;

    .aboutLink {
      color: $fontColorDark;
      text-decoration: none;
      white-space: nowrap;
      font-weight: 400;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
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
    .col-3.text-left {
      flex: 0 1 auto;
      width: auto;
    }

    // Page navigation and zone count keep their natural width (most useful);
    // the progress column absorbs any remaining space.
    .col-4:not(.text-left),
    .col-2:not(.footerBrand) {
      flex: 0 0 auto;
      width: auto;
    }

    .col-1 {
      flex: 1 1 auto;
      width: auto;
    }

    // On phones the footer is tight: drop the "Docs"/"About" text labels and
    // keep just the icons (still fully clickable).
    .footerBrand {
      flex: 0 0 auto;
      width: auto;
      gap: .35rem;

      .aboutLink span {
        display: none;
      }
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
