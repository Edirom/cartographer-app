
<template>
  <div class="modal modal-lg active">
    <a href="#close" class="modal-overlay" aria-label="Close" @click="closeModal"></a>
    <div class="modal-container">
      <div class="modal-header">
        <a href="#close" class="btn btn-clear float-right" aria-label="Close" @click="closeModal"></a>
        <div class="modal-title h5">Pages</div>
      </div>
      <div class="modal-body">
        <div class="content">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>@n</th>
                <th>@label</th>
                <th></th>
                <th>uri</th>
                <th>dimensions</th>
              </tr>
            </thead>
            <tbody>
              <PagesListEntry v-for="(page, i) in pages" :key="i" :index="i" :page="page"/>
            </tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer">
        <a class="btn btn-link btn-sm float-left" href="#" @click="showPageImportModal" title="Import additional Images">
          <font-awesome-icon icon="fa-solid fa-file-import"/> Import Images
        </a>
        <a class="btn btn-link" href="#close" @click="closeModal">Close</a>
      </div>
    </div>
  </div>
</template>

<script>
import PagesListEntry from '@/components/PagesListEntry.vue'

export default {
  name: 'PagesModal',
  components: {
    PagesListEntry
  },
  computed: {
    pages: function () {
      return this.$store.getters.pagesDetailed
    }
  },
  methods: {
    closeModal: function () {
      this.$store.dispatch('togglePagesModal')
    },
    showPageImportModal: function () {
      this.$store.dispatch('togglePageImportModal')
    },
    showPage: function () {
      this.$store.dispatch('setCurrentPage', this.$store.getters.currentPageIndexZeroBased + 1)
    }
  }
}
</script>

<style lang="scss" scoped>

.modal.modal-lg .modal-overlay {
  background: rgba(247, 248, 249, .75);
  backdrop-filter: blur(5px);
}

.modal.modal-lg .modal-container {
  max-width: 95vw;
  max-height: 95vh;
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
