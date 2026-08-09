The Scroller (`jig-scroller`) renders a list from an `items` array and can
**virtualise** it — rendering only the rows in view instead of the whole list.
Use the plain scroller for ordinary lists; switch on virtual scrolling once a
list grows large enough that rendering every row hurts.

### Basic Usage

Draw each row with a template you provide — the `item` content child
(`<ng-template #item>`) or the `templateItem` input — which receives the item and
its index. Give the scroller a bounded height (it owns the scroll) and mark each
row element with the `jigScrollerItem` directive so it picks up the theme's item
and sticky classes. Use `fieldId` for a stable track-by key and `focusable` to
put the scroller in the tab order. Without `virtual`, every item is rendered — the
scroller just provides the scrollable viewport and per-item theming.

{{ demo: Demo_Scroller_Base }}

### Sticky Elements

Point `fieldSticky` at a boolean field on your items; rows whose value is truthy
stick to the top of the viewport as you scroll past them (useful for group
headers). It works in both plain and virtual modes.

{{ demo: Demo_Scroller_Sticky }}

### Virtual Scrolling

Set `virtual` to render only the visible window of items. This requires a fixed
`itemHeight` (in pixels) so the scroller can size the spacer above and below the
rendered slice and map scroll position to item indices. `virtualPadding`
(default `2`) renders that many extra rows above and below the viewport to
reduce flicker while scrolling. Call `scrollToIndex(index)` to jump to a
specific item, and read `itemStartIndex()` for the first rendered index. The
scroller measures its scroll ancestor, so virtualisation still works when an
outer element (e.g. a table wrapper) owns the overflow.

{{ demo: Demo_Scroller_Virtual }}
