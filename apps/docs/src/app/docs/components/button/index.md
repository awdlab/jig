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
`<jig-icon>`) as content and always provide an `aria-label`, since there is no
visible text for assistive tech to read.

{{ demo: Demo_Button_Kind }}

### Link buttons

The `link` kind is the one text-level kind: instead of the theme's button chrome
it renders as an inline control that inherits the surrounding font, wraps with
the paragraph and puts its focus ring outside the text. Every theme ships it —
the inline behavior comes from the base theme, so each theme only supplies the
colour, the underline and the ring.

Reach for it inside prose, in hint or empty-state text, and in dense footers
where a full button would be too loud. Use `<a ngnButton kind="link">` when the
click navigates and `<button ngnButton kind="link">` when it triggers an action;
both look identical.

{{ demo: Demo_Button_Link }}

### Inline buttons

Set `inline` (aliased `ngnButtonInline`) to size an icon button to the current
line height (`1lh`) instead of the default control height, and to make it
inline-level so it can sit in a line of text. It is the companion of
`kind="icon"` — the other kinds keep their normal box — and it is what the
built-in adornments use: the input field's clear button and edit-inplace's
confirm button are `kind="icon"` + `inline`.

Inline only changes the size, never the chrome. For an action that should read as
text, use `kind="link"` (see above).

{{ demo: Demo_Button_Inline }}

### Disabled state

Because the directive uses the underlying element, disable a `<button>` with the
native `disabled` attribute — this also removes it from the tab order and blocks
clicks. The theme reflects the disabled state visually across every kind: muted
text and, for filled kinds, a muted background. Native `<a>` elements have no
`disabled` attribute; render them conditionally or intercept navigation instead.

{{ demo: Demo_Button_Disabled }}

### Action buttons

`<jig-action-button>` is a config-driven wrapper for cases where a button is
described by data rather than markup — snackbars, dialog footers, and row
actions all build their buttons from a `config` object. The config carries the
`label`, `icon`, `kind`, `color`, `disabled` flag, a `value`, and an `action`
callback. On click the `action` runs first and then `clicked` emits the config's
`value`, so hosts can treat `clicked` as the dismiss signal after the action has
had its chance to run.

{{ demo: Demo_Button_Action }}
