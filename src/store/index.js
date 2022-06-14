import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
  },
  state: {
    imageSelectionModalVisible: false,
    message: 'text',
    manifest: null
  },
  mutations: {
    UPDATE_MESSAGE (state, txt) {
      state.message = txt
    },
    SHOW_IMAGE_SELECTION_MODAL (state, bool) {
      state.imageSelectionModalVisible = bool
    },
    SET_MANIFEST (state, manifest) {
      Vue.set(state, 'manifest', manifest)
    }

  },
  actions: {
    showImageSelectionModal ({ commit }) {
      commit('SHOW_IMAGE_SELECTION_MODAL', true)
    },
    hideImageSelectionModal ({ commit }) {
      commit('SHOW_IMAGE_SELECTION_MODAL', false)
    },
    changeMessage ({ commit }, val) {
      commit('UPDATE_MESSAGE', val)
    },
    getManifest ({ commit }, uri) {
      return new Promise(resolve => {
        fetch(uri)
          .then(response => {
            if (response.status !== 200) {
              console.log('Houston, we have a problem…')
            }
            return response.json()
          })
          .then(manifest => {
            commit('SET_MANIFEST', manifest)
          })
      })
    }
  },
  getters: {
    imageSelectionModalVisible: state => {
      return state.imageSelectionModalVisible
    },
    message: state => {
      return state.message
    },
    manifest: state => {
      return state.manifest
    },
    imageArray: state => {
      if (state.manifest === null) {
        return []
      }

      const arr = []
      state.manifest.sequences.forEach((seq) => {
        seq.canvases.forEach((can) => {
          arr.push(can.images[0].resource.service['@id'])
        })
      })
      return arr
    }
  }
})
