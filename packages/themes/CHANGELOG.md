# Changelog

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
