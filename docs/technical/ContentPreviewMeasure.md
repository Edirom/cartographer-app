# Content Preview Measure 

Displays a single measure preview within an mdiv, showing its label, number, multi-rest status, and zone status.

---

## Overview

The `ContentPreviewMeasure` component:
- Renders a preview for a single measure inside an mdiv.
- Shows the measure label (if present) or number.
- Indicates if the measure is a multi-rest.
- Highlights if the measure has zones or is the first without zones.
- Double-clicking the measure sets it as the current measure in the store.
- Uses Vuex store for state management and actions.

---

## Layout

- **Label/Number**: Shows the measure label (bold) or number.
- **Multi-rest**: Displays `[N bars]` if the measure is a multi-rest.
- **Zones**: Shows an icon if no zones are available.
- **Highlight**: Applies special background if this is the first measure without zones.

---

## Props

| Name    | Type   | Description                        |
|---------|--------|------------------------------------|
| measure | Object | The measure object to display      |
| mdiv    | String | The ID of the parent mdiv          |

---

## Computed Properties

| Name                   | Description                                         |
|------------------------|-----------------------------------------------------|
| hasLabel               | True if the measure has a label                     |
| hasZones               | True if the measure has any zones                   |
| hasMultiRest           | True if the measure is a multi-rest                 |
| firstMeasureWithoutZone| ID of the first measure without a zone              |

---

## Methods

| Name           | Description                                                      |
|----------------|------------------------------------------------------------------|
| dblclickMeasure| Sets the current mdiv and measure in the store on double-click   |

---

## Example

```vue
<ContentPreviewMeasure :measure="measure" :mdiv="mdivId" />