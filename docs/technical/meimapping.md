# MEI Mapping Tools (`src/tools/meimapping.js`)

Helper functions to convert between MEI zones, Annotorious annotations, detected rectangles, and to manipulate measures/mdivs.  
This includes both **exported functions** (public API) and **internal helpers** (not exported but important for maintainers).

---


### `meiZone2annotorious(mei, zoneInput, pageUri)`
Converts an MEI `<zone>` into an Annotorious annotation object.  

```js
export function meiZone2annotorious (mei, zoneInput, pageUri) { ... }
```

**Parameters**  
- `mei {Document}` – MEI XML document  
- `zoneInput {Element|string}` – `<zone>` element or its xml:id  
- `pageUri {string}` – Page image URI  

**Returns**  
- `{Object}` – Annotorious-compatible annotation  

---

### `annotorious2meiZone(annot)`
Converts an Annotorious annotation into an MEI `<zone>`.

```js
export function annotorious2meiZone (annot) { ... }
```

**Parameters**  
- `annot {Object}` – Annotorious annotation  

**Returns**  
- `{Element}` – MEI `<zone>`  

---

### `measureDetector2meiZone(rect)`
Converts a detected rectangle into an MEI `<zone>`.

```js
export function measureDetector2meiZone (rect) { ... }
```

**Parameters**  
- `rect {Object}` – Rectangle `{ ulx, uly, lrx, lry }`  

**Returns**  
- `{Element}` – MEI `<zone>`  

---

### `generateMeasure()`
Creates a new MEI `<measure>`.

```js
export function generateMeasure () { ... }
```

**Returns**  
- `{Element}` – `<measure>` with unique xml:id  

---

### `insertMeasure(xmlDoc, measure, state, currentZone, pageIndex, targetMdiv)`
Inserts a `<measure>` into the MEI.

```js
export function insertMeasure (xmlDoc, measure, state, currentZone, pageIndex, targetMdiv) { ... }
```

**Parameters**  
- `xmlDoc {Document}` – MEI file  
- `measure {Element}` – New measure  
- `state {Object}` – Vuex state  
- `currentZone {Element}` – Zone for this measure  
- `pageIndex {number}` – Page index  
- `targetMdiv {Element}` – Target movement  

---

### `getFollowingMeasuresByMeasure(measure)`
Get all measures following a given one.

```js
export function getFollowingMeasuresByMeasure (measure) { ... }
```

**Parameters**  
- `measure {Element}` – Current measure  

**Returns**  
- `{Array<Element>}` – List of following measures  

---

### `addZoneToLastMeasure(xmlDoc, zoneId)`
Adds a zone to the last `<measure>` in the MEI.

```js
export function addZoneToLastMeasure (xmlDoc, zoneId) { ... }
```

---

### `createNewMdiv(xmlDoc, state, afterMdivId)`
Creates a new `<mdiv>` (movement).

```js
export function createNewMdiv (xmlDoc, state, afterMdivId) { ... }
```

**Parameters**  
- `xmlDoc {Document}` – MEI document  
- `state {Object}` – Vuex state  
- `afterMdivId {string?}` – Optional target to insert after  

**Returns**  
- `{string}` – New mdiv xml:id  

---

### `deleteZone(xmlDoc, id, state)`
Deletes a zone and updates measures accordingly.

```js
export function deleteZone (xmlDoc, id, state) { ... }
```

---

### `toggleAdditionalZone(xmlDoc, id, state)`
Toggle zone between new measure and merged measure.

```js
export function toggleAdditionalZone (xmlDoc, id, state) { ... }
```

---

### `setMultiRest(measure, val)`
Sets, updates, or removes a `<multiRest>`.

```js
export function setMultiRest (measure, val) { ... }
```

---

### `moveContentToMdiv(xmlDoc, firstMeasureId, targetMdivId, state)`
Moves a sequence of measures into a target mdiv.

```js
export function moveContentToMdiv (xmlDoc, firstMeasureId, targetMdivId, state) { ... }
```

---

### `addImportedPage(xmlDoc, index, url, width, height)`
Adds a new `<surface>` page.

```js
export function addImportedPage (xmlDoc, index, url, width, height) { ... }
```

---

## Internal Helpers

### `incrementMeasureNum(num, diff)`
```js
function incrementMeasureNum (num, diff) {
  return parseInt(num) + diff
}
```

**Parameters**  
- `num {string|number}` – Current measure number  
- `diff {number}` – Amount to add  

**Returns**  
- `{number}` – New measure number  

---

### `getLastMeasure(xmlDoc)`
```js
function getLastMeasure (xmlDoc) {
  const measure = [...xmlDoc.querySelectorAll('measure')].slice(-1)[0]
  return measure
}
```

**Parameters**  
- `xmlDoc {Document}` – MEI DOM  

**Returns**  
- `{Element|undefined}` – Last measure or undefined  

---

### `getPrecedingZone(xmlDoc, surface)`
```js
function getPrecedingZone (xmlDoc, surface) { ... }
```

**Parameters**  
- `xmlDoc {Document}` – MEI DOM  
- `surface {Element}` – Current page  

**Returns**  
- `{Element|null}` – Last zone on a previous page  

---

### `getPrecedingZoneNoMatterWhere(xmlDoc, zone)`
```js
function getPrecedingZoneNoMatterWhere (xmlDoc, zone) { ... }
```

**Parameters**  
- `xmlDoc {Document}` – MEI DOM  
- `zone {Element}` – Reference zone  

**Returns**  
- `{Element|null}` – Nearest preceding zone  

---

### `getMeasuresFromZone(xmlDoc, zone)`
```js
function getMeasuresFromZone (xmlDoc, zone) { ... }
```

**Parameters**  
- `xmlDoc {Document}` – MEI DOM  
- `zone {Element}` – Zone element  

**Returns**  
- `{Array<Element>}` – Measures referencing the zone  

---

### `getZonesFromMeasure(xmlDoc, measure)`
```js
function getZonesFromMeasure (xmlDoc, measure) { ... }
```

**Parameters**  
- `xmlDoc {Document}` – MEI DOM  
- `measure {Element}` – Measure element  

**Returns**  
- `{Array<Element>}` – Zones linked by @facs  

---

## Example Usage

```js
import {
  meiZone2annotorious,
  annotorious2meiZone,
  measureDetector2meiZone,
  generateMeasure,
  insertMeasure,
  addZoneToLastMeasure,
  createNewMdiv,
  deleteZone,
  toggleAdditionalZone,
  setMultiRest,
  moveContentToMdiv,
  addImportedPage,
  ...
} from '@/tools/meimapping.js'

// Convert zone → annotation
const annot = meiZone2annotorious(meiDoc, 'zone123', pageUri)

// Convert annotation → zone
const zone = annotorious2meiZone(annot)

// Add zone to last measure
addZoneToLastMeasure(meiDoc, 'zone123')

// Create new movement
const mdivId = createNewMdiv(meiDoc, state)

// Delete a zone
deleteZone(meiDoc, 'zone456', state)
```
