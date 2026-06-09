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
        <div class="modal-title h5">Commit to GitHub</div>
      </div>
      <div class="modal-body">
        <div class="content">
          <div class="form-group">
            <label class="form-label" for="repository-input">Repository</label>
            <input
              id="repository-input"
              class="form-input"
              type="text"
              list="repository-options"
              v-model.trim="repository"
              @change="handleRepositoryChange"
              placeholder="owner/repository"
            />
            <datalist id="repository-options">
              <option v-for="repo in repositories" :key="repo" :value="repo"></option>
            </datalist>
          </div>
          <div class="form-group">
            <label class="form-label" for="branch-input">Branch</label>
            <select
              id="branch-input"
              class="form-select"
              v-model="branch"
              :disabled="!repository"
            >
              <option disabled value="">Select branch</option>
              <option v-for="branchName in availableBranches" :key="branchName" :value="branchName">{{ branchName }}</option>
              <option value="__create_new__">Create new branch…</option>
            </select>
          </div>
          <div v-if="branch === '__create_new__'" class="form-group">
            <label class="form-label" for="new-branch-input">New branch name</label>
            <input
              id="new-branch-input"
              class="form-input"
              type="text"
              v-model.trim="newBranchName"
              placeholder="feature/new-branch"
            />
          </div>
          <div class="form-group">
            <label class="form-label" for="file-name-input">File name</label>
            <input
              id="file-name-input"
              class="form-input"
              type="text"
              v-model.trim="fileName"
              placeholder="meiFile.xml"
            />
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <a class="btn btn" href="#close" @click="closeModal">Cancel</a>
        <button class="btn btn-primary" :disabled="!canCommit" @click="main()">Commit</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IIIFModal',
  data() {
    return {
      repository: '',
      branch: '',
      newBranchName: '',
      fileName: 'meiFile.xml'
    }
  },
  components: {},
  computed: {
    repositories: function () {
      return this.$store.getters.gitRepositories
    },
    availableBranches: function () {
      const branchesByRepository = this.$store.getters.gitBranches
      if (!this.repository || !branchesByRepository[this.repository]) {
        return []
      }
      return branchesByRepository[this.repository]
    },
    canCommit: function () {
      if (!this.repository || !this.fileName || !this.branch) {
        return false
      }
      if (this.branch === '__create_new__') {
        return this.newBranchName.length > 0
      }
      return true
    }
  },
  methods: {
    handleRepositoryChange () {
      this.$store.dispatch('setSelectedRepository', this.repository)
      this.branch = ''
      this.newBranchName = ''
    },
    main () {
      this.$store.dispatch('commitGithub', {
        repository: this.repository,
        branch: this.branch,
        newBranchName: this.newBranchName,
        fileName: this.fileName
      })
      this.closeModal()
    },
    closeModal: function () {
      this.$store.dispatch('toggleLoadGitModal')
    }
  },
  mounted () {
    this.repository = this.$store.getters.selectedGitRepository || ''
    this.branch = this.$store.getters.selectedGitBranch || ''
    this.fileName = this.$store.getters.gitCommitFileName || 'meiFile.xml'
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
