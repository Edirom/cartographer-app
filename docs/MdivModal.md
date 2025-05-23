# MdivModal Component

Displays a modal dialog for viewing and editing the current mdiv (musical division).

---

## Overview

The `MdivModal` component:
- Shows a modal dialog with the current mdiv's index and ID.
- Allows editing the mdiv label via a text input.
- Modal can be closed with the Close button or overlay.
- Uses Vuex store for state management and actions.

---

## Layout

- **Header**: Modal title with movement index and close button.
- **Body**: Shows mdiv ID and editable label input.
- **Footer**: Close button.

---

## Props

_None_

---

## Computed Properties

| Name        | Description                                         |
|-------------|-----------------------------------------------------|
| currentMdiv | Returns the current mdiv object from the store      |
| mdivLabel   | Two-way binding for the mdiv label                  |

---

## Methods

| Name       | Description                        |
|------------|------------------------------------|
| closeModal | Closes the modal dialog            |

---

## Example

```vue
<MdivModal />