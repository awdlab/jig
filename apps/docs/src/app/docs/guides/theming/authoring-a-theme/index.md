This is how you write your own theme — either from scratch, or by taking a shipped preset
and replacing the parts you want to own.

A theme is just a named array of parts: `createTheme(name, parts, meta)`. You rarely start
from nothing; the common cases are **overriding one part** of an existing preset or
**assembling** a new theme from the shared base and token parts plus your own visual parts.

### Override a single part

The most frequent need — recoloring — is done by replacing just the `color` part of a
preset and re-wrapping. Map over the preset's `parts`, swap the one you want, keep the
name and metadata:

```ts
import { createTheme, createThemePart } from '@ngneers/controls-themes';
import { nova, novaColorsTemplate } from '@ngneers/controls-themes/nova';

const colorPart = createThemePart({
  scope: 'color',
  variables: [novaColorsTemplate],
  root: { values: myLightColors }, // token values for light mode
  dark: { values: myDarkColors }, // token values for dark mode
});

export const myTheme = createTheme(
  nova.name, // keep the name — color helpers key off it
  nova.parts.map(part => (part.scope === 'color' ? colorPart : part)),
  nova.meta
);
```

The same pattern replaces any single control's visual part — swap the part whose `scope`
matches the control.

### The anatomy of a part

Each control part is created with `createThemePart({ controlTemplate, base, dependencies,
root, dark })`:

- `controlTemplate` — the scope contract from `@ngneers/controls-themes/templates/*`.
- `base` — the base-layer part to sit on top of (usually reuse the shipped one).
- `dependencies` — the token templates this part reads (`colorsTemplate`, `sizesTemplate`, …).
- `root` / `dark` — the styling, as a `css` function that receives helpers `v` (token →
  `var(--ngn-*)`), `c` (own class selector), and `d` (a dependency control's class).

```ts
export const widgetStyles = createThemePart({
  controlTemplate: widgetControlTemplate,
  base: baseStyles.widget,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        background: ${v('color.surface.50')};
        border-radius: ${v('size.rounded.md')};
      }
    `,
  },
});
```

### Registering your theme

Provide it exactly like a preset:

```ts
provideNgnControls({ theme: { preset: myTheme } });
```

> **Two caveats.** `createTheme` does **not** validate that every required part is present
> — a missing part just warns and is skipped at runtime. And while a part can declare
> `light` and `highContrast` blocks, only `root` and `dark` are currently emitted — put
> light-mode values in `root`.

For the mechanics behind all of this, see [Theme Internals](/guides/theme-internals).
