# MeasureModal Component

Displays a modal dialog for viewing and editing the properties of the current measure.

---

## Overview

The `MeasureModal` component:
- Shows a modal dialog with the current measure's number and label.
- Allows assigning the measure to a different movement (mdiv) or creating a new mdiv.
- Enables editing or removing the explicit measure label.
- Supports enabling and setting a multi-measure rest value.
- Modal can be closed with the Close button or overlay.
- Uses Vuex store for state management and actions.

---

## Layout

- **Header**: Modal title with measure number/label and close button.
- **Body**: 
  - Dropdown for selecting or creating an mdiv.
  - Switch and input for explicit measure label.
  - Switch and input for multi-measure rest value.
- **Footer**: Close button.

---

## Props

_None_

---

## Computed Properties

| Name                | Description                                                      |
|---------------------|------------------------------------------------------------------|
| mdivs               | Returns the list of all mdivs from the store                     |
| currentMdiv         | Returns the current mdiv object from the store                   |
| measure             | Returns the current measure object from the store                |
| measureLabelActivated | Boolean for explicit label activation                           |
| measureLabelValue   | Two-way binding for the measure label                            |
| multiRestActivated  | Boolean for multi-rest activation                                |
| multiRestValue      | Two-way binding for the multi-rest value                         |

---

## Methods

| Name          | Description                                         |
|---------------|-----------------------------------------------------|
| selectMdiv    | Assigns the measure to a selected mdiv              |
| createNewMdiv | Creates a new mdiv and opens the mdiv modal         |
| closeModal    | Closes the modal dialog                             |
| handleChange  | Handles mdiv selection or creation from dropdown    |

---

## Example

```vue
<MeasureModal />
```