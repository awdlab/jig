## JigDrag

Selector: `[ngnDrag]`

{{ api: directives/drag/drag JigDrag }}

## JigDragScroll

Selector: `[ngnDragScroll]`

Same outputs as `ngnDrag`; each move additionally scrolls the host by the
inverse delta.

{{ api: directives/drag/drag-scroll JigDragScroll }}

## JigDragInfo

| Field       | Type     | Description                                      |
| ----------- | -------- | ------------------------------------------------ |
| `deltaX`    | `number` | Horizontal movement since the previous emission. |
| `deltaY`    | `number` | Vertical movement since the previous emission.   |
| `absoluteX` | `number` | The pointer's current `clientX`.                 |
| `absoluteY` | `number` | The pointer's current `clientY`.                 |

## JigDragBase

Abstract base for both directives. Extend it and implement
`protected onDragged(info: JigDragInfo): void` to build a directive that
handles the gesture itself. The `isDragging` signal is available to subclasses.
