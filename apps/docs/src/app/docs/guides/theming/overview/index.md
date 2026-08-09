Controls ship no component CSS. Everything you see is produced by a **theme** — a plain
data object the engine turns into CSS and injects into `<head>` at runtime, one control
scope at a time, as controls appear on the page.

### The building blocks

A theme is assembled from three kinds of part:

- **Control templates** (`@awdlab/jig-themes/templates/*`) — the style-free
  _contract_. Each declares a control's `scope` (e.g. `'switch'`) and its named class
  slots (`root`, `track`, `thumb`, …). Controls and themes both import the template, so
  their class names always line up.
- **Theme parts** — the actual styling for one scope, split into two layers:
  - **base** — minimal, token-free structural CSS (layout, positioning) shared by every
    theme.
  - **nova / shade / material** — the full visual layer: colors, radii, shadows,
    transitions, built on design tokens.
- **Token parts** — design tokens (colors, sizes, shadows, fonts, motion) emitted as
  `--jig-*` CSS custom properties.

A complete theme is just `createTheme(name, parts, meta)`. The library ships three ready
presets: **nova** (`nova`), **shade**, and **material** (`material`, a Material
Design 3 theme).

### Choosing a theme

You select a theme by passing it as `theme.preset` to the provider. The preset is a
`Theme` **object**, not a name:

```ts
import { provideAwdControls } from '@awdlab/jig/api/ng';
import { nova } from '@awdlab/jig-themes/nova';

provideAwdControls({ theme: { preset: nova } });
```

Without a preset (and with `lazyLoaded: false`), the theme service logs a warning and
controls throw — a theme is required.

### In this section

- [Colors](/guides/colors) — the palette and color tokens.
- [Kinds & Colors](/guides/kinds-colors) — the `kind` and `color` styling axes.
- [Dark Mode](/guides/dark-mode) — how schemes switch.
- [Authoring a Theme](/guides/authoring-a-theme) — build or override a theme.
- [Advanced › Theme Internals](/guides/theme-internals) — how the engine emits CSS.
