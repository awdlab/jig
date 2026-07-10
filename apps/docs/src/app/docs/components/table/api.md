# API

## NgnTable

Selector: `ngn-table`

## NgnTableRowActions

Selector: `[ngnTableRowActions]` (apply to a body `<tr>`)

| Input                       | Type              | Default | Description                                                 |
| --------------------------- | ----------------- | ------- | ----------------------------------------------------------- |
| `ngnTableRowActions`        | `NgnActionItem[]` | —       | Actions for this row.                                       |
| `ngnTableRowActionsContext` | `boolean`         | `true`  | Right-click opens a context menu of the actions.            |
| `ngnTableRowActionsInline`  | `boolean`         | `true`  | Renders an inline hover button-bar at the row's right edge. |

Keyboard: the table body is a single tab stop. ↑/↓ move the active row, → enters
the row's actions, ←/→ move between them (← off the first returns to the row),
Enter/Space trigger an action, and Enter/ContextMenu/Shift+F10 open the menu.
