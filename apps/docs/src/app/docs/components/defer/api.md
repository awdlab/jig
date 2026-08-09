Selector: `jig-defer`

{{ api: defer/defer AwdDefer }}

## Host classes

| Class    | When                                     |
| -------- | ---------------------------------------- |
| `open`   | `open()` is `true`.                      |
| `hidden` | Closed and `hiddenOnClosed()` is `true`. |

`aria-hidden` mirrors the closed state. `jig-defer` has no theme part — the
`hidden` class is implemented by the component's own minimal style.
