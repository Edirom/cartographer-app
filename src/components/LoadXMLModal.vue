<template>
  <div class="modal modal-sm active">
    <a href="#close" class="modal-overlay" aria-label="Close" @click="closeModal"></a>
    <div class="modal-container">
      <div class="modal-header">
        <a href="#close" class="btn btn-clear float-right" aria-label="Close" @click="closeModal"></a>
        <div class="modal-title h5">Lade XML</div>
      </div>
      <div class="modal-body">
        <div class="content">
         <button class="btn btn-link" @click="testData()">Load test data</button>
         <input type="file" id="mei-file-input" accept=".xml, .mei" />
        </div>
      </div>
      <div class="modal-footer">
         <button class="btn" @click="closeModal()">Cancel</button>
         <button class="btn btn-primary" @click="main()">Load</button>
      </div>
    </div>
  </div>
</template>

<script>

const testUri = 'testfile.xml'

/**
 * A Parser for reading in the XML Document
 * @type {DOMParser}
 */
const parser = new DOMParser()

export default {
  name: 'XMLModal',
  components: {
  },
  computed: {
  },
  methods: {
    testData () {
      fetch(testUri)
        .then(res => {
          return res.text()
        })
        .then(xml => {
          const mei = parser.parseFromString(xml, 'application/xml')
          this.$store.dispatch('setData', mei)
          this.closeModal()
        })
    },
    main () {
      const input = document.querySelector('#mei-file-input')
      const [file] = input.files
      if (file) {
        const reader = new FileReader()
        reader.addEventListener('load', () => {
          console.log(file)
          const xml = reader.result
          const mei = parser.parseFromString(xml, 'application/xml')
          this.$store.dispatch('setData', mei)
          this.closeModal()
        })
        reader.readAsText(file)
      }
    },
    closeModal: function () {
      this.$store.dispatch('toggleLoadXMLModal')
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
