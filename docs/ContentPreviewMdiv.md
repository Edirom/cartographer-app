# ContentPreviewMdiv Component

Displays a preview section for a single musical division (mdiv), showing its label and all associated measures.

---

## Overview

The `ContentPreviewMdiv` component:
- Renders a preview for a single mdiv (musical division).
- Displays the mdiv label as a heading.
- Renders a `ContentPreviewMeasure` component for each measure in the mdiv.

---

## Layout

- **Heading**: The mdiv label is shown as a heading.
- **Measures**: Each measure is rendered using the `ContentPreviewMeasure` component.

---

## Props

| Name | Type   | Description                        |
|------|--------|------------------------------------|
| mdiv | Object | The musical division object to preview |

---

## Computed Properties

| Name     | Description                                         |
|----------|-----------------------------------------------------|
| measures | Returns all measures belonging to the current mdiv  |

---

## Methods

_None_

---

## Example

```vue
<ContentPreviewMdiv :mdiv="mdivObject" />