`jig-kbd` renders a keyboard shortcut, and `[ngnKeyboardShortcut]` runs callbacks
for one. Both read the same config string: lowercase tokens joined by `+`, in any
order — `mod+shift+a`, `escape`, `alt+arrowup`, `mod+/`.

`mod` is the platform's primary modifier: Cmd on macOS, Ctrl everywhere else.
`ctrl`, `meta`, `alt`, and `shift` are literal on every platform. The final token
is a single character (`a`, `/`) or a name (`enter`, `escape`, `space`, `tab`,
`delete`, `arrowup`, `f2`). `esc` is an alias for `escape`, and `plus` is an alias
for the `+` character — `'+'` alone can't survive the `+`-split, so `mod+plus` is
how you write Cmd/Ctrl-plus.

### Displaying a shortcut

Glyphs stand in for key names: `ctrl` renders ⌃, `meta` renders ⌘, `alt` ⌥ and
`shift` ⇧. `mod` renders as the key it actually resolves to — ⌘ on macOS, ⌃
everywhere else — so the keycap never names a key the combo does not use.

{{ demo: Demo_Kbd_Base }}

### Handling a shortcut

`[ngnKeyboardShortcut]` takes an array of `{ shortcut, callback }` and fires only
while focus is inside its host element. A handled shortcut stops propagating, so
a nested scope wins over an outer one.

{{ demo: Demo_Kbd_ShortcutScope }}

> **Focus is required.** Nothing fires while focus sits outside the host — including
> on `<body>`. Mark a binding `global: true` to lift that requirement for it alone:
> it then fires from anywhere on the page, while the scope's other bindings keep
> theirs. That is how an app-wide hotkey (opening a command palette, say) is wired.

> **Typing is protected.** A combo with no `ctrl`/`mod`/`meta`/`alt` is ignored while
> the event target is an input, textarea, select, or contenteditable element, so a bare
> `a` never steals a keystroke. Held keys (`event.repeat`) fire once.

### Action buttons and dialogs

An `AwdActionButtonConfig` can carry a `shortcut`. The button registers it with the
nearest ancestor scope and renders the glyphs inline next to its label or icon, for
every kind — an icon-only button shows icon + keycap. `jig-dialog` is a scope, so
footer buttons work with no extra wiring.

A footer button only emits `buttonClicked`, whether it was clicked or triggered by its
shortcut — closing the dialog stays the consumer's decision, as below.

{{ demo: Demo_Kbd_DialogButtons }}
