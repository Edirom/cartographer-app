# PagesModal Component

Displays a modal dialog listing all pages in a table, with options to edit labels and import additional images.

---

## Overview

The `PagesModal` component:
- Shows a modal dialog with a table of all pages.
- Displays page number, editable label, thumbnail, URI, and dimensions.
- Allows importing additional images via a button.
- Clicking a thumbnail (handled in `PagesListEntry`) sets the current page and closes the modal.
- Uses Vuex store for state management and actions.

---

## Layout

- **Header**: Modal title ("Pages") and close button.
- **Body**: Table listing all pages with columns for number, label, thumbnail, URI, and dimensions.
- **Footer**:  
  - "Import Images" button to open the page import modal  
  - "Close" button to close the modal

---

## Props

_None_

---

## Computed Properties

| Name  | Description                                 |
|-------|---------------------------------------------|
| pages | Returns the detailed list of pages from the store |

---

## Methods

| Name               | Description                                                      |
|--------------------|------------------------------------------------------------------|
| closeModal         | Closes the modal dialog                                          |
| showPageImportModal| Opens the page import modal                                      |
| showPage           | Sets the current page (not used directly here)                   |

---

## Example

```vue
<PagesModal />