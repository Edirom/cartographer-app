# AppSidebar Component

Provides the application sidebar with editing controls, autodetection tools, and page navigation.

---

## Overview

The `AppSidebar` component offers:
- Sidebar controls for editing and navigation
- Buttons for selection, drawing, adding, and deleting zones
- Undo and redo controls for reverting or reapplying changes
- Autodetection tools for measures/zones
- Page navigation controls

---

## Layout

- **Top**: Mode buttons (select, draw, undo, redo, add zone, delete)
- **Middle**: Autodetection tools (e.g., autodetect measures)
- **Bottom**: Page navigation (current page, total pages, prev/next)

---

## Props

_None_

---

## Data

_None_

---

## Computed Properties

| Name          | Description                                         |
|---------------|-----------------------------------------------------|
| isReady       | Whether the app is ready for user actions           |
| multiZone     | Whether multi-zone mode is active                   |
| currentPage   | Current page number (1-based)                       |
| maxPage       | Maximum page number                                 |
| prevAvailable | Whether the previous page is available              |
| nextAvailable | Whether the next page is available                  |
| workingMode   | Current working mode (e.g., preprocessing, editing) |
| mode          | Current sidebar mode (selection, drawing, etc.)     |
| canUndo       | Whether there is a previous state that can be undone |
| canRedo       | Whether there is an undone state that can be redone  |

---

## Methods

| Name           | Description                                                      |
|----------------|------------------------------------------------------------------|
| showPrevPage   | Navigates to the previous page                                   |
| showNextPage   | Navigates to the next page                                       |
| autoDetect     | Automatically detects zones on the current page                  |
| autoDetectAll  | Automatically detects zones on all pages                         |
| activateMode   | Activates a specific mode (selection, drawing, etc.)             |
| undoChanges    | Dispatches the `undo` action to revert the last change           |
| redoChanges    | Dispatches the `redo` action to reapply an undone change         |

---

## Example

```vue
<AppSidebar />