# Changelog

## @awdlab/jig-mcp 0.0.5 (2026-10-26)

- **The table hands sorting, filter UX and row-action anchoring back to the app.**

- `jig-table` gains `sortLocally`: set it to `false` and the header still drives `[(sort)]`, but rows render in the order given — the sort counterpart to `filterLocally`.
- `jigTableFilterableColumn` gains `…AutoApply` (apply / cancel buttons when `false`) and `…AllowMultiple` (a single condition when `false`); both default to `true` as before.
- List filters take `{ label, value }` items besides plain strings, in `jig-filter-field`'s `listOptions` and the table's `…Items`; the label shows, the value matches.
- `JigActionItem.callback` receives the triggering event, from row-action buttons and menu items alike, so an action can anchor a popover to `event.currentTarget`.
- `JigTableModule` now includes `JigTableSortableColumn` and `JigTableFilterableColumn`.
- MCP: `get_control` names each control's real entry point (e.g. `@awdlab/jig/table`) instead of the empty `@awdlab/jig` root, and the PrimeNG migration maps `p-table`, `pSortableColumn`, `p-columnFilter`, `pFrozenColumn` and `p-contextMenu` input by input.

## @awdlab/jig-mcp 0.0.4 (2026-10-26)

- **Labels now name and focus every control, not just native inputs.**

- New `jigFor` directive (`@awdlab/jig/directives`): `<label [jigFor]="slider">` takes a control (or an element id), puts the label first in the control's `aria-labelledby` — so the visible label wins over the control's own `label` — and focuses the control, or a group's active item, on click.
- `jig-input-field` labels through `jigFor`, so its label now names a projected select, calendar, tag-input or mask-input too, and its `labelledBy` reaches any projected control. The control keeps its own id.
- Every control renders its `inputId` on the element that carries its name; controls that do so on their host (slider, rating, otp, radio-group, list-box, tree, number-input) take the host's own `id` attribute. `jigInput` gains `inputId`, from its `id` or generated.
- Fixes: checkbox and switch `labelledBy` threw; `jig-button-group` exposes `role="group"` on its host and keeps its tab stop on the focused button; select-button keeps it on the selected option (arrow keys work again with a value); the select combobox is its tab stop; the editable select's input is a named `role="combobox"`; calendar is a single tab stop; inline calendar and inline color-picker are labelled groups; color-picker's fallback trigger name is translatable (`colorPicker.trigger`).
- `jig-input-field` gains `labelFor` for projected content that isn't a jig control; filter-field and filter-builder use it, so their input-mode summary is a focusable button (Enter/Space opens) named by the field label plus the summary.
- Breaking: `jig-input-field` drops its `inputId` input — set the id on the control instead (`<input jigInput id="x">`, `<jig-select inputId="x">`); the field label follows it.
- Breaking: calendar no longer falls back to a fixed "Date" label (translation key `calendar.input` removed) — name it like any other control.
- `JigSelectHarness` gains a `combobox` locator.

Release times are Central European Time (CET/CEST), the project's local time zone.

## @awdlab/jig-mcp 0.0.3 (2026-10-21 19:25 CEST)

### Changed

- Guidance update: `invalid` is set automatically by every form binding — signal, reactive and template-driven — and only needs binding for validity from outside Angular forms.

## @awdlab/jig-mcp 0.0.2 (2026-10-21 07:45 CEST)

### Changed

- Picks up `@modelcontextprotocol/sdk` `^1.32.1` and `zod` `^4.6.7`. No source changes.

## @awdlab/jig-mcp 0.0.1 (2026-08-27 12:02 CEST)

First stable release.

### Fixed

- The stdio JSON-RPC channel no longer breaks on startup. `init.js` was imported eagerly and pulls in `awesome-logging`, which writes escape sequences to stdout and hijacks stdin on import; it is now loaded lazily, only for the `init` command.

### Added

- The knowledge pack covers every public directive, including the table's structure directives.

## @awdlab/jig-mcp 0.0.1-next.1 (2026-08-07 22:32 CEST)

### Added

- Migration maps cover the newer controls: `p-rating`, `p-colorPicker` and `mat-stepper` map to `jig-rating`, `jig-color-picker` and `jig-stepper`/`jig-step`; `p-inputOtp`, `p-stepper`, `p-scroller`, `ejs-rating`, `ejs-stepper`, `ejs-colorpicker`, `ejs-otpinput`, `ejs-inplaceeditor` and `ejs-keyboard` are new entries.

### Changed

- Badges map to the `[jigBadge]` directive instead of `jig-tag`.
- The table recipe documents `dataSource` lazy loading; the form recipe documents `[jigErrors]` with signal forms.
- 65 controls in the pack, up from 62.

## @awdlab/jig-mcp 0.0.1-next.0 (2026-07-17 01:31 CEST)

- First prerelease: release readiness set up.
