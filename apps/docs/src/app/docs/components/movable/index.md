`ngnMovable` makes an element draggable with the pointer. It writes `left` and
`top` as inline styles on its host as you drag, and freezes the host's measured
`width`/`height` so the element does not reflow mid-drag.

It is what `<ngn-dialog [movable]>` is built on, and it works on any element of
your own.

### Basic Usage

{{ demo: Demo_Movable_Base }}

> **The host must be positioned.** `left`/`top` only do something on a
> positioned element. If the host computes to `relative` or `sticky`, the
> directive switches it to `fixed` for you. A `static` host is left alone and
> will not move — give it `position: absolute` (inside a positioned ancestor)
> or `position: fixed` yourself.

### Drag Handle

Pass an element to `ngnMovableDragHandle` and only that element starts a drag.
Everything else in the host stays interactive — text is still selectable,
buttons still click.

{{ demo: Demo_Movable_Handle }}

The handle receives the theme's grab cursor while idle and the grabbing cursor
while dragging. Set `[ngnMovableChangeCursor]="false"` to keep your own cursor.
When you swap the handle at runtime, the classes are removed from the previous
element automatically.

### Constraining Movement

`ngnMovableLimitToViewport` (on by default) clamps the element so it can never
be dragged out of sight. The clamp is measured against the **document**, so it
matches your coordinates when the host's offset parent is the document. Inside
a positioned container, `left`/`top` are relative to that container while the
clamp is not — turn the limit off there and constrain with the container's own
`overflow` instead.

### Disabling

`ngnMovable` itself is the enable flag, so `[ngnMovable]="canMove()"` toggles
dragging without removing the directive. Turning it off mid-drag ends the drag.

### Theme State

The directive is themed through the `movable` scope, which exposes:

| Class                  | When                                       |
| ---------------------- | ------------------------------------------ |
| `movable`              | dragging is enabled                        |
| `moved`                | the element has been dragged at least once |
| `drag-handle-grab`     | on the handle while idle                   |
| `drag-handle-grabbing` | on the handle while dragging               |

### Position Baking

`bakePosition()` writes the element's current offset into `left`/`top` and
marks it as moved, without any pointer interaction (applying the same
positioning rule as above). `ngnResizable` calls it
before a resize so a moved element does not jump; call it yourself if you
reposition the host through other means and want the drag to continue from
there.
