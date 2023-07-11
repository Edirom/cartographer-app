<template>
  <div class="modal modal-sm active">
    <a
      href="#close"
      class="modal-overlay"
      aria-label="Close"
      @click="closeModal"
    ></a>
    <div class="modal-container">
      <div class="modal-header">
        <a
          href="#close"
          class="btn btn-clear float-right"
          aria-label="Close"
          @click="closeModal"
        ></a>
        <div class="modal-title h5">Get git path</div>
      </div>
      <div class="modal-body">
        <div class="content">
          <div class="form-group">
            <label class="form-label" for="manifest-uri-input"
              >Path</label
            >
            <input
              class="form-input"
              type="text"
              v-model="path"
              id="manifest-uri-input"
              placeholder="Path"
            />
            <!-- <select v-model="selectedDirectory"  @change="setBranches(selectedDirectory)">               
              <option v-for="directory in getRepositorys" :value="directory">{{ directory.name }}</option>
            </select
            <label class="form-label" for="manifest-uri-input"
              >Directory</label
            >
            <input
              class="form-input"
              type="Directory"
              id="manifest-uri-input"
              placeholder="Directory"
            />> -->
            <label class="form-label" for="manifest-uri-input"
              ></label>
              <label class="form-label" for="manifest-uri-input"
              ></label>
              <label class="form-label" for="manifest-uri-input"
              ></label>
            <!-- <select>
              <option v-for="branch in gerBranches" :value="branch.name">{{ branch.name }}</option>
            </select> -->
             <!-- <label class="form-label" for="manifest-uri-input"
              >Path</label
            >
           <select>
              <option>Path</option>
            </select> -->
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <a class="btn btn" href="#close" @click="closeModal">Cancel</a>
        <button class="btn btn-primary" @click="main(path)">Import</button>
      </div>
    </div>
  </div>
</template>

<script>
export default { 
  name: 'IIIFModal',
  data() {
    return {
      selectedDirectory: '',// initialize the selected directory to an empty string
      inputValue: ''
    }

  },
  components: {},
  computed: {
    getRepositorys: function () {
  const directories = this.$store.getters.getGitRepositotries
  return directories
},
getRepository: function () {
  const gitRepo = this.$store.getters.getGitRepositotry
  return gitRepo
},
gerBranches: function (){
  const gitBranches = this.$store.getters.getGitBranches
}
  },
  methods: {
    useTestUri () {
      this.$el.querySelector('#manifest-uri-input').value = this.testUri
    },
    // setBranches (selectedDirectory) {
    //   this.$store.dispatch('setBranches', selectedDirectory)
    // },
    main (path) {
      this.$store.dispatch('setBranches', path)
      this.$store.getters.pagesGit
     
      // const input = document.querySelector('#manifest-uri-input')
      // if (input.validity.valid) {
      //   this.$store.dispatch('importIIIF', input.value)
      //   this.closeModal()
      // }
    },
    closeModal: function () {
      this.$store.dispatch('toggleLoadGitModal')
      
    }
  }

}


</script>

<style lang="scss" scoped>
.modal.modal-sm .modal-container {
  max-width: 360px;
}

.modal-container .modal-body {
  padding: 0 0.8rem;
}

.modal-container .modal-footer {
  padding: 0 0.8rem 0.8rem;
}

.prop {
  text-align: left;
  font-size: 0.7rem;
  margin-bottom: 0.5rem;

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
