# MEI Mappings Tools (`src/tools/meiMappings.js`)

Utility functions for mapping between MEI zones/measures and Annotorious annotations, as well as manipulating MEI documents.

---

## Overview

This module provides functions to:
- Convert MEI zones to Annotorious annotation objects and vice versa
- Create, insert, and delete measures and zones in MEI
- Move content between mdivs
- Add imported pages to MEI
- Manage multi-rests and additional zones

---

## Functions

### `meiZone2annotorious(mei, zoneInput, pageUri)`

Converts an MEI `<zone>` element to an Annotorious annotation object.

- **Parameters:**
  - `mei`: The MEI XML document
  - `zoneInput`: The zone element or its ID
  - `pageUri`: The image/page URI

---

### `annotorious2meiZone(annot)`

Converts an Annotorious annotation object to an MEI `<zone>` element.

- **Parameters:**
  - `annot`: The Annotorious annotation object

---

### `measureDetector2meiZone(rect)`

Creates a new MEI `<zone>` element from a rectangle (e.g., from a detector).

- **Parameters:**
  - `rect`: Object with `ulx`, `uly`, `lrx`, `lry` properties

---

### `generateMeasure()`

Creates and returns a new MEI `<measure>` element with a unique ID.

---

### `insertMeasure(xmlDoc, measure, state, currentZone, pageIndex, targetMdiv)`

Inserts a measure into the MEI file at the correct position, adjusting measure numbers and page breaks as needed.

- **Parameters:**
  - `xmlDoc`: The MEI XML document
  - `measure`: The measure element to insert
  - `state`: Vuex state
  - `currentZone`: The zone associated with the measure
  - `pageIndex`: Index of the page (zero-based)
  - `targetMdiv`: The mdiv to insert into

---

### `getFollowingMeasuresByMeasure(measure)`

Returns an array of all measures following the given measure.

---

### `addZoneToLastMeasure(xmlDoc, zoneId)`

Adds a zone reference to the last measure in the MEI document.

---

### `createNewMdiv(xmlDoc, afterMdivId)`

Creates a new `<mdiv>` in the MEI document, optionally after a given mdiv.

- **Parameters:**
  - `xmlDoc`: The MEI XML document
  - `afterMdivId`: (Optional) ID of the mdiv after which to insert

---

### `deleteZone(xmlDoc, id, state)`

Deletes a zone and its associated measures from the MEI document.

- **Parameters:**
  - `xmlDoc`: The MEI XML document
  - `id`: The zone ID
  - `state`: Vuex state

---

### `toggleAdditionalZone(xmlDoc, id, state)`

Toggles an additional zone for a measure, updating facsimile references and measure structure.

---

### `setMultiRest(measure, val)`

Sets or removes a multi-rest on a measure, updating following measure numbers as needed.

- **Parameters:**
  - `measure`: The measure element
  - `val`: The multi-rest value (number or null)

---

### `moveContentToMdiv(xmlDoc, firstMeasureId, targetMdivId, state)`

Moves a sequence of measures (and related elements) to a different mdiv.

---

### `addImportedPage(xmlDoc, index, url, width, height)`

Adds a new page (surface and graphic) to the MEI document for an imported image.

- **Parameters:**
  - `xmlDoc`: The MEI XML document
  - `index`: Page index
  - `url`: Image URL
  - `width`: Image width
  - `height`: Image height

---

## Example Usage

```js
import { meiZone2annotorious, annotorious2meiZone, insertMeasure, createNewMdiv } from '@/tools/meiMappings.js'

// Convert a zone to an annotation
const annotation = meiZone2annotorious(meiDoc, zoneElem, pageUri)

// Convert an annotation to a zone
const zone = annotorious2meiZone(annotation)

// Insert a new measure
insertMeasure(meiDoc, newMeasure, state, currentZone, pageIndex, targetMdiv)

// Create a new mdiv
const mdivId = createNewMdiv(meiDoc)