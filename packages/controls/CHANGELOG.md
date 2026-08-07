# Changelog

## @ngneers/controls 0.0.1-next.6 (2026-08-07)

- `kind` and `color` resolve to the active theme's literal unions again, and importing a theme is all it takes to get there. Two separate defects kept the custom-type mechanic from ever working.

`CustomKind` and `CustomColor` collapsed to `unknown` whenever no augmentation was loaded. `never extends readonly (infer A)[]` matches with no inference candidate, so `A` widened to `unknown`, and the `extends never` guard written to catch that could never fire — a bare `X extends never` does not match `never`. Every `kind`/`color` binding was therefore checked against `unknown`, so `kind="nonsense"` passed anywhere. Both types now guard with `[X] extends [never]` and fall back to `string`.

The theme augmentations were also unreachable. `<theme>/theme-types.d.ts` shipped in the package but nothing pulled it into a consumer's program: no reference from the theme barrel, no `exports` entry to import or reference it by, and it lives under `node_modules`, so app `include` globs miss it. Each theme now ships a `typed.d.ts` barrel that references it, and `@ngneers/controls-themes/<theme>` resolves its types there.

Apps that pull in more than one theme have to opt out for the extra ones via the new `@ngneers/controls-themes/<theme>/untyped` entry point — two augmentations of `NgnThemeTypes` clash, and the first one loaded silently wins. Both entry points resolve to the same runtime module; only the types differ.

Bindings that leaned on the old `unknown` may now fail to compile. `[kind]="null"` is the common one: the input accepts `undefined`, not `null`.

## @ngneers/controls 0.0.1-next.5 (2026-08-07)

- The axe helper now scans the `wcag22aa` rule set with `color-contrast` enabled, and the four controls that carried `test.fixme` a11y checks pass it. Only `region` stays globally disabled (a test-wrapper artifact).

Target size (2.5.8): inline icon buttons were sized at `1lh` — 15x16px inside `ngn-edit-inplace` — and now hold a 24x24px minimum in the base theme, covering the tree toggle, the input-field clear button and the table row actions in one place. The chip remove button grows from 22px to the same 24px minimum.

Contrast (1.4.3): every muted `color:` in nova moves one shade darker (400 → 500, 500 → 600, 600 → 700), lifting the table head, upload size and color-picker channel labels from 3.85:1/4.06:1 to 5.47:1 or better. Backgrounds and borders are untouched. Mask-input placeholder segments and calendar other-month days stay below 4.5:1 by decision, with a scoped opt-out recording the measured ratio.

Virtualized `role="listbox"` / `role="tree"` hosts now own the scroll port, so the role host is both the scrollable region and the direct parent of its options. `ngn-scroller` emits a `tabindex` only when `focusable`, because even `-1` makes it focusable to axe. `NgnListBox.pageSize()` measured the scroller's `clientHeight`, which is now `auto`, so `PageDown` jumped to the end — it measures the host instead. Stuck group headers paint over the scroll port's padding band, keeping the gap to the container border. `NgnScrollerHarness.scrollToIndex` scrolled the wrong element and silently did nothing.

`NgnBadge`, `NgnScrollShadow` and `NgnKeyboardShortcut` were missing the `@category` tag the API-docs generator keys off, so their documented API tables rendered empty and the MCP knowledge pack skipped them entirely. All three are now generated (65 controls in the pack, up from 62).

`@ngneers/controls-mcp` migration maps catch up with the controls added since they were written: `p-rating`, `p-colorPicker` and `mat-stepper` no longer claim "no direct equivalent" (they map to `ngn-rating`, `ngn-color-picker` and `ngn-stepper`/`ngn-step`), badges map to the `[ngnBadge]` directive instead of `ngn-tag`, and `p-inputOtp`, `p-stepper`, `p-scroller`, `ejs-rating`, `ejs-stepper`, `ejs-colorpicker`, `ejs-otpinput`, `ejs-inplaceeditor` and `ejs-keyboard` are new entries. The table recipe documents `dataSource` lazy loading and the form recipe documents `[ngnErrors]` with signal forms.

Docs corrections: the material theme was missing wherever the library's presets were counted (introduction, theming overview, dark mode, READMEs, the themes package description). The default `color` is the theme's first entry — `primary` for nova, not `surface`. `ngn-message` has no `filled` kind. The icon registry covers 45 slots, not ~42. The control anatomy and theme-internals guides described a nova-only theme layer, and the installation guide omitted the `@angular/compiler` peer.

## @ngneers/controls 0.0.1-next.4 (2026-08-07)

- A control that renders already open no longer hides its own content from the browser. Every control starts out with `ngn-control-initializing` (`display: none`) to avoid a flash of unstyled content, and dropped that class in the same after-render phase that `ngn-dialog` uses to call `showModal()` — so a dialog created with `open` set to `true` ran its native focusing steps while the controls inside it were still hidden. Anything carrying `autofocus` was skipped as unfocusable and focus fell through to the header close button. The class now lifts in the earlier `write` phase, ahead of any `mixedReadWrite` hook.

`[ngnMovable]` and `[ngnResizable]` now end an interaction on `pointercancel`, not just `pointerup`. Touch scrolling takes the pointer away and only fires `pointercancel`, which left both directives believing a drag or resize was still running — on the command palette that baked the dialog's position and size in place the next time the filter changed its height. `[ngnResizable]` also stops observing size and ignores pointer presses while its binding is falsy.

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
