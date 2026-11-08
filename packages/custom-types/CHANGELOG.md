# Changelog

## @awdlab/jig-custom-types 0.0.3 (2026-11-08)

- **Package manifests are aligned and every package ships its LICENSE.** `@awdlab/jig-themes`, `@awdlab/jig-custom-types`, `@awdlab/jig-mcp` and `@awdlab/jig-playwright` now include the MIT `LICENSE` file. `@awdlab/jig-custom-types` and `@awdlab/jig-playwright` are marked `sideEffects: false`. `@awdlab/jig` peers on `@floating-ui/dom@^1.8.0`.

**Breaking:** `@awdlab/jig-playwright` gains an `exports` map, so only the package root (and `package.json`) can be imported.

Migration:

- `@awdlab/jig-playwright/dist/...` deep imports → `@awdlab/jig-playwright`
- **Controls share one code style: prefixed CSS custom properties, `data-*` host state, attribute ARIA bindings and shared helpers.** CSS custom properties set by controls carry a `--jig-{control}-` prefix, host state is exposed as `data-*` attributes instead of classes, and ARIA/tabindex host bindings are attribute bindings. Toast and snackbar run on one shared notification manager (public API unchanged), a single `clamp()` in `@awdlab/jig/utils` replaces the local copies, and the empty `package.json` files in the entry point folders are gone.

Migration:

- Avatar CSS properties: `--size` → `--jig-avatar-size`, `--color` → `--jig-avatar-color`.
- Spinner CSS properties: `--size` → `--jig-spinner-size`, `--thickness` → `--jig-spinner-thickness`.
- Color picker CSS property: `--hue` → `--jig-color-picker-hue`.
- `jig-defer` host classes `.open` / `.hidden` → `[data-open]` / `[data-hidden]` attributes.
- Motion tier marker classes `.jig-motion-loop` / `.jig-motion-exact` / `.jig-motion-cosmetic` → `[data-jig-motion="loop"]` / `[data-jig-motion="exact"]` / `[data-jig-motion="cosmetic"]` (indeterminate `jig-progress`, `jig-spinner`, `jig-skeleton`, the snackbar progress bar).
- New export `clamp(value, min, max)` from `@awdlab/jig/utils`.

## @awdlab/jig-custom-types 0.0.2 (2026-10-24)

- **An app can add kinds and colors of its own, and remove ones its theme ships, from a single declaration.** `customizeKinds` and `customizeColors` derive the lists from the active theme; the same object feeds the `JigCustomTypes` augmentation and the new `theme.kinds` / `theme.colors` / `theme.defaults` config fields, so the typed union and the runtime list that drives defaults and enumeration cannot drift apart. `remove` is typed against the theme's own values, controls the customization omits keep falling back to whichever theme is active, and a default the app removed is dropped with a warning instead of being emitted as a banned class. `ThemeKind<Control>` and `ThemeColor` expose a theme's values for apps that only want the types. `createTheme` now keeps its `COLORS` parameter in its return type, which `customizeColors` needs in order to read a theme's colors.

Release times are Central European Time (CET/CEST), the project's local time zone.

## @awdlab/jig-custom-types 0.0.1 (2026-08-24 23:47 CEST)

First stable release.

### Fixed

- The package is installable again — it shipped two manifests, and the root one pointed at an `./index.js` one directory down with no `exports` at all.
- Re-exports carry explicit `.js` extensions (`module: nodenext`), so `node16`/`nodenext` resolution works. The package was never covered by the old post-build rewrite script.

## @awdlab/jig-custom-types 0.0.1-next.1 (2026-08-08 01:35 CEST)

### Breaking

- Bindings that leaned on the old `unknown` may stop compiling. `[kind]="null"` is the common one — the input accepts `undefined`, not `null`.

### Fixed

- `CustomKind` and `CustomColor` no longer collapse to `unknown` without an augmentation. `never extends readonly (infer A)[]` matched with no inference candidate and the `extends never` guard could never fire; both now guard with `[X] extends [never]` and fall back to `string`.

## @awdlab/jig-custom-types 0.0.1-next.0 (2026-07-17 01:31 CEST)

- First prerelease: release readiness set up.
