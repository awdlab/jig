The Hint component (`jig-hint`) displays helper or sub-text for a control — an
explanatory note about a value, or a validation, warning, or informational
message. The semantic intent is set through the `kind` input, and it can bridge
validation state from a companion helper such as `jigErrors` to show pending or
error messages beneath a field.

### Kinds

Each `kind` (`default`, `info`, `success`, `warning`, `error`) sets both the
color treatment and the default icon. Pass the text as projected content or via
the `content` input.

{{ demo: Demo_Hint_Base }}

### Icon

By default each semantic kind shows a matching icon; the neutral `default` kind
shows none. You can override the icon with the `icon` input, or set `iconOnly`
to render just the icon and move the text into a tooltip.

{{ demo: Demo_Hint_WithIcon }}

### Custom template

The content can be projected, passed as a string via the `content` input, or
provided as an `<ng-template #content>` for full control over the markup.

{{ demo: Demo_Hint_Template }}
