
<template>
  <div class="modal modal-sm active">
    <a href="#close" class="modal-overlay" aria-label="Close" @click="closeModal"></a>
    <div class="modal-container">
      <div class="modal-header">
        <a href="#close" class="btn btn-clear float-right" aria-label="Close" @click="closeModal"></a>
        <div class="modal-title h5" :title="measure.id">Measure {{ measure.n }}</div>
      </div>
      <div class="modal-body">
        <div class="content">
          <div class="form-group customFormGroup">
            <select class="form-select">
              <option v-for="(mdiv, mdivIndex) in mdivs" @click="selectMdiv(mdiv.id)" :selected="mdivIndex === 0" :value="mdiv.id" v-bind:key="mdivIndex">{{ mdiv.label }}</option>
              <option value="___newMdiv___" @click="createNewMdiv">[new mdiv]</option>
            </select>
          </div>

          <div class="form-group customFormGroup">
            <label class="form-switch">
              <input type="checkbox" v-if="measure.label !== null" checked>
              <input type="checkbox" v-else>
              <i class="form-icon customIcon"></i> <span class="customLabel">Explicit @label:</span>
            </label>
            <label class="form-text modalInput">
              <input type="text" v-if="measure.label !== null" :value="measure.label">
              <input type="text" v-else :value="measure.n" disabled>
              <i class="form-icon"></i>
            </label>
          </div>

          <div class="form-group customFormGroup">
            <label class="form-switch">
              <input type="checkbox" v-if="measure.multiRest !== null" checked>
              <input type="checkbox" v-else>
              <i class="form-icon customIcon"></i> <span class="customLabel">Multiple measure rest:</span>
            </label>
            <label class="form-number modalInput">
              <input type="number" v-if="measure.multiRest !== null" :value="measure.multiRest" disabled="disabled">
              <input type="number" v-else placeholder="1" disabled="disabled">
              <i class="form-icon"></i>
            </label>
          </div>

          <!--<button class="btn btn-error" @click="closeModal">Delete Measure</button>-->
        </div>
      </div>
      <div class="modal-footer">
        <a class="btn btn-link" href="#close" @click="closeModal">Close</a>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'MeasureModal',
  components: {

  },
  computed: {
    mdivs: function () {
      return this.$store.getters.mdivs
    },
    currentMdiv: function () {
      return this.$store.getters.currentMdiv
    },
    measure: function () {
      return this.$store.getters.currentMeasure
    },
    visible: {
      get () {
        return this.$store.getters.imageSelectionModalVisible
      }
    },
    url: {

      get () {
        return this.$store.getters.message
      },
      set (val) {
        this.$store.dispatch('changeMessage', val)
      }

    }
  },
  methods: {
    selectMdiv: function (id) {
      console.log('selected ' + id)
    },
    createNewMdiv: function () {
      console.log('create new mdiv')
    },
    closeModal: function () {
      this.$store.dispatch('setModal', null)
    }
  }
}
</script>

<style lang="scss" scoped>

.modal-container .modal-body {
    padding: 0 .8rem;
}

.modal-container .modal-footer {
  padding: 0 .8rem .8rem;
}

.customFormGroup {
  position: relative;
  margin: 0 0 1.5rem;

  .customLabel {
    position: absolute;
    top: 0;
    left: 0;
  }

  .customIcon {
    position: absolute;
    top: 1.9rem;
    left: 0;
  }

  .modalInput input {
    position: relative;
    right: -1rem;
  }

}
</style>
