<template>
  <div class="appSidebar" :class="{ topTools: mobileLayout }">
    <!-- On mobile this single top bar shows the app brand on the left and all
         tools (drawing tools + jump-to + menu) on the right. -->
    <span v-if="mobileLayout" class="mobileBrand navbar-brand">CartographerApp</span>
    <!-- SELECT -->
    <button class="btn btn-action" :class="{'activeMode': mode === 'selection'}"
      title="select measure (s)" :disabled="!isReady"
      @click="activateMode('selection')">
      <font-awesome-icon icon="fa-solid fa-arrow-pointer"/>
    </button>

    <!-- DRAW -->
    <button class="btn btn-action"  :class="{'activeMode': mode === 'manualRect'}"
      title="draw measures (d)" :disabled="!isReady"
      @click="activateMode('manualRect')">
      <font-awesome-icon icon="fa-solid fa-pen"/>
    </button>

    <!-- UNDO -->
    <button class="btn btn-action" title="undo changes" :disabled="!canUndo"
      @click="undoChanges">
      <font-awesome-icon icon="fa-solid fa-rotate-left"/>
    </button>

    <!-- REDO -->
    <button class="btn btn-action" title="redo changes" :disabled="!canRedo"
      @click="redoChanges">
      <font-awesome-icon icon="fa-solid fa-rotate-right"/>
    </button>

    <!-- RECTANGLE -->
    <!-- <button class="btn btn-action" title="draw rectangle" :disabled="!isReady">
      <font-awesome-icon icon="fa-solid fa-crop-simple"/>
    </button> -->

    <!-- SPLIT HORIZONTALLY -->
    <!-- button class="btn btn-action"  :class="{'activeMode': mode === 'splitHorizontal'}"
      title="split measure horizontally" :disabled="!isReady"
      @click="activateMode('splitHorizontal')">
      <font-awesome-icon icon="fa-solid fa-scissors"/>
    </button> -->

    <!-- SPLIT VERTICALLY -->
    <!-- <button class="btn btn-action"  :class="{'activeMode': mode === 'splitVertical'}"
      title="split measure vertically" :disabled="!isReady"
      @click="activateMode('splitVertical')">
      <font-awesome-icon icon="fa-solid fa-scissors" rotation="270"/>
    </button> -->

    <!-- ADDITIONAL ZONE PER MEASURE -->
      <!-- @click="activateMode('additionalZone')"> -->
    <button class="btn btn-action"  :class="{'activeMode': mode === 'additionalZone'}"
      title="add zone to last measure (a)"
      :disabled="!isReady || measures.length === 0"
      @click="activateMode('additionalZone')">
      <template v-if="mode === 'additionalZone'">
        <font-awesome-icon icon="fa-solid fa-square-plus"/>
      </template>
      <template v-else>
        <font-awesome-icon icon="fa-regular fa-square-plus"/>
      </template>
    </button>

    <!-- DELETE MEASURE -->
    <button class="btn btn-action"  :class="{'activeMode': mode === 'deletion'}"
      title="delete measure (x)" :disabled="!isReady"
      @click="activateMode('deletion')">
      <font-awesome-icon icon="fa-solid fa-eraser"/>
    </button>
    <!-- MDIV -->
    <!-- <button class="btn btn-action"  :class="{'activeMode': mode === 'mdiv'}"
      title="select movement" :disabled="!isReady"
      @click="activateMode('mdiv')">
      <font-awesome-icon icon="fa-solid fa-sitemap"/>
    </button> -->

    <div class="automaticTools">
      <!-- AUTODETECT ON CURRENT PAGE -->
      <button class="btn btn-action" title="Autodetect measures on current page"
        :disabled="!isReady"
        @click="autoDetect">
        <font-awesome-layers>
          <font-awesome-icon icon="fa-solid fa-wand-sparkles" transform="flip-h down-5 right-5 shrink-3"/>
          <font-awesome-icon icon="fa-regular fa-clone" transform="up-5 left-5"/>
        </font-awesome-layers>
      </button>
        <!-- AUTODETECT ON ALL PAGE
        <button class="btn btn-action" title="Autodetect measures on current page"
          :disabled="!isReady"
          @click="autoDetectAll">
          <font-awesome-layers>
            <font-awesome-icon icon="fa-solid fa-wand-sparkles" transform="flip-h down-5 right-5 shrink-3"/>
            <font-awesome-icon icon="fa-regular fa-clone" transform="up-5 left-5"/>
            <font-awesome-icon icon="fa-regular fa-square" transform="up-7.5 right-6.5 shrink-3"/>
          </font-awesome-layers>
      </button> -->

      <!-- AUTODETECT ALL PAGES -->
      <!-- <button class="btn btn-action" title="Autodetect measures throughout document"
      :disabled="!isReady"
      @click="autoDetectAll">
        <font-awesome-layers>
          <font-awesome-icon icon="fa-solid fa-wand-sparkles" transform="flip-h down-5 right-5 shrink-3"/>
          <font-awesome-icon icon="fa-regular fa-clone" transform="up-5 left-5"/>
          <font-awesome-icon icon="fa-regular fa-square" transform="up-7.5 right-6.5 shrink-3"/>
        </font-awesome-layers>
      </button> -->

    </div>

    <!-- PAGE NAVIGATION (browser/desktop only; the mobile app uses horizontal
         swipe on the image + the jump-to button instead). -->
    <div class="pageNav" v-if="!mobileLayout">
      <label>Page</label>
      <span class="currentPage">{{ currentPage }}</span>
      <span class="maxPage">of {{ maxPage }}</span>
      <span class="pageBtn" @click="showPrevPage" :disabled="!prevAvailable">
        <font-awesome-icon icon="fa-solid fa-angle-left" />
      </span>
      <span class="pageBtn" @click="showNextPage" :disabled="!nextAvailable">
        <font-awesome-icon icon="fa-solid fa-angle-right" />
      </span>
    </div>

    <!-- JUMP TO PAGE (mobile app only) -->
    <button v-if="mobileLayout" class="btn btn-action" title="Jump to page"
      :disabled="!isReady" @click="openJumpTo">
      <font-awesome-icon icon="fa-solid fa-hashtag"/>
    </button>

    <!-- MENU (last button on mobile) -->
    <MainMenu v-if="mobileLayout" class="mobileMenu" />

    <!-- Jump-to-page popup -->
    <div v-if="showJumpTo" class="jumpToOverlay" @click.self="closeJumpTo">
      <div class="jumpToPopup">
        <label>Jump to page</label>
        <div class="jumpToRow">
          <input type="number" min="1" :max="maxPage" v-model.number="jumpToValue"
            @keyup.enter="doJumpTo" ref="jumpInput" />
          <span class="ofMax">of {{ maxPage }}</span>
        </div>
        <div class="jumpToActions">
          <button class="btn btn-sm" @click="closeJumpTo">Cancel</button>
          <button class="btn btn-primary btn-sm" @click="doJumpTo">Go</button>
        </div>
      </div>
    </div>
    <!-- this could be used for score setup
    <button class="btn btn-action">
      <font-awesome-layers>
        <font-awesome-icon icon="fa-solid fa-guitar" transform="up-8 shrink-5"/>
        <font-awesome-icon icon="fa-solid fa-guitar" transform="shrink-5"/>
        <font-awesome-icon icon="fa-solid fa-guitar" transform="down-8 shrink-5"/>
      </font-awesome-layers>
    </button>-->
    <!-- these could be used for score vs. parts
    <button class="btn btn-action">
      <font-awesome-icon icon="fa-solid fa-stop"/>
    </button>
    <button class="btn btn-action">
      <font-awesome-icon icon="fa-solid fa-layer-group"/>
    </button>-->

    <!--<button class="btn btn-action">
      <font-awesome-layers>
        <font-awesome-icon icon="fa-solid fa-wand-sparkles" transform="flip-h down-5 right-5 shrink-3"/>
        <font-awesome-icon icon="fa-regular fa-clone" transform="up-5 left-5"/>
        <font-awesome-icon icon="fa-regular fa-square" transform="up-7.5 right-6.5 shrink-3"/>
      </font-awesome-layers>
    </button>-->
  </div>
</template>

<script>
import { mode as allowedModes } from '@/store/constants.js'
import { isMobileApp } from '@/tools/platform.js'
import MainMenu from '@/components/MainMenu.vue'

export default {
  name: 'AppSidebar',
  components: {
    MainMenu
  },
  data () {
    return {
      showJumpTo: false,
      jumpToValue: 1
    }
  },
  computed: {
    mobileLayout: function () {
      return isMobileApp()
    },
    isReady: function () {
      return this.$store.getters.isReady
    },
    multiZone: function () {
      return this.$store.getters.multiZoneActive
    },
    currentPage: function () {
      return this.$store.getters.currentPageIndexOneBased
    },
    maxPage: function () {
      return this.$store.getters.maxPageNumber
    },
    prevAvailable: function () {
      return this.$store.getters.currentPageIndexZeroBased > 0
    },
    nextAvailable: function () {
      return this.$store.getters.currentPageIndexOneBased < this.$store.getters.maxPageNumber
    },
    mode: function () {
      return this.$store.getters.mode
    },
    measures: function () {
      return this.$store.getters.measures
    },
    canUndo: function () {
      return this.$store.getters.canUndo
    },
    canRedo: function () {
      return this.$store.getters.canRedo
    }
    /* visible: function() {
      return this.$store.getters.imageSelectionModalVisible
    } */
  },
  methods: {
    openJumpTo: function () {
      this.jumpToValue = this.currentPage || 1
      this.showJumpTo = true
      this.$nextTick(() => {
        if (this.$refs.jumpInput) {
          this.$refs.jumpInput.focus()
        }
      })
    },
    closeJumpTo: function () {
      this.showJumpTo = false
    },
    doJumpTo: function () {
      let n = parseInt(this.jumpToValue, 10)
      if (isNaN(n)) return
      const max = this.maxPage
      if (n < 1) n = 1
      if (n > max) n = max
      this.$store.dispatch('setCurrentPage', n - 1)
      this.showJumpTo = false
    },
    showPrevPage: function () {
      this.$store.dispatch('setCurrentPage', this.$store.getters.currentPageIndexZeroBased - 1)
    },
    showNextPage: function () {
      this.$store.dispatch('setCurrentPage', this.$store.getters.currentPageIndexZeroBased + 1)
    },
    autoDetect: function () {
      this.$store.dispatch('autoDetectZonesOnCurrentPage')
    },
    autoDetectAll: function () {
      this.$store.dispatch('autoDetectZonesOnAllPage')
    },
    activateMode: function (mode) {
      if (mode in allowedModes) {
        this.$store.dispatch('setMode', mode)
        // if (mode === allowedModes.additionalZone && mode === this.mode) {
        //   // console.log("Additional zone")
        //   // this.$store.dispatch('setMode', allowedModes.manualRect)
        // } else {
        //   this.$store.dispatch('setMode', mode)
        // }
        // if (mode === allowedModes.deletion) {
        //   this.$store.dispatch('setMode', mode)
        // }
        // if (mode === allowedModes.login) {
        //   this.$store.dispatch('setMode', mode)
        // }
      } else {
        console.error('mode ' + mode + ' is not known. Please check AppSidebar.vue and @/store/index.js.')
      }
    },
    undoChanges: function () {
      this.$store.dispatch('undo')
    },
    redoChanges: function () {
      this.$store.dispatch('redo')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/css/_variables.scss';

.appSidebar {
  height: calc(100vh - $appHeaderHeight - $appFooterHeight);
  height: calc(100dvh - #{$appHeaderHeight} - #{$appFooterHeight} - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px));
  width: $appSidebarWidth;
  background-color: $appColor;
  float: right;
  padding-top: .4rem;

  // On mobile the toolbar becomes a horizontal bar pinned to the top, directly
  // below the header, instead of a vertical bar on the right side.
  &.topTools {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 20;
    width: 100%;
    height: calc(#{$mobileToolbarHeight} + env(safe-area-inset-top, 0px));
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow-x: auto;
    overflow-y: hidden;
    float: none;
    padding: calc(.2rem + env(safe-area-inset-top, 0px)) .4rem .2rem .4rem;

    // Brand sits on the far left; the auto right-margin pushes every tool button
    // to the right side of the bar. Matches the browser header brand (dark text,
    // spectre navbar-brand font on the same red bar).
    .mobileBrand {
      flex: 0 0 auto;
      margin-right: auto;
      padding-left: .5rem;
      color: $fontColorDark;
      font-size: .95rem;
      white-space: nowrap;
    }

    .btn-action {
      flex: 0 0 auto;
      margin: 0 0 0 .2rem;
    }

    .automaticTools {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 0 0 0 .2rem;
    }

    .mobileMenu {
      flex: 0 0 auto;
      margin-left: .2rem;
    }

    // The dropdown menu would be clipped by the bar's overflow, so pin it to
    // the viewport just below the top bar (aligned to the right edge).
    :deep(.mainMenu) {
      position: fixed;
      top: calc(#{$mobileToolbarHeight} + env(safe-area-inset-top, 0px));
      right: .4rem;
      left: auto !important;
    }
  }

  .jumpToOverlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.35);

    .jumpToPopup {
      background: #ffffff;
      color: $fontColorDark;
      border-radius: 6px;
      padding: 1rem 1.2rem;
      min-width: 12rem;
      box-shadow: 0 0.4rem 1.2rem rgba(0, 0, 0, 0.3);
      text-align: left;

      label {
        display: block;
        font-weight: 500;
        margin-bottom: .5rem;
      }

      .jumpToRow {
        display: flex;
        align-items: center;
        gap: .4rem;

        input {
          flex: 1 1 auto;
          padding: .2rem .3rem;
          border: 1px solid #999999;
          border-radius: 4px;
        }

        .ofMax {
          font-size: .8rem;
          color: #555555;
          white-space: nowrap;
        }
      }

      .jumpToActions {
        display: flex;
        justify-content: flex-end;
        gap: .5rem;
        margin-top: .8rem;
      }
    }
  }

  button {
    color: $fontColorDark;
    border-color: $fontColorDark;
  }

  .btn-action {
    margin: 0 0 .2rem 0;

    &.activeMode {
      background-color: #a6e9fd;
      box-shadow: 0 0.01rem 0.2rem rgba(0, 0, 0, 0.3) inset;
    }
  }

  .automaticTools {
    margin: .5rem 0;
  }

  // Default page navigation shown in the right bar on the browser/desktop.
  .pageNav {
    background-color: #ffffff;
    border: 0.05rem solid #000000;
    border-radius: 2px;
    margin: 0 .35rem .2rem .35rem;

    label {
      display: block;
      font-weight: 100;
      font-size: .5rem;
    }

    .currentPage {
      display: block;
      font-weight: 300;
    }

    .maxPage {
      display: block;
      font-weight: 100;
      font-size: .5rem;
      line-height: .6rem;
    }

    .pageBtn {
      padding: 0 .1rem;
      cursor: pointer;
    }
  }

  .pageNav {
    background-color: #ffffff;
    border: 0.05rem solid #000000;
    border-radius: 2px;
    margin: 0 .35rem .2rem .35rem;
    // display: none;
    label {
      display: block;
      font-weight: 100;
      font-size: .5rem;
    }
    .currentPage {
      display: block;
      font-weight: 300;
    }

    .maxPage {
      display: block;
      font-weight: 100;
      font-size: .5rem;
      line-height: .6rem;
    }

    .pageBtn {
      padding: 0 .1rem;
    }
  }
}
</style>
