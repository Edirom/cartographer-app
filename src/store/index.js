import { createStore } from 'vuex'
import { iiifManifest2mei, checkIiifManifest, getPageArray } from '@/tools/iiif.js'
import { meiZone2annotorious, annotorious2meiZone, measureDetector2meiZone, generateMeasure, insertMeasure, addZoneToLastMeasure, deleteZone, setMultiRest, createNewMdiv, moveContentToMdiv, toggleAdditionalZone, addImportedPage,getPreviousMeasure } from '@/tools/meiMappings.js'

import { mode as allowedModes } from '@/store/constants.js'

const parser = new DOMParser()
const serializer = new XMLSerializer()

function getDefaultState() {
  return {
 selectedRepo: null,            // Currently selected GitHub repository
      selectedDirectory: null,       // Currently selected directory within the repo
      directories: [],               // List of directories in the selected repo
      repos: null,                   // List of available repositories
      xmlDoc: null,                  // The loaded MEI XML document (DOM)
      currentMdiv: null,            // The currently selected movement (mdiv)
      nextMdiv: null,                // The next mdiv to be created (if applicable)  
      previousMdiv: null,            // The previous mdiv (if applicable)
      pages: [],                     // Array of page objects (from MEI or IIIF)
      currentPage: -1,               // Index of the currently selected page
      showLoadXMLModal: false,       // Show/hide modal for loading XML files
      showLoadIIIFModal: false,      // Show/hide modal for loading IIIF manifests
      showLoadGitModal: false,       // Show/hide modal for loading from Git
      showMeasureModal: false,       // Show/hide modal for editing measure labels/numbers
      showMdivModal: false,          // Show/hide modal for movement (mdiv) management
      showPagesModal: false,         // Show/hide modal for page management
      showPageImportModal: false,    // Show/hide modal for importing pages/images
      showMeasureList: false,        // Show/hide the measure list panel
      loading: false,                // Indicates if the app is currently loading data
      logedin: false,                // Indicates if the user is logged in
      processing: false,             // Indicates if the app is processing data
      pageDimension: [],             // Array of [width, height] for each page
      mode: allowedModes.selection,  // Current editor mode (selection, manualRect, etc.)
      existingMusicMode: false,      // True if working with existing music content
      selectedZoneId: null,          // xml:id of the currently selected zone
      hoveredZoneId: null,           // xml:id of the currently hovered zone
      currentMdivId: null,           // xml:id of the currently selected mdiv
      totalZones: 0,                 // Total number of zones in the document
      resultingArray: [],            // Generic array for storing results (usage varies)
      deleteZoneId: null,            // xml:id of the zone to be deleted
      anno: null,                    // Current annotation object (Annotorious)
      canvases: [],                  // IIIF canvases (if loaded)
      importingImages: [],           // Array of images being imported (with status)
      currentMeasureId: null,        // xml:id of the currently selected measure
      infoJson: [],                   // Array of IIIF info.json URLs for canvases
      newFirstMeasure: "",            // The first measure of the old mdiv for selecting a new mdiv
      oldMdiv : null,
      selectedMdiv: null,             // The mdiv that is selected in the mdiv modal
      currentMdiv: null,
      insertMdivup: false,
      currentMeasure: null,
  }
}

export default createStore({
  modules: {
  },
    state: getDefaultState(),
  /**
 * Vuex mutations for managing application state.
 * Each mutation updates a specific part of the state in response to actions or UI events.
 *
 * - RESET_STATE: Resets the entire application state to its default values.
 * - TOGGLE_LOADXML_MODAL: Toggle the visibility of the XML file load modal.
 * - TOGGLE_LOADIIIF_MODAL: Toggle the visibility of the IIIF manifest load modal.
 * - TOGGLE_LOADGIT_MODAL: Toggle the visibility of the GitHub load modal.
 * - TOGGLE_MEASURE_MODAL: Toggle the visibility of the measure label/number modal.
 * - TOGGLE_PAGES_MODAL: Toggle the visibility of the page management modal.
 * - TOGGLE_PAGE_IMPORT_MODAL: Toggle the visibility of the page/image import modal.
 * - TOGGLE_MDIV_MODAL: Toggle the visibility of the movement (mdiv) management modal.
 * - HIDE_MODALS: Hide both the measure and mdiv modals.
 * - TOGGLE_MEASURE_LIST: Toggle the visibility of the measure list panel.
 * - SET_ANNO: Set the current annotation object.
 * - SET_SELECTED_DIRECTORY: Set the currently selected directory in the repo.
 * - SET_XML_DOC: Set the loaded MEI XML document and reset the current page to 0.
 * - SET_PAGES: Set the array of page objects.
 * - SET_CURRENT_PAGE: Set the index of the currently selected page.
 * - SET_TOTAL_ZONES_COUNT: Increment the total number of zones by a given value.
 * - SET_LOADING: Set the loading state (true/false).
 * - SET_PROCESSING: Set the processing state (true/false).
 * - SELECT_ZONE: Set the xml:id of the currently selected zone.
 * - HOVER_ZONE: Set the xml:id of the currently hovered zone.
 * - CREATE_ZONE_FROM_ANNOTORIOUS: Create a new zone from an Annotorious annotation and update the MEI document accordingly.
 * - CREATE_ZONES_FROM_MEASURE_DETECTOR_ON_PAGE: Create zones from detected rectangles and update the MEI document.
 * - UPDATE_ZONE_FROM_ANNOTORIOUS: Update an existing zone's coordinates from an Annotorious annotation.
 * - SET_MODE: Set the current editor mode.
 * - TOGGLE_EXISTING_MUSIC_MODE: Toggle whether the app is in existing music mode.
 * - SET_CURRENT_MEASURE_ID: Set the xml:id of the currently selected measure.
 * - SET_CURRENT_MEASURE_LABEL: Set or remove the label of the current measure.
 * - SET_CURRENT_MEASURE_MULTI_REST: Set, update, or remove a multiRest element in the current measure.
 * - SET_PAGE_LABEL: Set the label for a specific page.
 * - SET_CURRENT_MDIV_LABEL: Set the label for the current mdiv.
 * - CREATE_NEW_MDIV: Create a new mdiv and move content to it.
 * - SELECT_MDIV: Move content to a selected mdiv and update the current mdiv id.
 * - SET_CURRENT_MDIV: Set the xml:id of the currently selected mdiv.
 * - REGISTER_IMAGE_IMPORT: Register an image being imported (with status).
 * - RECEIVE_IMAGE_IMPORT: Mark an image import as successful and store its dimensions.
 * - FAILED_IMAGE_IMPORT: Mark an image import as failed.
 * - ACCEPT_IMAGE_IMPORTS: Add all successfully imported images as pages to the MEI document.
 * - CANCEL_IMAGE_IMPORTS: Cancel all pending image imports and hide the import modal.
 * - CURRENT_MDIV: Set the current mdiv object.
 * - NEXT_MDIV: Set the next mdiv object.
 * - PREVIOUS_MDIV: Set the previous mdiv object.
 */
  mutations: {
    RESET_STATE(state) {
        Object.assign(state, getDefaultState())
      },
    TOGGLE_LOADXML_MODAL(state) {
      state.showLoadXMLModal = !state.showLoadXMLModal
    },
    TOGGLE_LOADIIIF_MODAL(state) {
      state.showLoadIIIFModal = !state.showLoadIIIFModal
    },
    TOGGLE_LOADGIT_MODAL(state) {
      state.showLoadGitModal = !state.showLoadGitModal
    },
    TOGGLE_MEASURE_MODAL(state) {
      state.showMeasureModal = !state.showMeasureModal
    },
    TOGGLE_PAGES_MODAL(state) {
      state.showPagesModal = !state.showPagesModal
    },
    TOGGLE_PAGE_IMPORT_MODAL(state) {
      state.showPageImportModal = !state.showPageImportModal
    },
    TOGGLE_MDIV_MODAL(state) {
      state.showMdivModal = !state.showMdivModal
    },
    HIDE_MODALS(state) {
      state.showMeasureModal = false
      state.showMdivModal = false
    },
    TOGGLE_MEASURE_LIST(state) {
      state.showMeasureList = !state.showMeasureList
    },
    SET_ANNO(state, anno) {
      state.anno = anno
    },
    SET_SELECTED_DIRECTORY(state, gitdirec) {
      state.selectedDirectory = gitdirec
    },
    SET_XML_DOC(state, xmlDoc) {
      console.log("this is the xml doc in set ", xmlDoc)
      state.xmlDoc = xmlDoc
      state.currentPage = 0
    },
    SET_PAGES(state, pageArray) {
      state.pages = pageArray
      console.log("this is the length of pages ", state.pages)
    },
    SET_CURRENT_PAGE(state, i) {
      console.log("page is changed ", state.pages.length)
      if (i > -1 && i < state.pages.length) {
        state.currentPage = i
      }
    },
    SET_TOTAL_ZONES_COUNT(state, j) {
      state.totalZones = state.totalZones + j
      // console.log('this is j ' + state.totalZones)
    },
    SET_LOADING(state, bool) {
      state.loading = bool
    },
    SET_PROCESSING(state, bool) {
      state.processing = bool
    },
    SELECT_ZONE(state, id) {
      state.selectedZoneId = id
    },
    HOVER_ZONE(state, id) {
      state.hoveredZoneId = id
    },
    CREATE_ZONE_FROM_ANNOTORIOUS(state, annot) {

      if (state.mode !== allowedModes.selection) {

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
            console.log("previous measure is ", getPreviousMeasure(state.currentMeasure)
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
            console.log("zone is ", zone)
            insertMeasure(xmlDoc, measure, state, zone, state.currentPage)


            // add zone to last existing measure in file
          } else if (state.mode === allowedModes.additionalZone && state.selectedZoneId === null) {
            addZoneToLastMeasure(xmlDoc, zone.getAttribute('xml:id'))
          }
        }

        state.xmlDoc = xmlDoc
        // console.log(state.xmlDoc)
      }
    },
    CREATE_ZONES_FROM_MEASURE_DETECTOR_ON_PAGE(state, { rects, pageIndex }) {
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
    UPDATE_ZONE_FROM_ANNOTORIOUS(state, annot) {
      const xmlDoc = state.xmlDoc.cloneNode(true)
      const newZone = annotorious2meiZone(annot)
      console.log("annotation is ", annot)

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
    SET_MODE(state, mode) {
      if (mode in allowedModes) {
        state.mode = mode
      }
    },
    TOGGLE_EXISTING_MUSIC_MODE(state) {
      state.existingMusicMode = !state.existingMusicMode
    },
    SET_CURRENT_MEASURE_ID(state, id) {
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
    SET_CURRENT_MEASURE_LABEL(state, val) {
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
    SET_CURRENT_MEASURE_MULTI_REST(state, val) {
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
    SET_PAGE_LABEL(state, { index, val }) {
      const xmlDoc = state.xmlDoc.cloneNode(true)
      const surface = xmlDoc.querySelectorAll('surface')[index]
      surface.setAttribute('label', val)
      state.xmlDoc = xmlDoc
    },
    SET_CURRENT_MDIV_LABEL(state, val) {
      if (state.currentMdivId !== null && state.xmlDoc !== null) {
        const xmlDoc = state.xmlDoc.cloneNode(true)
        const mdivs = [...xmlDoc.querySelectorAll('mdiv')]
        const mdiv = mdivs.find(mdiv => mdiv.getAttribute('xml:id') === state.currentMdivId)

        mdiv.setAttribute('label', val)

        state.xmlDoc = xmlDoc
      }
    },
    CREATE_NEW_MDIV(state) {
      console.log("new case 1 creating new mdiv")
      const xmlDoc = state.xmlDoc.cloneNode(true)
            console.log("new case 2 creating new mdiv")
      state.currentMdivId = createNewMdiv(xmlDoc, state.currentMdivId)
            console.log("new case 3 creating new mdiv")

      moveContentToMdiv(xmlDoc, state.currentMeasureId, state.currentMdivId, state)
            console.log("new case 4 creating new mdiv")

      state.xmlDoc = xmlDoc
    },
    SELECT_MDIV(state, selectedMdiv) {
      // const xmlDoc = state.xmlDoc.cloneNode(true)
      // state.currentMdiv = xmlDoc.querySelector('mdiv[xml\\:id="' +  currentMdiv + '"]')
      // state.selectedMdiv = xmlDoc.querySelector('mdiv[xml\\:id="' + selectedMdiv + '"]')

      // if (state.selectedMdiv && state.currentMdiv) {
      //   const selectedN = parseInt(state.selectedMdiv.getAttribute('n'))
      //   const currentN = parseInt(state.currentMdiv.getAttribute('n'))
      //   console.log("line 341 elected ",selectedN, " currentN ", currentN)

      //   if (!isNaN(selectedN) && !isNaN(currentN) && selectedN > currentN) {
      //    console.log("")
      //    state.insertMdivup = true
      //   }
      // } else {
      //   console.warn("Could not find selectedMdiv or currentMdiv in XML.")
      // }
        const xmlDoc = state.xmlDoc.cloneNode(true)
        const mdivs = [...state.xmlDoc.querySelectorAll('mdiv')]
        state.currentMdiv = mdivs.find(mdiv => {
        const measures = Array.from(mdiv.getElementsByTagName('measure'));
        return measures.find(measure => measure.getAttribute('xml:id') === state.currentMeasureId);
      });
       state.selectedMdiv = mdivs.find(mdiv =>mdiv.getAttribute("xml:id") === selectedMdiv)

      
      if (state.currentMeasureId !== null) {
        moveContentToMdiv(xmlDoc, state.currentMeasureId, selectedMdiv, state)
        state.currentMdivId = selectedMdiv
        state.xmlDoc = xmlDoc
      }
    },
    SET_CURRENT_MDIV(state, id) {
      state.currentMdivId = id
    },
    REGISTER_IMAGE_IMPORT(state, { url, index }) {
      state.importingImages[index] = { index, url, width: null, height: null, status: 'loading' }
    },
    RECEIVE_IMAGE_IMPORT(state, { url, index, json }) {
      state.importingImages[index].status = 'success'
      state.importingImages[index].width = json.width
      state.importingImages[index].height = json.height
    },
    FAILED_IMAGE_IMPORT(state, { url, index }) {
      state.importingImages[index].status = 'failed'
    },
    ACCEPT_IMAGE_IMPORTS(state) {
      const xmlDoc = state.xmlDoc.cloneNode(true)
      state.importingImages.forEach(page => {
        addImportedPage(xmlDoc, page.index, page.url, page.width, page.height)
      })
      console.log("state is index", state)
      const pageArray = getPageArray(xmlDoc, state)
      state.pages = pageArray
      state.importingImages = []
      state.showPagesImportModal = false
      state.xmlDoc = xmlDoc
    },
    CANCEL_IMAGE_IMPORTS(state) {
      state.importingImages = []
      state.showPagesImportModal = false
      console.log('cancel imports')
    },
    CURRENT_MDIV(state, mdiv) {
      state.currentMdiv = mdiv
    },
    NEXT_MDIV(state, mdiv) {
      state.nextMdiv = mdiv
    },
    PREVIOUS_MDIV(state, mdiv) {
      state.previousMdiv = mdiv
    }
  },
  /**
 * Vuex actions for asynchronous operations and complex state updates.
 * Actions can dispatch mutations, perform async tasks, and coordinate multiple state changes.
 *
 * - fetchDirectories: Fetches directory listings from a GitHub repository (example, not fully implemented).
 * - resetAll: Resets the entire application state to its default values.
 * - toggleLoadXMLModal: Toggles the visibility of the XML file load modal.
 * - toggleLoadIIIFModal: Toggles the visibility of the IIIF manifest load modal.
 * - toggleMeasureModal: Toggles the visibility of the measure label/number modal.
 * - togglePagesModal: Toggles the visibility of the page management modal.
 * - togglePageImportModal: Toggles the visibility of the page/image import modal.
 * - toggleMdivModal: Toggles the visibility of the movement (mdiv) management modal.
 * - toggleMeasureList: Toggles the visibility of the measure list panel.
 * - setCurrentPage: Sets the currently selected page index.
 * - setCurrentPageZone: Updates the total number of zones on the current page.
 * - importIIIF: Imports a IIIF manifest, fetches image info, and converts to MEI (two implementations: sequential and concurrent).
 * - importXML: Loads an MEI XML file and parses it into the application state.
 * - autoDetectZonesOnCurrentPage: Sends the current page image to a remote service for automatic measure detection.
 * - autoDetectZonesOnAllPage: Runs automatic measure detection for all pages.
 * - setData: Sets the MEI document and updates related state (pages, processing, modals).
 * - selectZone: Selects a zone by xml:id.
 * - clickZone: Handles zone click events (deletion or additional zone logic).
 * - clickMeasureLabel: Opens the measure label/number modal for a measure.
 * - closeMeasureNumberModal: Closes the measure label/number modal.
 * - hoverZone: Sets the currently hovered zone.
 * - unhoverZone: Clears the hovered zone if it matches the given id.
 * - createZone: Creates a new zone from an annotation.
 * - deleteZone: Deletes a zone by xml:id.
 * - updateZone: Updates a zone's coordinates from an annotation.
 * - setMode: Sets the current editor mode.
 * - toggleExistingMusicMode: Toggles whether the app is in existing music mode.
 * - setCurrentMeasureLabel: Sets or removes the label for the current measure.
 * - setCurrentMeasureMultiRest: Sets, updates, or removes a multiRest element in the current measure.
 * - setPageLabel: Sets the label for a specific page.
 * - setCurrentMdiv: Sets the currently selected mdiv by xml:id.
 * - setDirectory: Sets the currently selected directory.
 * - setCurrentMdivLabel: Sets the label for the current mdiv.
 * - createNewMdiv: Creates a new mdiv and moves content to it.
 * - selectMdiv: Moves content to a selected mdiv and updates the current mdiv id.
 * - registerImageImports: Registers images for import and fetches their info.json data.
 * - acceptImageImports: Adds all successfully imported images as pages to the MEI document.
 * - cancelImageImports: Cancels all pending image imports and hides the import modal.
 */
  actions: {
    async fetchDirectories({ state, commit }) {
      try {
        const url = `https://api.github.com/repos/${state.username}/${state.repository}/contents/${state.path}`;
        const headers = { Authorization: `token ${state.accessToken}` };
        //const response = await axios.get(url, { headers });
        // const directories = response.data.filter(item => item.type === 'dir').map(item => item.name);
        // commit('setDirectories', directories);
      } catch (error) {
        console.error(error);
      }
    },
    resetAll({ commit }) {
      commit('RESET_STATE')
    },
    toggleLoadXMLModal({ commit }) {
      commit('TOGGLE_LOADXML_MODAL')
    },
    toggleLoadIIIFModal({ commit }) {
      commit('TOGGLE_LOADIIIF_MODAL')
    },
    toggleMeasureModal({ commit }) {
      commit('TOGGLE_MEASURE_MODAL')
    },
    togglePagesModal({ commit }) {
      commit('TOGGLE_PAGES_MODAL')
    },
    togglePageImportModal({ commit }) {
      commit('TOGGLE_PAGE_IMPORT_MODAL')
    },
    toggleMdivModal({ commit }) {
      commit('TOGGLE_MDIV_MODAL')
    },
    toggleMeasureList({ commit }) {
      commit('TOGGLE_MEASURE_LIST')
    },
    setCurrentPage({ commit }, i) {
      console.log('setting current page to ' + i)
      commit('SET_CURRENT_PAGE', i)
    },
    setCurrentPageZone({ commit }, j) {
      commit('SET_TOTAL_ZONES_COUNT', j)
    },
    importIIIF({ commit, dispatch, state }, url) {
      commit('SET_LOADING', true);

      // Fetch the IIIF manifest
      fetch(url)
        .then(res => res.json())
        .then(json => {
          commit('SET_LOADING', false);
          commit('SET_PROCESSING', true);
    
          let canvases = json.sequences[0].canvases;
    
          // Map all canvas images to their info.json URLs
          const infoJsonUrls = canvases.map(canvas => {
            return canvas.images[0].resource.service['@id'];
          });
    
          // Store all fetch promises for info.json
          const fetchPromises = infoJsonUrls.map((infoUrl) => {
            return fetch(infoUrl)
              .then(res => res.json())
              .then(result => {
                // Check if this is a proper IIIF Manifest
                const isManifest = checkIiifManifest(json);
                if (!isManifest) {
                  throw new Error("Invalid IIIF manifest");
                }
    
                // Extract the width and height from the result
                const width = result.width;
                const height = result.height;
    
                // Return both the infoUrl and the dimensions
                return { infoUrl, dimensions: [width, height] };
              })
              .catch(error => {
                console.error(`Error fetching ${infoUrl}:`, error);
                // Return a fallback object in case of error, to keep the promise chain going
                return { infoUrl, dimensions: [null, null], error: true };
              });
          });
    
          // Use Promise.allSettled to fetch all info.json files concurrently and wait for all of them
          Promise.allSettled(fetchPromises)
            .then((results) => {
              // Update state.infoJson and state.pageDimension in batches
              results.forEach(result => {
                if (result.status === 'fulfilled') {
                  state.infoJson.push(result.value.infoUrl);
                  state.pageDimension.push(result.value.dimensions);
                }
              });
    
              // After processing all canvases, convert the manifest to MEI
              return iiifManifest2mei(json, url, parser, state);
            })
            .then(mei => {
              // Dispatch setData with the generated MEI
              dispatch('setData', mei);
            })
            .catch(err => {
              console.error('Error processing IIIF manifest or canvases:', err);
              commit('SET_LOADING', false);
              // Add any additional error messaging here
            })
            .finally(() => {
              commit('SET_PROCESSING', false); // Ensure processing is set to false after completion
            });
        })
        .catch(error => {
          // Handle errors in the initial IIIF manifest fetch
          console.error('Error fetching IIIF manifest:', error);
          commit('SET_LOADING', false);
        });
    },
        
    importXML({ commit, dispatch }, mei) {
      fetch(mei)
        .then(res => {
          return res.text()
        })
        .then(xml => {
          const mei = parser.parseFromString(xml, 'application/xml')
          dispatch('setData', mei)
        })
    },
    async autoDetectZonesOnCurrentPage({ commit, state }) {
      const pageIndex = state.currentPage
      const imageUri = state.pages[pageIndex].uri.replace(/\/info\.json/, '') + '/full/full/0/default.jpg'
      const blob = await fetch(imageUri).then(r => r.blob())
      console.log("this is blob ", imageUri)
      try {
        const pageIndex = state.currentPage;
        const imageUri = state.pages[pageIndex].uri.replace(/\/info\.json/, '') + '/full/full/0/default.jpg';
        const response = await fetch(imageUri);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const blob = await response.blob();
        // Further processing with the blob
    } catch (error) {
        console.error('Error fetching image blob:', error);
        // Handle the error gracefully
    }
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
    async autoDetectZonesOnAllPage({ commit, state }) {
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
    setData({ commit }, mei) {
      const pageArray = getPageArray(mei)
      console.log("page array is ", pageArray)
      commit('SET_PAGES', pageArray)
      console.log("this is SET_PAGES ", mei)


      commit('SET_XML_DOC', mei)
      console.log("this is SET_XML_DOC ", mei)

      commit('SET_CURRENT_PAGE', 0)
      console.log("this is SET_XML_DOC ", mei)

      commit('SET_PROCESSING', false)
      console.log("this is SET_PROCESSING ", mei)

      commit('HIDE_MODALS')
      console.log("this is HIDE_MODALS ", mei)

    },
    selectZone({ commit }, id) {
      commit('SELECT_ZONE', id)
      console.log("this is select zone")
    },
    clickZone({ commit, state }, id) {
      console.log("this is click zone")

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
    clickMeasureLabel({ commit }, id) {
      console.log('clicked measure label')
      commit('SET_CURRENT_MEASURE_ID', id)
      commit('TOGGLE_MEASURE_MODAL')
    },
    closeMeasureNumberModal({ commit }) {
      commit('SET_CURRENT_MEASURE_ID', null)
      commit('TOGGLE_MEASURE_MODAL')
    },
    hoverZone({ commit }, id) {
      commit('HOVER_ZONE', id)
    },
    unhoverZone({ commit, state }, id) {
      // commit('SELECT_ZONE', id)
      if (state.hoveredZoneId === id) {
        commit('HOVER_ZONE', null)
      }
      console.log('unhovering ' + id)
    },
    createZone({ commit }, annot) {
      commit('SET_ANNO', annot)
      commit('CREATE_ZONE_FROM_ANNOTORIOUS', annot)
    },
    deleteZone({ commit }, id) {
      commit('DELETE_ZONE', id)
    },
    updateZone({ commit }, annot) {
      commit('UPDATE_ZONE_FROM_ANNOTORIOUS', annot)
    },
    setMode({ commit }, mode) {
      commit('SET_MODE', mode)
    },
    toggleExistingMusicMode({ commit }) {
      commit('TOGGLE_EXISTING_MUSIC_MODE')
    },
    setCurrentMeasureLabel({ commit }, val) {
      commit('SET_CURRENT_MEASURE_LABEL', val)
    },
    setCurrentMeasureMultiRest({ commit }, val) {
      commit('SET_CURRENT_MEASURE_MULTI_REST', val)
    },
    setPageLabel({ commit }, { index, val }) {
      commit('SET_PAGE_LABEL', { index, val })
    },
    setCurrentMdiv({ commit }, id) {
      commit('SET_CURRENT_MDIV', id)
    },
    setDirectory({ commit }, directory) {
      commit('SET_SELECTED_DIRECTORY', directory)
    },
    setCurrentMdivLabel({ commit }, val) {
      commit('SET_CURRENT_MDIV_LABEL', val)
    },
    createNewMdiv({ commit }) {
      commit('CREATE_NEW_MDIV')
    },
    selectMdiv({ commit }, selectedMdiv ) {
     commit('SELECT_MDIV', selectedMdiv);
    },
    registerImageImports({ commit }, urls) {
      const arr = urls.replace(/\s+/g, ' ').trim().split(' ')
      console.log("this is arr in register Image " + arr)
      arr.forEach((url, index) => {
        commit('REGISTER_IMAGE_IMPORT', { url, index })
        fetch(url)
          .then(res => res.json())
          .then(json => {
            console.log('retrieved info.json for ' + url)
            commit('RECEIVE_IMAGE_IMPORT', { url, index, json })
          })
          .catch(err => {
            console.log('Unable to fetch ' + url + ': ' + err)
            commit('FAILED_IMAGE_IMPORT', { url, index })
          })
      })
    },
    acceptImageImports({ commit }) {
      commit('ACCEPT_IMAGE_IMPORTS')
    },
    cancelImageImports({ commit }) {
      commit('CANCEL_IMAGE_IMPORTS')
    },
    currentMdiv({ commit }, mdiv) {
      commit('CURRENT_MDIV', mdiv)
    },
    nextMdiv({ commit }, mdiv) {
      commit('NEXT_MDIV', mdiv)
    },
    previousMdiv({ commit }, mdiv) {        
      commit('PREVIOUS_MDIV', mdiv)
    }
  },
  /**
 * Vuex getters for accessing and computing derived state.
 * Getters provide convenient access to state properties and computed values for components.
 *
 * - isReady: Returns true if an MEI XML document is loaded.
 * - totalZones: Returns the total number of zones in the document.
 * - meiFileForDownload: Returns the serialized MEI XML as a string for download, or null if not loaded.
 * - currentPageIndexOneBased: Returns the current page index (1-based).
 * - currentPageIndexZeroBased: Returns the current page index (0-based).
 * - maxPageNumber: Returns the total number of pages.
 * - pages: Returns an array of page objects with tileSource, width, and coordinates for OpenSeadragon.
 * - pagesDetailed: Returns an array of page objects with tileSource, dimensions, page number, and label.
 * - currentPageObject: Returns the page object for the currently selected page.
 * - zonesOnCurrentPage: Returns an array of annotation objects for all zones on the current page except the selected one.
 * - measures: Returns an array of all <measure> elements in the MEI document.
 * - mdivs: Returns an array of all mdivs with id, label, and index.
 * - measuresByMdivId: Returns an array of measure objects for a given mdiv id, including zones and multiRest info.
 * - currentMdiv: Returns the currently selected mdiv object (id, label, index), or null if not set.
 * - currentMeasure: Returns the currently selected measure object (id, n, label, multiRest, mdiv), or null if not set.
 * - mode: Returns the current editor mode.
 * - selectedZone: Returns the annotation object for the currently selected zone, or null if not set.
 * - showLoadIIIFModal: Returns true if the IIIF modal is visible.
 * - showLoadGitModal: Returns true if the Git modal is visible.
 * - showLoadXMLModal: Returns true if the XML modal is visible.
 * - showMeasureModal: Returns true if the measure modal is visible.
 * - showPagesModal: Returns true if the pages modal is visible.
 * - showPageImportModal: Returns true if the page import modal is visible.
 * - showMdivModal: Returns true if the mdiv modal is visible.
 * - showMeasureList: Returns true if the measure list panel is visible.
 * - importingImages: Returns the array of images being imported.
 * - readyForImageImport: Returns true if all images are successfully imported and ready to be added as pages.
 * - existingMusicMode: Returns true if working with existing music content.
 * - firstMeasureWithoutZone: Returns the xml:id of the first measure without a zone, or null if all have zones.
 */
  getters: {
    isReady: state => {
      return state.xmlDoc !== null
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
        console.log("this is the page width and height at index", page.width, " " , page.height)
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
      console.log("this is current mdiv id ", state.currentMdivId)
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

      console.log("current measuser from state is ",   state.currentMeasure)
      // const mdivs = [...state.xmlDoc.querySelectorAll('mdiv')]
      // const mdiv = mdivs.find(mdiv => mdiv.getAttribute('xml:id') === state.currentMdivId)
      let measures = [...state.xmlDoc.querySelectorAll('measure')]

      let measure = measures.find(measure => measure.getAttribute('xml:id') === state.currentMeasureId)

      if(!measure){
        measure = state.currentMeasure
      }
      const mdiv = measure.closest('mdiv').getAttribute('xml:id')
      console.log("current measure ", measure)

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
    showLoadGitModal: state => state.showLoadGitModal,
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
    },
  }
})