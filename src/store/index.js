import { createStore } from 'vuex'
import { iiifManifest2mei, checkIiifManifest, getPageArray } from '@/tools/iiif.js'
import { meiZone2annotorious, annotorious2meiZone, measureDetector2meiZone, generateMeasure, insertMeasure, addZoneToLastMeasure, deleteZone, setMultiRest, createNewMdiv, moveContentToCurrentMdiv } from '@/tools/meiMappings.js'

import { mode as allowedModes } from '@/store/constants.js'

const parser = new DOMParser()
const serializer = new XMLSerializer()

export default createStore({
  modules: {
  },
  state: {
    xmlDoc: null,
    pages: [],
    currentPage: -1,
    showMeasureModal: false,
    showMdivModal: false,
    loading: false,
    processing: false,
    mode: allowedModes.selection,
    selectedZoneId: null,
    hoveredZoneId: null,
    currentMdivId: null,
    totalZones: 0,
    resultingArray: [],
    deleteZoneId: null,
    anno: null,
    currentMeasureId: null // used for the MeasureModal

    // TODO isScore: true
  },
  mutations: {
    TOGGLE_MEASURE_MODAL (state) {
      state.showMeasureModal = !state.showMeasureModal
    },
    TOGGLE_MDIV_MODAL (state) {
      state.showMdivModal = !state.showMdivModal
    },
    HIDE_MODALS (state) {
      state.showMeasureModal = false
      state.showMdivModal = false
    },
    SET_ANNO (state, anno) {
      state.anno = anno
    },
    SET_XML_DOC (state, xmlDoc) {
      state.xmlDoc = xmlDoc
      state.currentPage = 0
    },
    SET_PAGES (state, pageArray) {
      state.pages = pageArray
    },
    SET_CURRENT_PAGE (state, i) {
      if (i > -1 && i < state.pages.length) {
        state.currentPage = i
      }
    },
    SET_TOTAL_ZONES_COUNT (state, j) {
      state.totalZones = state.totalZones + j
      console.log('this is j ' + state.totalZones)
    },
    SET_LOADING (state, bool) {
      state.loading = bool
    },
    SET_PROCESSING (state, bool) {
      state.processing = bool
    },
    SELECT_ZONE (state, id) {
      state.selectedZoneId = id
    },
    HOVER_ZONE (state, id) {
      state.hoveredZoneId = id
    },
    CREATE_ZONE_FROM_ANNOTORIOUS (state, annot) {
      const xmlDoc = state.xmlDoc.cloneNode(true)
      console.log('create ', annot)
      const index = state.currentPage + 1
      const surface = xmlDoc.querySelector('surface:nth-child(' + index + ')')

      const zone = annotorious2meiZone(annot)
      surface.appendChild(zone)

      // standard mode -> create new measure for zone
      if (state.mode === allowedModes.manualRect) {
        const measure = generateMeasure()
        measure.setAttribute('facs', '#' + zone.getAttribute('xml:id'))
        insertMeasure(xmlDoc, measure, state, zone, state.currentPage)

      // add zone to last existing measure in file
      } else if (state.mode === allowedModes.additionalZone && state.selectedZoneId === null) {
        addZoneToLastMeasure(xmlDoc, zone.getAttribute('xml:id'))
      }

      state.xmlDoc = xmlDoc
      console.log(state.xmlDoc)
    },
    CREATE_ZONES_FROM_MEASURE_DETECTOR_ON_PAGE (state, { rects, pageIndex }) {
      const xmlDoc = state.xmlDoc.cloneNode(true)
      const index = pageIndex + 1 // pageIndex is expected to be zero-based
      const surface = xmlDoc.querySelector('surface:nth-child(' + index + ')')

      rects.forEach(rect => {
        const zone = measureDetector2meiZone(rect)
        surface.appendChild(zone)
        const measure = generateMeasure()
        measure.setAttribute('facs', '#' + zone.getAttribute('xml:id'))
        insertMeasure(xmlDoc, measure, state, zone, pageIndex)
      })

      state.xmlDoc = xmlDoc
    },
    UPDATE_ZONE_FROM_ANNOTORIOUS (state, annot) {
      const xmlDoc = state.xmlDoc.cloneNode(true)
      const newZone = annotorious2meiZone(annot)

      const pageIndex = state.currentPage + 1
      const surface = xmlDoc.querySelector('surface:nth-child(' + pageIndex + ')')
      const zones = surface.querySelectorAll('zone')
      const existingZone = [...zones].find(zone => zone.getAttribute('xml:id') === newZone.getAttribute('xml:id'))

      existingZone.setAttribute('ulx', newZone.getAttribute('ulx'))
      existingZone.setAttribute('uly', newZone.getAttribute('uly'))
      existingZone.setAttribute('lrx', newZone.getAttribute('lrx'))
      existingZone.setAttribute('lry', newZone.getAttribute('lry'))

      state.xmlDoc = xmlDoc
    },
    SET_MODE (state, mode) {
      if (mode in allowedModes) {
        state.mode = mode
      }
    },
    SET_CURRENT_MEASURE_ID (state, zoneId) {
      if (zoneId === null) {
        state.currentMeasureId = null
      } else {
        const measure = state.xmlDoc.querySelector('measure[facs~="#' + zoneId + '"]')
        state.currentMeasureId = measure.getAttribute('xml:id')
      }
    },
    SET_CURRENT_MEASURE_LABEL (state, val) {
      if (state.currentMeasureId !== null) {
        const xmlDoc = state.xmlDoc.cloneNode(true)
        const mdivs = [...xmlDoc.querySelectorAll('mdiv')]
        const mdiv = mdivs.find(mdiv => mdiv.getAttribute('xml:id') === state.currentMdivId)
        const measures = [...mdiv.querySelectorAll('measure')]
        const measure = measures.find(measure => measure.getAttribute('xml:id') === state.currentMeasureId)

        if (val === null) {
          measure.removeAttribute('label')
        } else {
          measure.setAttribute('label', val)
        }
        state.xmlDoc = xmlDoc
      }
    },
    SET_CURRENT_MEASURE_MULTI_REST (state, val) {
      if (state.currentMeasureId !== null) {
        const xmlDoc = state.xmlDoc.cloneNode(true)
        const mdivs = [...xmlDoc.querySelectorAll('mdiv')]
        const mdiv = mdivs.find(mdiv => mdiv.getAttribute('xml:id') === state.currentMdivId)
        const measures = [...mdiv.querySelectorAll('measure')]
        const measure = measures.find(measure => measure.getAttribute('xml:id') === state.currentMeasureId)

        setMultiRest(measure, val)

        state.xmlDoc = xmlDoc
      }
    },
    SET_CURRENT_MDIV_LABEL (state, val) {
      if (state.currentMdivId !== null && state.xmlDoc !== null) {
        const xmlDoc = state.xmlDoc.cloneNode(true)
        const mdivs = [...xmlDoc.querySelectorAll('mdiv')]
        const mdiv = mdivs.find(mdiv => mdiv.getAttribute('xml:id') === state.currentMdivId)

        mdiv.setAttribute('label', val)

        state.xmlDoc = xmlDoc
      }
    },
    CREATE_NEW_MDIV (state) {
      const xmlDoc = state.xmlDoc.cloneNode(true)
      state.currentMdivId = createNewMdiv(xmlDoc, state.currentMdivId)
      moveContentToCurrentMdiv(xmlDoc, state.currentMeasureId, state.currentMdivId)
      state.xmlDoc = xmlDoc
    }
  },
  actions: {
    toggleMeasureModal ({ commit }) {
      commit('TOGGLE_MEASURE_MODAL')
    },
    toggleMdivModal ({ commit }) {
      commit('TOGGLE_MDIV_MODAL')
    },
    setCurrentPage ({ commit }, i) {
      console.log('setting current page to ' + i)
      commit('SET_CURRENT_PAGE', i)
    },
    setCurrentPageZone ({ commit }, j) {
      commit('SET_TOTAL_ZONES_COUNT', j)
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
      const pageIndex = state.currentPage
      const imageUri = state.pages[pageIndex].uri + '/full/full/0/default.jpg'
      const blob = await fetch(imageUri).then(r => r.blob())

      const successFunc = (json) => {
        commit('SET_LOADING', false)
        console.log('success')
        console.log(json)

        // do some sorting here, if necessary
        // then call measure generation
        console.log('this is from autodetect thing')
        commit('CREATE_ZONES_FROM_MEASURE_DETECTOR_ON_PAGE', { rects: json.measures, pageIndex })
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
      commit('HIDE_MODALS')
    },
    selectZone ({ commit }, id) {
      commit('SELECT_ZONE', id)
    },
    clickZone ({ commit, state }, id) {
      if (state.mode === allowedModes.deletion) {
        state.deleteZoneId = id
        const xmlDoc = state.xmlDoc.cloneNode(true)
        deleteZone(xmlDoc, id, state)
        state.xmlDoc = xmlDoc
      }
    },
    clickMeasureLabel ({ commit }, zoneId) {
      console.log('clicked measure label')
      commit('SET_CURRENT_MEASURE_ID', zoneId)
      commit('TOGGLE_MEASURE_MODAL')
    },
    closeMeasureNumberModal ({ commit }) {
      commit('SET_CURRENT_MEASURE_ID', null)
      commit('TOGGLE_MEASURE_MODAL')
    },
    hoverZone ({ commit }, id) {
      commit('HOVER_ZONE', id)
    },
    unhoverZone ({ commit, state }, id) {
      // commit('SELECT_ZONE', id)
      if (state.hoveredZoneId === id) {
        commit('HOVER_ZONE', null)
      }
      console.log('unhovering ' + id)
    },
    createZone ({ commit }, annot) {
      commit('SET_ANNO', annot)
      commit('CREATE_ZONE_FROM_ANNOTORIOUS', annot)
    },
    deleteZone ({ commit }, id) {
      commit('DELETE_ZONE', id)
    },
    updateZone ({ commit }, annot) {
      commit('UPDATE_ZONE_FROM_ANNOTORIOUS', annot)
    },
    setMode ({ commit }, mode) {
      commit('SET_MODE', mode)
    },
    setCurrentMeasureLabel ({ commit }, val) {
      commit('SET_CURRENT_MEASURE_LABEL', val)
    },
    setCurrentMeasureMultiRest ({ commit }, val) {
      commit('SET_CURRENT_MEASURE_MULTI_REST', val)
    },
    setCurrentMdivLabel ({ commit }, val) {
      commit('SET_CURRENT_MDIV_LABEL', val)
    },
    createNewMdiv ({ commit }) {
      commit('CREATE_NEW_MDIV')
    }
  },
  getters: {
    isReady: state => {
      return state.xmlDoc !== null
    },
    isLoading: state => {
      return state.loading
    },
    totalZones: state => {
      return state.totalZones
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
    mdivs: state => {
      if (state.xmlDoc === null) {
        return []
      }
      const arr = []
      state.xmlDoc.querySelectorAll('mdiv').forEach((mdiv, index) => {
        arr.push({
          id: mdiv.getAttribute('xml:id'),
          label: mdiv.getAttribute('label'),
          index
        })
      })
      return arr
    },
    currentMdiv: state => {
      if (state.currentMdivId === null || state.xmlDoc === null) {
        return null
      }

      const mdivs = [...state.xmlDoc.querySelectorAll('mdiv')]
      const index = mdivs.findIndex(mdiv => mdiv.getAttribute('xml:id') === state.currentMdivId)

      if (index === -1) {
        return null
      }

      const mdiv = mdivs[index]

      return {
        id: mdiv.getAttribute('xml:id'),
        label: mdiv.getAttribute('label'),
        index: index
      }
    },
    currentMeasure: state => {
      if (state.currentMeasureId === null || state.xmlDoc === null) {
        return null
      }

      // const mdivs = [...state.xmlDoc.querySelectorAll('mdiv')]
      // const mdiv = mdivs.find(mdiv => mdiv.getAttribute('xml:id') === state.currentMdivId)
      const measures = [...state.xmlDoc.querySelectorAll('measure')]
      const measure = measures.find(measure => measure.getAttribute('xml:id') === state.currentMeasureId)

      const multiRestElem = measure.querySelector('multiRest')
      const multiRest = (multiRestElem !== null) ? multiRestElem.getAttribute('num') : null

      const label = measure.hasAttribute('label') ? measure.getAttribute('label') : null

      const n = measure.getAttribute('n')
      const id = measure.getAttribute('xml:id')

      return {
        id,
        n,
        label,
        multiRest
      }
    },
    mode: state => {
      return state.mode
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
    },
    showMeasureModal: state => {
      return state.showMeasureModal
    },
    showMdivModal: state => {
      return state.showMdivModal
    }
  }
})
