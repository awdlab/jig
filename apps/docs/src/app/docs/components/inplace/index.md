The Inplace component (`jig-inplace`) shows a compact **display** view that,
when clicked, swaps to a richer **content** view in the same spot. Use it to
keep a page dense by default while letting a region expand on demand — an inline
"show details", an editable label, a lazy-loaded panel — without opening a
dialog or navigating away.

Reach for **edit-inplace** when the content view is specifically for editing a
value inline — a label that turns into an input with confirm/cancel affordances.
Reach for **inplace** when the content can be anything else; `edit-inplace`
builds its value-editing flow on top of this generic display/content swap.

### Basic Usage

You provide two templates: `#display` (the collapsed trigger) and `#content`
(what replaces it). The content template receives a `close` callback in its
context so it can return to the display view; focus is restored to the trigger
when the content closes, so keyboard and screen-reader users are not dropped to
the document body.

{{ demo: Demo_Inplace_Base }}

### Toggling and state

The display view is a `<button>` that switches to the content view on click. You
can also drive the toggle from code with the two-way **`contentVisible`** model
or the `switchToContent()`, `switchToDisplay()`, and `toggle()` methods. Set
`disabled` to freeze the control in its display view and apply disabled styling.

{{ demo: Demo_Inplace_Toggling }}

### Lazy rendering and caching

Content rendering is deferred by default: **`lazy`** (default `true`) means the
content template is not instantiated until the inplace is first opened. **`cache`**
(default `false`) controls what happens afterwards — when `false` the content is
torn down each time it closes and rebuilt on the next open; set it to `true` to
keep the content in the DOM between openings (preserving its state, at the cost
of memory).

{{ demo: Demo_Inplace_Lazy }}
