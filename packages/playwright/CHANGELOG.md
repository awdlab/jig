# Changelog

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
