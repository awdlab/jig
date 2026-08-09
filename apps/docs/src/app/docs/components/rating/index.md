The Rating (`jig-rating`) is a form control for picking a numeric score by
clicking a row of symbols, dragging across them, or using the keyboard. Bind
`value` and set `count` for the number of symbols and `step` for the granularity
(use `0.5` for half symbols). It exposes the `slider` role.

### Basic Usage

{{ demo: Demo_Rating_Base }}

### Fractional Steps

Set `step` to allow fractional values such as half symbols.

{{ demo: Demo_Rating_Half }}

### Custom Symbol Template

Provide an `<ng-template #indicator>` to render each symbol yourself. It receives
the fill ratio (`$implicit`, 0..1) and the symbol `index`.

{{ demo: Demo_Rating_CustomTemplate }}

### States

`readonly`, `disabled`, and `invalid` states.

{{ demo: Demo_Rating_States }}
