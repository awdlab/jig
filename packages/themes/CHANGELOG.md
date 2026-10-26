# Changelog

## @awdlab/jig-themes 0.0.9 (2026-10-26)

- **`jig-calendar` takes `min` and `max` date bounds.** Days outside the range render disabled with `aria-disabled` and ignore clicks and Enter/Space, while every month stays navigable so out-of-range days can still carry context; a typed date outside the range is clamped to the nearest bound instead of being committed. Bounds compare by calendar day, so their time of day does not matter. Both inputs accept `undefined`, so a signal forms `min()`/`max()` rule binds straight onto the calendar. Themes style the new `day-disabled` class, custom day templates receive a `disabled` flag, and `JigCalendarHarness` gains a `dayDisabled` locator.
- **Labels now name and focus every control, not just native inputs.**

- New `jigFor` directive (`@awdlab/jig/directives`): `<label [jigFor]="slider">` takes a control (or an element id), puts the label first in the control's `aria-labelledby` — so the visible label wins over the control's own `label` — and focuses the control, or a group's active item, on click.
- `jig-input-field` labels through `jigFor`, so its label now names a projected select, calendar, tag-input or mask-input too, and its `labelledBy` reaches any projected control. The control keeps its own id.
- Every control renders its `inputId` on the element that carries its name; controls that do so on their host (slider, rating, otp, radio-group, list-box, tree, number-input) take the host's own `id` attribute. `jigInput` gains `inputId`, from its `id` or generated.
- Fixes: checkbox and switch `labelledBy` threw; `jig-button-group` exposes `role="group"` on its host and keeps its tab stop on the focused button; select-button keeps it on the selected option (arrow keys work again with a value); the select combobox is its tab stop; the editable select's input is a named `role="combobox"`; calendar is a single tab stop; inline calendar and inline color-picker are labelled groups; color-picker's fallback trigger name is translatable (`colorPicker.trigger`).
- `jig-input-field` gains `labelFor` for projected content that isn't a jig control; filter-field and filter-builder use it, so their input-mode summary is a focusable button (Enter/Space opens) named by the field label plus the summary.
- Breaking: `jig-input-field` drops its `inputId` input — set the id on the control instead (`<input jigInput id="x">`, `<jig-select inputId="x">`); the field label follows it.
- Breaking: calendar no longer falls back to a fixed "Date" label (translation key `calendar.input` removed) — name it like any other control.
- `JigSelectHarness` gains a `combobox` locator.

## @awdlab/jig-themes 0.0.8 (2026-10-24)

- **A popover no longer flashes at the top-left of the viewport before it is positioned.** `JigPopover` entered the top layer and only then asked floating-ui for a position, and that first `computePosition` is asynchronous — on a cold open it also waits for the lazily imported `@floating-ui/dom` chunk. For those frames the UA's default placement applied, so the panel was painted, and hit-tested, at the viewport origin before jumping to its anchor. A pointer press aimed at it during the jump landed on the document instead and light-dismissed the popover, which made clicking an option in a freshly opened `jig-select` lose the click and close the list. The wrapper now carries a `wrapper-unpositioned` class until the first position is applied, keeping it laid out — floating-ui still measures it — but neither painted nor clickable. `jigAutofocus` follows the same rule: it now waits for a host that is actually rendered (`checkVisibility`) rather than merely laid out, so a menu still focuses its first item on open.
- **Three filter controls, named for what each one lets you configure.** `jig-filter` is now `jig-filter-field`: conditions over one field the host fixes, which is what a table column filter always was. `jig-filter-builder` is new in substance — each condition picks its own property, so a list of users can be filtered by "e-mail contains @gmail.com and role is Admin" — and `jig-filter-bar` composes the builder with a debounced search box, a trigger badged with the active condition count, and removable condition chips. The bar is display-agnostic: put a list box, a tree or your own markup beneath it. `jig-list-box` and `jig-tree` already take the same `items`, `filter` and `filterText` inputs, so one recipe covers both, and the bar's docs carry it.

The vocabulary is consistent across all three: a **property** is what a condition filters on, described by `JigFilterProperty` (`key`, `label`, `dataType`, optional `listOptions` and `selector`); a computed property uses `computedKey` and must supply a `selector`. Keys are checked against the item type via `Extract<AllKeysOfUnion<TData>, string>`, the shape `jig-table` already uses for column keys, so a typo is a compile error rather than a condition that silently matches nothing. `executePropertyFilter`, `readFilterPropertyValue` and `filterPropertyId` ship from `@awdlab/jig/api`, and `JigItemsData` exposes a `JigItem`'s payload type beside the existing `JigItemsValue`.

**Migration.** `jig-filter` → `jig-filter-field` (`JigFilter` → `JigFilterField`, entry point `@awdlab/jig/filter-field`, theme scope `filter-field`, `ThemeTemplate` key `filterField`). The config types (`JigFilterConfig`, `JigFilterConditionConfig`, `JigFilterDataType`, `JigFilterOperatorId`) keep their names, so `jig-table` column filters need only the import path updated. `jig-filter-list-box`, added earlier in this release line, is removed: compose `jig-filter-bar` with whatever you display instead, which avoids a filter-x variant per display type.

**Custom filter templates.** All three controls take a `templateFilter` (or an `<ng-template #filter>`), and `jigTableFilterableColumn` takes a matching `…Template` input, so a column's popover can be a slider, a rating, or a lookup against your own backend. The template replaces the condition rows only — the trigger, the summary and the footer stay, so `autoApply` keeps its Apply and Cancel. It writes an ordinary configuration back through the context's `setValue`, which is what keeps the rest working unchanged: the same matcher filters, the chips still render, the config still serializes for a server. The context carries the configuration as `$implicit`, the `data`, the `dataType` (or `properties` on the builder), `disabled` and `readonly`, and `setValue` / `apply` / `cancel` / `clear` / `close`. `jig-filter-bar` forwards its template to the builder it embeds.
- **Boolean inputs written as bare attributes now work, and a breadcrumb crumb you can click is now one you can reach.** Fifteen inputs — among them `jig-table`'s `virtual`, `striped` and `paginator`, `jig-slider`'s `vertical`, and `checkbox` on the four collection controls — carried no `booleanAttribute` transform, so `<jig-table virtual>` passed `""`, read as false, and the feature silently stayed off; the four tri-state ones keep "unset means derive from `multiple`" through a new `optionalBooleanAttribute`. Breadcrumb crumbs render by capability now — `<a>` with a route, `<button>` with only a callback, `<span>` otherwise — where a callback-only crumb was an anchor without an `href`, neither focusable nor announced as a link. The host gained `role="navigation"`, a name overridable through new `label`/`labelledBy` inputs, and `aria-current="page"` on the last crumb. Slider and rating answer PageUp/PageDown as the APG pattern asks, slider by a new `bigStep`, and neither leaks float drift like `0.30000000000000004` into `aria-valuenow` any more. In the theme engine, `deepSet` descended into the last path segment before assigning, duplicating a level in every theme's colour variable template, and `splitScopableCss` sliced to `i - 1` at index 0, copying a whole CSS block into the scopable half and emitting its leading at-rule twice. Both surfaced on the first run of the tests `@awdlab/jig-themes` had no script for.

**Breaking:** `focussable` is spelled `focusable` on `jig-list-box` and `jig-tree`; `selectable` defaults to `true` on `jig-list-box` as it already did elsewhere; `filterText` is a `model()` on list-box, dropdown-list, tree and select, so the text typed into a select's filter is finally readable. `jig-splitter` takes `storage: { key, kind?, states? }` like table and tree in place of `stateStorage`/`stateKey`/`stateData`, backed by `JigStorage` rather than the removed `registerState`/`loadState`/`saveState`, which threw on every load once a stored entry was truncated; the `registerStorage()` behind all three declares state as named slices and is exported for your own controls. `defaults.splitter.stateStorage` folds into one `defaults.stateStorage` taking a `JigStorageKind` name. `DialogHandle.buttonClicked` is an `OutputRef`, not an rxjs `Observable`, and `transformToJigItems` reports the value type it actually produces, which may surface errors `JigItem`'s `any` defaults were masking.
- **`jigTooltip` keeps an author-set accessible name, and nova placeholders meet AA contrast.**

- `jigTooltip` used to strip any `aria-label`, `aria-labelledby` or `aria-describedby` from its anchor, which left icon buttons with an `aria-label` and a tooltip unnamed. It now only removes the attribute it wrote itself, and stays out of the way when the author set one.
- nova: input and mask-input placeholders and mask separators use `surface.600` to meet WCAG AA contrast, matching the select placeholder.
- **An app can add kinds and colors of its own, and remove ones its theme ships, from a single declaration.** `customizeKinds` and `customizeColors` derive the lists from the active theme; the same object feeds the `JigCustomTypes` augmentation and the new `theme.kinds` / `theme.colors` / `theme.defaults` config fields, so the typed union and the runtime list that drives defaults and enumeration cannot drift apart. `remove` is typed against the theme's own values, controls the customization omits keep falling back to whichever theme is active, and a default the app removed is dropped with a warning instead of being emitted as a banned class. `ThemeKind<Control>` and `ThemeColor` expose a theme's values for apps that only want the types. `createTheme` now keeps its `COLORS` parameter in its return type, which `customizeColors` needs in order to read a theme's colors.
- **`jig-dropdown-list` stays inside its popover in shade and material, and its sticky group headers no longer scroll away.** Those two themes shipped no `dropdown-list` part at all, so the base rules that size the popover content and strip its padding never applied and the list grew to its full content height inside a popover capped by `maxHeight` — 1638px of items in a 260px box, with no scrollbar. The list-box scroller also used `flex: 1`, which pins its box to the viewport height while its content overflows; as the containing block of the sticky group headers, that unstuck every header once you scrolled past one viewport, in every theme. Group headers no longer mix shapes either: the radius reset used to ride along with the divider on `:not(:first-of-type)`, leaving the first group a rounded chip among square ones. nova now breaks sections with its rounded chip and a gap, shade and material with a square header and a divider, and nova's command palette — which renders the group as a flat label rather than a chip — draws that divider itself.

Release times are Central European Time (CET/CEST), the project's local time zone.

## @awdlab/jig-themes 0.0.7 (2026-10-22 00:55 CEST)

### Breaking

- `jig-input-field` theme parts style a single `invalid` class reported by the control, instead of matching `:has(.ng-invalid.ng-touched)` / `:has([aria-invalid='true'])`. Custom field parts that restated those selectors need updating.

### Fixed

- `styleScope` actually scopes the generated CSS — the generators read `styleScope` while `applyTheme()` passed `scope`, so every rule fell back to `:root` and two themes on one page overwrote each other.
- A scoped theme matches dark mode on an ancestor (`:root.dark &`); unscoped themes keep emitting `&.dark`.
- A top-level `@media` block is emitted with its rules inside the scope selector; `@keyframes` and other non-style at-rules stay global.
- Generated `<style>` elements carry Angular's `CSP_NONCE` (or the `nonce` option outside Angular), so a nonce-based `style-src` no longer drops them.
- Style content is written with `textContent`, keeping the library clear of Trusted Types sinks.

## @awdlab/jig-themes 0.0.6 (2026-10-21 19:25 CEST)

### Fixed

- An invalid form no longer marks every field inside it. The nova, shade and material `jig-input-field` parts matched any field nested under an `.ng-invalid.ng-touched` ancestor.

## @awdlab/jig-themes 0.0.5 (2026-08-24 23:47 CEST)

### Fixed

- The package is installable again — it shipped two manifests, and the root one pointed at an `./index.js` that lived a directory down with no `exports` at all.
- The 300-plus theme-part subpaths resolve through one `exports` pattern, so the 313 empty marker `package.json` files are gone and a new part can no longer be unresolvable because its marker was forgotten.
- Import specifiers are emitted correctly at the source (`module: nodenext` plus explicit `.js`); the post-build rewrite script, which never fixed the side-effect import in `typed.d.ts`, is deleted.

The `nova` / `shade` / `material` entry points keep their explicit mapping so `typed.d.ts` loads for the typed path and not for `/untyped`.

## @awdlab/jig-themes 0.0.4 (2026-08-17 23:36 CEST)

- Release tooling only. No theme changes.

## @awdlab/jig-themes 0.0.3 (2026-08-17 22:53 CEST)

- Release tooling only. No theme changes.

## @awdlab/jig-themes 0.0.2 (2026-08-17 22:07 CEST)

- Release pipeline fixes. No theme changes.

## @awdlab/jig-themes 0.0.1 (2026-08-13 23:22 CEST)

First stable release.

### Added

- Theme parts for the new controls: `tag-input`, `dropdown-list`, `skeleton`, `meter` and `toolbar`, across base, nova, shade and material.
- Right-to-left support. Padding, margins, borders and radii are written as logical properties; gradients, `background-position`, `transform-origin` and `translate()` offsets are mirrored per theme with `:dir(rtl)`.
- Skeleton animation is a themed concern: base renders flat, nova and material sweep a gradient, shade pulses opacity. A part that restates the `background` shorthand must restate `background-clip` with it.
- Meter items without a `color` cycle a per-theme palette — eight hues in nova and material, an interleaved primary ramp in shade, `currentColor` under base.
- `jig-input-field` draws the required marker in CSS, hidden from the accessibility tree.
- `jig-hint` collapses through a `root-collapsed` class instead of an inline `display: none`.
- Slider range mode fills between the two handles.

## @awdlab/jig-themes 0.0.1-next.5 (2026-08-08 01:35 CEST)

### Added

- `@awdlab/jig-themes/<theme>/untyped` — apps loading more than one theme opt out of the extra augmentations, since two `JigThemeTypes` augmentations clash and the first one loaded silently wins.

### Fixed

- Each theme ships a `typed.d.ts` barrel that references `theme-types.d.ts`, so `kind` and `color` finally resolve to the theme's literal unions. Nothing previously pulled the augmentation into a consumer's program.

## @awdlab/jig-themes 0.0.1-next.4 (2026-08-07 22:32 CEST)

### Fixed

- Contrast (WCAG 1.4.3): every muted `color:` in nova moves one shade darker (400 → 500, 500 → 600, 600 → 700), lifting table head, upload size and color-picker channel labels from 3.85:1/4.06:1 to 5.47:1 or better. Backgrounds and borders are untouched.
- Target size (WCAG 2.5.8): inline icon buttons hold a 24×24px minimum in the base theme — tree toggle, input-field clear, table row actions. The chip remove button grows from 22px to the same minimum.
- Stuck group headers paint over the scroll port's padding band, keeping the gap to the container border.

Mask-input placeholder segments and calendar other-month days stay below 4.5:1 by decision, with a scoped opt-out recording the measured ratio.

## @awdlab/jig-themes 0.0.1-next.3 (2026-08-07 01:43 CEST)

### Added

- `backdrop` theme part in nova and shade (`backdrop.scrim`, `backdrop.blur.*`) — modal dialog and drawer backdrops blur what sits behind them.
- Theme parts for `jig-kbd` and `jig-command` across base, nova, material and shade.

### Changed

- Nova theme redesign.

## @awdlab/jig-themes 0.0.1-next.2 (2026-07-28 00:45 CEST)

### Fixed

- Validity state styling and assorted smaller issues.

## @awdlab/jig-themes 0.0.1-next.1 (2026-07-20 21:47 CEST)

### Added

- Base, nova and shade theme parts for `jig-otp`.

## @awdlab/jig-themes 0.0.1-next.0 (2026-07-17 01:31 CEST)

- First prerelease: release readiness set up.
