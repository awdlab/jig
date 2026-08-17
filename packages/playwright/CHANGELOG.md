# Changelog

## @awdlab/jig-playwright 0.0.2 (2026-08-17)

- **The harness package is importable again.** `dist/index.js` re-exported directories, which Node's ESM resolver rejects (`ERR_UNSUPPORTED_DIR_IMPORT`), so the published package threw on import — the workspace never noticed because its tests resolve the harnesses from source. Relative specifiers are now explicit files. `@awdlab/jig-themes` had the same defect in its emitted output and is rewritten at build time, and the `toolbar` / `toolbar-region` parts were missing the `package.json` marker that puts a theme part in the package's `exports` map, so `@awdlab/jig-themes/templates/toolbar` — and with it `JigToolbarHarness` — could not resolve in an install at all.

**`JIG_CLASSES` and `themeClasses` are exported.** Both were documented as the way to derive theme selectors, and neither was reachable: the entry point only re-exported the harnesses.

**Every harness extends a new `JigHarness` base**, so the interactions and states that mean the same thing on every control are available on all of them: `locator`, `page`, `click()`, `hover()`, `focus()`, `blur()`, `press()`, `expectVisible()`, `expectAttached()`, `expectText()`, `expectFocused()`, `expectDisabled()`, `expectReadonly()`, `expectInvalid()`, `expectRequired()` and `expectState()`. The state assertions match the host **or any element inside it**, because a themed control puts `disabled` / `aria-invalid` on whichever inner element owns it, and they test for presence rather than `="true"`, which is how the controls bind the ARIA flags. `expectFocused()` likewise passes when the host merely contains the focused element. `JigHarness` is usable on its own for a control without a dedicated harness, and `JigPopoverHarness`, `JigMaskInputHarness` and `JigOtpHarness` now expose the host `locator` they previously kept private.

**New harnesses for `table`, `dialog`, `drawer`, `checkbox`, `paginator`, `splitter`, `command` and `spin-buttons`** — controls that had none, and whose generated DOM is the hardest to select by hand. `JigTableHarness` covers rows and data cells, row and select-all checkboxes, sorting, per-column filters, resize and reorder drags, group headers, row actions, load state, and the nested scroller and paginator. `JigDialogHarness.expectOpened()` gates on the `<dialog>`'s `open` property rather than visibility, so a following key press cannot race the open transition. A number input needs no harness of its own: `JigInputHarness` drives the field and `JigSpinButtonsHarness` the steppers.

`JigInputFieldHarness` gained the parts it was missing — `label`, `requiredMarker`, `clearButton`, plus `expectLabel()`, `clear()` and `expectFilled()`.

`@playwright/test` is now declared as a peer dependency instead of being assumed present.

### Breaking

Four harness methods clashed with the base class and were renamed to say what they scope to. `JigToggleButtonHarness.click(force)` is gone; use the inherited `click({ force })`.

```diff
-await tree.expectDisabled('Banana', true);
+await tree.expectNodeDisabled('Banana', true);

-await radioGroup.expectDisabled(1, true);
+await radioGroup.expectRadioDisabled(1, true);

-await otp.press(0, 'Backspace');
+await otp.pressCell(0, 'Backspace');

-await chip.expectState({ closable: true });
+await chip.expectModifiers({ closable: true });

-await toggleButton.click(true);
+await toggleButton.click({ force: true });
```
- **Right-to-left support.** Controls read the writing direction from the DOM: set `dir` on `<html>` or on any element and everything below it mirrors. There is no RTL mode to enable, no per-control input, and no service to configure. Because `direction` is an inherited CSS property, it resolves per subtree — a `dir="rtl"` island inside a left-to-right page works, and so does the reverse.

Layout and styling are mirrored throughout. Padding, margins, borders and corner radii across every theme part are written as CSS logical properties, so they follow the inline axis instead of a fixed side. The pieces CSS cannot express logically are handled per theme with `:dir(rtl)`: gradient direction and `background-position` (the scroll-shadow layer, the table's sticky-column edges and the tabs overflow fades are mirrored as a whole rather than duplicating every fade), `transform-origin` on the snackbar progress bar, and the `translate()` offsets behind the badge's corner overhang, the switch thumb travel, the vertical meter's highlight lift and the drawer's slide-in.

Keyboard navigation follows the inline axis, so in RTL `ArrowLeft` advances. That includes the cases where the axis carries meaning rather than order: tree nodes expand away from the root, submenus open away from their parent, and a table row's action bar is entered from the row's inline-end. `ArrowUp`/`ArrowDown` stay physical — the block axis does not flip.

Pointer interaction mirrors too. A slider's value is measured from the track's minimum end, and the splitter divider, table column resize and table column reorder all resolve against the inline-start edge, so a positive drag keeps its meaning in both directions. The native resize grip that `jigResizable` hit-tests is found in the bottom inline-end corner, which is bottom-left under RTL.

Three things stay physical on purpose. `placement="left"` on a tooltip, popover or menu means the left — only the alignment half (`-start`/`-end`) follows the direction, which floating-ui already handles. `jigMovable` writes physical coordinates, so a freely dragged element goes where the pointer goes. And the colour picker's saturation, hue and alpha gradients are painted left-to-right with pointer maths to match, so a hue ramp does not reverse when the page does.

New in `@awdlab/jig/api/ng`: `isRtl(el)` answers per element and is meant to be called at the point of use rather than cached, which keeps `getComputedStyle` out of the reactive graph; `inlineArrowStep(el, key)` resolves a horizontal arrow key into a step along the inline axis; `notifyDirectionChanged()` tells already-open overlays to re-resolve their placement after a runtime `dir` change, with `onDirectionChange()` to register that work. None of this is needed when the direction is set once at bootstrap, nor for anything styled with logical properties or `:dir(rtl)` — CSS re-matches on its own.

Two bugs surfaced along the way. Sticky table columns pinned to the wrong edge in RTL: their offsets are accumulated in visual column order but were applied to physical `left`/`right`, so a sticky-end column did not stick at all. And the off-screen parking used to keep collapsed toolbar items and the item-view measurable (`left: -9999px`) created real scrollable overflow in RTL — overflow toward the inline-start is not scrollable, but the mirrored position is — which showed up as a phantom horizontal scrollbar.

Directional glyphs in the default icon set are mirrored rather than swapped: `jig-icon` now reflects its `defaultIcon` as `data-default-icon`, and one theme rule flips the chevrons and carets used by the breadcrumb separator, the calendar's month arrows, submenu markers, the paginator, the table group toggle and the tabs scroll buttons. Keying off the slot means a consumer who overrides one of those icons gets the same treatment, while non-directional slots are untouched.

The docs ship an RTL guide and a **Direction** toggle in the theme picker, which flips the whole site and persists in the same cookie the theme uses, so a returning RTL visitor gets RTL HTML from the server rather than a left-to-right first paint. Every control that renders visible markup of its own has an RTL screenshot test — captured in a state worth looking at, so an open dropdown rather than a closed field — plus interaction tests covering the direction-dependent keyboard, pointer and scroll behaviour.

### Breaking

Inputs and theme classes that named a physical side now name a logical one. `top` and `bottom` are unchanged.

```diff
-<jig-drawer position="left" />
+<jig-drawer position="start" />

-<jig-upload listPosition="right" />
+<jig-upload listPosition="end" />

-<jig-tabs [iconScrollLeft]="…" [iconScrollRight]="…" />
+<jig-tabs [iconScrollStart]="…" [iconScrollEnd]="…" />
```

`JigUploadListPosition` is now `'top' | 'bottom' | 'start' | 'end'`, and the drawer's `position` is `'top' | 'end' | 'bottom' | 'start' | 'fullscreen'`. The `data-position` attribute the drawer reflects carries the new values, as does `JigDrawerHarness.expectPosition`.

Theme parts and `JigPassthrough` keys follow: `tabs` exposes `scroll-start` / `scroll-end` in place of `scroll-left` / `scroll-right`, and `upload` exposes `list-start` / `list-end` in place of `list-left` / `list-right`. The matching default-icon keys are now `tabs-scroll-start` and `tabs-scroll-end`. `jig-tooltip` is deliberately unchanged — its `left` / `right` classes come from floating-ui's resolved physical side and sit alongside the separate `start` / `end` alignment classes.

`jigScrollAmount` reports a distance rather than a physical offset, because browsers report a negative `scrollLeft` in RTL:

```diff
-scrollAmount.scrollLeft()
+scrollAmount.scrollInlineStart()

-scrollAmount.distanceFromRight()
+scrollAmount.distanceFromInlineEnd()
```

## @awdlab/jig-playwright 0.0.1 (2026-08-08)

- Readme adjustments

## @awdlab/jig-playwright 0.0.1-next.2 (2026-08-07)

- The axe helper now scans the `wcag22aa` rule set with `color-contrast` enabled, and the four controls that carried `test.fixme` a11y checks pass it. Only `region` stays globally disabled (a test-wrapper artifact).

Target size (2.5.8): inline icon buttons were sized at `1lh` — 15x16px inside `jig-edit-inplace` — and now hold a 24x24px minimum in the base theme, covering the tree toggle, the input-field clear button and the table row actions in one place. The chip remove button grows from 22px to the same 24px minimum.

Contrast (1.4.3): every muted `color:` in nova moves one shade darker (400 → 500, 500 → 600, 600 → 700), lifting the table head, upload size and color-picker channel labels from 3.85:1/4.06:1 to 5.47:1 or better. Backgrounds and borders are untouched. Mask-input placeholder segments and calendar other-month days stay below 4.5:1 by decision, with a scoped opt-out recording the measured ratio.

Virtualized `role="listbox"` / `role="tree"` hosts now own the scroll port, so the role host is both the scrollable region and the direct parent of its options. `jig-scroller` emits a `tabindex` only when `focusable`, because even `-1` makes it focusable to axe. `JigListBox.pageSize()` measured the scroller's `clientHeight`, which is now `auto`, so `PageDown` jumped to the end — it measures the host instead. Stuck group headers paint over the scroll port's padding band, keeping the gap to the container border. `JigScrollerHarness.scrollToIndex` scrolled the wrong element and silently did nothing.

`JigBadge`, `JigScrollShadow` and `JigKeyboardShortcut` were missing the `@category` tag the API-docs generator keys off, so their documented API tables rendered empty and the MCP knowledge pack skipped them entirely. All three are now generated (65 controls in the pack, up from 62).

`@awdlab/jig-mcp` migration maps catch up with the controls added since they were written: `p-rating`, `p-colorPicker` and `mat-stepper` no longer claim "no direct equivalent" (they map to `jig-rating`, `jig-color-picker` and `jig-stepper`/`jig-step`), badges map to the `[jigBadge]` directive instead of `jig-tag`, and `p-inputOtp`, `p-stepper`, `p-scroller`, `ejs-rating`, `ejs-stepper`, `ejs-colorpicker`, `ejs-otpinput`, `ejs-inplaceeditor` and `ejs-keyboard` are new entries. The table recipe documents `dataSource` lazy loading and the form recipe documents `[jigErrors]` with signal forms.

Docs corrections: the material theme was missing wherever the library's presets were counted (introduction, theming overview, dark mode, READMEs, the themes package description). The default `color` is the theme's first entry — `primary` for nova, not `surface`. `jig-message` has no `filled` kind. The icon registry covers 45 slots, not ~42. The control anatomy and theme-internals guides described a nova-only theme layer, and the installation guide omitted the `@angular/compiler` peer.

## @awdlab/jig-playwright 0.0.1-next.1 (2026-07-20)

- Add the `jig-otp` one-time-password control — a row of single-character cells with keyboard navigation, paste distribution, `mask`/`integerOnly`/`length` options and a `(completed)` output. Includes base/nova/shade theme parts and a Playwright `JigOtpHarness`.

## @awdlab/jig-playwright 0.0.1-next.0 (2026-07-16)

- fixed stuff
- Release readiness set up
