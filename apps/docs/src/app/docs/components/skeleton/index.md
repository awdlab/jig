The Skeleton (`<jig-skeleton>`) is a shaped placeholder that stands in for content
while it loads. It has no interactions and no state — it is a sized block that
animates according to the active theme.

Each skeleton is one shape: a rectangle sized with `width` / `height`, or a
circle sized with `diameter`. Compose several of them to mirror the layout that
is about to appear. Sizing defaults to one line of text, so stacked text
placeholders need no inputs at all.

> **The skeleton is `aria-hidden`.** It announces nothing on its own. Mark the
> surrounding region as busy (`aria-busy="true"`) so assistive tech knows content
> is on its way — see the A11y tab.

### Basic Usage

A bare `<jig-skeleton />` is a text-line placeholder: full width of its
container, one line tall (`1lh`). Override `width` / `height` for anything else —
numbers are pixels, strings are any CSS length.

A rectangle paints 2px in from its top and bottom edge, so stacked lines read as
separate lines without any gap. The inset is painted inside the box, never added
to it — the skeleton always occupies exactly the height you asked for.

{{ demo: Demo_Skeleton_Base }}

### Shapes

`shape="circle"` uses `diameter` and is always fully rounded. `shape="rect"`
(the default) uses `width`, `height` and an optional `radius` that overrides the
theme's default corner rounding.

{{ demo: Demo_Skeleton_Shapes }}

### Text Blocks

There is no `lines` input — a paragraph placeholder is a handful of skeletons in
a stack, which keeps the gaps and the short last line under your control.

{{ demo: Demo_Skeleton_Text }}

### Cards

Mirror the real layout: media block, heading, body lines, then the footer meta
row. Matching the final proportions is what keeps the swap from jumping.

{{ demo: Demo_Skeleton_Card }}

### Lists

Repeat a row placeholder for as many rows as you expect. Varying the text widths
per row reads as content rather than as a loading bar.

{{ demo: Demo_Skeleton_List }}

### Swapping In Real Content

The realistic case: a region that is `aria-busy` while loading, holding
skeletons, and drops them once the data arrives. Placing each skeleton _inside_
the element it stands in for means the default `1lh` height picks up that
element's own line height, so the placeholder and the real content occupy the
same space.

{{ demo: Demo_Skeleton_Loading }}
