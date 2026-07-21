The Button is an attribute directive (`ngnButton`) rather than a wrapper
component — you apply it to a native `<button>` or `<a>` element, so the element
keeps its native semantics, form behavior, and keyboard handling. Use it on a
`<button>` for actions and on an `<a>` for navigation; the theme makes them look
identical.

### Basic Usage

Applying `ngnButton` to a native `<button>` gives it the theme's default styling
while its own `click` handler keeps working.

{{ demo: Demo_Button_Base }}

### Button Kinds & Colors

The visual style is driven by two theme inputs, `kind` and `color`. `kind`
selects the emphasis/shape variant the active theme defines (e.g. `primary`,
`secondary`, `icon`), and `color` picks a semantic palette. The available values
come from the theme, so the demo below enumerates whatever the current theme
ships.

The `icon` kind is the icon-only button: give it a single glyph (or an
`<ngn-icon>`) as content and always provide an `aria-label`, since there is no
visible text for assistive tech to read.

{{ demo: Demo_Button_Kind }}

### Inline buttons

Set `inline` (aliased `ngnButtonInline`) to size the button to the current line
height instead of the default control height. This is meant for buttons that sit
inside flowing text or dense adornment slots — for example the icon buttons in a
tabs header.

{{ demo: Demo_Button_Inline }}

### Disabled state

Because the directive uses the underlying element, disable a `<button>` with the
native `disabled` attribute — this also removes it from the tab order and blocks
clicks. The theme reflects the disabled state visually across every kind: muted
text and, for filled kinds, a muted background. Native `<a>` elements have no
`disabled` attribute; render them conditionally or intercept navigation instead.

{{ demo: Demo_Button_Disabled }}

### Action buttons

`<ngn-action-button>` is a config-driven wrapper for cases where a button is
described by data rather than markup — snackbars, dialog footers, and row
actions all build their buttons from a `config` object. The config carries the
`label`, `icon`, `kind`, `color`, `disabled` flag, a `value`, and an `action`
callback. On click the `action` runs first and then `clicked` emits the config's
`value`, so hosts can treat `clicked` as the dismiss signal after the action has
had its chance to run.

{{ demo: Demo_Button_Action }}
