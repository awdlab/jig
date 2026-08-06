# Changelog

## @ngneers/controls 0.0.1-next.3 (2026-08-06)

- Nova theme redesign + various fixes
- New `@ngneers/controls/kbd` entry point: `ngn-kbd` displays a keyboard shortcut, `[ngnKeyboardShortcut]` runs shortcut callbacks scoped to focus within an element (a binding marked `global` fires page-wide instead), and the exported helpers `parseShortcut`, `matchesShortcut`, `formatShortcut`, `ariaKeyShortcuts` and `closestShortcutScope` are the Angular-free building blocks underneath. `mod` renders ⌘ on macOS and ⌃ elsewhere, matching the key it resolves to. `@ngneers/controls/api/ng` gains the `isMacPlatform()` helper the `mod` resolution is built on.

New `@ngneers/controls/command` entry point: `ngn-command` is a command palette — a modal dialog wrapping a search field and a list box, with grouped items, per-command shortcuts, `route` navigation, and templates for items, groups and the empty state. Ships `command_*` translations (en, de) and theme parts for base, nova, material and shade.

`NgnActionButtonConfig` gains `shortcut`: the button registers it with the nearest ancestor `[ngnKeyboardShortcut]` scope, renders the glyphs inline as a hidden keycap, and sets `aria-keyshortcuts`. `NgnActionItem` gains `shortcut` for the same purpose in item-driven hosts. `ngn-dialog` is itself a scope, so footer buttons need no extra wiring.

`ngn-dialog` gains `closeButton` (default `true`) and `label`. With `closeButton` set to `false` and neither a title nor a header template the header is dropped entirely, and the footer is likewise dropped when nothing fills it. `aria-labelledby` is only emitted when a header actually renders; `label` supplies `aria-label` for a dialog with no visible title.

`ngn-list-box` gains `separator`, drawing a divider above every group but the first, and grows its keyboard support: `Home` / `End` highlight the first / last enabled option, `PageDown` / `PageUp` move by a visible page's worth of rows and stop at the ends. Its root is now a column flex box, so the scroller resolves a height inside a flex parent.

Nova and shade gain a `backdrop` theme part (`backdrop.scrim`, `backdrop.blur.*`); their modal dialog and drawer backdrops now blur what sits behind them.

Breaking: `NgnActionButtonConfig.action` widens to `(event?: PointerEvent) => void`, because a shortcut-invoked action has no pointer event to pass. TypeScript still accepts a callback that declares the parameter as required (`(event: PointerEvent) => void`), so this does **not** surface as a compile error — audit your `action` callbacks by hand and change any unconditional `event.foo` access to `event?.foo`, or the call throws the first time the action runs from a keyboard shortcut.

## @ngneers/controls 0.0.1-next.2 (2026-07-27)

- Validity State fixes
- Various issues & fixes

## @ngneers/controls 0.0.1-next.1 (2026-07-20)

- Add the `ngn-otp` one-time-password control — a row of single-character cells with keyboard navigation, paste distribution, `mask`/`integerOnly`/`length` options and a `(completed)` output. Includes base/nova/shade theme parts and a Playwright `NgnOtpHarness`.

## @ngneers/controls 0.0.1-next.0 (2026-07-16)

- fixed stuff
- Release readiness set up
