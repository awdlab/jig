## NgnDrag

Selector: `[ngnDrag]`

{{ api: directives/drag/drag NgnDrag }}

## NgnDragScroll

Selector: `[ngnDragScroll]`

Same outputs as `ngnDrag`; each move additionally scrolls the host by the
inverse delta.

{{ api: directives/drag/drag-scroll NgnDragScroll }}

## NgnDragInfo

| Field       | Type     | Description                                      |
| ----------- | -------- | ------------------------------------------------ |
| `deltaX`    | `number` | Horizontal movement since the previous emission. |
| `deltaY`    | `number` | Vertical movement since the previous emission.   |
| `absoluteX` | `number` | The pointer's current `clientX`.                 |
| `absoluteY` | `number` | The pointer's current `clientY`.                 |

## NgnDragBase

Abstract base for both directives. Extend it and implement
`protected onDragged(info: NgnDragInfo): void` to build a directive that
handles the gesture itself. The `isDragging` signal is available to subclasses.
