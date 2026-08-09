# Changelog

## @awdlab/jig-themes 0.0.1 (2026-08-08)

- Readme adjustments

## @awdlab/jig-themes 0.0.1-next.5 (2026-08-07)

- `kind` and `color` resolve to the active theme's literal unions again, and importing a theme is all it takes to get there. Two separate defects kept the custom-type mechanic from ever working.

`CustomKind` and `CustomColor` collapsed to `unknown` whenever no augmentation was loaded. `never extends readonly (infer A)[]` matches with no inference candidate, so `A` widened to `unknown`, and the `extends never` guard written to catch that could never fire — a bare `X extends never` does not match `never`. Every `kind`/`color` binding was therefore checked against `unknown`, so `kind="nonsense"` passed anywhere. Both types now guard with `[X] extends [never]` and fall back to `string`.

The theme augmentations were also unreachable. `<theme>/theme-types.d.ts` shipped in the package but nothing pulled it into a consumer's program: no reference from the theme barrel, no `exports` entry to import or reference it by, and it lives under `node_modules`, so app `include` globs miss it. Each theme now ships a `typed.d.ts` barrel that references it, and `@awdlab/jig-themes/<theme>` resolves its types there.

Apps that pull in more than one theme have to opt out for the extra ones via the new `@awdlab/jig-themes/<theme>/untyped` entry point — two augmentations of `AwdThemeTypes` clash, and the first one loaded silently wins. Both entry points resolve to the same runtime module; only the types differ.

Bindings that leaned on the old `unknown` may now fail to compile. `[kind]="null"` is the common one: the input accepts `undefined`, not `null`.

## @awdlab/jig-themes 0.0.1-next.4 (2026-08-07)

- The axe helper now scans the `wcag22aa` rule set with `color-contrast` enabled, and the four controls that carried `test.fixme` a11y checks pass it. Only `region` stays globally disabled (a test-wrapper artifact).

Target size (2.5.8): inline icon buttons were sized at `1lh` — 15x16px inside `jig-edit-inplace` — and now hold a 24x24px minimum in the base theme, covering the tree toggle, the input-field clear button and the table row actions in one place. The chip remove button grows from 22px to the same 24px minimum.

Contrast (1.4.3): every muted `color:` in nova moves one shade darker (400 → 500, 500 → 600, 600 → 700), lifting the table head, upload size and color-picker channel labels from 3.85:1/4.06:1 to 5.47:1 or better. Backgrounds and borders are untouched. Mask-input placeholder segments and calendar other-month days stay below 4.5:1 by decision, with a scoped opt-out recording the measured ratio.

Virtualized `role="listbox"` / `role="tree"` hosts now own the scroll port, so the role host is both the scrollable region and the direct parent of its options. `jig-scroller` emits a `tabindex` only when `focusable`, because even `-1` makes it focusable to axe. `AwdListBox.pageSize()` measured the scroller's `clientHeight`, which is now `auto`, so `PageDown` jumped to the end — it measures the host instead. Stuck group headers paint over the scroll port's padding band, keeping the gap to the container border. `AwdScrollerHarness.scrollToIndex` scrolled the wrong element and silently did nothing.

`AwdBadge`, `AwdScrollShadow` and `AwdKeyboardShortcut` were missing the `@category` tag the API-docs generator keys off, so their documented API tables rendered empty and the MCP knowledge pack skipped them entirely. All three are now generated (65 controls in the pack, up from 62).

`@awdlab/jig-mcp` migration maps catch up with the controls added since they were written: `p-rating`, `p-colorPicker` and `mat-stepper` no longer claim "no direct equivalent" (they map to `jig-rating`, `jig-color-picker` and `jig-stepper`/`jig-step`), badges map to the `[ngnBadge]` directive instead of `jig-tag`, and `p-inputOtp`, `p-stepper`, `p-scroller`, `ejs-rating`, `ejs-stepper`, `ejs-colorpicker`, `ejs-otpinput`, `ejs-inplaceeditor` and `ejs-keyboard` are new entries. The table recipe documents `dataSource` lazy loading and the form recipe documents `[ngnErrors]` with signal forms.

Docs corrections: the material theme was missing wherever the library's presets were counted (introduction, theming overview, dark mode, READMEs, the themes package description). The default `color` is the theme's first entry — `primary` for nova, not `surface`. `jig-message` has no `filled` kind. The icon registry covers 45 slots, not ~42. The control anatomy and theme-internals guides described a nova-only theme layer, and the installation guide omitted the `@angular/compiler` peer.

## @awdlab/jig-themes 0.0.1-next.3 (2026-08-06)

- Nova theme redesign + various fixes

## @awdlab/jig-themes 0.0.1-next.2 (2026-07-27)

- Validity State fixes
- Various issues & fixes

## @awdlab/jig-themes 0.0.1-next.1 (2026-07-20)

- Add the `jig-otp` one-time-password control — a row of single-character cells with keyboard navigation, paste distribution, `mask`/`integerOnly`/`length` options and a `(completed)` output. Includes base/nova/shade theme parts and a Playwright `AwdOtpHarness`.

## @awdlab/jig-themes 0.0.1-next.0 (2026-07-16)

- Release readiness set up
