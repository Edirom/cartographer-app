# Vuex Store (`src/store/index.js`)

Centralized state management for the Cartographer app using Vuex.

---

## Overview

This Vuex store manages all application state, including:
- Current MEI/XML document and page data
- Modal visibility (for loading, editing, importing, etc.)
- Current selection (page, measure, mdiv, zone)
- GitHub integration (repositories, directories, branches)
- IIIF manifest and image import
- Annotation and zone management
- UI modes and processing/loading states

---

## State

| Key                   | Description                                      |
|-----------------------|--------------------------------------------------|
| xmlDoc                | The current MEI/XML document                     |
| pages                 | Array of page objects (with URI, width, etc.)    |
| currentPage           | Index of the currently selected page             |
| showLoadXMLModal      | Show/hide XML import modal                       |
| showLoadIIIFModal     | Show/hide IIIF import modal                      |
| showLoadGitModal      | Show/hide Git import modal                       |
| showMeasureModal      | Show/hide measure modal                          |
| showMdivModal         | Show/hide mdiv modal                             |
| showPagesModal        | Show/hide pages modal                            |
| showPageImportModal   | Show/hide page import modal                      |
| showMeasureList       | Show/hide measure list pane                      |
| loading, processing   | Loading and processing flags                     |
| mode                  | Current UI mode (selection, drawing, etc.)       |
| existingMusicMode     | Whether merge mode is active                     |
| selectedZoneId        | ID of the currently selected zone                |
| hoveredZoneId         | ID of the currently hovered zone                 |
| currentMdivId         | ID of the currently selected mdiv                |
| currentMeasureId      | ID of the currently selected measure             |
| importingImages       | Array of images being imported                   |
| username              | Current user's name                              |
| ...and more           | (see source for full list)                       |

---

## Mutations

- Toggle modal visibility (e.g. `TOGGLE_LOADXML_MODAL`)
- Set and update XML document, pages, and current selection
- Create, update, and delete zones and measures
- Set GitHub and IIIF-related state
- Accept/cancel image imports
- Set UI mode and flags

---

## Actions

- Toggle modals and UI elements
- Import IIIF manifests and XML files
- Auto-detect zones on images (via external service)
- Set and update data for pages, measures, mdivs, and zones
- Handle image import, GitHub, and annotation actions

---

## Getters

- Access computed state for:
  - Current page, mdiv, measure, and their details
  - Pages and measures arrays (with details)
  - Modal visibility flags
  - Zones on the current page
  - Downloadable MEI file as a string
  - Import status and readiness
  - GitHub and IIIF data

---

## Example Usage

```js
// Accessing state in a component
computed: {
  pages() {
    return this.$store.getters.pages
  },
  currentPage() {
    return this.$store.state.currentPage
  }
}