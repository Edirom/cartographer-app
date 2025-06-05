# LoadIIIFModal Component

Displays a modal dialog for importing a IIIF manifest URL.

---

## Overview

The `LoadIIIFModal` component:
- Shows a modal dialog for the user to input a IIIF manifest URL.
- Allows the user to autofill a test IIIF manifest URL.
- On confirmation, triggers an import action and closes the modal.
- Uses Vuex store for state management and actions.

---

## Layout

- **Header**: Modal title and close button.
- **Body**: Input field for the IIIF manifest URL, description, and a button to autofill a test URL.
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
<LoadIIIFModal />