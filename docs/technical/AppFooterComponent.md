# AppFooter Component

Displays the application footer, including navigation controls, current mdiv label, zone count, and loading status.

---

## Overview

The `AppFooter` component provides:
- Navigation between pages (previous, next, jump to page)
- Display of the current mdiv (musical division) label (clickable, opens modal)
- Display of the number of zones on the current page
- Loading progress indicator

---

## Layout

- **Left**: Current mdiv label (clickable, opens modal)
- **Center**: Page navigation (prev/next, jump to page)
- **Right**: Number of zones on current page
- **Progress**: Shows loading progress bar if loading

---

## Props

_None_

---

## Data

| Name       | Type   | Description                        |
|------------|--------|------------------------------------|
| inputPage  | String | User input for page navigation     |

---

## Computed Properties

| Name           | Description                                              |
|----------------|---------------------------------------------------------|
| currentPage    | Current page number (1-based)                           |
| maxPage        | Maximum page number                                     |
| isReady        | Whether the app is ready                                |
| isLoading      | Whether the app is currently loading                    |
| prevAvailable  | Whether the previous page is available                  |
| nextAvailable  | Whether the next page is available                      |
| zonesCount     | Number of zones on the current page                     |
| mdivLabel      | Label for the current mdiv (musical division)           |

---

## Methods

| Name            | Description                                                      |
|-----------------|------------------------------------------------------------------|
| showPrevPage    | Navigates to the previous page                                   |
| showNextPage    | Navigates to the next page                                       |
| showMdivModal   | Opens the mdiv modal dialog                                      |
| jumpToPage      | Jumps to the page entered by the user                            |

---

## Watchers

| Watched Property | Description                                 |
|------------------|---------------------------------------------|
| currentPage      | Updates `inputPage` when the page changes   |

---

## Example

```vue
<AppFooter />

