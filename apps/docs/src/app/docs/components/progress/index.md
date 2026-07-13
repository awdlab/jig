The Progress component (`ngn-progress`) shows how far a task has advanced. Bind
`value` (0–100) for determinate progress, or set `indeterminate` for an animated
placeholder when the amount of work is unknown. It renders as a horizontal bar by
default and carries the `progressbar` role with a matching `aria-valuenow`; switch
to `circular` for a ring.

### Basic Usage

The bar fills to `value`, which is clamped to the 0–100 range. This demo drives it
on a timer to show the transition.

{{ demo: Demo_Progress_Base }}

### Indeterminate

For operations whose progress can't be measured, set `indeterminate` to show a
continuously animated indicator instead of a fixed fill (`value` is ignored, and
`aria-valuenow` is dropped).

{{ demo: Demo_Progress_Indeterminate }}

### Circular

Add `circular` to render the same progress as a ring instead of a bar.

{{ demo: Demo_Progress_Circular }}

### Circular Indeterminate

The circular variant also supports `indeterminate`, animating the arc around the
ring.

{{ demo: Demo_Progress_CircularIndeterminate }}

### Sizes

The circular variant accepts a custom `radius` and stroke `thickness` (both in
pixels); they have no effect on the bar.

{{ demo: Demo_Progress_Sizes }}
