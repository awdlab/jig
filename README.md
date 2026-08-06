[![npm](https://img.shields.io/npm/v/@ngneers/controls?color=%2300d26a&style=for-the-badge)](https://www.npmjs.com/package/@ngneers/controls)
[![CI](https://img.shields.io/github/actions/workflow/status/NGneers/controls/build.yml?branch=main&style=for-the-badge)](https://github.com/NGneers/controls/actions/workflows/build.yml)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@ngneers/controls?color=%23FF006F&label=Bundle%20Size&style=for-the-badge)](https://bundlephobia.com/package/@ngneers/controls)

# @ngneers/controls

A modern, **signal-based component library for Angular 22+** — built the way Angular is
heading: signals everywhere, zoneless, standalone. No `NgModule`s, no
`@Input()`/`@Output()` decorators, no `ControlValueAccessor` boilerplate.

📚 **[Documentation → ngneers.dev](https://ngneers.dev)**

## Why

- **40+ controls** — inputs, actions, overlays, data display (incl. a full-featured
  table), layout, feedback, and navigation.
- **Headless behavior, swappable skin.** Controls ship **zero component CSS**. Behavior,
  accessibility, and named style scopes live in the control; all styling lives in a
  separate **theme** that the engine injects into `<head>` at runtime — no stylesheet to
  import, no Tailwind required.
- **Accessible by default.** WAI-ARIA roles, keyboard interaction, and focus management
  are built in.
- **Two theme presets** — `nova` (fully themed, dark-mode aware) and `shade` (a
  shadcn-style theme) — plus a token-driven engine for authoring your own.
- **Tree-shakeable.** Every control has its own import subpath; you bundle only what you
  use.

## Install

Controls and themes are installed together — the controls hold behavior, the themes hold
styling:

```bash
pnpm add @ngneers/controls @ngneers/controls-themes
```

See the [Installation guide](https://ngneers.dev/guides/installation) for the full installation
instructions including peer dependencies.

## Quick start

Register the provider with a theme preset (the preset is a `Theme` object, not a string):

```ts
import { ApplicationConfig } from '@angular/core';
import { provideNgnControls, withAutoColorScheme } from '@ngneers/controls/api/ng';
import { withDefaultIcons } from '@ngneers/controls/default-icons';
import { novaCoral } from '@ngneers/controls-themes/nova';

export const appConfig: ApplicationConfig = {
  providers: [
    provideNgnControls(
      { theme: { preset: novaCoral } },
      withDefaultIcons(), // opt-in built-in Tabler icon set
      withAutoColorScheme() // opt-in automatic light/dark mode
    ),
  ],
};
```

Then import a control from its subpath and use it — some are elements, some are attribute
directives on native elements:

```ts
import { Component } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';

@Component({
  selector: 'app-example',
  imports: [NgnButton],
  template: `<button ngnButton kind="primary">Save</button>`,
})
export class ExampleComponent {}
```

See the [Getting Started guide](https://ngneers.dev) for the full setup, theming, and
per-control documentation.

## Packages

| Package                                                   | Description                                           |
| --------------------------------------------------------- | ----------------------------------------------------- |
| [`@ngneers/controls`](packages/controls)                  | The control components and directives.                |
| [`@ngneers/controls-themes`](packages/themes)             | Theme presets (Nova, Shade) and the theming engine.   |
| [`@ngneers/controls-custom-types`](packages/custom-types) | Shared TypeScript type contracts.                     |
| [`@ngneers/controls-mcp`](packages/mcp)                   | MCP server exposing the docs/API to AI coding agents. |
| [`@ngneers/controls-playwright`](packages/playwright)     | Playwright testing harness with page-object helpers.  |

## License

[MIT](LICENSE) © NGneers
