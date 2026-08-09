Two directives share one gesture engine:

- **`ngnDrag`** reports the gesture and changes nothing — you decide what a drag
  means.
- **`ngnDragScroll`** consumes the same gesture to pan its host, giving you
  grab-and-drag scrolling.

Unlike [`ngnMovable`](/components/movable), neither one repositions the element.

### Reporting a Drag

`ngnDrag` emits three outputs: `dragStart` once the gesture begins, `dragged`
on every pointer move, and `dragEnd` on release.

{{ demo: Demo_Drag_Base }}

`dragged` carries an `AwdDragInfo`:

| Field       | Meaning                                         |
| ----------- | ----------------------------------------------- |
| `deltaX`    | horizontal movement since the previous emission |
| `deltaY`    | vertical movement since the previous emission   |
| `absoluteX` | the pointer's current `clientX`                 |
| `absoluteY` | the pointer's current `clientY`                 |

The deltas are **frame deltas**, not the distance from where the gesture
started — accumulate them yourself if you need a total offset.

### Drag to Scroll

`ngnDragScroll` scrolls its host by the inverse of each delta, so the content
follows the pointer. Put it on the scrolling element itself.

{{ demo: Demo_Drag_Scroll }}

### Gesture Details

Both directives share the same rules, and both are browser-only — nothing is
wired up during server-side rendering.

**A drag needs 5px of travel.** Until the pointer has moved 5 pixels from
`pointerdown`, nothing is emitted. That is what keeps an ordinary click from
registering as a drag.

**The click after a drag is swallowed.** Once a gesture has actually started,
the `click` the browser synthesizes on release is cancelled in the capture
phase. A draggable element that is also clickable therefore does not fire its
click handler at the end of a drag — and neither do its children, which is what
makes `ngnDragScroll` usable over interactive content.

**Touch scrolling is suppressed.** `touchmove` is prevented over the host, so a
drag does not scroll the page behind it. Add `touch-action: none` to the host so
the browser hands the gesture over immediately.

**Pointer moves are tracked on the document.** The gesture continues while the
pointer leaves the host and ends wherever it is released.

### Custom Drag Behaviour

Both directives extend the abstract `AwdDragBase`, which does the gesture
detection and calls `onDragged(info)` on each move. Extend it when you want a
directive that reacts to the drag internally instead of emitting to a consumer:

```ts
@Directive({ selector: '[appDragResizeSidebar]' })
export class DragResizeSidebar extends AwdDragBase {
  private readonly _width = signal(280);

  protected onDragged(info: AwdDragInfo): void {
    this._width.update(w => w + info.deltaX);
  }
}
```

`dragStart`, `dragged` and `dragEnd` still emit — `onDragged` runs in addition
to them, not instead.
