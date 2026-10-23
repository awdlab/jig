Most controls have two independent styling axes, both set as plain inputs:

- **`color`** — _which_ semantic family to paint with (`primary`, `success`, `error`, …).
  See [Colors](/guides/colors).
- **`kind`** — _how_ that family is used: a variant/shape such as a solid fill, a subtle
  outline, or text-only.

They're orthogonal: `color` picks the palette, `kind` picks the treatment. Any kind works
in any color.

{{ demo: Demo_Button_Kind }}

### How it works

At runtime the control toggles two classes on its host element: `<prefix><scope>-color-<value>`
and `<prefix><scope>-kind-<value>` — on a button, `jig-button-color-success` and
`jig-button-kind-primary`. The theme's color layer makes each `color-*` class **re-point a set of
generic `--theme-color-*` variables** onto the chosen family's ramp:

```css
.jig-button-color-success {
  --theme-color-500: var(--jig-color-success-500);
  --theme-color-500-contrast: var(--jig-color-success-500-contrast);
  /* …the rest of the ramp… */
}
```

Each `kind-*` block is then authored purely against those `--theme-color-*` variables:

```css
.jig-button-kind-primary {
  background: var(--theme-color-500);
  color: var(--theme-color-500-contrast);
}
.jig-button-kind-text {
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

Spelling the lists out like this replaces the theme's entirely. To start from the theme's own
values and adjust them, see [Kinds in your app](#kinds-in-your-app) below.

### Kinds in your app

An app can add kinds of its own and remove ones the theme ships — a kind your design guide
forbids should be a compile error at the binding site, not a review comment. `customizeKinds`
and `customizeColors` build both halves from one declaration: the type union **and** the
runtime list that feeds defaults and enumeration.

It takes two files. First, a module of your own — `src/app/jig-kinds.ts`, say — that declares
the lists and augments `JigCustomTypes` with them. A `declare module` block only applies if its
file is part of the TypeScript program; here that is guaranteed by your config importing
`APP_KINDS`, so a plain `.ts` is enough no matter how narrow your `tsconfig` globs are.

```ts
// src/app/jig-kinds.ts
import { customizeColors, customizeKinds } from '@awdlab/jig/api';
import { nova } from '@awdlab/jig-themes/nova';

export const APP_KINDS = customizeKinds(nova, {
  button: { remove: ['link', 'text'], add: ['fancy'] },
} as const);

export const APP_COLORS = customizeColors(nova, { remove: ['info'], add: ['brand'] } as const);

declare module '@awdlab/jig-custom-types' {
  export interface JigCustomTypes {
    kind: typeof APP_KINDS;
    color: typeof APP_COLORS;
  }
}
```

Then hand the same two constants to `provideJigControls`, so the runtime lists match the types
you just declared:

```ts
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideJigControls } from '@awdlab/jig/api/ng';
import { nova } from '@awdlab/jig-themes/nova';

import { APP_COLORS, APP_KINDS } from './jig-kinds';

export const appConfig: ApplicationConfig = {
  providers: [
    provideJigControls({
      theme: { preset: nova, kinds: APP_KINDS, colors: APP_COLORS },
    }),
  ],
};
```

Keep the customization inline in the `customizeKinds` call. Pulling it out into a separate
variable widens its literal types away, which would leave the types describing the theme's
original lists while the runtime list reflects your changes.

`remove` is typed against the theme's own values, so a typo is a compile error. Controls you
don't mention keep the theme's kinds untouched — there's no need to re-list them.

If you only want the types, compose them by hand instead. `ThemeKind<Control>` and `ThemeColor`
expose the theme's own values, so `Exclude` and `|` do the work. This needs no
`provideJigControls` change — but the runtime lists still come from the theme, so a kind you
remove this way stays in the enumeration `injectThemeControlKinds` returns.

Write it as a **`.d.ts`**. Nothing imports this file, so it reaches the program only through
your `tsconfig` — and while the Angular CLI's default `"include": ["src/**/*.ts"]` would pick a
`.ts` up, a narrower config silently would not, leaving `kind` and `color` as unchecked
`string` with no error to tell you:

```ts
// src/app/jig-kinds.d.ts
import type { ThemeColor, ThemeKind } from '@awdlab/jig-custom-types';
import type {} from '@awdlab/jig-themes/nova';

declare module '@awdlab/jig-custom-types' {
  export interface JigCustomTypes {
    kind: { button: Exclude<ThemeKind<'button'>, 'link'> | 'fancy' };
    color: ThemeColor | 'brand';
  }
}
```

### Styling an added kind

The control toggles `<prefix><scope>-kind-<value>` on its host, so `kind="fancy"` on a button
gives you `.jig-button-kind-fancy` to write against. Author it the same way a theme does —
against the generic `--theme-color-*` variables rather than a concrete family — and the kind
recolors with the `color` input for free:

```css
.jig-button-kind-fancy {
  background: var(--theme-color-500);
  color: var(--theme-color-500-contrast);
}
```

Theme CSS lives in `@layer jig`, and unlayered styles outrank any layer, so a plain app
stylesheet wins without `!important`. If you set a `cssLayer` of your own, declare it after
`jig`.

### Removing the default kind

A control with no `kind` bound uses the theme's `meta.defaults` entry, or the first kind in the
list. Remove the kind the theme defaults to and the first remaining kind takes over, with a
warning in the console. To choose the replacement yourself, set it explicitly:

```ts
provideJigControls({
  theme: { preset: nova, kinds: APP_KINDS, defaults: { button: { kind: 'secondary' } } },
});
```

`theme.kinds`, `theme.colors` and `theme.defaults` are a flat list rather than one per theme. An
app that switches themes at runtime keeps the same customization across all of them, so keep the
removals to values every theme you switch between agrees on.
