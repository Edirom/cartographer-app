# LoadLocalImage Component

Displays a modal dialog for importing images from the local file system.

---

## Overview

The `LoadLocalImage` component:
- Shows a modal dialog for the user to select a local folder containing images.
- Automatically filters and displays supported image files.
- Allows the user to preview the list of detected images before importing.
- On confirmation, converts local images to pages and imports them into the application.
- Preserves existing zones and measures if an MEI file is already loaded.
- Uses Vuex store for state management and actions.
- Supports various image formats: JPG, JPEG, PNG, GIF, WebP, SVG, BMP, and TIFF.

---

## Layout

- **Header**: Modal title ("Load Local Images") and close button.
- **Body**:
  - File input field with label "Choose Folder" (webkitdirectory for folder selection).
  - Image info section showing the count of selected images.
  - Scrollable list of detected image files with their paths.
- **Footer**: Cancel and Import buttons (Import button is disabled if no images are selected).

---

## Props

_None_

---

## Data

| Name                | Type   | Description                                 |
|---------------------|--------|---------------------------------------------|
| selectedImages      | Array  | Array of image file objects with name and file properties |
| selectedFolderPath  | String | Path of the selected folder                  |

---

## Methods

| Name                 | Description                                                      |
|----------------------|------------------------------------------------------------------|
| handleFolderSelection| Processes folder selection, filters image files, and populates selectedImages array |
| importImages         | Converts images to pages, preserves existing MEI data, and dispatches to store |
| closeModal           | Closes the modal and resets data to initial state |

---

## Computed Properties

_None_

---

## Store Integration

### Getters
- `showLoadLocalImage`: Boolean indicating whether the modal is visible

### Mutations
- `TOGGLE_LOADLOCALIMAGE_MODAL(state, value)`: Sets or toggles the modal visibility state

### Actions
- `addLocalImagePages({ pages, originalMei })`: Adds imported images as pages to the store, preserving existing MEI zones/measures if available
- `toggleLoadLocalImage()`: Toggles the modal visibility

---

## Image File Support

The component automatically filters and accepts the following image formats:
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)
- SVG (.svg)
- BMP (.bmp)
- TIFF (.tiff)

Non-image files are ignored during folder selection.

---

## Workflow

1. User clicks "Import Local Image" from the main menu.
2. Modal opens with a folder selection input.
3. User selects a folder using the "Choose Folder" button.
4. Component scans the folder and filters image files.
5. Detected images are displayed in a scrollable list.
6. User reviews the image list and clicks "Import" to proceed.
7. Images are converted to pages using `convertLocalImagesToPages()` utility.
8. If an existing MEI file is loaded, zones and measures are preserved.
9. Pages are added to the store via `addLocalImagePages` action.
10. Modal automatically closes when import is complete.

---

## Key Features

- **Folder-based selection**: Uses `webkitdirectory` attribute for selecting entire folders.
- **Image filtering**: Automatically detects and filters only image files.
- **Preview before import**: Users can see all detected images before importing.
- **MEI preservation**: If an MEI file is already loaded, existing zones and measures are maintained.
- **Error handling**: Displays alerts if image loading fails and logs errors to console.
- **Sorted imports**: Images are sorted by filename using `sortImageFiles()` utility before import.

---

## Technical Details

### Related Files

- **Component**: `src/components/LoadLocalImage.vue`
- **Store**: `src/store/index.js`
- **Utilities**: `src/tools/localImages.js` (contains `convertLocalImagesToPages` and `sortImageFiles`)

### Dependencies

- Vue 3
- Vuex (for state management)
- localImages.js utility functions

### Browser Support

The component relies on the File System Access API and `webkitdirectory` attribute, which are supported in:
- Chrome/Edge 50+
- Firefox 50+
- Safari 13.1+

---

## User Interactions

| Interaction | Action |
|---|---|
| Click "Choose Folder" | Opens system folder picker |
| Select folder | Populates image list if images are found |
| Click "Cancel" | Closes modal, clears selections |
| Click modal overlay | Closes modal (same as Cancel button) |
| Click "Import" | Converts and imports images, then closes modal |

---

## Error Handling

- If no images are found in the selected folder, the Import button remains disabled.
- If image conversion fails, an alert is shown and error details are logged to the browser console.
- The modal remains open if import fails, allowing the user to select a different folder or try again.

---

## Example Usage

```vue
<!-- In MainMenu.vue -->
<li class="menu-item">
  <button class="btn btn-action btn-sm" @click="importLocalImage" title="import Local Image">
    <font-awesome-icon icon="fa-solid fa-file-import"/> 
  </button>
  Import Local Image
</li>

<!-- In script -->
methods: {
  importLocalImage: function () {
    this.$store.dispatch('toggleLoadLocalImage')
  }
}
```

---

## Notes

- The component automatically closes after a successful import via the `HIDE_MODALS` commit triggered by the `addLocalImagePages` action.
- Image paths are preserved with their relative folder structure (e.g., "folderName/subfolder/image.jpg").
- The component works best with reasonably-sized image folders; very large folders (1000+ images) may take time to process.
