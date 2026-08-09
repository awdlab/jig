Toasts are brief, non-intrusive messages that appear over the app and dismiss
themselves. You create them imperatively rather than placing `<awd-toast>` in a
template: register the feature once with `withToasts()` in your app providers
(optionally passing default options), then inject `injectToastCreator()` and call
`show(options)`. A single host region is created automatically and attached to
the app root in the top layer, so toasts stack there wherever they were
triggered from.

### Basic Usage

Each toast takes a `header` and `content` string (or `headerTemplate` /
`contentTemplate` for richer markup), an optional `icon`, and a themed `color`.
`show()` returns a handle with a `hide()` method for dismissing it in code.

{{ demo: Demo_Toast_Base }}

### Colors

The `color` option selects a themed variant per toast, letting you signal
success, warning, error, and so on.

{{ demo: Demo_Toast_Colors }}

### Closable

By default a toast has no close button (`closable: false`). Set `closable: true`
to render one; a closable toast can also be dismissed with `Escape` while
focused.

{{ demo: Demo_Toast_Closable }}

### Persistent

Toasts auto-hide after `autoHide` milliseconds (default `5000`). Set
`autoHide: false` to make a toast persistent — it then stays until the user or
your code dismisses it (keep the handle from `show()` and call `hide()`).

{{ demo: Demo_Toast_Persistent }}

### Icon

The `icon` option renders a glyph ahead of the toast's header, reinforcing the
message's intent alongside its `color`.

{{ demo: Demo_Toast_Icon }}
