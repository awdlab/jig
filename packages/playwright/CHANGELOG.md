# Changelog

## @awdlab/jig-playwright 0.0.7 (2026-10-24)

- **Three filter controls, named for what each one lets you configure.** `jig-filter` is now `jig-filter-field`: conditions over one field the host fixes, which is what a table column filter always was. `jig-filter-builder` is new in substance — each condition picks its own property, so a list of users can be filtered by "e-mail contains @gmail.com and role is Admin" — and `jig-filter-bar` composes the builder with a debounced search box, a trigger badged with the active condition count, and removable condition chips. The bar is display-agnostic: put a list box, a tree or your own markup beneath it. `jig-list-box` and `jig-tree` already take the same `items`, `filter` and `filterText` inputs, so one recipe covers both, and the bar's docs carry it.

The vocabulary is consistent across all three: a **property** is what a condition filters on, described by `JigFilterProperty` (`key`, `label`, `dataType`, optional `listOptions` and `selector`); a computed property uses `computedKey` and must supply a `selector`. Keys are checked against the item type via `Extract<AllKeysOfUnion<TData>, string>`, the shape `jig-table` already uses for column keys, so a typo is a compile error rather than a condition that silently matches nothing. `executePropertyFilter`, `readFilterPropertyValue` and `filterPropertyId` ship from `@awdlab/jig/api`, and `JigItemsData` exposes a `JigItem`'s payload type beside the existing `JigItemsValue`.

**Migration.** `jig-filter` → `jig-filter-field` (`JigFilter` → `JigFilterField`, entry point `@awdlab/jig/filter-field`, theme scope `filter-field`, `ThemeTemplate` key `filterField`). The config types (`JigFilterConfig`, `JigFilterConditionConfig`, `JigFilterDataType`, `JigFilterOperatorId`) keep their names, so `jig-table` column filters need only the import path updated. `jig-filter-list-box`, added earlier in this release line, is removed: compose `jig-filter-bar` with whatever you display instead, which avoids a filter-x variant per display type.

**Custom filter templates.** All three controls take a `templateFilter` (or an `<ng-template #filter>`), and `jigTableFilterableColumn` takes a matching `…Template` input, so a column's popover can be a slider, a rating, or a lookup against your own backend. The template replaces the condition rows only — the trigger, the summary and the footer stay, so `autoApply` keeps its Apply and Cancel. It writes an ordinary configuration back through the context's `setValue`, which is what keeps the rest working unchanged: the same matcher filters, the chips still render, the config still serializes for a server. The context carries the configuration as `$implicit`, the `data`, the `dataType` (or `properties` on the builder), `disabled` and `readonly`, and `setValue` / `apply` / `cancel` / `clear` / `close`. `jig-filter-bar` forwards its template to the builder it embeds.

## @awdlab/jig-playwright 0.0.6 (2026-10-23)

- **Row action buttons carry `data-testid` like every other control.** The action button template — the one behind both the inline row action bar and the row context menu — rendered the `testId` of an action as `data-test-id`, so Playwright's `getByTestId` never matched a row action while it matched every other control. The attribute is now `data-testid`; `JigTableHarness.rowAction()` looks for the new spelling.

Release times are Central European Time (CET/CEST), the project's local time zone.

## @awdlab/jig-playwright 0.0.5 (2026-10-21 07:45 CEST)

### Changed

- Peers on `@playwright/test` `^1.64.1`, and the Angular catalog moves to 22.2.3. No source changes.

## @awdlab/jig-playwright 0.0.4 (2026-08-17 23:36 CEST)

- Release tooling only. No harness changes.

## @awdlab/jig-playwright 0.0.3 (2026-08-17 22:53 CEST)

- Release tooling only. No harness changes.

## @awdlab/jig-playwright 0.0.2 (2026-08-17 22:07 CEST)

- Release pipeline fixes. No harness changes.

## @awdlab/jig-playwright 0.0.1 (2026-08-13 23:22 CEST)

First stable release.

### Added

- Harnesses for the new controls: `JigTagInputHarness`, `JigDropdownListHarness`, `JigSkeletonHarness`, `JigMeterHarness` and `JigToolbarHarness`.
- `JigSliderHarness` covers range mode (two handles, `valueCommit`).

### Changed

- `JigSelectHarness` keeps `listBox` and `popoverContent` as forwarding getters onto the extracted dropdown, so existing tests need no change.

## @awdlab/jig-playwright 0.0.1-next.2 (2026-08-07 22:32 CEST)

### Fixed

- `JigScrollerHarness.scrollToIndex` scrolled the wrong element and silently did nothing.

### Changed

- The axe helper scans the `wcag22aa` rule set with `color-contrast` enabled. Only `region` stays globally disabled (a test-wrapper artifact), and the four controls that carried `test.fixme` a11y checks now pass.

## @awdlab/jig-playwright 0.0.1-next.1 (2026-07-20 21:47 CEST)

### Added

- `JigOtpHarness` for the new `jig-otp` control.

## @awdlab/jig-playwright 0.0.1-next.0 (2026-07-17 01:31 CEST)

- First prerelease: release readiness set up.
