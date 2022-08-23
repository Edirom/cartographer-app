<template>
  <div class="appSidebar">
    <button class="btn btn-action" title="select measure" :disabled="!isReady">
      <font-awesome-icon icon="fa-solid fa-arrow-pointer"/>
    </button>
    <button class="btn btn-action" title="draw free-form measures" :disabled="!isReady" @click="activateManualZone">
      <template v-if="mode === 'manualRect'">
        <font-awesome-icon icon="fa-solid fa-pen"/>
      </template>
      <template v-else>
        <font-awesome-icon icon="fa-regular fa-pen"/>
      </template>
    </button>
    <button class="btn btn-action" title="draw rectangle" :disabled="!isReady">
      <font-awesome-icon icon="fa-solid fa-crop-simple"/>
    </button>
    <button class="btn btn-action" title="split measure horizontally" :disabled="!isReady">
      <font-awesome-icon icon="fa-solid fa-scissors"/>
    </button>
    <button class="btn btn-action" title="split measure vertically" :disabled="!isReady">
      <font-awesome-icon icon="fa-solid fa-scissors" rotation="270"/>
    </button>
    <button class="btn btn-action" title="add zone to last measure" :disabled="!isReady" @click="activateMultiZone">
      <template v-if="mode === 'multiZone'">
        <font-awesome-icon icon="fa-solid fa-square-plus"/>
      </template>
      <template v-else>
        <font-awesome-icon icon="fa-regular fa-square-plus"/>
      </template>
    </button>
    <button class="btn btn-action" title="delete measure" :disabled="!isReady" @click="activateDeleteZone">
      <template v-if="mode === 'deleteZone'">
        <font-awesome-icon icon="fa-solid fa-eraser"/>
      </template>
      <template v-else>
        <font-awesome-icon icon="fa-regular fa-eraser"/>
      </template>
    </button>
    <button class="btn btn-action" title="Autodetect measures on current page" @click="autoDetect" :disabled="!isReady">
      <font-awesome-layers>
        <font-awesome-icon icon="fa-solid fa-wand-sparkles" transform="flip-h down-5 right-5 shrink-3"/>
        <font-awesome-icon icon="fa-regular fa-clone" transform="up-5 left-5"/>
      </font-awesome-layers>
    </button>
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
    </button>
    -->
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

export default {
  name: 'AppSidebar',
  components: {

  },
  computed: {
    isReady: function () {
      return this.$store.getters.isReady
    },
    mode: function () {
      return this.$store.getters.mode
    }
    /* visible: function() {
      return this.$store.getters.imageSelectionModalVisible
    } */
  },
  methods: {
    activateMultiZone: function () {
      this.$store.dispatch('setMode', 'multiZone')
    },
    activateDeleteZone: function () {
      this.$store.dispatch('setMode', 'deleteZone')
    },
    activateManualZone: function () {
      this.$store.dispatch('setMode', 'manualRect')
    },
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
  padding-top: .4rem;

  button {
    color: $fontColorDark;
    border-color: $fontColorDark;
  }

  .btn-action {
    margin: 0 0 .2rem 0;

    &.activeMode {
      background-color: #e5e5e5;
      box-shadow: 0 .1rem .3rem #0006 inset;
    }
  }
}
</style>
