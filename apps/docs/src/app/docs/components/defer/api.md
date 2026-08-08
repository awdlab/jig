Selector: `ngn-defer`

{{ api: defer/defer NgnDefer }}

## Host classes

| Class    | When                                     |
| -------- | ---------------------------------------- |
| `open`   | `open()` is `true`.                      |
| `hidden` | Closed and `hiddenOnClosed()` is `true`. |

`aria-hidden` mirrors the closed state. `ngn-defer` has no theme part — the
`hidden` class is implemented by the component's own minimal style.
