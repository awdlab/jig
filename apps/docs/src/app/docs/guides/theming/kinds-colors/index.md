Most controls have two independent styling axes, both set as plain inputs:

- **`color`** — _which_ semantic family to paint with (`primary`, `success`, `error`, …).
  See [Colors](/guides/colors).
- **`kind`** — _how_ that family is used: a variant/shape such as a solid fill, a subtle
  outline, or text-only.

They're orthogonal: `color` picks the palette, `kind` picks the treatment. Any kind works
in any color.

{{ demo: Demo_Button_Kind }}

### How it works

At runtime the control toggles two classes on its host element: `color-<value>` and
`kind-<value>`. The theme's color layer makes each `color-*` class **re-point a set of
generic `--theme-color-*` variables** onto the chosen family's ramp:

```css
.jig-button.color-success {
  --theme-color-500: var(--jig-color-success-500);
  --theme-color-500-contrast: var(--jig-color-success-500-contrast);
  /* …the rest of the ramp… */
}
```

Each `kind-*` block is then authored purely against those `--theme-color-*` variables:

```css
.jig-button.kind-primary {
  background: var(--theme-color-500);
  color: var(--theme-color-500-contrast);
}
.jig-button.kind-text {
  background: transparent;
  color: var(--theme-color-500);
}
```

Because the kind CSS never names a concrete family, swapping the `color` input
re-points the variables and every kind recolors for free.

### Kinds are per-control

There is no single global list of kinds — each control declares its own. In nova the
button offers `primary`, `secondary`, `link`, `text`, and `icon`; the message control
offers `default`, `outlined`, `simple`; the tag offers `default`, `pill`. The available
kinds and colors come from the **active theme's** metadata, so they're typed per control
and differ per theme — shade, for instance, gives the message `default` / `destructive`
and the tag `default` / `secondary` / `outline` / `destructive`, and material adds an
`input-field` kind (`outlined` / `filled`). If you don't set `kind`/`color`, the control
uses the theme's first entry as the default (for nova that's the `primary` color).

Not every control is recolorable — a control only exposes `color-*` classes if its theme
part defines them.

### Type safety

`kind` and `color` are typed as the active theme's literal unions, so `kind="pill"` on a
nova button is a compile error. This works automatically: importing a theme from its
default entry point also loads that theme's type augmentation.

```ts
import { nova } from '@awdlab/jig-themes/nova';
// kind: 'primary' | 'secondary' | 'link' | 'text' | 'icon'
```

Only one theme can contribute types to a project — two augmentations would clash and the
first one loaded would silently win. If an app pulls in more than one theme, import the
extra ones from their `/untyped` entry point:

```ts
import { nova } from '@awdlab/jig-themes/nova';
import { shade } from '@awdlab/jig-themes/shade/untyped';
```

Both entry points resolve to the same runtime module — only the types differ. With no
typed theme loaded at all, `kind` and `color` fall back to `string`.

To type kinds yourself (for a custom theme, or to override the theme's), augment
`JigCustomTypes`, which takes precedence over the theme's:

```ts
declare module '@awdlab/jig-custom-types' {
  export interface JigCustomTypes {
    kind: { button: readonly ['primary', 'ghost'] };
    color: readonly ['primary', 'danger'];
  }
}
```
