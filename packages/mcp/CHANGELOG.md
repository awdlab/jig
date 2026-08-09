# Changelog

## @awdlab/jig-mcp 0.0.2 (2026-08-08)

- Readme adjustments

## @awdlab/jig-mcp 0.0.1 (2026-08-08)

- Document the directive API and fix two i18n gaps.

- Every public directive and the remaining table structure directives now carry
  `@category`, so they appear in the generated API tables and in the MCP
  knowledge pack: `ngnAutofocus`, `ngnMovable`, `ngnResizable`, `ngnScrollAmount`,
  `ngnDrag`, `ngnDragScroll`, `ngnRovingGroup`/`ngnRovingItem`, `ngnContextMenu`,
  `awd-action-button`, `ngnScrollerItem`, and the table's `th`/`td`/`tr`,
  sticky-column and row-actions directives.
- `customTranslations` languages are now selectable. They were registered but
  never added to `availableLanguages`, so `setLanguage('fr')` silently fell back
  to English.
- Translation loading is tracked with `PendingTasks`, so server-side rendering
  waits for the locale instead of serializing raw key paths that were then
  swapped out on hydration.

## @awdlab/jig-mcp 0.0.1-next.1 (2026-08-07)

- The axe helper now scans the `wcag22aa` rule set with `color-contrast` enabled, and the four controls that carried `test.fixme` a11y checks pass it. Only `region` stays globally disabled (a test-wrapper artifact).

Target size (2.5.8): inline icon buttons were sized at `1lh` — 15x16px inside `awd-edit-inplace` — and now hold a 24x24px minimum in the base theme, covering the tree toggle, the input-field clear button and the table row actions in one place. The chip remove button grows from 22px to the same 24px minimum.

Contrast (1.4.3): every muted `color:` in nova moves one shade darker (400 → 500, 500 → 600, 600 → 700), lifting the table head, upload size and color-picker channel labels from 3.85:1/4.06:1 to 5.47:1 or better. Backgrounds and borders are untouched. Mask-input placeholder segments and calendar other-month days stay below 4.5:1 by decision, with a scoped opt-out recording the measured ratio.

Virtualized `role="listbox"` / `role="tree"` hosts now own the scroll port, so the role host is both the scrollable region and the direct parent of its options. `awd-scroller` emits a `tabindex` only when `focusable`, because even `-1` makes it focusable to axe. `NgnListBox.pageSize()` measured the scroller's `clientHeight`, which is now `auto`, so `PageDown` jumped to the end — it measures the host instead. Stuck group headers paint over the scroll port's padding band, keeping the gap to the container border. `NgnScrollerHarness.scrollToIndex` scrolled the wrong element and silently did nothing.

`NgnBadge`, `NgnScrollShadow` and `NgnKeyboardShortcut` were missing the `@category` tag the API-docs generator keys off, so their documented API tables rendered empty and the MCP knowledge pack skipped them entirely. All three are now generated (65 controls in the pack, up from 62).

`@awdlab/jig-mcp` migration maps catch up with the controls added since they were written: `p-rating`, `p-colorPicker` and `mat-stepper` no longer claim "no direct equivalent" (they map to `awd-rating`, `awd-color-picker` and `awd-stepper`/`awd-step`), badges map to the `[ngnBadge]` directive instead of `awd-tag`, and `p-inputOtp`, `p-stepper`, `p-scroller`, `ejs-rating`, `ejs-stepper`, `ejs-colorpicker`, `ejs-otpinput`, `ejs-inplaceeditor` and `ejs-keyboard` are new entries. The table recipe documents `dataSource` lazy loading and the form recipe documents `[ngnErrors]` with signal forms.

Docs corrections: the material theme was missing wherever the library's presets were counted (introduction, theming overview, dark mode, READMEs, the themes package description). The default `color` is the theme's first entry — `primary` for nova, not `surface`. `awd-message` has no `filled` kind. The icon registry covers 45 slots, not ~42. The control anatomy and theme-internals guides described a nova-only theme layer, and the installation guide omitted the `@angular/compiler` peer.

## @awdlab/jig-mcp 0.0.1-next.0 (2026-07-16)

- Release readiness set up
