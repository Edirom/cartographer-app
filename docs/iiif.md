# IIIF Tools (`src/tools/iiif.js`)

Utility functions for working with IIIF manifests and converting them to MEI format.

---

## Overview

This module provides helper functions to:
- Convert IIIF manifests to MEI XML
- Validate IIIF manifests
- Extract page arrays from MEI
- Add pages from IIIF canvases to the MEI structure

---

## Functions

### `addPage(canvas, canvases, dimension, n, file, meiSurfaceTemplate, hasItems)`

Adds a page to the MEI structure based on a IIIF canvas.

- **Parameters:**
  - `canvas`: The IIIF canvas object
  - `canvases`: Array of all canvases
  - `dimension`: Dimensions of the image
  - `n`: Page number
  - `file`: File reference or identifier
  - `meiSurfaceTemplate`: MEI surface template to use
  - `hasItems`: Boolean indicating if the canvas has items

---

### `async getDimension(imgsrc)`

Fetches and returns the dimensions (width and height) of an image from its IIIF info.json.

- **Parameters:**
  - `imgsrc`: The IIIF image service URL

---

### `async iiifManifest2mei(json, url, parser, state)`

Converts a IIIF manifest JSON to an MEI XML document.

- **Parameters:**
  - `json`: The IIIF manifest JSON object
  - `url`: The manifest URL
  - `parser`: DOMParser instance
  - `state`: Vuex state or context

---

### `checkIiifManifest(json)`

Checks if a given JSON object is a valid IIIF manifest.

- **Parameters:**
  - `json`: The IIIF manifest JSON object

---

### `getPageArray(mei)`

Extracts and returns an array of page objects from an MEI XML document.

- **Parameters:**
  - `mei`: The MEI XML document

---

## Example Usage

```js
import { iiifManifest2mei, checkIiifManifest, getPageArray } from '@/tools/iiif.js'

// Convert IIIF manifest to MEI
const mei = await iiifManifest2mei(manifestJson, manifestUrl, parser, state)

// Validate IIIF manifest
const isValid = checkIiifManifest(manifestJson)

// Get pages from MEI
const pages = getPageArray(mei)