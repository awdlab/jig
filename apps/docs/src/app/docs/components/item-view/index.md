The Item View (`ngn-item-view`) lays a data array (`items`) out in a single row
and **collapses whatever does not fit** into an overflow indicator, remeasuring
as the container resizes. Use it for horizontal lists of chips, tags, avatars,
or breadcrumbs that must degrade gracefully in tight space. It carries
`role="list"`.

### Basic Usage

Each item needs a stable id, named by the required `idField` input, and is drawn
with an `#item` template (or the `templateItem` input) that receives the item
plus its `index`, `first`, and `last` flags. The overflow indicator's
`#overflow` template receives `totalCount`, `overflowCount`, and the list of
`overflowItems`.

{{ demo: Demo_ItemView_Base }}

### Separator

Set `separator` to `true` for a `", "` separator, or pass a custom string; use
`iconItemSeparator` for an icon instead. The rendered separator can be
customised with an `#separator` template, which receives the current
`character` and/or `icon`.

{{ demo: Demo_ItemView_Separator }}

### Freeze

`overflowStrategyFreezeCount` keeps that many items pinned as always-visible
before the row is allowed to overflow, so the first (or, per strategy, the
anchored) items never collapse into the indicator.

{{ demo: Demo_ItemView_Freeze }}

### Overflow Strategies

`overflowStrategy` decides **where** items collapse when space runs out:
`end` (default) hides trailing items, `start` hides leading ones, `center` hides
from the middle, and `aroundIndex` keeps the item at `overflowStrategyIndex`
visible and overflows on both sides of it. Combine any strategy with
`overflowStrategyFreezeCount` to protect a run of items from collapsing.

For very large rows where every item has the same width, set `sameWidthItems`
to skip per-item measurement for a large performance win — at the cost of
accessibility, since screen readers can no longer report the hidden count and
keyboard users cannot reach the overflowed items directly.

{{ demo: Demo_ItemView_Strategies }}
