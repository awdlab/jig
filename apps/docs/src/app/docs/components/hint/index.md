The Hint component displays helper or sub-text for a control — an explanatory
note about a value, or a validation, warning, or informational message. The
semantic intent is set through the `kind` input.

### Kinds

{{ demo: Demo_Hint_Base }}

### Icon

By default each semantic kind shows a matching icon; the neutral `default` kind
shows none. You can override the icon with the `icon` input.

{{ demo: Demo_Hint_WithIcon }}

### Custom template

The content can be projected, passed as a string via the `content` input, or
provided as an `<ng-template #content>` for full control over the markup.

{{ demo: Demo_Hint_Template }}
