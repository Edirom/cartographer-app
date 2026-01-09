# MainMenu Component

Displays a dropdown menu with actions for file import/export and toggling app features.

---

## Overview

The `MainMenu` component provides:
- A dropdown menu for importing MEI files and IIIF manifests
- Downloading the current MEI file
- Showing the page overview modal
- Toggling the measure list pane
- Toggling merge mode for existing music (if available)
- Uses Vuex store for state management and dispatching actions

---

## Layout

- **Dropdown Menu**: Triggered by a button with a bars icon
- **Sections**:
  - **Data**: Upload MEI, Import IIIF Manifest, Download MEI File
  - **Actions**: Show Page Overview, Toggle Measure List
  - **Options**: Toggle Merge Mode (if available)

---

## Props

_None_

---

## Computed Properties

| Name                   | Description                                              |
|------------------------|---------------------------------------------------------|
| accessToken            | GitHub access token from the store                      |
| directories            | GitHub directories from the store                       |
| selectedDirectory      | Selected directory from the store                       |
| manifest               | Current manifest from the store                         |
| xmlFilename            | Filename for MEI file download                          |
| downloadAvailable      | True if MEI file is available for download              |
| isLoggedin             | True if the user is logged in                           |
| firstMeasureWithoutZone| First measure without a zone (for merge mode)           |
| existingMusicMode      | Whether merge mode is active                            |
| getUserName            | Current user's name from the store                      |

---

## Methods

| Name                  | Description                                                      |
|-----------------------|------------------------------------------------------------------|
| importXML             | Opens the modal to upload an MEI file                            |
| importManifest        | Opens the modal to import a IIIF manifest                        |
| xmlDataUrl            | Returns the data URL for downloading the MEI file                |
| toggleMeasureList     | Toggles the measure list pane                                    |
| showPagesModal        | Opens the page overview modal                                    |
| toggleExistingMusicMode| Toggles merge mode for existing music (if available)            |

---

## Example

```vue
<MainMenu />