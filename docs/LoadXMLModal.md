# LoadXMLModal Component

Displays a modal dialog for importing a IIIF manifest URL and converting it to an MEI file.

---

## Overview

The `LoadXMLModal` component:
- Shows a modal dialog for the user to input a IIIF manifest URL.
- Provides a button to autofill a test IIIF manifest URL.
- On import, triggers an action to convert the IIIF manifest to an MEI file for the Mercator app.
- Modal can be closed with the Cancel button or overlay.
- Uses Vuex store for state management and actions.

---

## Layout

- **Header**: Modal title ("Lade IIIF") and close button.
- **Body**:
  - Input field for IIIF manifest URL.
  - Description of the import process.
  - Button to autofill a test IIIF manifest URL.
- **Footer**: Cancel and Import buttons.

---

## Props

_None_

---

## Data

| Name    | Type   | Description                                 |
|---------|--------|---------------------------------------------|
| testUri | String | Example IIIF manifest URL for autofill      |

---

## Methods

| Name        | Description                                                      |
|-------------|------------------------------------------------------------------|
| useTestUri  | Autofills the input with a test IIIF manifest URL                |
| main        | Triggers import action if the input is a valid URL, then closes the modal |
| closeModal  | Closes the modal dialog                                          |

---

## Example

```vue
<LoadXMLModal />