The nova and material themes expose **eight semantic color families**, each rendered as a
ramp of **eleven tones** from `50` (lightest) to `950` (darkest). Every tone is a CSS custom
property you can use anywhere:

```
--jig-color-<family>-<shade>     e.g. --jig-color-primary-500
```

The families are `surface`, `primary`, `secondary`, `accent`, `info`, `success`,
`warning`, and `error`. `surface` is the neutral/grey family used for backgrounds,
borders, and text; the rest are accent hues.

The shade theme is slot-based instead: it defines `surface`, `primary`, `secondary`,
`muted`, `accent`, and `destructive`, and offers `surface` / `primary` / `destructive` as
`color` values. It emits the numeric ramp too, so token references keep resolving.

{{ component: AwdThemeColorsDemo }}

### Contrast companions

Alongside each tone the theme precomputes a WCAG-checked **contrast** color — the
foreground that reads best on that tone:

```
--jig-color-<family>-<shade>-contrast    e.g. --jig-color-primary-500-contrast
```

Use the pair together — fill with a tone, text with its `-contrast` — and text stays
legible in both light and dark mode.

### Standalone tokens

Beyond the ramps there are a few global color tokens: `--jig-color-background`,
`--jig-color-text`, and `--jig-color-border`, plus grouped `disabled` and `invalid`
tokens for shared states.

### Dark mode reverses the ramp

In dark mode nova and material **reverse each family's ramp** — `50` and `950` swap, `100` and
`900` swap, and so on — so the same token name self-adjusts to the scheme without you
changing anything. The **`500` tone is the fixed point**: it sits at the exact center of
the ramp and renders identically in light and dark. Reach for `500` when a color must look
the same in both schemes (this is exactly how the `invalid`/error accent stays stable).

See [Dark Mode](/guides/dark-mode) for how the scheme is switched, and
[Kinds & Colors](/guides/kinds-colors) for how a control picks which family to paint with.
