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
        <div class="modal-title h5">Load Local Images</div>
      </div>
      <div class="modal-body">
        <div class="content">
          <div class="form-group">
            <label class="form-label" for="image-input"
              >Select Images</label
            >
            <input
              class="form-input"
              type="file"
              id="image-input"
              multiple
              accept="image/*"
              @change="handleImageSelection"
            />
          </div>
          <div v-if="selectedImages.length > 0">
            <p><strong>Selected Images ({{ selectedImages.length }}):</strong></p>
            <div class="image-list">
              <div v-for="(image, index) in selectedImages" :key="index" class="image-item">
                <span>{{ image.name }}</span>
                <button class="btn btn-sm btn-error" @click="removeImage(index)">Remove</button>
              </div>
            </div>
          </div>
          <div v-else>
            <p>No images selected. Choose one or more image files to import.</p>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <a class="btn btn" href="#close" @click="closeModal">Cancel</a>
        <button class="btn btn-primary" @click="importImages" :disabled="selectedImages.length === 0">Import</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadLocalImage',
  data: () => ({
    selectedImages: []
  }),
  components: {},
  computed: {},
  methods: {
    handleImageSelection (event) {
      const files = event.target.files
      this.selectedImages = Array.from(files).map(file => ({
        name: file.name,
        file: file
      }))
    },
    removeImage (index) {
      this.selectedImages.splice(index, 1)
    },
    importImages () {
      if (this.selectedImages.length > 0) {
        // Dispatch action to store with list of image files
        this.$store.dispatch('importLocalImages', this.selectedImages.map(img => img.file))
        this.closeModal()
      }
    },
    closeModal: function () {
      this.$store.dispatch('toggleLoadLocalImageModal')
      this.selectedImages = []
    }
  }
}
</script>

<style lang="scss" scoped>
.modal.modal-sm .modal-container {
  max-width: 400px;
}

.modal-container .modal-body {
  padding: 0 0.8rem;
}

.modal-container .modal-footer {
  padding: 0 0.8rem 0.8rem;
}

.image-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 0.5rem;
}

.image-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  span {
    flex-grow: 1;
    word-break: break-word;
    font-size: 0.9rem;
  }

  button {
    margin-left: 0.5rem;
    flex-shrink: 0;
  }
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
