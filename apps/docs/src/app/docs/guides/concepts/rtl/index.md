Controls read the writing direction from the DOM. Set `dir` once — on `<html>`,
or on any element — and everything below it mirrors. There is no RTL mode to
enable, no per-control input to set, and no service to configure.

```
<html dir="rtl">
```

The topbar theme picker has a **Direction** toggle that flips these docs to RTL,
so every example on every page can be read in both directions.

### It resolves per subtree

`direction` is an inherited CSS property, so a `dir="rtl"` island inside a
left-to-right page works — and so does the reverse. The block below is the only
RTL part of this page:

{{ demo: Demo_Rtl_Subtree }}

That matters for real apps: a comment field holding Arabic content can be RTL
while the surrounding shell stays LTR.

### What mirrors

Anything positional. Padding, margins, borders and corner radii are written as
CSS logical properties, so they follow the inline axis rather than a fixed side.
The pieces CSS cannot express logically — gradient directions, `transform-origin`,
`translate()` offsets, and the arrow glyphs in the default icon set — are handled
per theme with `:dir(rtl)` rules.

{{ demo: Demo_Rtl_Comparison }}

Note the badge overhanging the opposite corner, the paginator arrows swapping
direction, and the progress bar filling from the other edge.

### Logical option values

Inputs that name an edge take `start`/`end` rather than `left`/`right`, so the
value keeps its meaning in both directions:

```html
<!-- opens from the left in LTR, from the right in RTL -->
<jig-drawer position="start" />

<jig-upload listPosition="end" />
```

`top` and `bottom` are unchanged — the block axis does not flip.

### Overlay placement

`placement` on `jig-tooltip`, `jig-popover` and `jig-menu` uses floating-ui's
values. The **alignment** half is logical and already flips: `bottom-start`
anchors to the left in LTR and to the right in RTL. The **side** half
(`left`, `right`) stays physical by design — asking for a tooltip on the left
means the left.

### Flipping at runtime

Setting `dir` is enough for anything styled in CSS; it re-matches on its own. An
overlay that is _already open_ computed its position imperatively, so tell the
library to redo that work:

```ts
import { notifyDirectionChanged } from '@awdlab/jig/api/ng';

document.documentElement.setAttribute('dir', 'rtl');
notifyDirectionChanged();
```

You do not need this when the direction is set once at bootstrap and never
changes.

### Reading the direction yourself

For your own pointer or keyboard maths, `isRtl` answers per element. Call it at
the point of use rather than caching it, so it stays correct for whatever subtree
the element is in:

```ts
import { isRtl } from '@awdlab/jig/api/ng';

const forward = isRtl(el) ? -1 : 1;
```

### Deliberately physical

Layout, styling, keyboard navigation and pointer interaction are all
direction-aware. Horizontal arrow keys follow the inline axis, so in RTL
`ArrowLeft` advances — including where the axis carries meaning rather than
order: tree nodes expand away from the root, submenus open away from their
parent, and a table's action bar is entered from the row's inline-end. Dragging
mirrors too: a slider's value, a splitter's divider, and table column
resize/reorder all measure from the inline-start edge.

Three things stay physical on purpose:

- **Overlay sides.** `placement="left"` on a tooltip or popover means the left.
  Only the alignment half (`-start`/`-end`) follows the direction.
- **Free dragging.** `jigMovable` moves an element wherever the pointer goes, so
  it writes physical coordinates — dragging left moves left in both directions.
- **The colour picker.** Its saturation, hue and alpha gradients are painted
  left-to-right and the pointer maths matches, so a hue ramp does not reverse
  when the page does.

Two known gaps: `background-position` on decorative backgrounds is physical, and
code blocks are pinned to `direction: ltr` (which is what you want for source).
