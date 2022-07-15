import Vue from 'vue'
import Vuex from 'vuex'

import { iiifManifest2mei, checkIiifManifest, getPageArray } from '@/tools/iiif.js'
import { meiZone2annotorious, annotorious2meiZone, generateMeasure, insertMeasure, addZoneToLastMeasure } from '@/tools/meiMappings.js'

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
    processing: false,
    multiZoneMode: false,
    selectedZoneId: null,
    currentMdivId: null //,
    // TODO isScore: true
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
    SELECT_ZONE (state, id) {
      state.selectedZoneId = id
    },
    CREATE_ZONE_FROM_ANNOTORIOUS (state, annot) {
      const xmlDoc = state.xmlDoc.cloneNode(true)
      console.log('create ', annot)
      const index = state.currentPage + 1
      const surface = xmlDoc.querySelector('surface:nth-child(' + index + ')')

      const zone = annotorious2meiZone(annot)
      surface.appendChild(zone)

      // standard mode -> create new measure for zone
      if (!state.multiZoneMode) {
        const measure = generateMeasure()
        measure.setAttribute('facs', '#' + zone.getAttribute('xml:id'))
        insertMeasure(xmlDoc, measure, state)

      // add zone to last existing measure in file
      } else if (state.multiZoneMode && state.selectedZoneId === null) {
        addZoneToLastMeasure(xmlDoc, zone.getAttribute('xml:id'))
      }

      Vue.set(state, 'xmlDoc', xmlDoc)
    },
    UPDATE_ZONE_FROM_ANNOTORIOUS (state, annot) {
      const xmlDoc = state.xmlDoc.cloneNode(true)
      // console.log('update', annot)
      // create new zone from the annot, then transfer its position to the old one
      const newZone = annotorious2meiZone(annot)

      // const query = '[*|id=' + newZone.getAttribute('xml:id') + ']'
      // const existingZone = xmlDoc.querySelector(query)

      const pageIndex = state.currentPage + 1
      const surface = xmlDoc.querySelector('surface:nth-child(' + pageIndex + ')')
      const zones = surface.querySelectorAll('zone')
      const existingZone = [...zones].find(zone => zone.getAttribute('xml:id') === newZone.getAttribute('xml:id'))

      // TODO: why is this?
      /*
      const query1 = '[*|id="' + newZone.getAttribute('xml:id') + '"]'
      const query2 = '[*|id="mercatorApp"]'
      const query3 = 'zone'

      const temp1 = xmlDoc.querySelector(query1)
      const temp2 = xmlDoc.querySelector(query2)
      const temp3 = xmlDoc.querySelector(query3)

      console.log('query1: ' + query1)
      console.log(temp1)
      console.log('query2: ' + query2)
      console.log(temp2)
      console.log('query3: ' + query3)
      console.log(temp3)
      console.log('complicated retrieval:')
      console.log(existingZone)
      */
      existingZone.setAttribute('ulx', newZone.getAttribute('ulx'))
      existingZone.setAttribute('uly', newZone.getAttribute('uly'))
      existingZone.setAttribute('lrx', newZone.getAttribute('lrx'))
      existingZone.setAttribute('lry', newZone.getAttribute('lry'))

      Vue.set(state, 'xmlDoc', xmlDoc)
    },
    TOGGLE_MULTIZONE_MODE (state) {
      state.multiZoneMode = !state.multiZoneMode
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
    async autoDetectZonesOnCurrentPage ({ commit, state }) {
      const imageUri = state.pages[state.currentPage].uri + '/full/full/0/default.jpg'
      const blob = await fetch(imageUri).then(r => r.blob())

      const successFunc = (json) => {
        commit('SET_LOADING', false)
        console.log('success')
        console.log(json)
      }

      const errorFunc = (err) => {
        commit('SET_LOADING', false)
        console.log('error retrieving autodetected measure positions for ' + imageUri + ': ' + err)
      }
      const formdata = new FormData()
      formdata.append('Content-Type', 'image/jpg')
      formdata.append('filename', 'image.jpg')
      formdata.append('image', blob, 'image.jpg')

      const requestOptions = {
        method: 'POST',
        body: formdata
      }
      commit('SET_LOADING', true)
      fetch('https://measure-detector.edirom.de/upload', requestOptions)
        .then(response => response.json())
        .then(json => successFunc(json))
        .catch(error => errorFunc(error))
    },
    setData ({ commit }, mei) {
      const pageArray = getPageArray(mei)
      commit('SET_PAGES', pageArray)

      commit('SET_XML_DOC', mei)

      commit('SET_CURRENT_PAGE', 0)
      commit('SET_PROCESSING', false)
      commit('SET_MODAL', null)
    },
    selectZone ({ commit }, id) {
      commit('SELECT_ZONE', id)
    },
    createZone ({ commit }, annot) {
      commit('CREATE_ZONE_FROM_ANNOTORIOUS', annot)
    },
    updateZone ({ commit }, annot) {
      commit('UPDATE_ZONE_FROM_ANNOTORIOUS', annot)
    },
    toggleMultiZone ({ commit }) {
      commit('TOGGLE_MULTIZONE_MODE')
    }
  },
  getters: {
    isReady: state => {
      return state.xmlDoc !== null
    },
    isLoading: state => {
      return state.loading
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
        if (zone.getAttribute('xml:id') !== state.selectedZoneId) {
          annots.push(meiZone2annotorious(state.xmlDoc, zone, pageUri))
        }
      })
      return annots
    },
    measures: state => {
      if (state.xmlDoc === null) {
        return []
      }
      const measures = [...state.xmlDoc.querySelectorAll('measure')]

      return measures
    },
    multiZoneActive: state => {
      return state.multiZoneMode
    },
    selectedZone: state => {
      if (state.selectedZoneId === null || state.xmlDoc === null) {
        return null
      }
      const index = state.currentPage + 1
      const surface = state.xmlDoc.querySelector('surface:nth-child(' + index + ')')
      const zones = surface.querySelectorAll('zone')

      const zone = [...zones].find(zone => zone.getAttribute('xml:id') === state.selectedZoneId)
      const pageUri = state.pages[state.currentPage].uri
      return meiZone2annotorious(state.xmlDoc, zone, pageUri)
    }
  }
})
