The Toggle Button (`<ngn-toggle-button>`) is a single button that flips a
boolean `value` on and off in place — think "bold" in a text editor. Its `value`
is a two-way `model<boolean>` that works with `ngModel` / reactive forms, and
the state is exposed via `role="switch"` + `aria-checked` so it reads as an
on/off toggle.

Prefer a **switch** when the on/off metaphor is a setting rather than an action,
and a **select-button** when the user picks one option out of several.

## Basic Usage

The label comes from the base `label` input; the icon and label render together
inside the button.

{{ demo: Demo_ToggleButton_Base }}

### Validation

As a form control it participates in validation, dirty/touched tracking, and the
`invalid` state (which drives error styling). `touched` is set on blur.

{{ demo: Demo_ToggleButton_Validation }}

## Labels

`labelOn` and `labelOff` let the caption change with the state; each falls back
to the shared `label` when unset. This is handy when the two states read better
with different wording (e.g. "Show" / "Hide").

{{ demo: Demo_ToggleButton_Labels }}

## Fixed Width

Because the caption can change between states, the button's width can jump as it
toggles. Set `fixedWidth` to reserve the width of the longest possible content
(both states are measured with `inert` placeholders), keeping the layout stable.

{{ demo: Demo_ToggleButton_FixedWidth }}

## Icons

`icon` sets a single icon for both states. `iconOn` / `iconOff` override it
per state and take precedence for their respective state, so you can show a
different glyph when active. Icons combine with the label or stand alone.

{{ demo: Demo_ToggleButton_Icon }}

## States

`disabled` and `readonly` both stop `toggle()` from changing the value.
`disabled` removes the button from interaction via the native `disabled`
attribute; `readonly` leaves the button focusable but makes `toggle()` a no-op
and reports `aria-readonly` to assistive tech.

{{ demo: Demo_ToggleButton_States }}
