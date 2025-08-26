# PagesListEntry Component

Renders a table row for a single page entry in the pages list.

---

## Overview

The `PagesListEntry` component:
- Displays the page number, editable label, thumbnail image, URI, and dimensions.
- Allows editing the page label directly in the table.
- Clicking the thumbnail sets the current page and closes the modal.
- Uses Vuex store for state management and actions.

---

## Layout

- **Table Row**:  
  - Page number (`page.n`)
  - Editable label (`page.label`)
  - Thumbnail image (clickable)
  - Page URI
  - Page dimensions

---

## Props

| Name  | Type   | Description                       |
|-------|--------|-----------------------------------|
| page  | Object | The page object to display        |
| index | Number | The index of the page in the list |

---

## Computed Properties

| Name           | Description                                 |
|----------------|---------------------------------------------|
| pageLabelValue | Two-way binding for the page label input    |

---

## Methods

| Name     | Description                                                      |
|----------|------------------------------------------------------------------|
| showPage | Sets the current page and closes the pages modal                 |

---

## Example

```vue
<PagesListEntry :page="page" :index="index" />