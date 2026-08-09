The Snackbar shows brief, transient notifications in a stack, keeping the user
informed of the result of an action without interrupting their flow. It is the
sibling of the toast — same idea, different placement and defaults. Snackbars are
created imperatively, so you rarely place `<awd-snackbar>` in a template
yourself.

### Creating snackbars

Register the feature once with `withSnackbars()` in your app providers (it can
take default options), then inject `injectSnackbarCreator()` and call `show()`
with the message. `show()` returns a ref with a `hide()` method for dismissing
the snackbar programmatically.

```ts
const snackbars = injectSnackbarCreator();
snackbars.show({ header: 'Saved', content: 'Your changes were saved.' });
```

Each snackbar auto-dismisses after `autoHide` ms (default `5000`; pass `false`
to keep it open until dismissed). A depleting progress bar (`showProgress`) shows
the remaining time, and the timer pauses while the snackbar is hovered
(`pauseOnHover`) or focused — the latter always, so keyboard and screen-reader
users get time to read it. For accessibility the snackbar renders as a live
region: `error`/`warning` colors announce assertively (`role="alert"`), others
politely (`role="status"`), a visually-hidden severity prefix conveys the color's
meaning, `Escape` dismisses a closable snackbar, and focus returns to where it
was on close.

### Basic Usage

The minimal call takes a `header` and `content`.

{{ demo: Demo_Snackbar_Base }}

### Colors

`color` sets the semantic styling (e.g. `success`, `error`, `warning`, `info`)
and, unless you override `ariaLive`, determines how urgently it is announced.

{{ demo: Demo_Snackbar_Colors }}

### Closable

Set `closable` to render a dismiss button (customizable via `iconClose`); a
closable snackbar also responds to `Escape`.

{{ demo: Demo_Snackbar_Closable }}

### Persistent

Pass `autoHide: false` to keep the snackbar visible until it is dismissed
manually — appropriate for messages the user must acknowledge.

{{ demo: Demo_Snackbar_Persistent }}

### Icon

`icon` shows a leading glyph, typically paired with a semantic `color`.

{{ demo: Demo_Snackbar_Icon }}

### Actions

`actions` renders buttons at the end of the snackbar (e.g. "Undo"). Clicking any
action runs its `action` callback and then always dismisses the snackbar.

{{ demo: Demo_Snackbar_Actions }}
