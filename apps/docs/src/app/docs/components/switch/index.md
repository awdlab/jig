The Switch (`<jig-switch>`) toggles a single boolean that takes effect
immediately — think "Notifications on/off" or "Dark mode", where flipping it
applies the change at once with no separate save step. Its state is a plain
`boolean` exposed through the two-way `value` model.

When the opt-in is instead committed only when a form is submitted (accept terms,
pick items from a list), prefer a **checkbox**.

## Basic Usage

Under the hood it is a native `<input type="checkbox">` styled as a track and
thumb, so it participates in the page like any checkbox — bind the two-way
`value`.

{{ demo: Demo_Switch_Base }}

## Validation

The switch implements the signal-forms value-control contract, so it binds to a
form field directly and works with the `ngnErrors` directive for validation
messages. Its invalid state is reflected as `aria-invalid` on the input.

{{ demo: Demo_Switch_Validation }}

## States

`disabled` removes the switch from interaction entirely (disabled attribute).
`readonly` keeps it focusable and announced but blocks changes — clicks are
prevented and `aria-readonly` is set — which is useful for showing a value the
user may not currently change. `invalid` applies the error styling shown above.

Point `labelledBy` at the id of an existing element to give the underlying
checkbox an accessible name.

{{ demo: Demo_Switch_States }}
