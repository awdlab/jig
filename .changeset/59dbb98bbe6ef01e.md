---
"@awdlab/jig": minor
"@awdlab/jig-themes": minor
"@awdlab/jig-mcp": minor
"@awdlab/jig-custom-types": minor
---

<!-- author: Janik Schumacher -->
<!-- email: 37637338+LoaderB0T@users.noreply.github.com -->
<!-- timestamp: 2026-11-07T01:42:13.000Z -->

**Controls share one code style: prefixed CSS custom properties, `data-*` host state, attribute ARIA bindings and shared helpers.** CSS custom properties set by controls carry a `--jig-{control}-` prefix, host state is exposed as `data-*` attributes instead of classes, and ARIA/tabindex host bindings are attribute bindings. Toast and snackbar run on one shared notification manager (public API unchanged), a single `clamp()` in `@awdlab/jig/utils` replaces the local copies, and the empty `package.json` files in the entry point folders are gone.

Migration:

- Avatar CSS properties: `--size` → `--jig-avatar-size`, `--color` → `--jig-avatar-color`.
- Spinner CSS properties: `--size` → `--jig-spinner-size`, `--thickness` → `--jig-spinner-thickness`.
- Color picker CSS property: `--hue` → `--jig-color-picker-hue`.
- `jig-defer` host classes `.open` / `.hidden` → `[data-open]` / `[data-hidden]` attributes.
- Motion tier marker classes `.jig-motion-loop` / `.jig-motion-exact` / `.jig-motion-cosmetic` → `[data-jig-motion="loop"]` / `[data-jig-motion="exact"]` / `[data-jig-motion="cosmetic"]` (indeterminate `jig-progress`, `jig-spinner`, `jig-skeleton`, the snackbar progress bar).
- New export `clamp(value, min, max)` from `@awdlab/jig/utils`.
