`ngnScrollAmount` publishes an element's scroll geometry as signals and fires
`endReached` when the user scrolls near the bottom. It is the primitive behind
"load more" lists and scroll-linked UI.

### Reading Scroll State

The directive has no `exportAs`, so query it with `viewChild` to read its
signals:

{{ demo: Demo_ScrollAmount_Base }}

The exposed signals are listed under **Properties** in the
[API](/components/scroll-amount/api) tab.

Geometry is resynced whenever the observed element resizes **or** the host's
own content grows, so `distanceFromEnd` stays correct after rows are appended
— no manual refresh call.

### Infinite Scrolling

`endReached` is **edge-triggered**: it fires once as the scroll position
crosses into the threshold zone and does not fire again until the position
leaves the zone and comes back. Appending rows pushes the end away, which
re-arms it.

{{ demo: Demo_ScrollAmount_Infinite }}

`ngnScrollAmountEndThreshold` is the distance in pixels at which it fires —
`0` means "at the very bottom", a larger value prefetches earlier.

> Still guard your loader against overlapping loads. Edge-triggering removes
> the repeated-fire problem, not the case where the user scrolls back and forth
> across the threshold while a request is in flight.

For a guarded consumer, read `distanceFromEnd` directly instead of listening to
the output — you get the same information continuously, with no edge semantics
to reason about.

### External Scroll Container

When the scrolling element is not the host — a wrapper you don't control, or a
scroller elsewhere in the page — point the directive at it:

```html
<div #outer class="scroll-area">
  <ul ngnScrollAmount [ngnScrollAmountContainer]="outer" (endReached)="loadMore()">
    …
  </ul>
</div>
```

Scroll events and dimensions are then read from that element, while the host
still contributes its own size to the resync.

### Server-side Rendering

Scroll listeners and geometry sync run in `afterRenderEffect`, so nothing is
observed on the server. The signals start at the element's initial values
(`0`) and become live after the first client render.

### Related

The [Scroller](/components/scroller) control builds virtual scrolling on top of
this idea, and the [Table](/components/table) uses it for lazy infinite scroll.
Reach for `ngnScrollAmount` when you want the raw numbers instead.
