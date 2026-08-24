# Changelog

## @awdlab/jig-themes 0.0.5 (2026-08-24)

- **`@awdlab/jig-themes` and `@awdlab/jig-custom-types` are installable again.** Both shipped two manifests: the source `package.json` at the tarball root, whose `main` pointed at an `./index.js` that only existed one directory down and which carried no `exports` at all, plus a second generated manifest inside `dist/`. Nothing could resolve either package. The source `package.json` is now the single publish manifest and points into `dist/`, and the build no longer copies a manifest, README or LICENSE into the build output.

`@awdlab/jig-themes` declares its 300-plus theme-part subpaths through one `exports` pattern instead of a generated entry per part, so the 313 empty `package.json` marker files under `packages/themes/src` are gone — with them goes the class of bug where a new theme part silently stayed unresolvable because its marker was forgotten. The three theme entry points keep their explicit mapping, since `@awdlab/jig-themes/nova` must load the type augmentation from `typed.d.ts` while `@awdlab/jig-themes/nova/untyped` must not.

**Emitted specifiers are correct at the source.** Both packages compiled with the workspace-wide `module: preserve`, which emits import specifiers verbatim, so extensionless and directory specifiers survived into `dist` where Node's ESM resolver rejects them. A post-build script rewrote them afterwards — a regex that only matched `from` and `import()` forms, so the side-effect `import './theme-types'` inside each theme's `typed.d.ts` stayed broken for consumers on `node16`/`nodenext` resolution. The two packages now build with `module: nodenext` and carry explicit `.js` extensions in source, and the rewrite script is deleted. `@awdlab/jig-custom-types` was never rewritten at all and shipped extensionless re-exports.

**`@awdlab/jig` packs from `dist/`.** ng-packagr flattens secondary entry points into hyphenated bundle names, so its generated manifest cannot be expressed as a root manifest pointing into `dist/`; the tarball now uses that manifest directly and carries one `package.json` instead of two. `README`/`LICENSE` are copied into `dist` so npm still includes them.

No API surface changed — every import path a consumer already uses resolves to the same module.

## @awdlab/jig-themes 0.0.4 (2026-08-17)

- **New control `jig-tag-input`.** A list of string tags the user types and confirms — Enter always commits, further characters can be declared as `delimiters`. Offers suggestions from a static list or an async callback, enforces `maxTags` / `minTagLength` / `maxTagLength` / `allowDuplicates` and reports refusals through `rejected`, wraps onto several lines or scrolls on one, and announces every change in a live region. Its value is `string[] | null` — never an empty array — so signal-forms `required` reacts to an empty control. Ships the `tagCount` and `tagLength` validators for bounds the stock `minLength`/`maxLength` cannot express on a nullable array.

**New control `jig-dropdown-list`.** The anchored popover wrapping a `jig-list-box` — the dropdown half of a combobox, extracted out of `jig-select` and now shared by select and tag-input. Usable on its own, and projects `dropdownHeader` content above the list, which is how select puts its filter field inside the popover.

**`jig-slider` gains range mode.** `range` turns the value into a `[start, end]` tuple and spans the fill between the handles. `minRangeDistance` sets the smallest gap the handles may have; values outside `0 … max - min`, and bound pairs that violate the gap, are clamped with a dev-mode error. The host degrades to `role="group"` and each handle becomes its own focusable `role="slider"` with handle-local `aria-valuemin`/`aria-valuemax`, per the WAI-ARIA multi-thumb pattern. New `valueCommit` output emits once an interaction settles — a drag release, a track click, or a handled key press — where `valueChange` fires on every frame.

**`jig-input-field` can mark the label of a required control with an asterisk.** Opt in per field via `showRequiredMarker`, or globally via the new `defaults.inputField.showRequiredMarker` config. Value controls expose `requiredState`, which ORs the `required` input with the required validator of a bound form control, so the marker works across signal forms, reactive and template-driven forms alike. The marker is drawn in CSS and hidden from the accessibility tree — `aria-required` on the control already carries the semantics.

**Validation messages can be scoped to a control.** A control's own `<scope>.errors.<key>` translation now wins over the shared `errors.<key>`, so `jig-otp` says "Enter the full code" and `jig-tag-input` "Add at least one entry" where every other control keeps the generic wording.

**`jig-hint` collapses through a `root-collapsed` theme class** instead of an inline `display: none`, so a hidden validation hint keeps the field's layout stable and the message expands into place.

Smaller additions: `rovingDisabled` on `jigRovingGroup` suspends navigation so a suspended group reads as one plain element (a readonly `jig-mask-input` no longer exposes selectable sections); `loading` on `jig-list-box` covers the list with a spinner while items are fetched; `jig-mask-input` exposes `disabled` / `readonly` / `invalid` theme classes and the matching ARIA.

### Breaking

`JigPassthrough<'select'>` changed shape. The select's popover and list box now live behind the extracted dropdown, so the `popover` and `list-box` dependencies and the `popover-content` / `list-box-empty` classes are gone, replaced by a single `dropdown` dependency:

```diff
-const pt: JigPassthrough<'select'> = { 'popover-content': { … } };
+const pt: JigPassthrough<'select'> = { dropdown: { content: { … } } };

-const pt: JigPassthrough<'select'> = { 'list-box': { root: { … } } };
+const pt: JigPassthrough<'select'> = { dropdown: { 'list-box': { root: { … } } } };
```

The Playwright `JigSelectHarness` keeps `listBox` and `popoverContent` as forwarding getters, so existing end-to-end tests need no change.

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

- **New control `jig-skeleton`.** A placeholder box for content that has not arrived yet. `shape` picks which dimensions apply: a `rect` is sized with `width` (default `100%`) and `height` (default `1lh`, so a bare skeleton reads as one line of text) plus an optional `radius`; a `circle` takes a single `diameter` and is always fully rounded. Numbers are pixels, strings are passed through as CSS lengths, so `width="55%"` and `height="2rem"` work as written. The host carries `aria-hidden="true"` — a skeleton is never content, and the surrounding region owns the loading announcement.

Rectangles paint a 2px vertical inset inside their own box rather than outside it, so stacked `1lh` lines separate visually while the height they occupy stays exactly on the text line grid. Circles keep their full diameter, since an inset would squash them into an ellipse. Sizing flows through `--jig-skeleton-*` custom properties, namespaced so an app token of the same short name cannot reach in and override what the theme decided.

The animation is a themed concern: base renders a flat block at the authored size, nova and material sweep a travelling gradient (material on its own easing and with a wider highlight), and shade pulses opacity instead, matching its flatter look. A theme that restates the `background` shorthand has to restate `background-clip` with it, or the inset stops being an inset.

`jig-table` now renders `jig-skeleton` inside its loading rows instead of painting the cell itself, so the table's shimmer comes from the shared control and follows whichever theme is active.

- **New control `jig-meter`.** Breaks a quantity into labelled, colored parts: a stacked bar plus a legend. Every item carries a `label` and a `value`, optionally a `color` and an `icon`. Without `total` the items add up to a full bar; with one, whatever they don't cover stays empty track — pass the remainder as its own item to give it a name and a share. Items that overshoot `total` are clipped and reported through a dev-mode error. Each legend entry shows its share, rounded except for a non-zero sliver below one percent, which reads `<1%`; `showPercentage="false"` hides the numbers visually but keeps them in the accessibility tree. `vertical` stands the bar up — filling bottom-up, the way a gauge reads — and moves the legend beside it. The legend row is templateable through `<ng-template #label>` (or `templateLabel`), which receives the item and its unrounded percentage. Hovering a segment highlights the legend entry that names it, and hovering a legend entry lifts its segment clear of the bar — decorative, and switched off with `highlightOnHover="false"`. Neighbouring segments are parted by a hairline in the track color, the filled run ends in a rounded cap, and an item too small to round up to a visible slice still paints a minimum sliver, so the bar never contradicts its legend. The host is a `role="group"` named by `label`, the bar is `aria-hidden` — the legend is plain text, so nothing depends on color alone. Items without a `color` cycle through a per-theme palette: eight hues in nova and material, an interleaved primary ramp in the monochrome shade, and `currentColor` under a base-only theme.
- Every overlay control now shares one open/close lifecycle, and the bugs the duplicated copies had drifted into are fixed.

Dialog kept lazy, uncached content mounted only until `open` flipped, not until the exit animation ended: the flag meant to span the animation was never reset on open, and the close waited on animations of the host element, which is `display: contents` and never animates. `closed` fired early for the same reason. A cancelled exit animation stranded dialog and tooltip half-closed — content mounted, `closed` never emitted — because the rejection was swallowed; the close now settles instead of hanging, and skips animations that never finish (infinite, paused, idle) so a spinner in projected content cannot wedge it. `closed` and `closing` can no longer fire after the host is destroyed.

Closed overlays are no longer top-layer elements: modal dialogs drop the unused `popover` attribute, and popover, tooltip, toast and snackbar carry theirs only while open. Password managers that count top-layer entries no longer read a page full of jig controls as top-layer hijacking and disable their inline menu. Toast and snackbar regions occupy the top layer only while they hold items, and stay until the last item has animated out — previously the region entered at app start, so any modal opened later covered it.

`Openable` gains an optional `closing` output and documented semantics for the members every overlay shares, and dialog and drawer now expose that output alongside popover — it fires when the close starts, where `closed` fires once the exit animation has finished. Drawer and tooltip hide themselves via `:not(:popover-open)` in the base theme instead of relying on the user-agent rule for the `popover` attribute, which is no longer present while they are closed.

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

- **New control `jig-toolbar`.** Arranges controls across three placements — start, center and end — in either orientation, and decides what happens when they stop fitting. It is a layout-and-focus container: it does not own the state of the controls inside it. Projected content lands in the start placement; `placement="center"` and `placement="end"` move it into the other tracks, as static attributes rather than bindings, since Angular resolves content projection at compile time. The side placements reserve equal space, so the center placement is centered against the toolbar rather than against whatever the sides happen to weigh, and an empty center track costs nothing; past the point where a side needs more than its half, the center gives way rather than the side wrapping. `orientation="vertical"` stacks the tracks and switches the measured axis to the block direction. The whole toolbar is a single tab stop: `role="toolbar"` with `aria-orientation`, one roving tabindex across all three placements, arrow keys along the orientation, `Home`/`End` to the ends, disabled controls skipped.

`overflow` decides the response to a shortage of space. `'wrap'` (the default) grows the toolbar along the cross axis — pure CSS, nothing is measured, so any projected content works and a simple toolbar needs no extra markup. A placement wraps as a whole, moving to the next line as one group and only wrapping inside itself when that group alone is wider than the toolbar, so a full start placement first uses the room the end placement does not need. `'popover'` collapses whatever no longer fits into a `…` trigger per placement, which reveals the collapsed items in a popover. Collapsing means rendering an item in two places, so collapsible content is declared as `<ng-template #item>` inside a `jig-toolbar-region`; each item template receives an `overflowed` flag, so the same template can render an icon-only button in the bar and an icon-plus-label row in the popover. Because the template renders twice, item state has to live in the parent component. Projected content that cannot collapse is refused with a dev-mode error rather than silently consuming track space the collapse math never accounted for.

**New control `jig-toolbar-region`.** A group of items sharing a placement and a collapse `priority`: regions pooled in one placement give up the lowest priority first, regardless of where they sit visually, so a low-priority region on the left can empty while the region to its right stays full. Ties collapse in reverse DOM order. The region is `display: contents`, so its items are direct children of the placement track and a single gap applies across all regions in it — the gap the collapse math reads out of the theme.

Collapsed items stay in the DOM, laid out off-screen, so the toolbar keeps measuring them at their natural size; hiding them would measure zero, everything would "fit", and the toolbar would flip forever. Their in-bar copy is `inert` and `aria-hidden="true"`, so only the copy inside the popover is exposed and no item is announced twice or becomes a phantom tab stop. Inside the popover, controls use the native tab order rather than a roving tabindex. The `…` trigger is a real button with a translated `aria-label` (`toolbar.overflow`, new in en and de) and `aria-expanded`, drawn with the new `toolbar-overflow` default icon or an `iconOverflow` of your own; while nothing is collapsed it is inert and hidden from assistive tech. Both halves are templateable — `<ng-template #overflow>` / `templateOverflow` for the trigger, `<ng-template #popoverContent>` / `templatePopoverContent` for the popover body.

Ships with base, nova, shade and material theme parts for both the toolbar and the region, and a `JigToolbarHarness` for Playwright.

## @awdlab/jig-themes 0.0.3 (2026-08-17)

- **New control `jig-tag-input`.** A list of string tags the user types and confirms — Enter always commits, further characters can be declared as `delimiters`. Offers suggestions from a static list or an async callback, enforces `maxTags` / `minTagLength` / `maxTagLength` / `allowDuplicates` and reports refusals through `rejected`, wraps onto several lines or scrolls on one, and announces every change in a live region. Its value is `string[] | null` — never an empty array — so signal-forms `required` reacts to an empty control. Ships the `tagCount` and `tagLength` validators for bounds the stock `minLength`/`maxLength` cannot express on a nullable array.

**New control `jig-dropdown-list`.** The anchored popover wrapping a `jig-list-box` — the dropdown half of a combobox, extracted out of `jig-select` and now shared by select and tag-input. Usable on its own, and projects `dropdownHeader` content above the list, which is how select puts its filter field inside the popover.

**`jig-slider` gains range mode.** `range` turns the value into a `[start, end]` tuple and spans the fill between the handles. `minRangeDistance` sets the smallest gap the handles may have; values outside `0 … max - min`, and bound pairs that violate the gap, are clamped with a dev-mode error. The host degrades to `role="group"` and each handle becomes its own focusable `role="slider"` with handle-local `aria-valuemin`/`aria-valuemax`, per the WAI-ARIA multi-thumb pattern. New `valueCommit` output emits once an interaction settles — a drag release, a track click, or a handled key press — where `valueChange` fires on every frame.

**`jig-input-field` can mark the label of a required control with an asterisk.** Opt in per field via `showRequiredMarker`, or globally via the new `defaults.inputField.showRequiredMarker` config. Value controls expose `requiredState`, which ORs the `required` input with the required validator of a bound form control, so the marker works across signal forms, reactive and template-driven forms alike. The marker is drawn in CSS and hidden from the accessibility tree — `aria-required` on the control already carries the semantics.

**Validation messages can be scoped to a control.** A control's own `<scope>.errors.<key>` translation now wins over the shared `errors.<key>`, so `jig-otp` says "Enter the full code" and `jig-tag-input` "Add at least one entry" where every other control keeps the generic wording.

**`jig-hint` collapses through a `root-collapsed` theme class** instead of an inline `display: none`, so a hidden validation hint keeps the field's layout stable and the message expands into place.

Smaller additions: `rovingDisabled` on `jigRovingGroup` suspends navigation so a suspended group reads as one plain element (a readonly `jig-mask-input` no longer exposes selectable sections); `loading` on `jig-list-box` covers the list with a spinner while items are fetched; `jig-mask-input` exposes `disabled` / `readonly` / `invalid` theme classes and the matching ARIA.

### Breaking

`JigPassthrough<'select'>` changed shape. The select's popover and list box now live behind the extracted dropdown, so the `popover` and `list-box` dependencies and the `popover-content` / `list-box-empty` classes are gone, replaced by a single `dropdown` dependency:

```diff
-const pt: JigPassthrough<'select'> = { 'popover-content': { … } };
+const pt: JigPassthrough<'select'> = { dropdown: { content: { … } } };

-const pt: JigPassthrough<'select'> = { 'list-box': { root: { … } } };
+const pt: JigPassthrough<'select'> = { dropdown: { 'list-box': { root: { … } } } };
```

The Playwright `JigSelectHarness` keeps `listBox` and `popoverContent` as forwarding getters, so existing end-to-end tests need no change.

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

- **New control `jig-skeleton`.** A placeholder box for content that has not arrived yet. `shape` picks which dimensions apply: a `rect` is sized with `width` (default `100%`) and `height` (default `1lh`, so a bare skeleton reads as one line of text) plus an optional `radius`; a `circle` takes a single `diameter` and is always fully rounded. Numbers are pixels, strings are passed through as CSS lengths, so `width="55%"` and `height="2rem"` work as written. The host carries `aria-hidden="true"` — a skeleton is never content, and the surrounding region owns the loading announcement.

Rectangles paint a 2px vertical inset inside their own box rather than outside it, so stacked `1lh` lines separate visually while the height they occupy stays exactly on the text line grid. Circles keep their full diameter, since an inset would squash them into an ellipse. Sizing flows through `--jig-skeleton-*` custom properties, namespaced so an app token of the same short name cannot reach in and override what the theme decided.

The animation is a themed concern: base renders a flat block at the authored size, nova and material sweep a travelling gradient (material on its own easing and with a wider highlight), and shade pulses opacity instead, matching its flatter look. A theme that restates the `background` shorthand has to restate `background-clip` with it, or the inset stops being an inset.

`jig-table` now renders `jig-skeleton` inside its loading rows instead of painting the cell itself, so the table's shimmer comes from the shared control and follows whichever theme is active.

- **New control `jig-meter`.** Breaks a quantity into labelled, colored parts: a stacked bar plus a legend. Every item carries a `label` and a `value`, optionally a `color` and an `icon`. Without `total` the items add up to a full bar; with one, whatever they don't cover stays empty track — pass the remainder as its own item to give it a name and a share. Items that overshoot `total` are clipped and reported through a dev-mode error. Each legend entry shows its share, rounded except for a non-zero sliver below one percent, which reads `<1%`; `showPercentage="false"` hides the numbers visually but keeps them in the accessibility tree. `vertical` stands the bar up — filling bottom-up, the way a gauge reads — and moves the legend beside it. The legend row is templateable through `<ng-template #label>` (or `templateLabel`), which receives the item and its unrounded percentage. Hovering a segment highlights the legend entry that names it, and hovering a legend entry lifts its segment clear of the bar — decorative, and switched off with `highlightOnHover="false"`. Neighbouring segments are parted by a hairline in the track color, the filled run ends in a rounded cap, and an item too small to round up to a visible slice still paints a minimum sliver, so the bar never contradicts its legend. The host is a `role="group"` named by `label`, the bar is `aria-hidden` — the legend is plain text, so nothing depends on color alone. Items without a `color` cycle through a per-theme palette: eight hues in nova and material, an interleaved primary ramp in the monochrome shade, and `currentColor` under a base-only theme.
- Every overlay control now shares one open/close lifecycle, and the bugs the duplicated copies had drifted into are fixed.

Dialog kept lazy, uncached content mounted only until `open` flipped, not until the exit animation ended: the flag meant to span the animation was never reset on open, and the close waited on animations of the host element, which is `display: contents` and never animates. `closed` fired early for the same reason. A cancelled exit animation stranded dialog and tooltip half-closed — content mounted, `closed` never emitted — because the rejection was swallowed; the close now settles instead of hanging, and skips animations that never finish (infinite, paused, idle) so a spinner in projected content cannot wedge it. `closed` and `closing` can no longer fire after the host is destroyed.

Closed overlays are no longer top-layer elements: modal dialogs drop the unused `popover` attribute, and popover, tooltip, toast and snackbar carry theirs only while open. Password managers that count top-layer entries no longer read a page full of jig controls as top-layer hijacking and disable their inline menu. Toast and snackbar regions occupy the top layer only while they hold items, and stay until the last item has animated out — previously the region entered at app start, so any modal opened later covered it.

`Openable` gains an optional `closing` output and documented semantics for the members every overlay shares, and dialog and drawer now expose that output alongside popover — it fires when the close starts, where `closed` fires once the exit animation has finished. Drawer and tooltip hide themselves via `:not(:popover-open)` in the base theme instead of relying on the user-agent rule for the `popover` attribute, which is no longer present while they are closed.

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

- **New control `jig-toolbar`.** Arranges controls across three placements — start, center and end — in either orientation, and decides what happens when they stop fitting. It is a layout-and-focus container: it does not own the state of the controls inside it. Projected content lands in the start placement; `placement="center"` and `placement="end"` move it into the other tracks, as static attributes rather than bindings, since Angular resolves content projection at compile time. The side placements reserve equal space, so the center placement is centered against the toolbar rather than against whatever the sides happen to weigh, and an empty center track costs nothing; past the point where a side needs more than its half, the center gives way rather than the side wrapping. `orientation="vertical"` stacks the tracks and switches the measured axis to the block direction. The whole toolbar is a single tab stop: `role="toolbar"` with `aria-orientation`, one roving tabindex across all three placements, arrow keys along the orientation, `Home`/`End` to the ends, disabled controls skipped.

`overflow` decides the response to a shortage of space. `'wrap'` (the default) grows the toolbar along the cross axis — pure CSS, nothing is measured, so any projected content works and a simple toolbar needs no extra markup. A placement wraps as a whole, moving to the next line as one group and only wrapping inside itself when that group alone is wider than the toolbar, so a full start placement first uses the room the end placement does not need. `'popover'` collapses whatever no longer fits into a `…` trigger per placement, which reveals the collapsed items in a popover. Collapsing means rendering an item in two places, so collapsible content is declared as `<ng-template #item>` inside a `jig-toolbar-region`; each item template receives an `overflowed` flag, so the same template can render an icon-only button in the bar and an icon-plus-label row in the popover. Because the template renders twice, item state has to live in the parent component. Projected content that cannot collapse is refused with a dev-mode error rather than silently consuming track space the collapse math never accounted for.

**New control `jig-toolbar-region`.** A group of items sharing a placement and a collapse `priority`: regions pooled in one placement give up the lowest priority first, regardless of where they sit visually, so a low-priority region on the left can empty while the region to its right stays full. Ties collapse in reverse DOM order. The region is `display: contents`, so its items are direct children of the placement track and a single gap applies across all regions in it — the gap the collapse math reads out of the theme.

Collapsed items stay in the DOM, laid out off-screen, so the toolbar keeps measuring them at their natural size; hiding them would measure zero, everything would "fit", and the toolbar would flip forever. Their in-bar copy is `inert` and `aria-hidden="true"`, so only the copy inside the popover is exposed and no item is announced twice or becomes a phantom tab stop. Inside the popover, controls use the native tab order rather than a roving tabindex. The `…` trigger is a real button with a translated `aria-label` (`toolbar.overflow`, new in en and de) and `aria-expanded`, drawn with the new `toolbar-overflow` default icon or an `iconOverflow` of your own; while nothing is collapsed it is inert and hidden from assistive tech. Both halves are templateable — `<ng-template #overflow>` / `templateOverflow` for the trigger, `<ng-template #popoverContent>` / `templatePopoverContent` for the popover body.

Ships with base, nova, shade and material theme parts for both the toolbar and the region, and a `JigToolbarHarness` for Playwright.

## @awdlab/jig-themes 0.0.2 (2026-08-17)

- **New control `jig-tag-input`.** A list of string tags the user types and confirms — Enter always commits, further characters can be declared as `delimiters`. Offers suggestions from a static list or an async callback, enforces `maxTags` / `minTagLength` / `maxTagLength` / `allowDuplicates` and reports refusals through `rejected`, wraps onto several lines or scrolls on one, and announces every change in a live region. Its value is `string[] | null` — never an empty array — so signal-forms `required` reacts to an empty control. Ships the `tagCount` and `tagLength` validators for bounds the stock `minLength`/`maxLength` cannot express on a nullable array.

**New control `jig-dropdown-list`.** The anchored popover wrapping a `jig-list-box` — the dropdown half of a combobox, extracted out of `jig-select` and now shared by select and tag-input. Usable on its own, and projects `dropdownHeader` content above the list, which is how select puts its filter field inside the popover.

**`jig-slider` gains range mode.** `range` turns the value into a `[start, end]` tuple and spans the fill between the handles. `minRangeDistance` sets the smallest gap the handles may have; values outside `0 … max - min`, and bound pairs that violate the gap, are clamped with a dev-mode error. The host degrades to `role="group"` and each handle becomes its own focusable `role="slider"` with handle-local `aria-valuemin`/`aria-valuemax`, per the WAI-ARIA multi-thumb pattern. New `valueCommit` output emits once an interaction settles — a drag release, a track click, or a handled key press — where `valueChange` fires on every frame.

**`jig-input-field` can mark the label of a required control with an asterisk.** Opt in per field via `showRequiredMarker`, or globally via the new `defaults.inputField.showRequiredMarker` config. Value controls expose `requiredState`, which ORs the `required` input with the required validator of a bound form control, so the marker works across signal forms, reactive and template-driven forms alike. The marker is drawn in CSS and hidden from the accessibility tree — `aria-required` on the control already carries the semantics.

**Validation messages can be scoped to a control.** A control's own `<scope>.errors.<key>` translation now wins over the shared `errors.<key>`, so `jig-otp` says "Enter the full code" and `jig-tag-input` "Add at least one entry" where every other control keeps the generic wording.

**`jig-hint` collapses through a `root-collapsed` theme class** instead of an inline `display: none`, so a hidden validation hint keeps the field's layout stable and the message expands into place.

Smaller additions: `rovingDisabled` on `jigRovingGroup` suspends navigation so a suspended group reads as one plain element (a readonly `jig-mask-input` no longer exposes selectable sections); `loading` on `jig-list-box` covers the list with a spinner while items are fetched; `jig-mask-input` exposes `disabled` / `readonly` / `invalid` theme classes and the matching ARIA.

### Breaking

`JigPassthrough<'select'>` changed shape. The select's popover and list box now live behind the extracted dropdown, so the `popover` and `list-box` dependencies and the `popover-content` / `list-box-empty` classes are gone, replaced by a single `dropdown` dependency:

```diff
-const pt: JigPassthrough<'select'> = { 'popover-content': { … } };
+const pt: JigPassthrough<'select'> = { dropdown: { content: { … } } };

-const pt: JigPassthrough<'select'> = { 'list-box': { root: { … } } };
+const pt: JigPassthrough<'select'> = { dropdown: { 'list-box': { root: { … } } } };
```

The Playwright `JigSelectHarness` keeps `listBox` and `popoverContent` as forwarding getters, so existing end-to-end tests need no change.

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

- **New control `jig-skeleton`.** A placeholder box for content that has not arrived yet. `shape` picks which dimensions apply: a `rect` is sized with `width` (default `100%`) and `height` (default `1lh`, so a bare skeleton reads as one line of text) plus an optional `radius`; a `circle` takes a single `diameter` and is always fully rounded. Numbers are pixels, strings are passed through as CSS lengths, so `width="55%"` and `height="2rem"` work as written. The host carries `aria-hidden="true"` — a skeleton is never content, and the surrounding region owns the loading announcement.

Rectangles paint a 2px vertical inset inside their own box rather than outside it, so stacked `1lh` lines separate visually while the height they occupy stays exactly on the text line grid. Circles keep their full diameter, since an inset would squash them into an ellipse. Sizing flows through `--jig-skeleton-*` custom properties, namespaced so an app token of the same short name cannot reach in and override what the theme decided.

The animation is a themed concern: base renders a flat block at the authored size, nova and material sweep a travelling gradient (material on its own easing and with a wider highlight), and shade pulses opacity instead, matching its flatter look. A theme that restates the `background` shorthand has to restate `background-clip` with it, or the inset stops being an inset.

`jig-table` now renders `jig-skeleton` inside its loading rows instead of painting the cell itself, so the table's shimmer comes from the shared control and follows whichever theme is active.

- **New control `jig-meter`.** Breaks a quantity into labelled, colored parts: a stacked bar plus a legend. Every item carries a `label` and a `value`, optionally a `color` and an `icon`. Without `total` the items add up to a full bar; with one, whatever they don't cover stays empty track — pass the remainder as its own item to give it a name and a share. Items that overshoot `total` are clipped and reported through a dev-mode error. Each legend entry shows its share, rounded except for a non-zero sliver below one percent, which reads `<1%`; `showPercentage="false"` hides the numbers visually but keeps them in the accessibility tree. `vertical` stands the bar up — filling bottom-up, the way a gauge reads — and moves the legend beside it. The legend row is templateable through `<ng-template #label>` (or `templateLabel`), which receives the item and its unrounded percentage. Hovering a segment highlights the legend entry that names it, and hovering a legend entry lifts its segment clear of the bar — decorative, and switched off with `highlightOnHover="false"`. Neighbouring segments are parted by a hairline in the track color, the filled run ends in a rounded cap, and an item too small to round up to a visible slice still paints a minimum sliver, so the bar never contradicts its legend. The host is a `role="group"` named by `label`, the bar is `aria-hidden` — the legend is plain text, so nothing depends on color alone. Items without a `color` cycle through a per-theme palette: eight hues in nova and material, an interleaved primary ramp in the monochrome shade, and `currentColor` under a base-only theme.
- Every overlay control now shares one open/close lifecycle, and the bugs the duplicated copies had drifted into are fixed.

Dialog kept lazy, uncached content mounted only until `open` flipped, not until the exit animation ended: the flag meant to span the animation was never reset on open, and the close waited on animations of the host element, which is `display: contents` and never animates. `closed` fired early for the same reason. A cancelled exit animation stranded dialog and tooltip half-closed — content mounted, `closed` never emitted — because the rejection was swallowed; the close now settles instead of hanging, and skips animations that never finish (infinite, paused, idle) so a spinner in projected content cannot wedge it. `closed` and `closing` can no longer fire after the host is destroyed.

Closed overlays are no longer top-layer elements: modal dialogs drop the unused `popover` attribute, and popover, tooltip, toast and snackbar carry theirs only while open. Password managers that count top-layer entries no longer read a page full of jig controls as top-layer hijacking and disable their inline menu. Toast and snackbar regions occupy the top layer only while they hold items, and stay until the last item has animated out — previously the region entered at app start, so any modal opened later covered it.

`Openable` gains an optional `closing` output and documented semantics for the members every overlay shares, and dialog and drawer now expose that output alongside popover — it fires when the close starts, where `closed` fires once the exit animation has finished. Drawer and tooltip hide themselves via `:not(:popover-open)` in the base theme instead of relying on the user-agent rule for the `popover` attribute, which is no longer present while they are closed.

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

- **New control `jig-toolbar`.** Arranges controls across three placements — start, center and end — in either orientation, and decides what happens when they stop fitting. It is a layout-and-focus container: it does not own the state of the controls inside it. Projected content lands in the start placement; `placement="center"` and `placement="end"` move it into the other tracks, as static attributes rather than bindings, since Angular resolves content projection at compile time. The side placements reserve equal space, so the center placement is centered against the toolbar rather than against whatever the sides happen to weigh, and an empty center track costs nothing; past the point where a side needs more than its half, the center gives way rather than the side wrapping. `orientation="vertical"` stacks the tracks and switches the measured axis to the block direction. The whole toolbar is a single tab stop: `role="toolbar"` with `aria-orientation`, one roving tabindex across all three placements, arrow keys along the orientation, `Home`/`End` to the ends, disabled controls skipped.

`overflow` decides the response to a shortage of space. `'wrap'` (the default) grows the toolbar along the cross axis — pure CSS, nothing is measured, so any projected content works and a simple toolbar needs no extra markup. A placement wraps as a whole, moving to the next line as one group and only wrapping inside itself when that group alone is wider than the toolbar, so a full start placement first uses the room the end placement does not need. `'popover'` collapses whatever no longer fits into a `…` trigger per placement, which reveals the collapsed items in a popover. Collapsing means rendering an item in two places, so collapsible content is declared as `<ng-template #item>` inside a `jig-toolbar-region`; each item template receives an `overflowed` flag, so the same template can render an icon-only button in the bar and an icon-plus-label row in the popover. Because the template renders twice, item state has to live in the parent component. Projected content that cannot collapse is refused with a dev-mode error rather than silently consuming track space the collapse math never accounted for.

**New control `jig-toolbar-region`.** A group of items sharing a placement and a collapse `priority`: regions pooled in one placement give up the lowest priority first, regardless of where they sit visually, so a low-priority region on the left can empty while the region to its right stays full. Ties collapse in reverse DOM order. The region is `display: contents`, so its items are direct children of the placement track and a single gap applies across all regions in it — the gap the collapse math reads out of the theme.

Collapsed items stay in the DOM, laid out off-screen, so the toolbar keeps measuring them at their natural size; hiding them would measure zero, everything would "fit", and the toolbar would flip forever. Their in-bar copy is `inert` and `aria-hidden="true"`, so only the copy inside the popover is exposed and no item is announced twice or becomes a phantom tab stop. Inside the popover, controls use the native tab order rather than a roving tabindex. The `…` trigger is a real button with a translated `aria-label` (`toolbar.overflow`, new in en and de) and `aria-expanded`, drawn with the new `toolbar-overflow` default icon or an `iconOverflow` of your own; while nothing is collapsed it is inert and hidden from assistive tech. Both halves are templateable — `<ng-template #overflow>` / `templateOverflow` for the trigger, `<ng-template #popoverContent>` / `templatePopoverContent` for the popover body.

Ships with base, nova, shade and material theme parts for both the toolbar and the region, and a `JigToolbarHarness` for Playwright.

## @awdlab/jig-themes 0.0.1 (2026-08-08)

- Readme adjustments

## @awdlab/jig-themes 0.0.1-next.5 (2026-08-07)

- `kind` and `color` resolve to the active theme's literal unions again, and importing a theme is all it takes to get there. Two separate defects kept the custom-type mechanic from ever working.

`CustomKind` and `CustomColor` collapsed to `unknown` whenever no augmentation was loaded. `never extends readonly (infer A)[]` matches with no inference candidate, so `A` widened to `unknown`, and the `extends never` guard written to catch that could never fire — a bare `X extends never` does not match `never`. Every `kind`/`color` binding was therefore checked against `unknown`, so `kind="nonsense"` passed anywhere. Both types now guard with `[X] extends [never]` and fall back to `string`.

The theme augmentations were also unreachable. `<theme>/theme-types.d.ts` shipped in the package but nothing pulled it into a consumer's program: no reference from the theme barrel, no `exports` entry to import or reference it by, and it lives under `node_modules`, so app `include` globs miss it. Each theme now ships a `typed.d.ts` barrel that references it, and `@awdlab/jig-themes/<theme>` resolves its types there.

Apps that pull in more than one theme have to opt out for the extra ones via the new `@awdlab/jig-themes/<theme>/untyped` entry point — two augmentations of `JigThemeTypes` clash, and the first one loaded silently wins. Both entry points resolve to the same runtime module; only the types differ.

Bindings that leaned on the old `unknown` may now fail to compile. `[kind]="null"` is the common one: the input accepts `undefined`, not `null`.

## @awdlab/jig-themes 0.0.1-next.4 (2026-08-07)

- The axe helper now scans the `wcag22aa` rule set with `color-contrast` enabled, and the four controls that carried `test.fixme` a11y checks pass it. Only `region` stays globally disabled (a test-wrapper artifact).

Target size (2.5.8): inline icon buttons were sized at `1lh` — 15x16px inside `jig-edit-inplace` — and now hold a 24x24px minimum in the base theme, covering the tree toggle, the input-field clear button and the table row actions in one place. The chip remove button grows from 22px to the same 24px minimum.

Contrast (1.4.3): every muted `color:` in nova moves one shade darker (400 → 500, 500 → 600, 600 → 700), lifting the table head, upload size and color-picker channel labels from 3.85:1/4.06:1 to 5.47:1 or better. Backgrounds and borders are untouched. Mask-input placeholder segments and calendar other-month days stay below 4.5:1 by decision, with a scoped opt-out recording the measured ratio.

Virtualized `role="listbox"` / `role="tree"` hosts now own the scroll port, so the role host is both the scrollable region and the direct parent of its options. `jig-scroller` emits a `tabindex` only when `focusable`, because even `-1` makes it focusable to axe. `JigListBox.pageSize()` measured the scroller's `clientHeight`, which is now `auto`, so `PageDown` jumped to the end — it measures the host instead. Stuck group headers paint over the scroll port's padding band, keeping the gap to the container border. `JigScrollerHarness.scrollToIndex` scrolled the wrong element and silently did nothing.

`JigBadge`, `JigScrollShadow` and `JigKeyboardShortcut` were missing the `@category` tag the API-docs generator keys off, so their documented API tables rendered empty and the MCP knowledge pack skipped them entirely. All three are now generated (65 controls in the pack, up from 62).

`@awdlab/jig-mcp` migration maps catch up with the controls added since they were written: `p-rating`, `p-colorPicker` and `mat-stepper` no longer claim "no direct equivalent" (they map to `jig-rating`, `jig-color-picker` and `jig-stepper`/`jig-step`), badges map to the `[jigBadge]` directive instead of `jig-tag`, and `p-inputOtp`, `p-stepper`, `p-scroller`, `ejs-rating`, `ejs-stepper`, `ejs-colorpicker`, `ejs-otpinput`, `ejs-inplaceeditor` and `ejs-keyboard` are new entries. The table recipe documents `dataSource` lazy loading and the form recipe documents `[jigErrors]` with signal forms.

Docs corrections: the material theme was missing wherever the library's presets were counted (introduction, theming overview, dark mode, READMEs, the themes package description). The default `color` is the theme's first entry — `primary` for nova, not `surface`. `jig-message` has no `filled` kind. The icon registry covers 45 slots, not ~42. The control anatomy and theme-internals guides described a nova-only theme layer, and the installation guide omitted the `@angular/compiler` peer.

## @awdlab/jig-themes 0.0.1-next.3 (2026-08-06)

- Nova theme redesign + various fixes

## @awdlab/jig-themes 0.0.1-next.2 (2026-07-27)

- Validity State fixes
- Various issues & fixes

## @awdlab/jig-themes 0.0.1-next.1 (2026-07-20)

- Add the `jig-otp` one-time-password control — a row of single-character cells with keyboard navigation, paste distribution, `mask`/`integerOnly`/`length` options and a `(completed)` output. Includes base/nova/shade theme parts and a Playwright `JigOtpHarness`.

## @awdlab/jig-themes 0.0.1-next.0 (2026-07-16)

- Release readiness set up
