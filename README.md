[![npm](https://img.shields.io/npm/v/@ngneers/controls?color=%2300d26a&style=for-the-badge)](https://www.npmjs.com/package/@ngneers/controls)
[![CI](https://img.shields.io/github/actions/workflow/status/NGneers/controls/build.yml?branch=main&style=for-the-badge)](https://github.com/NGneers/controls/actions/workflows/build.yml)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@ngneers/controls?color=%23FF006F&label=Bundle%20Size&style=for-the-badge)](https://bundlephobia.com/package/@ngneers/controls)

# @ngneers/controls

A modern, **signal-based component library for Angular 22+** — built the way Angular is
heading: signals everywhere, zoneless, standalone. No `NgModule`s, no
`@Input()`/`@Output()` decorators, no `ControlValueAccessor` boilerplate.

📚 **[Documentation → ngneers.dev](https://ngneers.dev)**

> **Beta.** Published under the `next` dist-tag. The API is close to stable, but inputs
> may still be renamed between pre-releases — every change ships with a changelog entry.
> Feedback and bug reports are very welcome.

## Why

- **50+ controls** — inputs, actions, overlays, data display (incl. a full-featured
  table), layout, feedback, and navigation.
- **Headless behavior, swappable skin.** Controls ship **zero component CSS**. Behavior,
  accessibility, and named style scopes live in the control; all styling lives in a
  separate **theme** that the engine injects into `<head>` at runtime — no stylesheet to
  import, no Tailwind required.
- **Accessible by default.** WAI-ARIA roles, keyboard interaction, and focus management
  are built in.
- **Three theme presets** — `nova` (fully themed, dark-mode aware), `shade` (a
  shadcn-style theme), and `material` (Material Design 3) — plus a token-driven engine for
  authoring your own.
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

## Documentation map

| Guide                                                               | What it covers                                           |
| ------------------------------------------------------------------- | -------------------------------------------------------- |
| [Configuration](https://ngneers.dev/guides/configuration)           | Every provider option and opt-in feature.                |
| [Forms & Validation](https://ngneers.dev/guides/forms-validation)   | Signal forms, reactive forms, `ngModel`, error messages. |
| [Theming](https://ngneers.dev/guides/overview)                      | Tokens, kinds, colors, dark mode, custom themes.         |
| [Styling & Overrides](https://ngneers.dev/guides/styling-overrides) | Cascade layers, passthrough, `unstyled`, Tailwind.       |
| [Accessibility](https://ngneers.dev/guides/accessibility)           | What is built in, and what stays your responsibility.    |
| [SSR & Hydration](https://ngneers.dev/guides/ssr-hydration)         | What renders on the server, and what settles after.      |
| [Testing](https://ngneers.dev/guides/testing)                       | Playwright harnesses and unit-test setup.                |
| [Migration](https://ngneers.dev/guides/migration)                   | Porting from PrimeNG, Angular Material or Syncfusion.    |
| [Browser Support](https://ngneers.dev/guides/browser-support)       | Supported browsers, Angular and TypeScript floors.       |

## Requirements

| Requirement       | Version                                      |
| ----------------- | -------------------------------------------- |
| Angular           | 22.0+                                        |
| TypeScript        | 6.0+                                         |
| Node (build only) | 22+                                          |
| Browsers          | Chrome/Edge 120+, Firefox 129+, Safari 17.5+ |

The browser floors come from the platform features the controls use directly — the popover
API, `@starting-style`, cascade layers and CSS nesting. See
[Browser Support](https://ngneers.dev/guides/browser-support) for the full matrix.

## Packages

| Package                                                   | Description                                           |
| --------------------------------------------------------- | ----------------------------------------------------- |
| [`@ngneers/controls`](packages/controls)                  | The control components and directives.                |
| [`@ngneers/controls-themes`](packages/themes)             | Theme presets (Nova, Shade, Material) and the engine. |
| [`@ngneers/controls-custom-types`](packages/custom-types) | Shared TypeScript type contracts.                     |
| [`@ngneers/controls-mcp`](packages/mcp)                   | MCP server exposing the docs/API to AI coding agents. |
| [`@ngneers/controls-playwright`](packages/playwright)     | Playwright testing harness with page-object helpers.  |

## Contributing

Issues and pull requests are welcome. [CONTRIBUTING.md](CONTRIBUTING.md) covers the repo
layout, the seven parts a control spans, and the conventions we enforce.

- 🐛 [Report a bug](https://github.com/NGneers/controls/issues/new?template=bug_report.yml)
- 💡 [Request a feature](https://github.com/NGneers/controls/issues/new?template=feature_request.yml)
- 🔒 [Security policy](SECURITY.md) — please report vulnerabilities privately
- 🤝 [Code of Conduct](CODE_OF_CONDUCT.md)

## License

[MIT](LICENSE) © NGneers
