
<template>
  <div class="modal modal-sm active">
    <a href="#close" class="modal-overlay" aria-label="Close" @click="closeModal"></a>
    <div class="modal-container">
      <div class="modal-header">
        <a href="#close" class="btn btn-clear float-right" aria-label="Close" @click="closeModal"></a>
        <div class="modal-title h5">Movement {{currentMdiv.index + 1}}</div>
      </div>
      <div class="modal-body">
        <div class="content">
          <div class="prop">
            <span class="desc">ID:</span>
            <span class="value">{{currentMdiv.id}}</span>
          </div>
          <!--<div class="prop">
            <span class="desc">Position (1-based):</span>
            <span class="value">{{currentMdiv.index + 1}}</span>
          </div>-->
          <div class="form-group customFormGroup">
            <label class="form-label text-left" for="mdivLabel">Label</label>
            <input class="form-input" id="mdivLabel" type="text" v-model="mdivLabel">
          </div>
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
    currentMdiv: function () {
      return this.$store.getters.currentMdiv
    },
    mdivLabel: {
      get () {
        return this.currentMdiv.label
      },
      set (val) {
        this.$store.dispatch('setCurrentMdivLabel', val)
      }
    }
  },
  methods: {
    closeModal: function () {
      this.$store.dispatch('toggleMdivModal')
    }
  }
}
</script>

<style lang="scss" scoped>

.modal.modal-sm .modal-container {
  max-width: 360px;
}

.modal-container .modal-body {
    padding: 0 .8rem;
}

.modal-container .modal-footer {
  padding: 0 .8rem .8rem;
}

.prop {
  text-align: left;
  font-size: .7rem;
  margin-bottom: .5rem;

  .desc {
    display: block;
  }

  .value {
    display: block;
    color: #999999;
  }
}

.customFormGroup {
  position: relative;
}
</style>
