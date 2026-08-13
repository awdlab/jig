The Meter component (`jig-meter`) breaks a quantity into labelled, colored parts:
a stacked bar plus a legend. Each item carries a `label`, a `value` and optionally
a `color` and an `icon`. Without a `total` the items add up to a full bar; with one,
whatever they don't cover stays empty track.

### Basic Usage

Pass `items`; each one becomes a segment sized by its share of the sum, and a legend
entry with its percentage. Shares are shown rounded, except a non-zero sliver below one
percent, which reads `<1%` rather than `0%`.

{{ demo: Demo_Meter_Base }}

### Total

Set `total` to measure the items against a fixed capacity. Here 54 of 80 sprint hours
are booked, so a quarter of the bar stays empty. Items that add up to more than `total`
overflow the reported 100% — the bar clips them and logs a dev-mode error.

{{ demo: Demo_Meter_Total }}

### Naming the remainder

Empty track has no label and no percentage, so nothing announces it. When the free
space is part of the story, pass it as its own item — it then gets a legend entry, a
color and a share like everything else.

{{ demo: Demo_Meter_Remaining }}

### Icons

An item can carry an `icon`, rendered before its label in the legend.

{{ demo: Demo_Meter_Icons }}

### Colors

Items without a `color` cycle through the theme's meter palette. Set `color` to any
CSS color — a literal, or a theme variable — to pin an item to a fixed meaning.

{{ demo: Demo_Meter_Colors }}

### Vertical

Add `vertical` to stand the bar up and put the legend beside it. It fills bottom-up, the
way a tank or gauge reads, and takes its length from its own host — so the height belongs
on the `jig-meter` element. Put it on a wrapper instead and the track has nothing to size
against: it collapses to the theme's minimum and renders empty.

{{ demo: Demo_Meter_Vertical }}

### Hiding percentages

Set `showPercentage` to `false` for a legend of plain labels. The percentage stays in
the accessibility tree, so screen reader users keep the numbers.

{{ demo: Demo_Meter_Percentages }}

### Hover pairing

Hovering a segment highlights the legend entry that names it, and hovering a legend entry
highlights its segment — useful once a bar carries more slices than colors you can hold in
your head. It is decorative, so set `highlightOnHover` to `false` to switch it off.

Segments are separated by a hairline in the track color and the filled run ends in a rounded
cap, so neighbouring slices stay readable even when their colors sit close together. An item
with a value too small to round up to a visible slice still paints a minimum sliver, so the
bar never contradicts its legend.

### Custom labels

Project an `<ng-template #label>` to replace the legend row. The template receives the
item as `$implicit` and its unrounded share as `percentage`, so you can show absolute
values, formats or extra controls instead.

{{ demo: Demo_Meter_Templates }}
