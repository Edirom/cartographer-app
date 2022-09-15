<template>
  <div class="contentPreviewMeasure" :class="{'hasZones': hasZones, 'firstWithoutZones': firstMeasureWithoutZone === measure.id}" @dblclick="dblclickMeasure" :data-measure-id="measure.id">
    <template v-if="hasLabel">
      <span class="name explicitLabel">{{measure.label}}</span>
    </template>
    <template v-else>
      <span class="name n">{{measure.n}}</span>
    </template>
    <span class="multiRest"><span v-if="hasMultiRest">[{{measure.multiRest}} bars]</span></span>
    <span class="zones"><font-awesome-icon title="no zones available" v-if="!hasZones" icon="fa-regular fa-rectangle-xmark"/></span>
  </div>
</template>

<script>
// import { mode as allowedModes } from '@/store/constants.js'

export default {
  name: 'ContentPreviewMeasure',
  components: {

  },
  props: {
    measure: Object,
    mdiv: String
  },
  computed: {
    hasLabel: function () {
      return this.measure.label !== null && this.measure.label !== ''
    },
    hasZones: function () {
      return this.measure.zones.length > 0
    },
    hasMultiRest: function () {
      return this.measure.multiRest !== null
    },
    firstMeasureWithoutZone: function () {
      return this.$store.getters.firstMeasureWithoutZone
    }
    /* visible: function () {
      return this.$store.getters.imageSelectionModalVisible
    } */
  },
  methods: {
    dblclickMeasure: function () {
      this.$store.dispatch('setCurrentMdiv', this.mdiv)
      this.$store.dispatch('clickMeasureLabel', this.measure.id)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/css/_variables.scss';

.contentPreviewMeasure {
  color: #999999;
  line-height: 1rem;
  height: 1rem;
  cursor: default;
  &.hasZones {
    color: #000000;
  }

  &.firstWithoutZones {
    background-color: transparentize($highlightColor, .6);
  }

  .name {
    display: inline-block;
    width: 2.5rem;
    // background-color: yellow;
    text-align: right;
    &.explicitLabel {
      font-weight: 700;
    }
  }

  .multiRest {
    display: inline-block;
    width: 4rem;
    padding-left: .5rem;
    // background-color: blue;
  }

  .zones {
    display: inline-block;
    width: 2rem;
    height: 1rem;
    text-align: right;
    // background-color: green;
  }
}
</style>
