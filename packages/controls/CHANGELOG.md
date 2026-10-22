# Changelog

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
