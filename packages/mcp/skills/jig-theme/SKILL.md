---
name: jig-theme
description: Author or modify a product-specific theme for @awdlab/jig (jig) — theme parts, tokens, kinds, colors, dark mode. Use when creating a custom/product theme, styling jig controls, or editing theme part files (createThemePart, createControlTemplate).
metadata:
  version: 1
---

# Authoring a jig theme

jig controls have no component-level CSS — all styling flows through the theme
system. Use the `@awdlab/jig-mcp` server for the token schema and each
control's themeable anatomy. This authors a **product** theme; it does not edit
the library's internal themes.

## Workflow

1. **Load the schema** — call `get_theme_schema` for the token vocabulary
   (`color.*`, `size.*`, `font.*`, `shadow.*`, `anim.*`) and the `createThemePart`
   authoring API: `c('<class>')` targets the control's own classes, `d('<scope>',
'<class>')` targets a dependency's classes, `v('<token>')` reads a token.
2. **Get the control anatomy** — call `get_control_theme(control)` for the scope,
   the class names you can target with `c()`, and dependency scopes for `d()`.
3. **Scaffold** — call `scaffold_theme_part(control)` for a ready `createThemePart`
   skeleton with every class stubbed; fill in the css using tokens.
4. **Kinds & colors** — if you're adding themed variants, call `get_theme_options`
   to see the kind/color vocabulary the built-in themes use as a reference.

## Rules & gotchas

- **Tokens only** — style with `v('color.…')`, `v('size.…')`, etc. Never hardcode
  colors or px values; that is what keeps re-theming and light/dark working.
- **Dark mode reverses the palette** — in the Nova palette, shades flip in dark
  mode (e.g. `surface.800` becomes light). Add a `dark` key for overrides; for
  elements that must stay dark in both schemes use the raw grey / the scheme-stable
  `500` shade.
- **New theme parts** need an empty `package.json` marker in their folder and a
  themes build before they resolve.
- Confirm every class name you pass to `c()` against `get_control_theme` — invented
  class names silently style nothing.
