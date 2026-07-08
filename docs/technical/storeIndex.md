# Vuex Store (`src/store/index.js`)

Centralized state management for the **Cartographer App**.  
This store wires together MEI editing, IIIF ingestion, page/zone management, and UI state.

---

## Overview

- **Framework:** Vuex (`createStore`)
- **External helpers:**
  - From `@/tools/iiif.js`: `iiifManifest2mei`, `checkIiifManifest`, `getPageArray`
  - From `@/tools/meiMappings.js`:  
    `meiZone2annotorious`, `annotorious2meiZone`, `measureDetector2meiZone`,  
    `generateMeasure`, `insertMeasure`, `addZoneToLastMeasure`, `deleteZone`,  
    `setMultiRest`, `createNewMdiv`, `moveContentToMdiv`, `toggleAdditionalZone`,  
    `addImportedPage`
  - From `@/store/constants.js`: `mode as allowedModes`
- **Parsers:** `DOMParser` (for XML → DOM), `XMLSerializer` (DOM → string)

---

## State

| Key | Type | Description |
|---|---|---|
| `allmdivs` | `Array` | Collected mdiv references (e.g., for overview lists). |
| `xmlDoc` | `Document \| null` | Loaded MEI XML document (DOM). |
| `pages` | `Array<{ uri, width, height, n?, label? }>` | Pages derived from MEI or IIIF. |
| `currentPage` | `number` | Zero-based index of the selected page (`-1` when unset). |
| `showLoadXMLModal` | `boolean` | Toggle XML import modal. |
| `showLoadIIIFModal` | `boolean` | Toggle IIIF import modal. |
| `showLoadGitModal` | `boolean` | Toggle Git import modal. |
| `showMeasureModal` | `boolean` | Toggle measure label/number modal. |
| `showMdivModal` | `boolean` | Toggle movement (mdiv) modal. |
| `showPagesModal` | `boolean` | Toggle pages management modal. |
| `showPageImportModal` | `boolean` | Toggle page import modal. |
| `showMeasureList` | `boolean` | Toggle measure list side panel. |
| `loading` | `boolean` | Global loading flag (network/IO). |
| `processing` | `boolean` | Background processing flag (transforms). |
| `pageDimension` | `Array<[width, height]>` | Dimensions collected from IIIF `info.json`. |
| `mode` | `allowedModes[key]` | Current editor mode (`selection`, `manualRect`, `additionalZone`, `deletion`, …). |
| `existingMusicMode` | `boolean` | If true, work against existing measures instead of creating new ones. |
| `selectedZoneId` | `string \| null` | Currently selected zone `xml:id`. |
| `hoveredZoneId` | `string \| null` | Currently hovered zone `xml:id`. |
| `currentMdivId` | `string \| null` | Selected mdiv `xml:id`. |
| `totalZones` | `number` | Running total of zones in the document. |
| `resultingArray` | `Array` | Scratch area for miscellaneous results. |
| `deleteZoneId` | `string \| null` | Zone to delete (used by deletion flow). |
| `anno` | `Object \| null` | Last Annotorious annotation payload. |
| `canvases` | `Array` | IIIF canvases (if needed by UI). |
| `importingImages` | `Array<{index,url,width?,height?,status}>` | Pending IIIF pages for import. |
| `currentMeasureId` | `string \| null` | Selected measure `xml:id`. |
| `infoJson` | `Array<string>` | Collected IIIF `info.json` service IDs. |


---

## Mutations

> Mutations are **synchronous** state updates. Below are the key ones grouped by domain.

### UI / Modals
- `TOGGLE_LOADXML_MODAL`, `TOGGLE_LOADIIIF_MODAL`, `TOGGLE_LOADGIT_MODAL`
- `TOGGLE_MEASURE_MODAL`, `TOGGLE_MDIV_MODAL`
- `TOGGLE_PAGES_MODAL`, `TOGGLE_PAGE_IMPORT_MODAL`
- `HIDE_MODALS` — closes measure & mdiv modals.
- `TOGGLE_MEASURE_LIST` — show/hide the measure list panel.
- `SET_LOADING(bool)`, `SET_PROCESSING(bool)`

### Core MEI & Pages
- `SET_XML_DOC(xmlDoc)` — sets MEI DOM and resets `currentPage` to `0`.
- `SET_PAGES(pageArray)` — replaces `pages` with computed array.
- `SET_CURRENT_PAGE(i)` — bounds-checked page selection.
- `SET_TOTAL_ZONES_COUNT(j)` — increments `totalZones` by `j`.

### Zones & Measures
- `SET_ANNO(anno)` — cache last annotation payload.
- `SELECT_ZONE(id)`, `HOVER_ZONE(id)`
- `CREATE_ZONE_FROM_ANNOTORIOUS(annot)`  
  Builds an MEI `<zone>` from an Annotorious annotation and:
  - **existingMusicMode = false**  
    - `mode === manualRect` → creates a **new** `<measure>` and links zone via `facs`.
    - `mode === additionalZone` (no selected zone) → appends zone to the **last existing** measure via `addZoneToLastMeasure`.
  - **existingMusicMode = true**  
    - `manualRect` → links zone to the **first measure without** a `facs`.
    - `additionalZone` → appends zone to the **last measure with** a `facs`.
- `CREATE_ZONES_FROM_MEASURE_DETECTOR_ON_PAGE({ rects, pageIndex })`  
  Converts detector rectangles → zones; either creates measures (non-existing mode) or assigns to first measure without facs (existing mode).
- `UPDATE_ZONE_FROM_ANNOTORIOUS(annot)` — updates coordinates of an existing zone.
- `SET_MODE(mode)` — only accepts values present in `allowedModes`.

### Measures & Mdivs
- `SET_CURRENT_MEASURE_ID(id)` — resolves id by direct match or by `facs ~="#zoneId"`.
- `SET_CURRENT_MEASURE_LABEL(val)` — set/remove `@label` on the selected measure.
- `SET_CURRENT_MEASURE_MULTI_REST(val)` — uses `setMultiRest` helper on selected measure.
- `SET_PAGE_LABEL({ index, val })` — sets `@label` on `<surface>` (page).
- `SET_CURRENT_MDIV_LABEL(val)` — set `@label` on current mdiv.
- `CREATE_NEW_MDIV` — creates an `<mdiv>` and moves content via `moveContentToMdiv`.
- `SELECT_MDIV(id)`, `SET_CURRENT_MDIV(id)`

### Image Import (IIIF pages)
- `REGISTER_IMAGE_IMPORT({ url, index })` — queue a page for import.
- `RECEIVE_IMAGE_IMPORT({ url, index, json })` — store width/height from `info.json`.
- `FAILED_IMAGE_IMPORT({ url, index })` — mark failed.
- `ACCEPT_IMAGE_IMPORTS` — calls `addImportedPage` for successes, recomputes `pages` via `getPageArray`, clears queue, closes import modal.
- `CANCEL_IMAGE_IMPORTS` — clears queue and closes modal.

---

## Actions

> Actions can be async and may dispatch multiple mutations.

### UI Toggles
`toggleLoadXMLModal`, `toggleLoadIIIFModal`, `toggleLoadGitModal`, `toggleLoadLocalImageModal`,  
`toggleMeasureModal`, `toggleMdivModal`, `togglePagesModal`, `togglePageImportModal`,  
`toggleMeasureList`

### Navigation & Counters
- `setCurrentPage(i)` — selects page.
- `setAllMdivs(i)` — push to `allmdivs`.
- `setCurrentPageZone(j)` — increment total zones.

### IIIF Import

> **Note:** `importIIIF` is defined **twice** in code. The **second** (concurrent) version overrides the first (sequential). The concurrent one is what actually runs.

- `importIIIF(url)` (concurrent)  
  1. `SET_LOADING(true)`, fetch manifest.  
  2. Validate with `checkIiifManifest(json)`.  
  3. Map canvases → `info.json` URLs; fetch **concurrently** via `Promise.allSettled`.  
  4. Store `infoJson[]` and `pageDimension[]`.  
  5. Convert to MEI via `iiifManifest2mei(json, url, parser, state)`.  
  6. `dispatch('setData', mei)`; finally `SET_PROCESSING(false)`.

### XML Import
- `importXML(meiUrl)` — fetches XML, parses with `DOMParser`, then `dispatch('setData', meiDOM)`.

### Auto-Detection of Measures (External Service)
- `autoDetectZonesOnCurrentPage()`  
  - Builds a full image URL (IIIF), fetches blob, POSTs to `https://measure-detector.edirom.de/upload`.  
  - On success, calls `CREATE_ZONES_FROM_MEASURE_DETECTOR_ON_PAGE` with returned rectangles.

- `autoDetectZonesOnAllPage()`  
  - Iterates pages, uploads each image, appends zones/measures as above.  
### Data Setup
- `setData(meiDOM)`  
  - Recompute pages via `getPageArray(meiDOM)`.  
  - `SET_PAGES`, `SET_XML_DOC`, `SET_CURRENT_PAGE(0)`, `SET_PROCESSING(false)`, `HIDE_MODALS`.

### Zone & Measure Interaction
- `selectZone(id)` — sets selection.
- `clickZone(id)` — if `mode === deletion`, removes zone via `deleteZone`; if `mode === additionalZone`, toggles with `toggleAdditionalZone`.
- `clickMeasureLabel(id)` — select measure and open modal; `closeMeasureNumberModal()` reverses.
- `hoverZone(id)`, `unhoverZone(id)` — manage hover state.
- `createZone(annot)` — store annot and call `CREATE_ZONE_FROM_ANNOTORIOUS`.
- `deleteZone(id)` — (calls a mutation named `DELETE_ZONE` which is **not present**; deletion currently handled inside `clickZone` path.)
- `updateZone(annot)` — proxy to update mutation.

### Modes, Labels, Mdivs
- `setMode(mode)`, `toggleExistingMusicMode()`
- `setCurrentMeasureLabel(val)`, `setCurrentMeasureMultiRest(val)`
- `setPageLabel({ index, val })`
- `setCurrentMdiv(id)`, `setCurrentMdivLabel(val)`
- `createNewMdiv()`, `selectMdiv(id)`

### Image Import Workflow
- `registerImageImports(urlsString)` — space-separated `info.json` URLs; queues, fetches, and stores dimensions.
- `acceptImageImports()` — add all success pages to MEI and refresh `pages`.
- `cancelImageImports()` — clear queue.

---

## Getters

| Getter | Returns |
|---|---|
| `isReady` | `true` iff `xmlDoc` is loaded. |
| `totalZones` | `number` total zones. |
| `meiFileForDownload` | Serialized MEI XML string or `null`. |
| `currentPageIndexOneBased` | `currentPage + 1`. |
| `currentPageIndexZeroBased` | `currentPage`. |
| `maxPageNumber` | `pages.length`. |
| `pages` | Array of `{ tileSource, width, x:0, y:0 }` for OpenSeadragon. |
| `pagesDetailed` | Array of `{ tileSource, dim: 'WxH', n, label }`. |
| `currentPageObject` | `pages[currentPage]`. |
| `zonesOnCurrentPage` | All zone annotations (except the selected one) converted via `meiZone2annotorious`. |
| `measures` | Array of all `<measure>` elements (DOM nodes). |
| `mdivs` | `{ id, label, index }[]` for all `<mdiv>`. |
| `measuresByMdivId(id)` | Measures with `{ id, n, label, multiRest, zones[], index }`. |
| `currentMdiv` | `{ id, label, index } \| null` for `currentMdivId`. |
| `currentMeasure` | `{ id, n, label, multiRest, mdiv } \| null` for `currentMeasureId`. |
| `mode` | Current editor mode value. |
| `selectedZone` | Selected zone as an annotation object (via `meiZone2annotorious`). |
| `showLoadIIIFModal` … `showMeasureList` | Booleans for UI. |
| `importingImages` | Pending import items. |
| `readyForImageImport` | `true` if all importing items have `status === 'success'` and the queue is non-empty. |
| `existingMusicMode` | Boolean flag. |
| `firstMeasureWithoutZone` | `xml:id` of first `<measure>` without `@facs`, or `null`. |

---

## Data Shapes

### Page (internal)
```ts
type Page = {
  uri: string;       // IIIF info.json URL
  width: number;
  height: number;
  n?: string | number;
  label?: string;
}
```

### Importing Image
```ts
type ImportingImage = {
  index: number;
  url: string;       // info.json
  width: number | null;
  height: number | null;
  status: 'loading' | 'success' | 'failed';
}
```
## Example Usage

### In a Vue component (composition or options API)

```js
computed: {
  pages() { return this.$store.getters.pages },
  currentPage() { return this.$store.state.currentPage },
  isReady() { return this.$store.getters.isReady },
  currentMeasure() { return this.$store.getters.currentMeasure },
},
methods: {
  openIiif() { this.$store.dispatch('toggleLoadIIIFModal') },
  openLocalImages() { this.$store.dispatch('toggleLoadLocalImageModal') },
  goTo(pageIndex) { this.$store.dispatch('setCurrentPage', pageIndex) },
  setLabel(val) { this.$store.dispatch('setCurrentMeasureLabel', val) },
}
```  

### Trigger IIIF import   
```js 
this.$store.dispatch('importIIIF', 'https://server/iiif/manifest.json')
```

### Create an extra zone on the last measure
```js
this.$store.dispatch('setMode', this.$store.state.allowedModes.additionalZone)
this.$store.dispatch('createZone', annotFromAnnotorious)

``` 
## Typical Flows

### Import IIIF → Build MEI → Show Pages

1. `dispatch('importIIIF', manifestUrl)`
2. Fetch manifest → validate → fetch all `info.json` → compute dimensions
3. Convert to MEI (`iiifManifest2mei`) → `dispatch('setData', meiDOM)`
4. UI now shows pages; `currentPage` set to 0.

---

### Draw a Rectangle → Create Zone (+ Measure)

1. Set mode to manual rectangle:  
   ```js
   dispatch('setMode', allowedModes.manualRect)
  
2. User draws rectangle (Annotorious):  
   ```js
   dispatch('createZone', annot)

3. Store creates MEI `<zone>`, and either:  
   - Creates a new `<measure>` linked by `@facs` (standard), or  
   - Assigns to an existing measure (**existingMusicMode**).

### Auto-detect Measures on Current Page  

1. Run detection:  
   ```js
   dispatch('autoDetectZonesOnCurrentPage')

2. Upload image to detector → receive rectangles  

3. `CREATE_ZONES_FROM_MEASURE_DETECTOR_ON_PAGE` adds zones and measures  


