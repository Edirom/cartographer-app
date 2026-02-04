<template>
  <div class="modal modal-sm active">
    <a href="#close" class="modal-overlay" aria-label="Close" @click="closeModal"></a>
    <div class="modal-container">
      <div class="modal-header">
        <a href="#close" class="btn btn-clear float-right" aria-label="Close" @click="closeModal"></a>
        <div class="modal-title h5">Load Local Images</div>
      </div>
      <div class="modal-body">
        <div class="content">
          <div class="form-group">
            <label class="form-label" for="folder-input">Choose Folder</label>
            <input 
              type="file" 
              id="folder-input" 
              webkitdirectory 
              directory 
              multiple 
              @change="handleFolderSelection"
            />
          </div>
          <div v-if="selectedImages.length > 0" class="image-info">
            <p><strong>Selected Images: {{ selectedImages.length }}</strong></p>
            <div class="image-list">
              <div v-for="(image, index) in selectedImages" :key="index" class="image-item">
                <span>{{ image.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
         <button class="btn" @click="closeModal()">Cancel</button>
         <button class="btn btn-primary" @click="importImages()" :disabled="selectedImages.length === 0">Import</button>
      </div>
    </div>
  </div>
</template>

<script>
import { convertLocalImagesToPages, sortImageFiles } from '@/tools/localImages.js'

export default {
  name: 'LoadLocalImage',
  data: () => ({
    selectedImages: [],
    selectedFolderPath: ''
  }),
  components: {
  },
  computed: {
  },
  methods: {
    handleFolderSelection (event) {
      const files = event.target.files
      if (files.length > 0) {
        // Extract folder path from the first file's path
        const firstFilePath = files[0].webkitRelativePath || ''
        const folderPath = firstFilePath.split('/')[0]
        this.selectedFolderPath = folderPath
        console.log('Selected folder path:', folderPath)
        console.log('Total files in folder:', files.length)
        
        // Filter only image files
        const imageFiles = Array.from(files).filter(file => {
          return /\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)$/i.test(file.name)
        })
        
        this.selectedImages = imageFiles.map(file => ({
          name: file.webkitRelativePath || file.name,
          file: file
        }))
        
        console.log('Image files found:', this.selectedImages.length)
      }
    },
    importImages () {
      if (this.selectedImages.length > 0) {
        console.log('Folder path:', this.selectedFolderPath)
        console.log('Number of images:', this.selectedImages.length)
        console.log('Image files:', this.selectedImages.map(img => img.name))
        
        // Sort images by name
        const sortedImages = sortImageFiles(this.selectedImages.map(img => img.file))
        
        // Convert images to pages and dispatch to store
        convertLocalImagesToPages(sortedImages)
          .then(pages => {
            console.log('Converted pages:', pages)
            // Pass original MEI if it exists (to preserve zones/measures)
            const originalMei = this.$store.state.xmlDoc
            if (originalMei) {
              console.log('Dispatching addLocalImagePages with original MEI')
              this.$store.dispatch('addLocalImagePages', { pages, originalMei })
            } else {
              console.log('Dispatching addLocalImagePages without original MEI')
              this.$store.dispatch('addLocalImagePages', pages)
            }
            // Modal will close via HIDE_MODALS commit in addLocalImagePages action
          })
          .catch(error => {
            console.error('Error loading images:', error)
            alert('Failed to load some images. Check console for details.')
          })
      }
    },
    closeModal: function () {
      this.$store.commit('TOGGLE_LOADLOCALIMAGE_MODAL', false)
      this.selectedImages = []
      this.selectedFolderPath = ''
    }
  }
}
</script>

<style lang="scss" scoped>

.modal.modal-sm .modal-container {
  max-width: 400px;
}

.modal-container .modal-body {
    padding: 0 .8rem;
}

.modal-container .modal-footer {
  padding: 0 .8rem .8rem;
}

.form-group {
  text-align: left;
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

#folder-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.image-info {
  text-align: left;
  margin-top: 1rem;
}

.image-list {
  max-height: 250px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 0.5rem;
  margin-top: 0.5rem;
}

.image-item {
  padding: 0.3rem;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.85rem;
  
  &:last-child {
    border-bottom: none;
  }
}
</style>
