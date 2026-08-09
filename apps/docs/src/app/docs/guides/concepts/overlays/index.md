Tooltips, popovers, menus, selects, dialogs and drawers all sit on top of the
page. Two browser features do the heavy lifting, and
[floating-ui](https://floating-ui.com) does the maths.

### The top layer

Overlays use the platform's **top layer** — native `popover` for the
non-modal ones, `<dialog>.showModal()` for modal ones. That has consequences
worth knowing, because they solve problems other libraries fight:

- **No z-index.** A top-layer element paints above everything, whatever the
  stacking contexts below it. You never need to bid up a z-index, and an
  ancestor's `transform` or `filter` cannot trap an overlay.
- **No `overflow: hidden` clipping.** An overlay inside a scroll container is
  not clipped by it.
- **Escape and light dismiss** are handled by the browser for `popover`
  elements, so dismissal behaves the way the platform does everywhere else.

The trade-off is that overlay content is not in the DOM where you wrote it in
terms of paint order, so _your_ CSS descendant selectors from an ancestor still
match (the node stays put in the tree) but visual stacking is out of your
hands. That is almost always what you want.

### Positioning

Anchored overlays are placed by floating-ui, loaded on demand the first time
one opens — the dependency costs nothing on a page without overlays.

The shared options:

| Option            | Default    | Effect                                                         |
| ----------------- | ---------- | -------------------------------------------------------------- |
| `placement`       | `'bottom'` | Preferred side and alignment (`'bottom-start'`, `'right'`, …). |
| `flip`            | `true`     | Flip to the opposite side when there is not enough room.       |
| `shift`           | `true`     | Slide along the axis to stay in view.                          |
| `offset`          | `4`        | Gap between anchor and overlay, in pixels.                     |
| `resize`          | `true`     | Reposition when the anchor or viewport changes size.           |
| `strategy`        | —          | floating-ui strategy (`'absolute'` / `'fixed'`).               |
| `sizeConstraints` | —          | Width/height bounds, see below.                                |
| `middleware`      | —          | Extra floating-ui middleware, appended to the defaults.        |

`placement` is a preference, not a guarantee: with `flip` and `shift` on, the
overlay ends up wherever it actually fits. Turn them off only when a fixed side
matters more than visibility.

Coordinates are snapped to the device-pixel grid, so overlays and their arrows
render crisply instead of on fractional boundaries.

### Sizing relative to the anchor

`sizeConstraints` accepts strings (used as CSS verbatim) or numbers, where a
number is a **multiple of the anchor's width**:

```ts
sizeConstraints: {
  width: 1,          // exactly as wide as the trigger
  maxWidth: 2,       // never more than twice the trigger
  maxHeight: '20rem' // plain CSS
}
```

This is how a select's dropdown matches its input without measuring anything
yourself.

### Anchoring to a point

An anchor is either an element or a `{ x, y }` point — which is what
`[ngnContextMenu]` uses to open at the pointer.

### Repositioning

Anchored overlays track their anchor while open: scrolling, resizing and
anchor size changes all trigger a recompute. The handle returned by the
positioning API can `stop()` and `start()` tracking when you need to freeze an
overlay in place.

### Closing behaviour

Overlay controls share a `closeBy` input describing what dismisses them —
clicking outside, pressing Escape, either, or neither. A modal dialog also
traps focus while open and restores it to the trigger on close.

### Nesting

Overlays nest: a menu inside a popover inside a dialog works, and each level
dismisses independently in the order the user expects, because the top layer is
a stack.

The one rule: an overlay's content is created by the component that declares
it, so put the trigger and the overlay in the same template rather than trying
to open one component's overlay from another's markup.

### Server-side rendering

No overlay is open during SSR, so none of their content is in the server HTML,
and floating-ui is never loaded there. Content that must be indexable does not
belong inside an overlay.

### Deferring the content

Overlay bodies are rendered lazily where the control supports it — see
[Defer](/components/defer) for the primitive and how `lazyContent` differs from
projected content.

### Related

- [Popover](/components/popover), [Menu](/components/menu),
  [Tooltip](/components/tooltip), [Dialog](/components/dialog),
  [Drawer](/components/drawer)
- [Configuration](/guides/configuration) — app-wide tooltip defaults
