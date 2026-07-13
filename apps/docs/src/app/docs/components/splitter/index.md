The Splitter (`<ngn-splitter>`) lays out resizable panels — one
`<ngn-splitter-panel>` per region — separated by draggable dividers, in a
`horizontal` or `vertical` layout. Give each panel a `fr` or `px` `size` plus
optional `minSize`/`maxSize` bounds. Use it for adjustable app shells such as a
sidebar next to a content area, or a preview pane.

### Basic Usage

Declare a `<ngn-splitter-panel>` for each region, then drag the divider between
two panels to resize. Sizes accept `fr` (proportional) or `px` (fixed) units —
here a fixed `70px` panel sits beside two `fr` panels that share the rest. Each
divider is a keyboard-focusable `separator`: arrow keys nudge it by `step`
(default `5px`), and Home/End jump to the extremes.

{{ demo: Demo_Splitter_Base }}

### Kinds

The `kind` input selects the divider appearance:

- `default` — the standard divider.
- `thin` — a 1px line that visually expands on hover, focus, and while dragging,
  without shifting surrounding content (the track stays 1px).
- `invisible` — no line at rest; the resize handle only appears on interaction. Draw
  your own seam between panels (e.g. a panel border), as shown below.

{{ demo: Demo_Splitter_Kinds }}

### Min/Max Constraints

Set `minSize` and `maxSize` on a panel to bound how far a drag may shrink or grow
it; both accept `px` or `%` values. When a drag reaches a bound, `resizeMode`
decides how the remaining movement is distributed — `'adjacent'` (default) only
resizes the neighbouring panel, while `'proportional'` spreads it across the
others.

{{ demo: Demo_Splitter_MinMax }}

### Panel Reordering

Bind `[panelOrder]` to an array of panel `name`s to set the display order
independently of how the panels are written in the template. Reassign the array
— as the Shuffle button here does — and the panels move to match.

{{ demo: Demo_Splitter_Reorder }}

### State Management

Give the splitter a `stateKey` and it persists the current layout, panel order,
and panel sizes to `stateStorage` (`'session'` by default, `'local'` here),
restoring them on reload. Choose which parts are saved with `stateData`.

{{ demo: Demo_Splitter_State }}

### Vertical Layout

Set `layout` to `'vertical'` to stack panels top-to-bottom with horizontal
dividers between them; sizes, bounds, and keyboard resizing all behave as in the
horizontal case, just along the vertical axis.

{{ demo: Demo_Splitter_Vertical }}
