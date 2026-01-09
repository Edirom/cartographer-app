# PageImportModal Component

Displays a modal dialog for importing new page images by URL.

---

## Overview

The `PageImportModal` component:
- Shows a modal dialog for importing new page images.
- Allows users to input multiple image URLs (separated by spaces).
- Displays a table with the status and dimensions of images being imported.
- Provides Import and Cancel actions.
- Uses Vuex store for state management and actions.

---

## Layout

- **Header**: Modal title and close button.
- **Body**:
  - If no images are being imported: shows instructions and a textarea for URLs.
  - If images are being imported: shows a table with image index, URL, status, and dimensions.
- **Footer**: Import and Cancel buttons.

---

## Props

_None_

---

## Computed Properties

| Name             | Description                                         |
|------------------|-----------------------------------------------------|
| importingImages  | Returns the list of images being imported           |
| readyForImageImport | Returns whether the import is ready to be accepted |

---

## Methods

| Name      | Description                                                      |
|-----------|------------------------------------------------------------------|
| loadImages| Loads images from the textarea input and dispatches to store     |
| accept    | Accepts the imported images and closes the modal                 |
| closeModal| Cancels the import and closes the modal                          |

---

## Example

```vue
<PageImportModal />