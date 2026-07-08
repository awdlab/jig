The Splitter component provides resizable panels with support for horizontal and
vertical layouts, minimum/maximum sizes, and state management.

### Basic Usage

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

{{ demo: Demo_Splitter_MinMax }}

### Panel Reordering

{{ demo: Demo_Splitter_Reorder }}

### State Management

{{ demo: Demo_Splitter_State }}

### Vertical Layout

{{ demo: Demo_Splitter_Vertical }}
