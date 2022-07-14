import Vue from 'vue'
import Vuex from 'vuex'

import { iiifManifest2mei, checkIiifManifest, getPageArray } from '@/tools/iiif.js'
import { meiZone2annotorious, annotorious2meiZone, generateMeasure, insertMeasure } from '@/tools/meiMappings.js'

Vue.use(Vuex)

const parser = new DOMParser()
const serializer = new XMLSerializer()

export default new Vuex.Store({
  modules: {
  },
  state: {
    xmlDoc: null,
    pages: [],
    currentPage: -1,
    modal: null,
    loading: false,
    processing: false
  },
  mutations: {
    SET_MODAL (state, modalName) {
      state.modal = modalName
    },
    SET_XML_DOC (state, xmlDoc) {
      Vue.set(state, 'xmlDoc', xmlDoc)
      state.currentPage = 0
    },
    SET_PAGES (state, pageArray) {
      Vue.set(state, 'pages', pageArray)
    },
    SET_CURRENT_PAGE (state, i) {
      if (i > -1 && i < state.pages.length) {
        state.currentPage = i
      }
    },
    SET_LOADING (state, bool) {
      state.loading = bool
    },
    SET_PROCESSING (state, bool) {
      state.process = bool
    },
    CREATE_ZONE_FROM_ANNOTORIOUS (state, annot) {
      const xmlDoc = state.xmlDoc.cloneNode(true)
      const index = state.currentPage + 1
      const surface = xmlDoc.querySelector('surface:nth-child(' + index + ')')

      const zone = annotorious2meiZone(annot)
      surface.appendChild(zone)

      const mode = 'default'
      // todo: different modes, i.e. generate new measures etc.
      if (mode === 'default') {
        const measure = generateMeasure()
        measure.setAttribute('facs', '#' + zone.getAttribute('xml:id'))
        insertMeasure(xmlDoc, measure, null)
      }
      Vue.set(state, 'xmlDoc', xmlDoc)
    }

  },
  actions: {
    setModal ({ commit }, modalName) {
      commit('SET_MODAL', modalName)
    },
    setCurrentPage ({ commit }, i) {
      console.log('setting current page to ' + i)
      commit('SET_CURRENT_PAGE', i)
    },
    importIIIF ({ commit, dispatch }, url) {
      commit('SET_LOADING', true)
      fetch(url)
        .then(res => {
          return res.json()
        })
        .then(json => {
          commit('SET_LOADING', false)
          commit('SET_PROCESSING', true)
          // check if this is a proper IIIF Manifest, then convert to MEI
          const isManifest = checkIiifManifest(json)
          console.log('isManifest: ' + isManifest)
          if (!isManifest) {
            // do some error handling
            return false
          }

          iiifManifest2mei(json, url, parser)
            .then(mei => {
              dispatch('setData', mei)
            })
        })
        .catch(err => {
          commit('SET_LOADING', false)
          console.log(err)
          // add some error message
        })
    },
    importXMLtest ({ commit, dispatch }, mei) {
      fetch('testfile.xml')
        .then(res => {
          return res.text()
        })
        .then(xml => {
          const mei = parser.parseFromString(xml, 'application/xml')
          dispatch('setData', mei)
        })
    },
    setData ({ commit }, mei) {
      const pageArray = getPageArray(mei)
      commit('SET_PAGES', pageArray)

      commit('SET_XML_DOC', mei)

      commit('SET_CURRENT_PAGE', 0)
      commit('SET_PROCESSING', false)
      commit('SET_MODAL', null)
    },
    createZone ({ commit }, annot) {
      commit('CREATE_ZONE_FROM_ANNOTORIOUS', annot)
    }
  },
  getters: {
    isReady: state => {
      return state.xmlDoc !== null
    },
    meiFileForDownload: state => {
      if (state.xmlDoc === null) {
        return null
      }
      const mei = state.xmlDoc
      return serializer.serializeToString(mei)
    },
    currentPageIndexOneBased: state => {
      return state.currentPage + 1
    },
    currentPageIndexZeroBased: state => {
      return state.currentPage
    },
    maxPageNumber: state => {
      return state.pages.length
    },
    pages: state => {
      const arr = []
      state.pages.forEach(page => {
        const obj = {
          tileSource: page.uri,
          width: page.width,
          x: 0,
          y: 0
        }
        arr.push(obj)
      })

      return arr
    },
    currentPageObject: state => {
      return state.pages[state.currentPage]
    },
    zonesOnCurrentPage: state => {
      if (state.xmlDoc === null) {
        return []
      }
      const index = state.currentPage + 1
      const surface = state.xmlDoc.querySelector('surface:nth-child(' + index + ')')
      const zones = surface.querySelectorAll('zone')
      const pageUri = state.pages[state.currentPage].uri

      const annots = []
      zones.forEach(zone => {
        annots.push(meiZone2annotorious(state.xmlDoc, zone, pageUri))
      })
      return annots
    },
    measures: state => {
      if (state.xmlDoc === null) {
        return []
      }
      const measures = [...state.xmlDoc.querySelectorAll('measure')]

      return measures
    }
  }
})
