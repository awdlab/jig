The Button Group component (`ngn-button-group`) collects a set of related
buttons into a single visual unit and manages keyboard focus across them. It is
a layout-and-focus container only — it does not track selection itself. Project
`button[ngnButton]` elements, or `ngn-toggle-button`s when you want pressable
buttons; the group adapts to either. Style variants (`kind`, `color`) live on
the individual buttons, not on the group.

### Basic Usage

Three related `button[ngnButton]`s wrapped in `<ngn-button-group>` render as one
connected unit and share a single tab stop (roving focus). `Tab` moves into and
out of the whole group as one unit; once inside, the arrow keys move focus
between the buttons, and disabled buttons are skipped automatically. This
matches the toolbar interaction pattern and keeps a row of buttons from bloating
the tab order.

{{ demo: Demo_ButtonGroup_Base }}

### Orientation

`orientation` accepts `'auto'` (default), `'horizontal'`, or `'vertical'`. In
`'auto'` mode the group lays out horizontally but flips to vertical when the
buttons no longer fit the available width, so a group degrades gracefully in
tight containers instead of overflowing.

{{ demo: Demo_ButtonGroup_Orientation }}

### Toggle Buttons

Placing `ngn-toggle-button`s inside the group gives each button an independent
pressed/unpressed state — use this for a set of independent toggles. For a
segmented control where exactly one option is selected at a time, use
`select-button`, which wraps a button group with single-selection value
handling.

{{ demo: Demo_ButtonGroup_Toggle }}
