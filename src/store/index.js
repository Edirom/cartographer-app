import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
  },
  state: {
    imageSelectionModalVisible: false
  },
  mutations: {
    SHOW_IMAGE_SELECTION_MODAL (state, bool) {
      state.imageSelectionModalVisible = bool
    }
  },
  actions: {
    showImageSelectionModal ({ commit }) {
      commit('SHOW_IMAGE_SELECTION_MODAL', true)
    },
    hideImageSelectionModal ({ commit }) {
      commit('SHOW_IMAGE_SELECTION_MODAL', false)
    }
  },
  getters: {
    imageSelectionModalVisible: state => {
      return state.imageSelectionModalVisible
    }
  }
})
