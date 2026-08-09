### Kbd API

{{ api: kbd/kbd JigKbd }}

### Keyboard Shortcut API

{{ api: kbd/keyboard-shortcut JigKeyboardShortcut }}

### Shortcut Helpers

All exported from `@awdlab/jig/kbd`. These are the pure, Angular-free
building blocks `jig-kbd` and `[jigKeyboardShortcut]` are built on — reach for
them directly when writing your own control that registers into a shortcut
scope.

| Function                                                                      | Description                                                                                                                                                                                      |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `parseShortcut(shortcut: string): ParsedShortcut`                             | Parses a config string into a form directly comparable to a `KeyboardEvent`, resolving `mod` to `meta`/`ctrl` for the current platform.                                                          |
| `matchesShortcut(event: KeyboardEvent, parsed: ParsedShortcut): boolean`      | Whether a keydown event satisfies a parsed shortcut. Modifiers must match exactly, with a punctuation/space exception for the Shift state.                                                       |
| `formatShortcut(shortcut: string): string`                                    | Renders a shortcut as glyphs for display, e.g. `mod+shift+a` → `⇧⌘A` on macOS and `⇧⌃A` elsewhere. `ctrl`, `meta`, `alt` and `shift` render the same on every platform.                          |
| `ariaKeyShortcuts(shortcut: string): string`                                  | Renders a shortcut for the `aria-keyshortcuts` attribute, where each token must be a valid `KeyboardEvent.key` name (`mod` → `Meta`/`Control`).                                                  |
| `closestShortcutScope(element: Element \| null): JigKeyboardShortcut \| null` | The nearest `[jigKeyboardShortcut]` scope at or above `element`, found by walking up the DOM. This is how `JigActionButton` finds its scope, and how you'd wire up a custom registering control. |

The platform check behind `mod` lives with the other platform helpers:
`isMacPlatform()` from `@awdlab/jig/api/ng` returns whether the current
platform is macOS, and `false` in non-browser environments.

| Type                 | Description                                                                                                                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ParsedShortcut`     | The shape `parseShortcut` returns: `{ ctrl, meta, alt, shift }` booleans plus a resolved `key`.                                                                                                |
| `JigShortcutBinding` | `{ shortcut, callback, disabled?, global? }` — the shape passed to `[jigKeyboardShortcut]` and to `JigKeyboardShortcut.register()`. `global` drops the focus requirement for that one binding. |
