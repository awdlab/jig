The Popover (`jig-popover`) floats arbitrary content next to a trigger element.
It renders in the browser's top layer via the native Popover API — so it escapes
`overflow` clipping and stacking contexts — and is positioned against its
`anchor` with floating-ui, which flips and shifts the content to keep it in view.

Reach for a popover to reveal **interactive or rich content** on demand; for a
short non-interactive hint use a **tooltip**, and for a list of actions use the
**menu**.

### Basic Usage

Pass the trigger element to the required `anchor` input (a template reference to
any element) and control visibility with the `show()` / `hide()` / `toggle()`
methods or the two-way `open` model. React to `closing` (fired as the popover
starts to close) and `closed` (once its exit animation has finished).
`options.placement` (default `bottom`) chooses the side, and `options.padding`
sets the gap.

{{ demo: Demo_Popover_Base }}

### Lazy Loading

Project content through an `<ng-template #lazy>` to defer its creation until the
popover first opens. Combine it with `options.cache: true` to build that
content once and keep it alive across subsequent open/close cycles instead of
recreating it each time.

{{ demo: Demo_Popover_Lazy }}

### Dismissal and sizing

`closeBy` controls how the user can dismiss the popover: `any` (default) light-
dismisses on an outside click or `Escape`, while `none` keeps it open until you
close it programmatically. Set `hasShrinkableContent` when the content should
scroll or shrink to fit the available space, and use `options.sizeConstraints`
to bound its dimensions.
