# Changelog

## @awdlab/jig 0.0.9 (2026-10-23)

- **Reduced motion no longer starts transitions on properties that never had one.** The `respectReducedMotion` stylesheet collapsed `transition-duration` to `0.01ms`, but `transition-property` defaults to `all`, so every animatable property inside a control gained a transition — font sizes, paddings and colors included. A `getComputedStyle` read taken right after a state or theme change then returned the outgoing value, and overlays spent an extra frame in their closing phase while the phantom transitions settled. The duration is now a flat `0s`, matching what `disableAnimations` has always done. `animation-duration` is unchanged at `0.01ms`, so keyframe animations still run and `animationend` still fires — the `-leave` animations that `JigBase` and the overlay lifecycle wait on are untouched.
- **The table column filter trigger is translated and can be named per column.** `jigTableFilterableColumn` hardcoded the English string `Filter` as the accessible name of its icon button, so every locale announced it in English and apps had no way to replace it. The label now comes from the new `table.filter` translation key (`Filter` / `Filtern`) and follows language switches, and the new `jigTableFilterableColumnLabel` input overrides it per column for names like `Filter by name`.
- **Filters take a per-column operator list and a default operator.** `jig-filter` gains `operators`, which narrows and orders the operators offered for the current `dataType` (unsupported ids are ignored), and `defaultOperator`, the operator a new condition starts with. `jigTableFilterableColumn` passes both through as `jigTableFilterableColumnOperators` and `jigTableFilterableColumnDefaultOperator`, so a column no longer has to take the full operator set its data type implies.
- **`jig-table` takes a `sortClearable` input, so sorting can be two-state.** Clicking a sortable header always cycled ascending → descending → unsorted, and nothing let an app drop that third step — a table whose rows must always be in a defined order had no way to express it. Set `sortClearable` to `false` and the header toggles between ascending and descending only. It defaults to `true`, so the existing three-state cycle is unchanged.
- **Row action buttons carry `data-testid` like every other control.** The action button template — the one behind both the inline row action bar and the row context menu — rendered the `testId` of an action as `data-test-id`, so Playwright's `getByTestId` never matched a row action while it matched every other control. The attribute is now `data-testid`; `JigTableHarness.rowAction()` looks for the new spelling.
- **Default icon imports carry their `.js` extension, so jig resolves under plain Node ESM.** `withDefaultIcons()` imported `@iconify/icons-tabler/alert-circle` and its 22 siblings without an extension. That package has no `exports` map, so bundlers filled the extension in themselves while Node ESM applied legacy subpath resolution and threw `ERR_MODULE_NOT_FOUND` — consumers running Vitest hit it the moment jig was left unbundled, and had to add it to `server.deps.inline` to get a suite running. Every specifier now ends in `.js`, which bundlers and Node both resolve. The docs demos and the icons guide were updated alongside, so copied snippets carry the extension too.
- **jig no longer relabels `<html lang>`.** `I18n` started at a hardcoded `en` and wrote the active tag back to `document.documentElement.lang`, so a `<html lang="de">` app was silently relabelled `en` the moment a control was rendered — and the write-back could only be turned off by subclassing the service, because the underlying flag is `protected readonly`. The initial language is now read from `<html lang>`, falling back to `en` when the document declares none, so startup never changes the attribute. Keeping it in sync with later `setLanguage()` calls stays on — screen readers rely on it for pronunciation — and is now a plain config option: `syncDocumentLang: false` turns it off for apps that own the attribute themselves. `language` sets the initial tag outright, with `null` for the browser's preference.
- **`jig-table` takes `[filterLocally]="false"`, so a server-filtered table keeps its column filter UI.** `jigTableFilterableColumn` wrote the chosen config into `[(filters)]` and the table then always ran `filterRows()` over `rows` — correct for in-memory data, wrong once the server had already filtered, and there was no way to opt out short of switching to `dataSource` (which also takes over paging and sorting, and refuses `groupBy`) or rebuilding the header filters by hand. With `filterLocally` off the header controls still drive `[(filters)]`, the table renders `rows` as given, and client-side sorting, paging and grouping keep working over whatever you fetch. Lazy mode is unaffected — a `dataSource` still delegates filtering to the loader. The per-column filter popover no longer filters its own copy of the data either, since the table owns that step.
- **`jig-filter` offers a `notContains` operator for string filters.** The string operator set was missing the negated counterpart of `contains`, which every comparable grid ships. `notContains` is now part of `JigFilterOperatorId`, is evaluated by `executeFilter` for the `string` and `list` data types, and appears in the operator dropdown as "Does not contain" / "Enthält nicht". Values that are empty pass the condition, matching the behaviour of the other negated operators.
- **Table header cells keep custom content out of the sort button.** `jigTableTh` used to rebuild the header cell after render — every child was moved into the `cell-text` span, which a sortable column then turned into a `role="button"`, and only the first element carrying the `filter-control` class was pulled back out. Anything else a consumer put in the header, a column menu button included, ended up nested inside the sort button, and Angular-managed nodes were relocated behind its back. The cell is now a component that projects its content: the label goes into `cell-text`, while `button`, `a` and anything marked `jigTableThAction` render next to it. Sorting and column reordering no longer fire for clicks that start on an interactive header child, so those controls keep their own clicks. The resize handle is part of the template now and is simply not rendered on columns that have none, instead of being hidden with `display: none`.
- **The table persists its state across reloads.** `jig-table` gains a `storage` input with the same shape the tree already uses — `{ key, kind?, states? }`, backed by `JigStorage` and defaulting to `localstorage`. Everything the user can change is restored on the next mount: `sort`, `filters`, `columnOrder`, `columnSizes`, `selection`, `expandedGroups` and `page` (index + size). `states` narrows that to a subset. Column widths are keyed by column id and applied as header cells register, so they survive a reorder; widths are written once a resize drag ends rather than on every frame. The paginator's page index and size are now two-way bound inside the table so they can be restored.
- **A chip's remove button can now be named per chip.** Its `aria-label` came from the global `chip_close` translation, so every chip in a group announced the same "Remove" and a screen reader user could not tell which one a button belonged to. The new `labelClose` input overrides that name per chip — `[labelClose]="'Remove filter ' + filter.name"` — and falls back to the translation when unset, so existing chips are unchanged.
- **`jig-table` has a loading state without a data source.** Skeleton rows, the `loading` theme class and `aria-busy` were reachable only through the lazy load status, which only `dataSource` ever sets — a client-side table fetching its own rows had no loading state at all, so every consumer wrapped the table in its own spinner overlay. The new `loading` input drives the same path: while it is set the body is replaced by skeleton rows (or an `<ng-template #loading>`), the grid reports `aria-busy`, and the theme gets its `loading` class. Lazy mode is unchanged — with `dataSource` the table still tracks this itself, and infinite scroll keeps the rows it already loaded while skeletons trail them.
- **Date filters no longer shift by a day west of UTC.** `JigFilterField` writes a date-only value as `YYYY-MM-DD`, but every place that read it back used `new Date('YYYY-MM-DD')`, which the language parses as UTC midnight. In any zone behind UTC that landed on the previous local day: a reopened filter showed the day before, and `executeFilter` matched the wrong day without any visible sign. A shared `parseFilterRawDate()` now reads a bare `YYYY-MM-DD` as local midnight and backs all three readers — the calendar round-trip in the control, `parseFilterRawValue()` and the internal `asDateMs()`. `dateTime` values carry a time (`…T08:30`) and were already parsed as local time, so they are unchanged. The `date` data type now also compares whole local days rather than exact timestamps, so `isEqual` matches any time on the selected day and the range operators include it; `dateTime` still compares the exact instant.
- **`provideJigControls()` and `provideJigConfig()` now return `EnvironmentProviders`, so using them in a component's `providers` is a compile error instead of a runtime NG0207.** Both wrapped a `provideAppInitializer(...)` but were typed as plain `Provider` / `(Provider | EnvironmentProviders)[]`, which let them type-check anywhere providers are accepted — the failure only surfaced when Angular hit the environment-only initializer at runtime. They are now built with `makeEnvironmentProviders()` and belong in `ApplicationConfig.providers`, `bootstrapApplication`, a route's `providers`, or `TestBed.configureTestingModule({ providers })`. Spreading the result (`...provideJigControls()`) no longer type-checks; pass it as a single entry.

Release times are Central European Time (CET/CEST), the project's local time zone.

## @awdlab/jig 0.0.8 (2026-10-22 00:55 CEST)

### Breaking

- `ValueControlBase.invalidState` and `JigInput.invalidState` are public; they were protected.
- `jig-input-field` no longer infers invalid state from a plain `<input>`. Bind `[invalid]` for controls that are not jig controls.

### Fixed

- `styleScope` actually scopes the generated CSS. `applyTheme()` passed a `scope` key while the generators read `styleScope`, so every rule fell back to `:root`.
- A scoped theme matches dark mode on an ancestor (`:root.dark &`), and a top-level `@media` block is emitted inside the scope selector.
- SSR and the client no longer hand out the same auto-generated element id — the counter crosses the boundary via `TransferState`.
- Injected `<style>` elements carry Angular's `CSP_NONCE`, and style text is written with `textContent` instead of `innerHTML`.
- `jig-input-field` reads invalid state from the projected control instead of guessing it with `:has(.ng-invalid.ng-touched)` selectors.

### Added

- [Security guide](https://jig.awdlab.dev/guides/security): CSP, Trusted Types, icon trust, passthrough attributes, persisted state.

## @awdlab/jig 0.0.7 (2026-10-21 19:25 CEST)

### Fixed

- Validator directives on jig controls work again under `ngModel`, `[formControl]` and `formControlName` ([angular/angular#69756](https://github.com/angular/angular/issues/69756)). A static `required` next to `[formControl]` is still disabled by Angular — use `Validators.required`.
- `jigInput` reports `aria-invalid` under reactive and template-driven forms.
- An invalid `<form>` no longer paints every field inside it red; a field reflects only its own control.

## @awdlab/jig 0.0.6 (2026-10-21 07:45 CEST)

### Fixed

- A pre-filled reactive or template-driven value no longer disappears from `jigInput`. The directive's element sync overwrote what `DefaultValueAccessor` had just written, so edit forms rendered blank.

### Changed

- Angular 22.1 → 22.2.3 across the catalog; `@ngneers/signal-translate` peer widened to `^22`. No migrations to run.

## @awdlab/jig 0.0.5 (2026-08-24 23:47 CEST)

### Fixed

- `@awdlab/jig-themes` and `@awdlab/jig-custom-types` are installable again — both shipped two manifests and neither resolved.
- Import specifiers are emitted correctly at the source (`module: nodenext` plus explicit `.js`), replacing the post-build rewrite script.
- `@awdlab/jig` packs from `dist/` with a single manifest.

No API surface changed.

## @awdlab/jig 0.0.4 (2026-08-17 23:36 CEST)

- Release tooling only (release-note restore). No library changes.

## @awdlab/jig 0.0.3 (2026-08-17 22:53 CEST)

- Release tooling only (changesets restored, GitHub releases enabled). No library changes.

## @awdlab/jig 0.0.2 (2026-08-17 22:07 CEST)

- Release pipeline fixes (resume mode). No library changes.

## @awdlab/jig 0.0.1 (2026-08-13 23:22 CEST)

First stable release.

### Breaking

- `JigPassthrough<'select'>` changed shape — the popover and list box moved behind the extracted dropdown:

  ```diff
  -const pt: JigPassthrough<'select'> = { 'popover-content': { … } };
  +const pt: JigPassthrough<'select'> = { dropdown: { content: { … } } };
  ```

  `JigSelectHarness` keeps `listBox` and `popoverContent` as forwarding getters, so e2e tests need no change.

### Added

- `jig-tag-input` — typed string tags with `delimiters`, suggestions, `maxTags` / `minTagLength` / `maxTagLength` / `allowDuplicates`, a `rejected` output and the `tagCount` / `tagLength` validators.
- `jig-dropdown-list` — the anchored popover around `jig-list-box`, extracted from `jig-select` and shared with tag-input.
- `jig-skeleton` — `rect` / `circle` placeholder sized through `--jig-skeleton-*`; `jig-table` loading rows now use it.
- `jig-meter` — stacked bar plus legend, with `total`, per-item colors and icons, `vertical` mode and a templateable legend row.
- `jig-toolbar` — groups controls into one roving-focus tab stop.
- Right-to-left support: set `dir` anywhere and layout, keyboard navigation and pointer maths mirror. New `isRtl()`, `inlineArrowStep()`, `notifyDirectionChanged()` and `onDirectionChange()` in `@awdlab/jig/api/ng`.
- `jig-slider` range mode — `range` makes the value a `[start, end]` tuple, `minRangeDistance` sets the smallest gap, and `valueCommit` fires once an interaction settles.
- `jig-input-field` can mark a required control's label with an asterisk (`showRequiredMarker`, or `defaults.inputField.showRequiredMarker`); value controls expose `requiredState`.
- Per-control validation messages: `<scope>.errors.<key>` wins over the shared `errors.<key>`.
- `rovingDisabled` on `jigRovingGroup`, `loading` on `jig-list-box`, and `disabled` / `readonly` / `invalid` theme classes on `jig-mask-input`.

### Fixed

- One shared open/close lifecycle for every overlay. Dialog keeps lazy content mounted until the exit animation ends, a cancelled animation no longer strands dialog or tooltip half-closed, and `closed` / `closing` cannot fire after the host is destroyed.
- Closed overlays are no longer top-layer elements, so password managers stop reading a page of jig controls as top-layer hijacking. Toast and snackbar regions enter the top layer only while they hold items.
- Roving focus only claims elements that can take focus — a decorative `jig-icon` no longer adds a phantom tab stop, and a `jig-select` inside `jig-input-field` or `jig-toolbar` is reached by the arrow keys.
- `jig-hint` collapses through a `root-collapsed` theme class instead of an inline `display: none`, keeping field layout stable.
- Angular peers publish as `^22.0.5` instead of the exact catalog pin, so consumers on a later Angular patch no longer hit a peer conflict.
- `customTranslations` languages are selectable — they were registered but never added to `availableLanguages`.
- Translation loading is tracked with `PendingTasks`, so SSR waits for the locale instead of serializing raw key paths.
- Every public directive carries `@category`, so it appears in the generated API tables and the MCP knowledge pack.

## @awdlab/jig 0.0.1-next.6 (2026-08-08 01:35 CEST)

### Breaking

- Bindings that leaned on the old `unknown` may stop compiling. `[kind]="null"` is the common one — the input accepts `undefined`, not `null`.

### Fixed

- `kind` and `color` resolve to the active theme's literal unions again. `CustomKind` / `CustomColor` collapsed to `unknown` without an augmentation, and the augmentations themselves were unreachable; each theme now ships a `typed.d.ts` barrel that references them.

### Added

- `@awdlab/jig-themes/<theme>/untyped` for apps that load more than one theme — two `JigThemeTypes` augmentations clash, so the extra themes opt out.

## @awdlab/jig 0.0.1-next.5 (2026-08-07 22:32 CEST)

### Fixed

- WCAG 2.2 AA: inline icon buttons hold a 24×24px minimum target size, and every muted `color:` in nova moves one shade darker (3.85:1 → 5.47:1 or better).
- Virtualized `role="listbox"` / `role="tree"` hosts own their scroll port. `JigListBox.pageSize()` measures the host, so `PageDown` no longer jumps to the end, and stuck group headers keep the gap to the container border.
- `jig-scroller` emits a `tabindex` only when `focusable`.
- `JigBadge`, `JigScrollShadow` and `JigKeyboardShortcut` were missing `@category`, so their API tables rendered empty (65 controls in the MCP pack, up from 62).

### Changed

- The axe helper scans `wcag22aa` with `color-contrast` enabled; only `region` stays disabled.
- `@awdlab/jig-mcp` migration maps cover the newer controls (rating, color-picker, stepper, OTP, scroller, inplace-editor, keyboard).

## @awdlab/jig 0.0.1-next.4 (2026-08-07 16:03 CEST)

### Fixed

- A control that renders already open no longer hides its own content. `jig-control-initializing` now lifts in the `write` phase, so `autofocus` inside a dialog opened with `open="true"` is honoured.
- `[jigMovable]` and `[jigResizable]` end an interaction on `pointercancel`, not just `pointerup`, so touch scrolling no longer leaves a drag running.
- `[jigResizable]` stops observing size and ignores pointer presses while its binding is falsy.

## @awdlab/jig 0.0.1-next.3 (2026-08-07 01:43 CEST)

### Breaking

- `JigActionButtonConfig.action` widens to `(event?: PointerEvent) => void`. This is **not** a compile error — audit your callbacks and change unconditional `event.foo` access to `event?.foo`, or the call throws when the action runs from a shortcut.

### Added

- `@awdlab/jig/kbd`: `jig-kbd`, `[jigKeyboardShortcut]` and the Angular-free helpers `parseShortcut`, `matchesShortcut`, `formatShortcut`, `ariaKeyShortcuts`, `closestShortcutScope`. `mod` renders ⌘ on macOS, ⌃ elsewhere.
- `@awdlab/jig/command`: `jig-command`, a command palette with grouped items, per-command shortcuts, `route` navigation and templates for items, groups and the empty state (en/de translations, all four themes).
- `shortcut` on `JigActionButtonConfig` and `JigActionItem`; `jig-dialog` is itself a shortcut scope.
- `jig-dialog` gains `closeButton` (default `true`) and `label`; the header and footer are dropped when nothing fills them.
- `jig-list-box` gains `separator`, plus `Home` / `End` / `PageDown` / `PageUp`.
- `backdrop` theme part in nova and shade — modal dialog and drawer backdrops blur what sits behind them.

### Changed

- Nova theme redesign.

## @awdlab/jig 0.0.1-next.2 (2026-07-28 00:45 CEST)

### Fixed

- Validity state fixes and assorted smaller issues.

## @awdlab/jig 0.0.1-next.1 (2026-07-20 21:47 CEST)

### Added

- `jig-otp` — single-character cells with keyboard navigation, paste distribution, `mask` / `integerOnly` / `length` and a `(completed)` output. Base/nova/shade theme parts and `JigOtpHarness` included.

## @awdlab/jig 0.0.1-next.0 (2026-07-17 01:31 CEST)

- First prerelease: release readiness set up.
