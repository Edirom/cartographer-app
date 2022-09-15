<template>
  <div class="contentPreviewMdiv">
    <h1>{{mdiv.label}}</h1>
    <ContentPreviewMeasure v-for="(measure, i) in measures" :key="i" :measure="measure" :mdiv="mdiv.id"/>
  </div>
</template>

<script>
import ContentPreviewMeasure from '@/components/ContentPreviewMeasure.vue'

export default {
  name: 'ContentPreviewMdiv',
  components: {
    ContentPreviewMeasure
  },
  props: {
    mdiv: Object
  },
  computed: {
    measures: function () {
      return this.$store.getters.measuresByMdivId(this.mdiv.id)
    }
    /* visible: function() {
      return this.$store.getters.imageSelectionModalVisible
    } */
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
@import '@/css/_variables.scss';

.contentPreviewMdiv + .contentPreviewMdiv {
  margin-top: .5rem;
}

.contentPreviewMdiv {
  h1 {
    font-weight: 700;
    font-size: .8rem;
    padding: .1rem .3rem;
    background-color: lighten($appColor, 25%);
    border-radius: 3px;
    margin: 0;
  }
}
</style>
