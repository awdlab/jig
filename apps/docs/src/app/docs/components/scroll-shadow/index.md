The Scroll Shadow directive (`jigScrollShadow`) adds a soft fading shadow to the
edges of a scroll container that still have content beyond them — a lightweight
affordance that hints "there's more to scroll" and disappears once you reach an
edge. Put it on any element that scrolls; it tracks the scroll position and
paints the shadow through the theme, so there is no per-app CSS to write.

### Horizontal

Set `jigScrollShadow="horizontal"` (the default axis) on a horizontally
scrollable element. A shadow fades in on the left once you scroll right, and on
the right while more content remains — both show together in the middle.

{{ demo: Demo_Scroll_Shadow_Horizontal }}

### Vertical

Use `jigScrollShadow="vertical"` to track the vertical axis instead, shading the
top and bottom edges as you scroll a tall list.

{{ demo: Demo_Scroll_Shadow_Vertical }}

### Both Axes

`jigScrollShadow="both"` tracks horizontal and vertical scrolling at once,
shading whichever of the four edges still has content beyond it.

{{ demo: Demo_Scroll_Shadow_Both }}

### Bringing Your Own Shadow

The directive also toggles `scrolled-start` / `scrolled-end` / `scrolled-top` /
`scrolled-bottom` classes on the target as each edge gains hidden content. Set
`jigScrollShadowUnstyled` to suppress the built-in overlay and paint your own
shadow off those classes — this is how the [Table](/components/table) anchors
its shadow to the sticky-column edge rather than the container edge. Reuse the
shared `--jig-scroll-shadow-color` custom property so your shadow matches the
built-in one exactly.
