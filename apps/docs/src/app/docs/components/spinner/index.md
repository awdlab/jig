The Spinner (`<awd-spinner>`) is an indeterminate loading indicator — an animated
circular ring for when you can't show real progress. It renders with
`role="status"` so assistive tech treats it as a live status region. Use it while
content is loading, inside a button during a pending action, or as the busy state
of `<awd-state>`.

### Basic Usage

The spinner displays an animated circular indicator suitable for loading states.
It is inline by default; set `centered` to center it within its containing block,
which is what you want when overlaying a whole panel.

{{ demo: Demo_Spinner_Base }}

### Sizes

Control the diameter with `size`, given in pixels (default `64`).

{{ demo: Demo_Spinner_Sizes }}

### Thickness

Set `thickness` to a CSS length such as `'4px'` for the ring stroke; it falls
back to the theme default when left unset.

{{ demo: Demo_Spinner_Thickness }}

### Colors

The spinner can be styled with the themes colors or a custom color.

{{ demo: Demo_Spinner_Colors }}

### Programmatic Creation

For "cover this element while it loads" cases you don't need a template spinner.
Inject `injectSpinnerCreator()` and call `show(target, options)` to attach a
spinner to any element or selector; it returns a ref with `hide()`, and sets
`aria-busy` on the target while active (opt out via `ariaBusy: false`).
`createConditionalSpinner(isVisible, options)` binds a spinner to a boolean
signal, showing and hiding it automatically (with a debounce, default 200ms, so
brief loads don't flash a spinner).

{{ demo: Demo_Spinner_Creator }}
