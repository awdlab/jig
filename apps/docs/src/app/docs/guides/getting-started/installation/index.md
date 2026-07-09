### Install

@ngneers/controls and its theme package are installed together:

```bash
pnpm add @ngneers/controls @ngneers/controls-themes
```

Both are separate packages — the controls hold behavior, the themes hold styling.
Installing only `@ngneers/controls` will leave every control unstyled and throw at runtime
if no theme preset is provided.

### Peer dependencies

The library targets **Angular 22+** and expects these peers in your app:

- `@angular/common`, `@angular/core`, `@angular/forms`, `@angular/platform-browser`,
  `@angular/router` (Angular 22)
- `@floating-ui/dom` — positioning for overlays (tooltip, popover, select…)
- `@iconify/types`, `@ngneers/signal-translate`, `rxjs`

`@iconify/icons-tabler` is an **optional** peer. It's only pulled in by the
[`withDefaultIcons()`](/guides/icons) feature — if you supply your own icon set with
`withCustomIcons()`, you don't need it.

> **No Tailwind, no CSS import.** Control styling is generated and injected at runtime by
> the theme engine — there is no stylesheet to import and Tailwind is not required to
> consume the library.

### Register the provider

Add `provideNgnControls` to your application config, passing a theme preset and any
optional features you want:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideNgnControls, withAutoColorScheme } from '@ngneers/controls/api/ng';
import { withDefaultIcons } from '@ngneers/controls/default-icons';
import { withToasts } from '@ngneers/controls/toast';
import { withSnackbars } from '@ngneers/controls/snackbar';
import { novaCoral } from '@ngneers/controls-themes/nova';

export const appConfig: ApplicationConfig = {
  providers: [
    provideNgnControls(
      { theme: { preset: novaCoral } }, // the preset is a Theme object, not a string
      withDefaultIcons(), // register the built-in Tabler icon set
      withAutoColorScheme(), // enable automatic light/dark mode
      withToasts(),
      withSnackbars()
    ),
  ],
};
```

Only the config object is required — every `with*()` feature is opt-in. Drop the ones you
don't need.

### Next steps

- [Usage](/guides/usage) — import and render a control.
- [Theming › Dark Mode](/guides/dark-mode) — the details behind `withAutoColorScheme()`.
