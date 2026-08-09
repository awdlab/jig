The Select Button (`jig-select-button`) is a segmented control: a row of
connected buttons from which the user picks exactly one. Use it for a small,
fixed set of mutually exclusive options that benefit from being visible at once
(a List / Grid view switcher, an alignment picker); for many or long options,
prefer a `select` dropdown instead.

### Basic Usage

Provide the choices through the required **`options`** input; the selected
option's `value` is exposed as the two-way `value` model. Selection is single —
picking a button replaces the previous choice.

{{ demo: Demo_SelectButton_Base }}

By default clicking the already-selected option does nothing. Set
**`allowUnselect`** to `true` to let a second click on the active option clear
the selection.

`orientation` accepts `'auto'` (default), `'horizontal'`, or `'vertical'`; in
`auto` mode it lays out horizontally and falls back to vertical when the buttons
do not fit. It renders as a button group, which also provides the roving-focus
arrow-key navigation between buttons.

### Validation

The control implements the signal-forms value-control contract, so it binds
straight to a form field and works with `jigErrors`; its invalid state is
reflected in the styling.

{{ demo: Demo_SelectButton_Validation }}

### States

`disabled` and `readonly` propagate to all buttons, and `invalid` applies error
styling. `label` / `labelledBy` give the group its accessible name.

{{ demo: Demo_SelectButton_States }}
