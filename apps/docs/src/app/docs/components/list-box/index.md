The List Box (`<ngn-list-box>`) renders a scrollable, keyboard-navigable list of
items from an `items` array, with optional grouping, filtering, and
virtualization for large datasets. It is a value control — enable `selectable`
to let users pick items and `multiple` for multi-select. Reach for it when you
need a persistently visible list rather than a dropdown like `ngn-select`.

### Basic Usage

Pass an `items` array to render a scrollable list, and give the host a fixed
height so it scrolls. Without `selectable` the list is purely for display.

{{ demo: Demo_ListBox_Base }}

### Validation

Wired with the `ngnErrors` directive, the list box surfaces validation like any
other value control. Here a `required` error shows until an item is selected.

{{ demo: Demo_ListBox_Validation }}

### Grouped Items

Nested items (a `children` array) render as labelled groups with their entries
beneath. `transformToNgnItems` maps arbitrary objects onto the expected
`value`/`label`/`children` shape.

{{ demo: Demo_ListBox_Grouped }}

### Custom Templates

Project an `#item` template to customize how each option renders, and a `#group`
template for group headers. Both receive the item through `let-option`.

{{ demo: Demo_ListBox_Templates }}

### Value Selection

Bind `[(value)]` alongside `selectable` to control and read the selection. The
value holds the selected item's value (or an array once `multiple` is set).

{{ demo: Demo_ListBox_Value }}

### Multiple Selection

Set `multiple` together with `selectable` to allow several selections; the value
becomes an array and checkboxes appear automatically to indicate state.

{{ demo: Demo_ListBox_Multiple }}

### Filtering

Enable `filter` and feed it `filterText` to narrow the visible items. Matching is
case-insensitive substring by default; pass a `FilterConfig` object to `filter`
to customize it.

{{ demo: Demo_ListBox_Filter }}

### Virtual Scrolling

Set `virtual` with a fixed `itemHeight` to render only the visible rows, keeping
thousands of items smooth. This demo scrolls a list of 10,000 items.

{{ demo: Demo_ListBox_Virtual }}
