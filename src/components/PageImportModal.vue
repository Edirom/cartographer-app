
<template>
  <div class="modal active">
    <a href="#close" class="modal-overlay" aria-label="Close" @click="closeModal"></a>
    <div class="modal-container">
      <div class="modal-header">
        <a href="#close" class="btn btn-clear float-right" aria-label="Close" @click="closeModal"></a>
        <div class="modal-title h5">Page Import</div>
      </div>
      <div class="modal-body">
        <div class="content">
          <template v-if="importingImages.length === 0">
            <p>New pages will be imported following any existing images. Currently,
              there is no way for re-ordering pages. Multiple images can be
              separated by spaces.</p>
            <textarea ref="urls" rows="5"></textarea>
            <a class="btn btn-primary btn-sm float-right" @click="loadImages" href="#" title="Load">
              <font-awesome-icon icon="fa-solid fa-file-import"/> Load Images
            </a>
          </template>
          <template v-else>
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>@n</th>
                  <th>uri</th>
                  <th>status</th>
                  <th>dimensions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(img, i) in importingImages" :key="i">
                  <td>{{img.index + 1}}</td>
                  <td>{{img.url}}</td>
                  <td><span class="label" :class="{'label-success': img.status === 'success', 'label-error': img.status === 'failed'}">{{img.status}}</span></td>
                  <td>{{img.width !== null ? img.width + 'x' + img.height : '' }}</td>
                </tr>
              </tbody>
            </table>
          </template>
        </div>
      </div>
      <div class="modal-footer">
        <div class="btn-group">
          <a class="btn btn-primary" v-if="readyForImageImport" href="#" @click="accept">Import</a>
          <a class="btn btn-primary" v-else disabled href="#" @click="accept">Import</a>
          <a class="btn" href="#" @click="closeModal">Cancel</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PageImportModal',
  components: {

  },
  computed: {
    importingImages: function () {
      return this.$store.getters.importingImages
    },
    readyForImageImport: function () {
      return this.$store.getters.readyForImageImport
    }
  },
  methods: {
    loadImages: function () {
      const urls = this.$refs.urls.value
      console.log(urls)
      this.$store.dispatch('registerImageImports', urls)
    },
    accept: function () {
      this.$store.dispatch('acceptImageImports')
      this.$store.dispatch('togglePageImportModal')
    },
    closeModal: function () {
      this.$store.dispatch('cancelImageImports')
      this.$store.dispatch('togglePageImportModal')
    }
  }
}
</script>

<style lang="scss" scoped>

.modal-container {
    max-width: 85vw;
}

.content {
  margin: 0 0 1rem;
}

.modal-container .modal-body {
    padding: 0 .8rem;

    a {
      margin-bottom: .5rem;
    }
}

textarea {
  width: 100%;
}

.modal-container .modal-footer {
  padding: 0 .8rem .8rem;
}

</style>
