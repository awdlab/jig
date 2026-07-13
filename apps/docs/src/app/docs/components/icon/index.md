The Icon component (`ngn-icon`) renders a single SVG icon. It takes an
[Iconify](https://iconify.design) data object and inlines it as an `<svg>`, so
icons ship as tree-shakeable imports rather than a font or sprite sheet. Use it
anywhere you need a scalable, theme-colored glyph; most controls consume it
internally through their registered default icon set.

### Usage

Import an icon set entry and pass it to the `icon` input; the component inlines
it as an `<svg>` that inherits size and color from surrounding text.

{{ demo: Demo_Icon_Base }}

### `icon` vs `defaultIcon`

The component resolves its icon from one of two inputs:

- **`icon`** — the icon to render, given as an Iconify data object, a registered
  icon entry (`{ icon, scale }`), or a custom value handled by a registered
  `GlobalIconTemplate`. This is what you pass for one-off, application-level
  icons.
- **`defaultIcon`** — a key (e.g. `breadcrumb-separator`) into the icon set
  registered globally via `withDefaultIcons()` or `withCustomIcons()` in your
  `provideNgnControls()` call. Controls use this internally so their icons stay
  overridable from one place.

`icon` takes precedence over `defaultIcon`, so passing an explicit `[icon]`
overrides the registered default. At least one of the two must be set —
otherwise the component throws. Using `defaultIcon` without a registered icon
set, or a custom `[icon]` value without a `GlobalIconTemplate`, also throws with
a message pointing at the missing provider.

{{ demo: Demo_Icon_DefaultIcon }}

### Sizing and `scale`

The rendered `<svg>` inherits its dimensions from CSS (typically `font-size` /
`width` on the host through the theme), so size the icon by styling `ngn-icon`
rather than through an input — this keeps it in step with adjacent text. Icons
default to a `24` viewBox to match the Tabler set.

`scale` is a property of a registered icon **entry** (`{ icon, scale }`), not a
component input. It tightens or loosens the SVG `viewBox` around the glyph so
icons from different sets sit at a consistent visual weight without being
re-drawn.

{{ demo: Demo_Icon_Sizing }}
