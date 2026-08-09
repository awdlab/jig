`jigResizable` turns the browser's own resize grip into a controlled one: it
applies the CSS `resize` handle through the theme, then clamps the resulting
size to your limits **and** to the space left between the element and the
viewport edge.

The gesture itself is native — the directive observes the size changes while
the pointer is down and writes the `min-*`/`max-*` styles that bound them.

### Basic Usage

{{ demo: Demo_Resizable_Base }}

> **The host needs a scroll context.** CSS `resize` is ignored on an element
> whose `overflow` is `visible`. Give the host `overflow: auto` (or `hidden`,
> `scroll`) or nothing will be resizable.

### Size Limits

`jigResizableSizeLimits` takes all four bounds; numbers are pixels, strings are
used verbatim as CSS, and `null`/`undefined` means unconstrained:

```html
<div
  jigResizable
  [jigResizableSizeLimits]="{
    minWidth: 180,
    minHeight: '6rem',
    maxWidth: null,
    maxHeight: null,
  }"
></div>
```

The maximum is always additionally clamped to the distance from the element's
top-left corner to the bottom-right edge of the document body, so a resize can
never push content out of reach. Your `maxWidth`/`maxHeight` are combined with
that clamp via CSS `min()`, so whichever is smaller wins.

### With Movable

Put `jigMovable` and `jigResizable` on the same element and the two cooperate:
before each resize the movable position is baked into `left`/`top`, so the
element grows from where it sits instead of jumping back.

A gesture that starts on the resize grip belongs to `jigResizable` alone —
it claims the pointer so the element resizes without also being dragged.
Anywhere else on the element still starts a move.

{{ demo: Demo_Resizable_Movable }}

### Disabling

`jigResizable` is the enable flag. It accepts the empty string, so the bare
attribute enables it; bind it to turn resizing on and off:

```html
<div jigResizable></div>
<div [jigResizable]="canResize()"></div>
```

### Theme State

The directive is themed through the `resizable` scope:

| Class       | When                                                      |
| ----------- | --------------------------------------------------------- |
| `resizable` | resizing is enabled — this class carries the CSS `resize` |
| `resized`   | the element has been resized at least once                |

Because the `resize` property comes from the theme part, restyling the grip is
a theming concern, not a component one.
