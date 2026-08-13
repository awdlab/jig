The Toolbar component (`jig-toolbar`) arranges controls across three placements —
start, center and end — in either orientation, and decides what happens when they
stop fitting. It is a layout-and-focus container: it does not own the state of the
controls inside it.

### Basic Usage

Projected content lands in the start placement. `placement="center"` and
`placement="end"` move content into the other two tracks. The whole toolbar is a
single tab stop: `Tab` enters and leaves it as one unit, and the arrow keys move
between the controls inside.

{{ demo: Demo_Toolbar_Base }}

### Placements

The center placement is centered against the **toolbar**, not against whatever the
start and end placements happen to weigh — the side placements reserve equal space
for as long as neither of them needs more than its half. Past that the center gives
way rather than the side placement wrapping.

Note that `placement` must be a static attribute rather than a binding — Angular
resolves content projection at compile time.

{{ demo: Demo_Toolbar_Placements }}

### Wrap Overflow

`overflow="wrap"` (the default) lets the toolbar grow along the cross axis when
its content no longer fits. This is pure CSS: nothing is measured, and any
projected content works, so a simple toolbar needs no extra markup.

A placement wraps as a whole — it keeps its items together and moves to the next
line as one group, and only wraps inside itself when that single group is wider
than the toolbar. Space is spent where the content is: a full start placement uses
the room the end placement does not need before anything wraps.

{{ demo: Demo_Toolbar_OverflowWrap }}

### Popover Overflow

`overflow="popover"` collapses whatever no longer fits into a `…` trigger — one
per placement, at the end of that placement — which reveals the collapsed items in
a popover.

Collapsing an item means rendering it in two places, so collapsible content must
be declared as `<ng-template #item>` inside a `jig-toolbar-region` rather than
projected directly. Each item template receives an `overflowed` flag, so the same
template can render an icon-only button in the bar and an icon-plus-label row in
the popover.

Because a template is rendered twice, item state must live in the parent
component — an item that keeps its own internal state would diverge between the
bar and the popover.

{{ demo: Demo_Toolbar_OverflowPopover }}

### Collapse Priority

Regions sharing a placement pool their items and collapse by `priority`: the
lowest gives up its items first, regardless of where it sits visually. Ties are
broken by reverse DOM order.

This decouples visual order from collapse order — a low-priority region on the
left can empty while the region to its right stays full.

{{ demo: Demo_Toolbar_Priority }}

### Vertical

`orientation="vertical"` stacks the tracks and switches the measured axis to the
block direction.

Vertical overflow only happens when something bounds the toolbar's height. An
unbounded column is always exactly as tall as its content, so nothing ever
collapses — give the toolbar (or its container) a height when you want vertical
overflow.

{{ demo: Demo_Toolbar_Vertical }}

### Editor Toolbar

A formatting bar puts everything together: grouped actions separated by rules, a
block-style `jig-select`, toggle buttons whose pressed state lives in the editor,
and document actions pushed to the end.

Icon-only buttons carry the dense groups; the label lives in the tooltip and the
`aria-label`.

{{ demo: Demo_Toolbar_Editor }}

### Table Actions

The same layout serves a bulk-action bar — selection state and row actions at
the start, a filter field centered against the toolbar, and the view switcher at
the end.

{{ demo: Demo_Toolbar_TableActions }}
