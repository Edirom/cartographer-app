import { createStore } from 'vuex'
import { iiifManifest2mei, checkIiifManifest, getPageArray } from '@/tools/iiif.js'
import { meiZone2annotorious, annotorious2meiZone, measureDetector2meiZone, generateMeasure, insertMeasure, addZoneToLastMeasure, deleteZone, setMultiRest, createNewMdiv, moveContentToMdiv, toggleAdditionalZone, addImportedPage } from '@/tools/meiMappings.js'

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
    showLoadXMLModal: false,
    showLoadIIIFModal: false,
    showMeasureModal: false,
    showMdivModal: false,
    showPagesModal: false,
    showPageImportModal: false,
    showMeasureList: false,
    loading: false,
    processing: false,
    mode: allowedModes.selection,
    existingMusicMode: false,
    selectedZoneId: null,
    hoveredZoneId: null,
    currentMdivId: null,
    totalZones: 0,
    resultingArray: [],
    deleteZoneId: null,
    anno: null,
    importingImages: [],
    currentMeasureId: null // used for the MeasureModal

    // TODO isScore: true
  },
  mutations: {
    TOGGLE_LOADXML_MODAL (state) {
      state.showLoadXMLModal = !state.showLoadXMLModal
    },
    TOGGLE_LOADIIIF_MODAL (state) {
      state.showLoadIIIFModal = !state.showLoadIIIFModal
    },
    TOGGLE_MEASURE_MODAL (state) {
      state.showMeasureModal = !state.showMeasureModal
    },
    TOGGLE_PAGES_MODAL (state) {
      state.showPagesModal = !state.showPagesModal
    },
    TOGGLE_PAGE_IMPORT_MODAL (state) {
      state.showPageImportModal = !state.showPageImportModal
    },
    TOGGLE_MDIV_MODAL (state) {
      state.showMdivModal = !state.showMdivModal
    },
    HIDE_MODALS (state) {
      state.showMeasureModal = false
      state.showMdivModal = false
    },
    TOGGLE_MEASURE_LIST (state) {
      state.showMeasureList = !state.showMeasureList
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
      // console.log('this is j ' + state.totalZones)
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
      // console.log('create ', annot)
      const index = state.currentPage + 1
      const surface = xmlDoc.querySelector('surface:nth-child(' + index + ')')

      const zone = annotorious2meiZone(annot)
      surface.appendChild(zone)

      if (state.existingMusicMode) {
        // standard mode -> add zone to first measure without zone
        if (state.mode === allowedModes.manualRect) {
          const lastMeasureWithoutZone = xmlDoc.querySelector('music measure:not([facs])')
          if (lastMeasureWithoutZone !== null) {
            state.currentMdivId = lastMeasureWithoutZone.closest('mdiv').getAttribute('xml:id')
            lastMeasureWithoutZone.setAttribute('facs', '#' + zone.getAttribute('xml:id'))
          }

        // add extra zone to last measure that already has one
        } else if (state.mode === allowedModes.additionalZone) {
          const lastMeasureWithZone = [...xmlDoc.querySelectorAll('music measure[facs]')].at(-1)
          if (lastMeasureWithZone !== null) {
            state.currentMdivId = lastMeasureWithZone.closest('mdiv').getAttribute('xml:id')
            lastMeasureWithZone.setAttribute('facs', lastMeasureWithZone.getAttribute('facs') + ' #' + zone.getAttribute('xml:id'))
          }
        }
      } else {
        // standard mode -> create new measure for zone
        if (state.mode === allowedModes.manualRect) {
          const measure = generateMeasure()
          measure.setAttribute('facs', '#' + zone.getAttribute('xml:id'))
          insertMeasure(xmlDoc, measure, state, zone, state.currentPage)

        // add zone to last existing measure in file
        } else if (state.mode === allowedModes.additionalZone && state.selectedZoneId === null) {
          addZoneToLastMeasure(xmlDoc, zone.getAttribute('xml:id'))
        }
      }

      state.xmlDoc = xmlDoc
      // console.log(state.xmlDoc)
    },
    CREATE_ZONES_FROM_MEASURE_DETECTOR_ON_PAGE (state, { rects, pageIndex }) {
      const xmlDoc = state.xmlDoc.cloneNode(true)
      const index = pageIndex + 1 // pageIndex is expected to be zero-based
      const surface = xmlDoc.querySelector('surface:nth-child(' + index + ')')

      rects.forEach(rect => {
        const zone = measureDetector2meiZone(rect)
        surface.appendChild(zone)
        if (!state.existingMusicMode) {
          const measure = generateMeasure()
          measure.setAttribute('facs', '#' + zone.getAttribute('xml:id'))
          insertMeasure(xmlDoc, measure, state, zone, pageIndex)
        } else {
          const lastMeasureWithoutZone = xmlDoc.querySelector('music measure:not([facs])')
          if (lastMeasureWithoutZone !== null) {
            state.currentMdivId = lastMeasureWithoutZone.closest('mdiv').getAttribute('xml:id')
            lastMeasureWithoutZone.setAttribute('facs', '#' + zone.getAttribute('xml:id'))
          }
        }
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
    TOGGLE_EXISTING_MUSIC_MODE (state) {
      state.existingMusicMode = !state.existingMusicMode
    },
    SET_CURRENT_MEASURE_ID (state, id) {
      if (id === null) {
        state.currentMeasureId = null
      } else {
        let measure = [...state.xmlDoc.querySelectorAll('measure')].find(measure => measure.getAttribute('xml:id') === id)
        if (measure === undefined) {
          measure = state.xmlDoc.querySelector('measure[facs~="#' + id + '"]')
        }
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
    SET_PAGE_LABEL (state, { index, val }) {
      const xmlDoc = state.xmlDoc.cloneNode(true)
      const surface = xmlDoc.querySelectorAll('surface')[index]
      surface.setAttribute('label', val)
      state.xmlDoc = xmlDoc
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
      moveContentToMdiv(xmlDoc, state.currentMeasureId, state.currentMdivId, state)
      state.xmlDoc = xmlDoc
    },
    SELECT_MDIV (state, id) {
      if (state.currentMeasureId !== null) {
        const xmlDoc = state.xmlDoc.cloneNode(true)
        moveContentToMdiv(xmlDoc, state.currentMeasureId, id, state)
        state.currentMdivId = id
        state.xmlDoc = xmlDoc
      }
    },
    SET_CURRENT_MDIV (state, id) {
      state.currentMdivId = id
    },
    REGISTER_IMAGE_IMPORT (state, { url, index }) {
      state.importingImages[index] = { index, url, width: null, height: null, status: 'loading' }
    },
    RECEIVE_IMAGE_IMPORT (state, { url, index, json }) {
      state.importingImages[index].status = 'success'
      state.importingImages[index].width = json.width
      state.importingImages[index].height = json.height
    },
    FAILED_IMAGE_IMPORT (state, { url, index }) {
      state.importingImages[index].status = 'failed'
    },
    ACCEPT_IMAGE_IMPORTS (state) {
      const xmlDoc = state.xmlDoc.cloneNode(true)
      state.importingImages.forEach(page => {
        addImportedPage(xmlDoc, page.index, page.url, page.width, page.height)
      })
      const pageArray = getPageArray(xmlDoc)
      state.pages = pageArray
      state.importingImages = []
      state.showPagesImportModal = false
      state.xmlDoc = xmlDoc
    },
    CANCEL_IMAGE_IMPORTS (state) {
      state.importingImages = []
      state.showPagesImportModal = false
      console.log('cancel imports')
    }
  },
  actions: {
    toggleLoadXMLModal ({ commit }) {
      commit('TOGGLE_LOADXML_MODAL')
    },
    toggleLoadIIIFModal ({ commit }) {
      commit('TOGGLE_LOADIIIF_MODAL')
    },
    toggleMeasureModal ({ commit }) {
      commit('TOGGLE_MEASURE_MODAL')
    },
    togglePagesModal ({ commit }) {
      commit('TOGGLE_PAGES_MODAL')
    },
    togglePageImportModal ({ commit }) {
      commit('TOGGLE_PAGE_IMPORT_MODAL')
    },
    toggleMdivModal ({ commit }) {
      commit('TOGGLE_MDIV_MODAL')
    },
    toggleMeasureList ({ commit }) {
      commit('TOGGLE_MEASURE_LIST')
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
    importXML ({ commit, dispatch }, mei) {
      fetch(mei)
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
    async autoDetectZonesOnAllPage ({ commit, state }) {
      for (let i = 0; i < state.pages.length; i++) {
        const pageIndex = i + 1
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
      }
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
      } else if (state.mode === allowedModes.additionalZone) {
        console.log('clicked on existing zone')
        const xmlDoc = state.xmlDoc.cloneNode(true)
        toggleAdditionalZone(xmlDoc, id, state)
        state.xmlDoc = xmlDoc
      }
    },
    clickMeasureLabel ({ commit }, id) {
      console.log('clicked measure label')
      commit('SET_CURRENT_MEASURE_ID', id)
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
    toggleExistingMusicMode ({ commit }) {
      commit('TOGGLE_EXISTING_MUSIC_MODE')
    },
    setCurrentMeasureLabel ({ commit }, val) {
      commit('SET_CURRENT_MEASURE_LABEL', val)
    },
    setCurrentMeasureMultiRest ({ commit }, val) {
      commit('SET_CURRENT_MEASURE_MULTI_REST', val)
    },
    setPageLabel ({ commit }, { index, val }) {
      commit('SET_PAGE_LABEL', { index, val })
    },
    setCurrentMdiv ({ commit }, id) {
      commit('SET_CURRENT_MDIV', id)
    },
    setCurrentMdivLabel ({ commit }, val) {
      commit('SET_CURRENT_MDIV_LABEL', val)
    },
    createNewMdiv ({ commit }) {
      commit('CREATE_NEW_MDIV')
    },
    selectMdiv ({ commit }, id) {
      commit('SELECT_MDIV', id)
    },
    registerImageImports ({ commit }, urls) {
      const arr = urls.replace(/\s+/g, ' ').trim().split(' ')
      arr.forEach((url, index) => {
        commit('REGISTER_IMAGE_IMPORT', { url, index })
        fetch(url)
          .then(res => res.json())
          .then(json => {
            console.log('retrieved info.json for ' + url)
            commit('RECEIVE_IMAGE_IMPORT', { url, index, json })
            console.log(json)
          })
          .catch(err => {
            console.log('Unable to fetch ' + url + ': ' + err)
            commit('FAILED_IMAGE_IMPORT', { url, index })
          })
      })
    },
    acceptImageImports ({ commit }) {
      commit('ACCEPT_IMAGE_IMPORTS')
    },
    cancelImageImports ({ commit }) {
      commit('CANCEL_IMAGE_IMPORTS')
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
    pagesDetailed: state => {
      const arr = []
      state.pages.forEach(page => {
        const obj = {
          tileSource: page.uri,
          dim: page.width + 'x' + page.height,
          n: page.n,
          label: page.label
        }
        arr.push(obj)
      })

      return arr
    },
    currentPageObject: state => {
      return state.pages[state.currentPage]
    },
    zonesOnCurrentPage: state => {
      if (state.xmlDoc === null || state.currentPage === -1) {
        return []
      }
      const index = state.currentPage + 1
      const surface = state.xmlDoc.querySelector('surface:nth-child(' + index + ')')

      if (surface === null) {
        return []
      }

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
    measuresByMdivId: state => (id) => {
      if (state.xmlDoc === null) {
        return []
      }
      const arr = []
      const mdiv = [...state.xmlDoc.querySelectorAll('mdiv')].find(mdiv => mdiv.getAttribute('xml:id') === id)
      mdiv.querySelectorAll('measure').forEach((measure, index) => {
        let zones = []
        if (measure.hasAttribute('facs')) {
          zones = measure.getAttribute('facs').replace(/\s+/g, ' ').trim().split(' ')
        }
        const mrElem = measure.querySelector('multiRest')
        const multiRest = (mrElem === null) ? null : parseInt(mrElem.getAttribute('num'))
        arr.push({
          id: measure.getAttribute('xml:id'),
          n: measure.getAttribute('n'),
          label: measure.getAttribute('label'),
          multiRest,
          zones,
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

      const mdiv = measure.closest('mdiv').getAttribute('xml:id')

      const multiRestElem = measure.querySelector('multiRest')
      const multiRest = (multiRestElem !== null) ? multiRestElem.getAttribute('num') : null

      const label = measure.hasAttribute('label') ? measure.getAttribute('label') : null

      const n = measure.getAttribute('n')
      const id = measure.getAttribute('xml:id')

      return {
        id,
        n,
        label,
        multiRest,
        mdiv
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
    showLoadIIIFModal: state => state.showLoadIIIFModal,
    showLoadXMLModal: state => state.showLoadXMLModal,
    showMeasureModal: state => state.showMeasureModal,
    showPagesModal: state => state.showPagesModal,
    showPageImportModal: state => state.showPageImportModal,
    showMdivModal: state => state.showMdivModal,
    showMeasureList: state => state.showMeasureList,
    importingImages: state => state.importingImages,
    readyForImageImport: state => {
      let bool = true
      if (state.importingImages.length === 0) {
        return false
      }
      state.importingImages.every(img => {
        if (img.status !== 'success') {
          bool = false
          return false
        }
        return true
      })
      return bool
    },
    existingMusicMode: state => {
      return state.existingMusicMode
    },
    firstMeasureWithoutZone: state => {
      if (state.xmlDoc === null) {
        return null
      }
      const measure = state.xmlDoc.querySelector('music measure:not([facs])')
      if (measure === null) {
        return null
      }
      return measure.getAttribute('xml:id')
    }
  }
})
