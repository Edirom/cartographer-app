<template>
  <div class="modal active">
    <a href="#close" class="modal-overlay" aria-label="Close" @click.prevent="closeModal"></a>
    <div class="modal-container" style="max-width: 480px;">
      <div class="modal-header">
        <button class="btn btn-clear float-right" aria-label="Close" @click="closeModal"></button>
        <div class="modal-title h5">
          <font-awesome-icon icon="fa-solid fa-code-commit" class="mr-1" />
          Commit to GitHub
        </div>
      </div>

      <div class="modal-body">
        <!-- Conflict alert -->
        <div v-if="isConflict" class="toast toast-error" style="margin-bottom: 0.8rem;">
          <strong>Conflict detected.</strong> The file on GitHub was modified after you loaded it.
          Please reload the file from GitHub to get the latest version, then re-apply your changes.
        </div>

        <!-- General error -->
        <div v-else-if="errorMsg" class="toast toast-error" style="margin-bottom: 0.8rem;">
          {{ errorMsg }}
        </div>

        <!-- File info -->
        <p v-if="githubFile" class="text-small text-gray" style="margin-bottom: 0.6rem;">
          <template v-if="githubFile.sha">
            Updating <strong>{{ githubFile.repo }}</strong>:
            <code>{{ githubFile.path }}</code>
          </template>
          <template v-else>
            Creating new file in <strong>{{ githubFile.repo }}</strong>:
            <code>{{ githubFile.path }}</code>
          </template>
        </p>

        <!-- Commit message input (hidden when conflict) -->
        <div v-if="!isConflict" class="form-group">
          <label class="form-label" for="commit-message">Commit message</label>
          <textarea
            id="commit-message"
            class="form-input"
            v-model="commitMessage"
            rows="3"
            placeholder="Update MEI file via Cartographer"
            :disabled="committing"
            style="resize: vertical;"
            ref="messageInput"
          ></textarea>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn" @click="closeModal">
          {{ isConflict ? 'Close' : 'Cancel' }}
        </button>
        <button
          v-if="!isConflict"
          class="btn btn-primary"
          :disabled="!commitMessage.trim() || committing"
          :class="{ loading: committing }"
          @click="doCommit"
        >
          Commit
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommitModal',
  data () {
    return {
      commitMessage: 'Update MEI file via Cartographer',
      committing: false,
      errorMsg: null,
      isConflict: false,
    }
  },
  computed: {
    githubFile () { return this.$store.getters.githubFile },
  },
  mounted () {
    this.$nextTick(() => {
      if (this.$refs.messageInput) this.$refs.messageInput.focus()
    })
  },
  methods: {
    closeModal () {
      this.$store.dispatch('toggleCommitModal')
    },
    async doCommit () {
      this.committing = true
      this.errorMsg = null
      this.isConflict = false
      try {
        await this.$store.dispatch('commitToGithub', this.commitMessage.trim())
        this.closeModal()
      } catch (err) {
        if (err.isConflict) {
          this.isConflict = true
        } else {
          this.errorMsg = err.message || 'Failed to commit to GitHub.'
        }
      } finally {
        this.committing = false
      }
    },
  },
}
</script>

<style scoped lang="scss">
.modal-container .modal-body {
  padding: 0 0.8rem;
}
.modal-container .modal-footer {
  padding: 0 0.8rem 0.8rem;
  display: flex;
  gap: 0.4rem;
  justify-content: flex-end;
}
</style>
