import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
  },
  state: {
    wrongInputModalVisible: false,
    imageSelectionModalVisible: false,
    message: null,
    manifest: null,
    uri: null
  },
  mutations: {
    UPDATE_MESSAGE (state, txt) {
      state.message = txt
    },
    SHOW_WRONG_INPUT_MODAL (state, bool) {
      state.wrongInputModalVisible = bool
    },
    SHOW_IMAGE_SELECTION_MODAL (state, bool) {
      state.imageSelectionModalVisible = bool
    },
    SET_MANIFEST (state, manifest) {
      Vue.set(state, 'manifest', manifest)
    },
    UPDATE_URI (state, uri) {
      state.uri = uri
    }
  },
  actions: {
    showImageSelectionModal ({ commit }) {
      commit('SHOW_IMAGE_SELECTION_MODAL', true)
    },
    hideImageSelectionModal ({ commit }) {
      commit('SHOW_IMAGE_SELECTION_MODAL', false)
    },
    showWrongInputModalVisible ({ commit }) {
      commit('SHOW_WRONG_INPUT_MODAL', true)
    },
    hideWrongInputModalVisible ({ commit }) {
      commit('SHOW_WRONG_INPUT_MODAL', false)
    },
    changeMessage ({ commit }, val) {
      commit('UPDATE_MESSAGE', val)
    },
    getUri ({ commit }, val) {
      commit('UPDATE_URI', val)
    },
    getManifestWithoutParameter ({ commit }) {
      // fetch(state.uri)
      var myHeaders = new Headers()
      myHeaders.append('method', 'post')
      myHeaders.append('path', '/upload')
      myHeaders.append('Access-Control-Allow-Origin', '*')
      myHeaders.append('Accept', 'application/json, text/plain, */*')
      myHeaders.append('Content-Disposition', 'form-data; name="image"; filename="https://digital.blb-karlsruhe.de/i3f/v21/6295250/full/304/0/default.jpg"')

      var formdata = new FormData()
      formdata.append('Content-Type', 'image/jpg')
      formdata.append('filename', 'test.jpg')
      formdata.append('image', 'https://digital.blb-karlsruhe.de/i3f/v21/6295250/full/304/0/default.jpg')

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      }
      fetch('https://measure-detector.edirom.de/upload', requestOptions)
        .then(response => response.text())
        .then(result => console.log('this is the fetch result ', result))
        .catch(error => console.log('error', error))
    },
    getManifest ({ commit }, uri) {
      console.log(uri)
      const regex = /^(http|https)/
      if (uri.length > 3 && uri.match(regex)) {
        console.log('this is url')
      } else {
        commit('SHOW_WRONG_INPUT_MODAL', true)
        return
      }
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
    wrongInputModalVisible: state => {
      return state.wrongInputModalVisible
    },
    message: state => {
      return state.message
    },
    manifest: state => {
      return state.manifest
    },
    uri: state => {
      return state.uri
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
