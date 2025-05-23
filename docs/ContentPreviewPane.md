# Content Preview Pane

Displays a pane with previews of all musical divisions (mdivs), each rendered using the `ContentPreviewMdiv` component.

---

## Overview

The `ContentPreviewPane` component:
- Shows a scrollable pane on the right side of the app
- Renders a `ContentPreviewMdiv` component for each mdiv (musical division)
- Is only visible when the measure list is enabled (`showMeasureList` is true in the store)

---

## Layout

- **Pane**: Fixed width, scrollable, right-aligned
- **Content**: One `ContentPreviewMdiv` per mdiv

---

## Props

_None_

---

## Computed Properties

| Name    | Description                                               |
|---------|-----------------------------------------------------------|
| mdivs   | Returns all mdivs (musical divisions) from the store      |
| visible | Determines if the pane should be visible                  |

---

## Methods

_None_

---

## Example

```vue
<ContentPreviewPane />