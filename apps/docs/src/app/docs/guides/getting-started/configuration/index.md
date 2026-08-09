Everything `provideNgnControls` accepts, in one place. The first argument is a
config object; every following argument is an opt-in feature.

```ts
provideNgnControls(config, ...features);
```

Only the config is required, and within it only `theme.preset` really matters —
everything else has a working default.

### Config reference

```ts
provideNgnControls({
  logLevel: 'info',
  disableAnimations: false,
  respectReducedMotion: true,
  customTranslations: { fr: () => import('./i18n/fr').then(m => m.fr) },
  theme: {
    preset: nova,
    lazyLoaded: false,
    styleScope: null,
    cssLayer: 'awd-controls',
    namePrefix: 'awd-',
  },
  defaults: {
    stateStorage: 'session',
    splitter: { stateStorage: 'session' },
    tooltip: {/* … */},
  },
});
```

#### Top level

| Option                 | Type                                          | Default  | Description                                                                                                                                       |
| ---------------------- | --------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `logLevel`             | `'debug' \| 'info' \| 'warn' \| 'error'`      | `'info'` | How much the library logs. Raise it to `'warn'` in production to silence informational output.                                                    |
| `disableAnimations`    | `boolean`                                     | `false`  | Turns off control animations globally. See [Animations](/guides/animations).                                                                      |
| `respectReducedMotion` | `boolean`                                     | `true`   | Collapses control animations to a near-zero duration while the OS reports `prefers-reduced-motion: reduce`. See [Animations](/guides/animations). |
| `customTranslations`   | `Record<string, () => Promise<Translations>>` | —        | Extra languages, loaded on demand. See [i18n](/guides/i18n).                                                                                      |

#### `theme`

| Option       | Type                 | Default          | Description                                                                                                                |
| ------------ | -------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `preset`     | `Theme \| null`      | `null`           | The theme object (not a name). Required unless `lazyLoaded` is `true` — without one, controls throw.                       |
| `lazyLoaded` | `boolean`            | `false`          | Suppresses the "no theme" error, for apps that install a theme later at runtime.                                           |
| `styleScope` | `StyleScope \| null` | `null`           | Selector the token declarations are scoped to. `null` means `:root`. See [Styling & Overrides](/guides/styling-overrides). |
| `cssLayer`   | `string \| null`     | `'awd-controls'` | Wraps all generated CSS in a `@layer` of this name. Set to `null` to emit unlayered CSS.                                   |
| `namePrefix` | `string`             | `'awd-'`         | Prefix for generated class names and CSS custom properties.                                                                |

> `cssLayer` is the lever for specificity. Everything the theme emits sits in
> one cascade layer, so **any** unlayered CSS of yours wins over it regardless
> of selector strength — no `!important`, no `::ng-deep`.

`styleScope` takes a selector descriptor rather than a raw string:

```ts
styleScope: { kind: 'class', name: 'my-app' } // .my-app { --awd-…: … }
styleScope: { kind: 'attribute', name: 'data-awd', value: 'on' }
styleScope: { kind: 'id', name: 'app-root' }
styleScope: { kind: 'tag', name: 'my-app' }
```

Use it to keep the design tokens off `:root` when the library lives inside a
larger page you do not own.

#### `defaults`

| Option                  | Type                   | Default                 | Description                                                                          |
| ----------------------- | ---------------------- | ----------------------- | ------------------------------------------------------------------------------------ |
| `stateStorage`          | `'local' \| 'session'` | `'session'`             | Where controls persist UI state. See [State Persistence](/guides/state-persistence). |
| `splitter.stateStorage` | `'local' \| 'session'` | inherits `stateStorage` | Per-control override for the splitter.                                               |
| `tooltip`               | `TooltipOptions`       | see below               | Default options for every `ngnTooltip`.                                              |

Tooltip defaults:

| Option               | Default         |
| -------------------- | --------------- |
| `placement`          | `'bottom'`      |
| `offset`             | `4`             |
| `showDelay`          | `'0.5s'`        |
| `hideDelay`          | `'0.1s'`        |
| `showArrow`          | `true`          |
| `showOnHover`        | `true`          |
| `showOnFocus`        | `true`          |
| `hideOnTooltipHover` | `false`         |
| `hideOnClick`        | `true`          |
| `autoAriaMode`       | `'description'` |

Any of these can still be overridden per tooltip.

### Features

Each `with*()` is opt-in — leave it out and none of its code ships.

| Feature                         | From                        | Enables                                                             |
| ------------------------------- | --------------------------- | ------------------------------------------------------------------- |
| `withDefaultIcons()`            | `@awdlab/jig/default-icons` | The built-in Tabler icon set for all semantic slots.                |
| `withCustomIcons(registry)`     | `@awdlab/jig/icon`          | Your own icon set. See [Icons](/guides/icons).                      |
| `withAutoColorScheme(options?)` | `@awdlab/jig/api/ng`        | Automatic light/dark switching. See [Dark Mode](/guides/dark-mode). |
| `withToasts(defaults?)`         | `@awdlab/jig/toast`         | The toast service and host.                                         |
| `withSnackbars(defaults?)`      | `@awdlab/jig/snackbar`      | The snackbar service and host.                                      |

A control that needs a feature you did not register fails loudly — an icon slot
with no registry throws at render, and the toast/snackbar managers throw when
injected without their feature.

### A complete setup

```ts
import { ApplicationConfig } from '@angular/core';
import { provideNgnControls, withAutoColorScheme } from '@awdlab/jig/api/ng';
import { withDefaultIcons } from '@awdlab/jig/default-icons';
import { withSnackbars } from '@awdlab/jig/snackbar';
import { withToasts } from '@awdlab/jig/toast';
import { provideNgnErrorsMessages } from '@awdlab/jig/errors';
import { nova } from '@awdlab/jig-themes/nova';

export const appConfig: ApplicationConfig = {
  providers: [
    provideNgnControls(
      {
        logLevel: 'warn',
        theme: { preset: nova, cssLayer: 'awd-controls' },
        defaults: { stateStorage: 'local' },
      },
      withDefaultIcons(),
      withAutoColorScheme(),
      withToasts(),
      withSnackbars()
    ),
    provideNgnErrorsMessages({ required: 'This field is required.' }),
  ],
};
```

### Reading the config

`NGN_CONFIG` is an injection token holding the resolved config, useful when you
build your own control on top of the library:

```ts
const config = inject(NGN_CONFIG);
config.theme.namePrefix; // 'awd-'
```
