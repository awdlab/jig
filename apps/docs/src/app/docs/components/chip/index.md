The Chip is a compact, **interactive** counterpart to the tag: a small block of
information the user can click (`actionable`) or remove (`closable`). Reach for
it when the element does something — a selectable filter, a removable input
token, a clickable entity; for a purely decorative label, use the **tag**. Like
the tag it honours the theme's `kind` and `color` inputs.

### Basic Usage

A plain chip (neither `actionable` nor `closable`) is a static block styled by
`kind` / `color`.

{{ demo: Demo_Chip_Base }}

### Closable Chip

`closable` adds a close button (glyph overridable via `iconClose`); handle
`closed` — which carries the DOM `Event` — to drop the chip from your data.

{{ demo: Demo_Chip_Closable }}

### Actionable Chip

`actionable` makes the chip itself clickable via the `clicked` output, and can
be paired with `closable`.

{{ demo: Demo_Chip_Actionable }}
